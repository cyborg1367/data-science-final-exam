/**
 * Instructor gradebook — lists all stored submissions.
 *
 * Protected by ADMIN_TOKEN (env). Pass it as ?token=... or header x-admin-token.
 * Formats:
 *   /api/results?token=...            -> HTML table (open in a browser)
 *   /api/results?token=...&format=csv -> CSV download
 *   /api/results?token=...&format=json-> raw JSON
 */
const store = require('./lib/store');

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function csvCell(s) {
  const v = String(s == null ? '' : s);
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const adminToken = process.env.ADMIN_TOKEN;
  const provided = (req.query && req.query.token) || req.headers['x-admin-token'];

  if (!adminToken) {
    return res.status(503).json({ error: 'ADMIN_TOKEN is not configured on the server.' });
  }
  if (provided !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!store.enabled()) {
    return res.status(503).json({ error: 'Storage is not configured (connect Redis on Vercel or set UPSTASH_REDIS_REST_URL/TOKEN).' });
  }

  let submissions;
  try {
    submissions = await store.listSubmissions();
  } catch (e) {
    console.error('listSubmissions failed:', e);
    return res.status(500).json({ error: 'Could not read submissions.' });
  }

  submissions.sort(function (a, b) {
    return String(b.submittedAt).localeCompare(String(a.submittedAt));
  });

  const format = (req.query && req.query.format) || '';

  if (format === 'json') {
    return res.status(200).json({ count: submissions.length, submissions: submissions });
  }

  if (format === 'csv') {
    const header = ['name', 'score', 'correct', 'total', 'passed', 'durationSec', 'submittedAt'];
    const rows = [header.join(',')];
    submissions.forEach(function (s) {
      rows.push([s.name, s.score, s.correct, s.total, s.passed, s.durationSec, s.submittedAt].map(csvCell).join(','));
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="exam-submissions.csv"');
    return res.status(200).send(rows.join('\n'));
  }

  // Default: a self-contained HTML gradebook.
  const count = submissions.length;
  const avg = count
    ? Math.round(submissions.reduce(function (a, s) { return a + (Number(s.score) || 0); }, 0) / count)
    : 0;
  const passedCount = submissions.filter(function (s) { return s.passed; }).length;

  const rowsHtml = submissions.map(function (s) {
    const mins = Math.floor((Number(s.durationSec) || 0) / 60);
    const secs = (Number(s.durationSec) || 0) % 60;
    return (
      '<tr>' +
      '<td>' + escapeHtml(s.name) + '</td>' +
      '<td class="num">' + escapeHtml(s.score) + '</td>' +
      '<td class="num">' + escapeHtml(s.correct) + '/' + escapeHtml(s.total) + '</td>' +
      '<td>' + (s.passed ? '<span class="pass">Pass</span>' : '<span class="fail">Fail</span>') + '</td>' +
      '<td class="num">' + mins + 'm ' + secs + 's</td>' +
      '<td>' + escapeHtml(s.submittedAt) + '</td>' +
      '</tr>'
    );
  }).join('');

  const html =
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Gradebook — Basics of Data Science</title>' +
    '<style>' +
    ':root{--bg:#0c1220;--card:#141c2e;--border:rgba(255,255,255,.1);--muted:#94a3b8;--accent:#818cf8;--ok:#34d399;--bad:#f87171}' +
    '*{box-sizing:border-box}body{margin:0;font-family:Segoe UI,system-ui,sans-serif;background:var(--bg);color:#f1f5f9;padding:2rem}' +
    'h1{font-size:1.4rem;margin:0 0 .25rem}.sub{color:var(--muted);margin-bottom:1.25rem;font-size:.9rem}' +
    '.stats{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1.25rem}' +
    '.stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:.8rem 1.1rem;min-width:120px}' +
    '.stat b{display:block;font-size:1.5rem}.stat span{color:var(--muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.05em}' +
    '.bar{margin-bottom:1rem}.bar a{color:var(--accent);text-decoration:none;font-size:.85rem;border:1px solid var(--border);padding:.4rem .8rem;border-radius:8px}' +
    'table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden}' +
    'th,td{padding:.6rem .8rem;text-align:left;border-bottom:1px solid var(--border);font-size:.88rem}' +
    'th{background:rgba(255,255,255,.04);color:var(--muted);text-transform:uppercase;font-size:.7rem;letter-spacing:.05em}' +
    'td.num{text-align:right;font-variant-numeric:tabular-nums}tr:last-child td{border-bottom:none}' +
    '.pass{color:var(--ok);font-weight:600}.fail{color:var(--bad);font-weight:600}' +
    '.empty{color:var(--muted);padding:2rem;text-align:center}' +
    '</style></head><body>' +
    '<h1>Gradebook — Basics of Data Science</h1>' +
    '<div class="sub">Final Exam submissions</div>' +
    '<div class="stats">' +
    '<div class="stat"><b>' + count + '</b><span>Submissions</span></div>' +
    '<div class="stat"><b>' + avg + '</b><span>Average score</span></div>' +
    '<div class="stat"><b>' + passedCount + '</b><span>Passed</span></div>' +
    '</div>' +
    '<div class="bar"><a href="?token=' + encodeURIComponent(provided) + '&format=csv">⬇ Download CSV</a></div>' +
    (count
      ? '<table><thead><tr><th>Student</th><th>Score</th><th>Correct</th><th>Result</th><th>Time</th><th>Submitted</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>'
      : '<div class="empty">No submissions yet.</div>') +
    '</body></html>';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
