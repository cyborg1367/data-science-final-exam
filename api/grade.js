const { loadAnswerKey, gradeSubmission } = require('./lib/grade');
const store = require('./lib/store');

function clientIp(req) {
  const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket?.remoteAddress || 'unknown';
}

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

    // Per-IP rate limit (only when storage is configured).
    if (store.enabled()) {
      const perMin = parseInt(process.env.RATE_LIMIT_PER_MIN || '20', 10);
      if (perMin > 0) {
        try {
          const hits = await store.incrWithTtl('exam:rl:' + clientIp(req), 60);
          if (hits > perMin) {
            return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
          }
        } catch (e) {
          console.error('Rate-limit check failed (continuing):', e);
        }
      }
    }

    if (requiredCode && body.examCode !== requiredCode) {
      return res.status(403).json({ error: 'Invalid exam access code' });
    }

    if (!body.answers || typeof body.answers !== 'object') {
      return res.status(400).json({ error: 'Missing answers payload' });
    }

    const studentName = String(body.studentName || '').trim();
    const nameKey = store.nameKeyOf(studentName);
    const maxAttempts = parseInt(process.env.MAX_ATTEMPTS || '1', 10);

    // Per-student attempt cap (only when storage is configured and a name is provided).
    if (store.enabled() && maxAttempts > 0 && nameKey) {
      try {
        const attempts = await store.getAttempts(nameKey);
        if (attempts >= maxAttempts) {
          return res.status(409).json({
            error:
              'This exam has already been submitted under the name "' +
              studentName +
              '". Multiple attempts are not allowed — please contact your instructor.'
          });
        }
      } catch (e) {
        console.error('Attempt-cap check failed (continuing):', e);
      }
    }

    const answerKey = loadAnswerKey();
    const results = gradeSubmission(answerKey, body.answers, {
      startTime: body.startTime,
      endTime: body.endTime || Date.now()
    });

    // Record the attempt + gradebook entry (best-effort; never blocks the student).
    if (store.enabled()) {
      try {
        if (nameKey && maxAttempts > 0) {
          await store.bumpAttempts(nameKey);
        }
        const topics = {};
        Object.keys(results.topicStats || {}).forEach(function (k) {
          const t = results.topicStats[k];
          topics[k] = t.correct + '/' + t.total;
        });
        await store.saveSubmission({
          name: studentName || '(anonymous)',
          score: results.score,
          correct: results.correctCount,
          total: results.totalQuestions,
          passed: results.passed,
          durationSec: results.durationSec,
          topics: topics,
          submittedAt: new Date().toISOString(),
          ip: clientIp(req)
        });
      } catch (e) {
        console.error('Submission persistence failed (continuing):', e);
      }
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('Grade API error:', err);
    return res.status(500).json({ error: 'Grading failed. Please try again.' });
  }
};
