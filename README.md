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
                              ├─ loads ANSWER_KEY_JSON (server only)
                              └─ returns score + explanations
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

## Local development

**Frontend** (Python HTTP server):

```bash
python -m http.server 8080
```

**API** (Vercel CLI):

```bash
npx vercel dev
```

Set `js/config.js` → `GRADE_API_URL: 'http://localhost:3000/api/grade'`.

Ensure `api/data/answer-key.json` exists locally (from split script).

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

---

## License

Educational use for **Basics of Data Science**. Contact the instructor for reuse outside the course.

---

## Acknowledgments

- Instructor: **Masoud Ahangary**
- Charts: [Chart.js](https://www.chartjs.org/) · [chartjs-chart-boxplot](https://github.com/sgratzl/chartjs-chart-boxplot)
