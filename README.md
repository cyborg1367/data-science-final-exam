# Basics of Data Science — Final Exam

A static, browser-based final examination for the **Basics of Data Science** course. Students complete 35 scenario-driven questions on **GitHub Pages**; answers are graded by a **private Vercel API** so the answer key is never shipped to the browser.

**Instructor:** Masoud Ahangary

| Component | Host | Purpose |
|-----------|------|---------|
| Frontend | GitHub Pages | Exam UI, questions (no answers), charts |
| Grading API | [Vercel](https://vercel.com) | Answer key, scoring, explanations after submit |

---

## Security model

| File | In GitHub repo? | Students can access? |
|------|-----------------|---------------------|
| `js/questions-public.js` | Yes | Yes — questions only, **no answers** |
| `data/questions-master.js` | **No** (gitignored) | No |
| `api/data/answer-key.json` | **No** (gitignored) | No — lives on Vercel only |
| `js/config.js` | **No** (gitignored) | API URL + settings you configure |

Students who open DevTools or browse the repo will **not** find correct answers before submitting. Explanations are returned only **after** a successful API grade.

Optional **exam access code** (`EXAM_ACCESS_CODE` on Vercel) limits who can submit even if someone discovers the API URL.

---

## Quick start (instructor)

### 1. Prepare question files

Edit the master bank (with answers):

```
data/questions-master.js
```

Regenerate public questions + answer key:

```bash
py scripts/split_questions.py
```

This writes:

- `js/questions-public.js` — safe to publish
- `api/data/answer-key.json` — **keep private**

### 2. Configure the frontend

```bash
copy js\config.example.js js\config.js
```

Edit `js/config.js`:

```javascript
window.EXAM_CONFIG = {
  GRADE_API_URL: 'https://your-project.vercel.app/api/grade',
  REQUIRE_EXAM_CODE: true
};
```

### 3. Deploy grading API to Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Import this GitHub repository as a new Vercel project.
3. In **Settings → Environment Variables**, add:

| Variable | Value |
|----------|--------|
| `EXAM_ACCESS_CODE` | A secret code you share with students on exam day |
| `ALLOW_GITHUB_PAGES` | `true` |
| `ANSWER_KEY_JSON` | Paste one-line JSON (see below) |

Generate `ANSWER_KEY_JSON`:

> **Optional (recommended): gradebook + attempt limits.** See [Gradebook & attempt limits](#gradebook--attempt-limits).

```bash
py scripts/export_vercel_env.py
```

Copy the entire output into the Vercel variable.

4. Deploy. Note your API URL: `https://<project>.vercel.app/api/grade`.

5. Put that URL in `js/config.js` → `GRADE_API_URL`.

### 4. Deploy frontend to GitHub Pages

```bash
git add .
git commit -m "Deploy exam frontend"
git push origin main
```

**Settings → Pages →** branch `main`, folder `/ (root)`.

Live exam URL:

```
https://<username>.github.io/<repo-name>/
```

Share with students: **Pages URL** + **exam access code** (not the Vercel URL).

---

## Architecture

```
Student browser (GitHub Pages)
    │
    ├─ loads js/questions-public.js  (no answers)
    │
    └─ on Submit ──POST──► Vercel /api/grade
                              │
                              ├─ verifies EXAM_ACCESS_CODE
                              ├─ rate-limits + caps attempts (if storage configured)
                              ├─ loads ANSWER_KEY_JSON (server only)
                              ├─ persists submission to gradebook (if storage configured)
                              └─ returns score + explanations
```

---

## Gradebook & attempt limits

By default the grader is **stateless** — it scores and returns to the student but stores
nothing. Connect a Redis store (free tier) to unlock three things:

1. **Gradebook** — every submission `{name, score, correct/total, passed, duration, topics, time}` is saved.
2. **Attempt cap** — a student name can only submit `MAX_ATTEMPTS` times (default **1**).
3. **Rate limiting** — at most `RATE_LIMIT_PER_MIN` submissions per IP per minute (default **20**).

If no store is configured, all three are silently skipped and the exam behaves exactly as before.

### Connect a store

Use **Vercel KV** (Storage tab → Create → KV) or a free **[Upstash](https://upstash.com)** Redis DB.
Vercel usually injects **`REDIS_URL`** when you connect Redis from the Marketplace (Redis Cloud or Upstash). That is enough — the API uses the native Redis protocol.

Optional explicit REST vars (Upstash dashboard / legacy KV — only if you do not use `REDIS_URL`):

| Variable | Value |
|----------|--------|
| `REDIS_URL` | `redis://default:…@….db.redis.io:…` (auto from Vercel) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Upstash REST API |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | legacy Vercel KV |

Then add the controls + gradebook auth:

| Variable | Default | Purpose |
|----------|---------|---------|
| `MAX_ATTEMPTS` | `1` | Submissions allowed per student name (`0` = unlimited) |
| `RATE_LIMIT_PER_MIN` | `20` | Max submissions per IP per minute (`0` = off) |
| `ADMIN_TOKEN` | — | Secret to view the gradebook (required for `/api/results`) |

> Attempt capping keys on the **normalized student name** (case/space-insensitive). Ask students
> to use their full name; two students with the identical name would share a cap.

### View the gradebook

Open in a browser (instructor only — keep `ADMIN_TOKEN` secret):

```
https://<project>.vercel.app/api/results?token=YOUR_ADMIN_TOKEN            # HTML table
https://<project>.vercel.app/api/results?token=YOUR_ADMIN_TOKEN&format=csv # CSV download
https://<project>.vercel.app/api/results?token=YOUR_ADMIN_TOKEN&format=json
```

---

## Project structure

```
├── index.html              # Landing — name + access code
├── exam.html               # Exam
├── results.html            # Dashboard (uses API results)
├── js/
│   ├── questions-public.js # Published — NO answers
│   ├── config.js           # Gitignored — your API URL
│   ├── config.example.js
│   ├── exam.js             # Submits to API
│   └── results.js
├── data/
│   └── questions-master.js # Gitignored — edit questions here
├── api/
│   ├── grade.js            # Vercel serverless handler
│   ├── lib/grade.js
│   └── data/
│       ├── answer-key.json       # Gitignored
│       └── answer-key.example.json
└── scripts/
    ├── split_questions.py
    └── export_vercel_env.py
```

---

## Updating questions

1. Edit `data/questions-master.js`.
2. Run `py scripts/split_questions.py`.
3. Run `py scripts/export_vercel_env.py` and update `ANSWER_KEY_JSON` on Vercel.
4. Commit and push (only `questions-public.js` changes go to GitHub).
5. Redeploy Vercel if needed (env var change triggers redeploy).

---

## Local development (full exam → dashboard)

Run **one command** — a local Node server serves the HTML pages **and** the grading API on the same port (no CORS, no Vercel login).

### 1. One-time setup

```bash
npm install
copy .env.local.example .env.local
```

On macOS/Linux: `cp .env.local.example .env.local`

Ensure the answer key exists:

```bash
py scripts/split_questions.py
```

### 2. Start local server

```bash
npm run dev
```

Open:

```
http://localhost:3000/
```

### 3. Take the exam locally

1. Exam code: `kadoos_dc_exam` (from `.env.local`)
2. Any student name
3. Submit → **dashboard** at `results.html`

`js/config.js` uses `/api/grade` on localhost automatically.

**Optional:** `npm run dev:vercel` if you use the Vercel CLI (requires `vercel login`).

---

## Features

- 35 questions across 6 topics, shuffled order and options
- Question navigator, mark-for-review, Chart.js visualizations
- Server-side grading with pass threshold 60%
- Results dashboard with topic breakdown and explanations (post-submit only)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Submit fails / CORS error | Set `ALLOW_GITHUB_PAGES=true` on Vercel; confirm `GRADE_API_URL` matches your Vercel project |
| Invalid exam access code | Match code in `EXAM_ACCESS_CODE` (Vercel) with what students enter |
| Grading failed (500) | Set `ANSWER_KEY_JSON` on Vercel or add `api/data/answer-key.json` for local dev |
| Students see answers in repo | Ensure `questions.js` is removed; only `questions-public.js` is committed |
| "Already submitted" (409) | Student hit the `MAX_ATTEMPTS` cap; raise it, set `0`, or clear `exam:attempts:<name>` in Redis |
| "Too many requests" (429) | IP hit `RATE_LIMIT_PER_MIN`; wait a minute or raise the limit |
| `/api/results` Unauthorized | `ADMIN_TOKEN` missing or token in URL doesn't match |
| Gradebook empty / 503 | Connect a Redis store (Upstash/Vercel KV env vars) |

---

## License

Educational use for **Basics of Data Science**. Contact the instructor for reuse outside the course.

---

## Acknowledgments

- Instructor: **Masoud Ahangary**
- Charts: [Chart.js](https://www.chartjs.org/) · [chartjs-chart-boxplot](https://github.com/sgratzl/chartjs-chart-boxplot)
