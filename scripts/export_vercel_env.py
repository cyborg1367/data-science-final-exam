"""Print ANSWER_KEY_JSON as one line for Vercel environment variable."""
import json
from pathlib import Path

KEY = Path(__file__).resolve().parent.parent / "api" / "data" / "answer-key.json"

if not KEY.exists():
    raise SystemExit(f"Missing {KEY}. Run: py scripts/split_questions.py")

data = json.loads(KEY.read_text(encoding="utf-8"))
print(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
