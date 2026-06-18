"""Split questions-master.js into public exam file and server answer key."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "data" / "questions-master.js"
PUBLIC_JS = ROOT / "js" / "questions-public.js"
ANSWER_KEY = ROOT / "api" / "data" / "answer-key.json"

PASS_THRESHOLD = 60


def read_master_text():
    return MASTER.read_text(encoding="utf-8")


def strip_comments(text):
    return re.sub(r"//[^\n]*", "", text)


def unescape_js(s):
    """Decode a raw JS string literal body (e.g. `\\"hi\\"`) into its real value.

    The field regexes capture the *source* text including escape sequences, so a
    quote stored as \\" must be decoded here. Without this, json.dumps would
    double-escape it (\\" -> \\\\\\") and the page would show literal backslashes.
    """
    if s is None:
        return None
    try:
        return json.loads('"' + s + '"')
    except Exception:
        return s.replace('\\"', '"').replace("\\\\", "\\")


def extract_topics_block(text):
    m = re.search(r"const TOPICS\s*=\s*(\{[\s\S]*?\});", text)
    if not m:
        raise ValueError("TOPICS block not found")
    topics_src = m.group(1)
    topics = {}
    for key, label in re.findall(r'(\w+):\s*"((?:[^"\\]|\\.)*)"', topics_src):
        topics[key] = label.encode().decode("unicode_escape") if "\\" in label else label
    return topics


def extract_capstone_panels(body):
    m = re.search(r"capstonePanels:\s*\[", body)
    if not m:
        return None
    depth = 0
    end = m.start()
    for i in range(m.start(), len(body)):
        if body[i] == "[":
            depth += 1
        elif body[i] == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    block = body[m.start() : end]
    panels = []
    for pm in re.finditer(
        r'icon:\s*"([^"]+)".*?title:\s*"((?:[^"\\]|\\.)*)".*?text:\s*"((?:[^"\\]|\\.)*)"',
        block,
        re.DOTALL,
    ):
        panels.append(
            {
                "icon": pm.group(1),
                "title": unescape_js(pm.group(2)),
                "text": unescape_js(pm.group(3)),
            }
        )
    return panels if panels else None


def iter_question_blocks(text):
    """Yield (qid, body) for each top-level question object in the array text."""
    i = 0
    while i < len(text):
        m = re.search(r"\{\s*id:\s*(\d+)\s*,", text[i:])
        if not m:
            break
        start = i + m.start()
        qid = int(m.group(1))
        depth = 0
        j = start
        while j < len(text):
            ch = text[j]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    block = text[start : j + 1]
                    inner = block.split(",", 1)
                    body = inner[1][:-1] if len(inner) > 1 else ""
                    yield qid, body
                    i = j + 1
                    break
            j += 1
        else:
            break


def extract_questions(text):
    text = strip_comments(text)
    m = re.search(r"const EXAM_QUESTIONS\s*=\s*\[", text)
    if not m:
        raise ValueError("EXAM_QUESTIONS not found")

    questions = []
    for qid, body in iter_question_blocks(text[m.end() :]):

        def field_str(name):
            fm = re.search(rf'{name}:\s*"((?:[^"\\]|\\.)*)"', body)
            return unescape_js(fm.group(1)) if fm else None

        def field_bool(name):
            fm = re.search(rf"{name}:\s*(true|false)", body)
            return fm.group(1) == "true" if fm else False

        def field_array(name):
            fm = re.search(rf"{name}:\s*\[([^\]]*)\]", body, re.DOTALL)
            if not fm:
                return []
            inner = fm.group(1)
            return [int(x.strip()) for x in inner.split(",") if x.strip().isdigit()]

        options = []
        om = re.search(r"options:\s*\[([\s\S]*?)\n\s*\],", body)
        if om:
            options = [unescape_js(o) for o in re.findall(r'"((?:[^"\\]|\\.)*)"', om.group(1))]

        q = {
            "id": qid,
            "topic": field_str("topic"),
            "topicLabel": field_str("topicLabel"),
            "difficulty": field_str("difficulty"),
            "multiSelect": field_bool("multiSelect"),
            "capstone": field_bool("capstone"),
            "question": field_str("question"),
            "options": options,
            "correct": field_array("correct"),
            "explanation": field_str("explanation"),
        }
        panels = extract_capstone_panels(body)
        if panels:
            q["capstonePanels"] = panels
        chart = field_str("chart")
        if chart:
            q["chart"] = chart
        caption = field_str("chartCaption")
        if caption:
            q["chartCaption"] = caption
        questions.append(q)

    questions.sort(key=lambda x: x["id"])
    return questions


def js_quote(s):
    return json.dumps(s, ensure_ascii=False)


def write_public_js(questions, topics):
    lines = ["const EXAM_QUESTIONS = ["]
    public_fields = [
        "id", "topic", "topicLabel", "difficulty", "multiSelect", "capstone",
        "question", "options", "chart", "chartCaption", "capstonePanels",
    ]
    for q in questions:
        lines.append("  {")
        for key in public_fields:
            if key not in q:
                continue
            val = q[key]
            if key == "options":
                opts = ",\n      ".join(js_quote(o) for o in val)
                lines.append(f"    options: [\n      {opts}\n    ],")
            elif key == "capstonePanels":
                lines.append("    capstonePanels: [")
                for panel in val:
                    lines.append("      {")
                    lines.append(f"        icon: {js_quote(panel['icon'])},")
                    lines.append(f"        title: {js_quote(panel['title'])},")
                    lines.append(f"        text: {js_quote(panel['text'])},")
                    lines.append("      },")
                lines.append("    ],")
            elif isinstance(val, bool):
                lines.append(f"    {key}: {'true' if val else 'false'},")
            else:
                lines.append(f"    {key}: {js_quote(val)},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append("const TOPICS = {")
    for k, v in topics.items():
        lines.append(f"  {k}: {js_quote(v)},")
    lines.append("};")
    PUBLIC_JS.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_answer_key(questions, topics):
    ANSWER_KEY.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "passThreshold": PASS_THRESHOLD,
        "topics": topics,
        "questions": [
            {
                "id": q["id"],
                "topic": q["topic"],
                "difficulty": q["difficulty"],
                "correct": q["correct"],
                "explanation": q["explanation"],
            }
            for q in questions
        ],
    }
    ANSWER_KEY.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main():
    if not MASTER.exists():
        raise SystemExit(f"Missing master file: {MASTER}")

    text = read_master_text()
    topics = extract_topics_block(text)
    questions = extract_questions(text)

    if len(questions) != 36:
        raise SystemExit(f"Expected 36 questions, parsed {len(questions)}")

    write_public_js(questions, topics)
    write_answer_key(questions, topics)
    print(f"Wrote {PUBLIC_JS.relative_to(ROOT)} ({len(questions)} questions, no answers)")
    print(f"Wrote {ANSWER_KEY.relative_to(ROOT)} (answer key — keep private)")


if __name__ == "__main__":
    main()
