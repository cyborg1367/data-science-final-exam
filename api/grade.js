const { loadAnswerKey, gradeSubmission } = require('./lib/grade');

function setCors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const allowGithub = process.env.ALLOW_GITHUB_PAGES !== 'false';
  let allowOrigin = null;

  if (origin && allowed.includes(origin)) {
    allowOrigin = origin;
  } else if (allowGithub && /^https:\/\/[\w.-]+\.github\.io$/.test(origin)) {
    allowOrigin = origin;
  } else if (allowGithub && /\.github\.io$/.test(origin)) {
    allowOrigin = origin;
  } else if (process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development') {
    allowOrigin = origin || '*';
  }

  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const requiredCode = process.env.EXAM_ACCESS_CODE;

    if (requiredCode && body.examCode !== requiredCode) {
      return res.status(403).json({ error: 'Invalid exam access code' });
    }

    if (!body.answers || typeof body.answers !== 'object') {
      return res.status(400).json({ error: 'Missing answers payload' });
    }

    const answerKey = loadAnswerKey();
    const results = gradeSubmission(answerKey, body.answers, {
      startTime: body.startTime,
      endTime: body.endTime || Date.now()
    });

    return res.status(200).json(results);
  } catch (err) {
    console.error('Grade API error:', err);
    return res.status(500).json({ error: 'Grading failed. Please try again.' });
  }
};
