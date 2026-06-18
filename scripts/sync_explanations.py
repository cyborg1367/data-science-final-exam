"""Copy detailed explanations from answer-key.json into questions-master.js."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "data" / "questions-master.js"
ANSWER_KEY = ROOT / "api" / "data" / "answer-key.json"


def sync_explanations(master_text, explanations_by_id):
    m = re.search(r"const EXAM_QUESTIONS\s*=\s*\[", master_text)
    if not m:
        raise ValueError("EXAM_QUESTIONS block not found")

    prefix = master_text[: m.end()]
    rest = master_text[m.end() :]
    updated = 0

    def replacer(match):
        nonlocal updated
        qid = int(match.group(1))
        body = match.group(2)
        if qid not in explanations_by_id:
            return match.group(0)
        new_expl = explanations_by_id[qid]
        new_body, n = re.subn(
            r'explanation:\s*"((?:[^"\\]|\\.)*)"',
            "explanation: " + json.dumps(new_expl, ensure_ascii=False),
            body,
            count=1,
        )
        if n:
            updated += 1
        return "{\n    id: " + str(qid) + "," + new_body + "\n  }"

    new_rest = re.sub(r"\{\s*id:\s*(\d+),([\s\S]*?)\n\s*\}", replacer, rest)
    return prefix + new_rest, updated


def main():
    if not ANSWER_KEY.exists():
        raise SystemExit(f"Missing {ANSWER_KEY}")
    if not MASTER.exists():
        raise SystemExit(f"Missing {MASTER}")

    key = json.loads(ANSWER_KEY.read_text(encoding="utf-8"))
    by_id = {q["id"]: q["explanation"] for q in key["questions"]}

    if len(by_id) != 36:
        raise SystemExit(f"Expected 36 explanations, found {len(by_id)}")

    text = MASTER.read_text(encoding="utf-8")
    new_text, count = sync_explanations(text, by_id)

    if count != 36:
        raise SystemExit(f"Updated {count}/36 explanations — check master format")

    MASTER.write_text(new_text, encoding="utf-8")
    print(f"Synced {count} explanations into {MASTER.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
