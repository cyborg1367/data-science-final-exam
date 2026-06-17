const fs = require('fs');
const path = require('path');

const PASS_THRESHOLD_DEFAULT = 60;

function loadAnswerKey() {
  if (process.env.ANSWER_KEY_JSON) {
    return JSON.parse(process.env.ANSWER_KEY_JSON);
  }

  const file = path.join(process.cwd(), 'api', 'data', 'answer-key.json');
  if (!fs.existsSync(file)) {
    throw new Error(
      'Answer key not found. Run scripts/split_questions.py and deploy api/data/answer-key.json to Vercel, or set ANSWER_KEY_JSON.'
    );
  }

  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalizeAnswers(answers) {
  const out = {};
  if (!answers || typeof answers !== 'object') return out;

  Object.entries(answers).forEach(([key, value]) => {
    const id = parseInt(key, 10);
    if (!Number.isFinite(id)) return;
    out[id] = Array.isArray(value)
      ? value.map(v => parseInt(v, 10)).filter(n => Number.isFinite(n))
      : [];
  });

  return out;
}

function gradeSubmission(answerKey, answers, timing) {
  const normalized = normalizeAnswers(answers);
  const passThreshold = answerKey.passThreshold || PASS_THRESHOLD_DEFAULT;
  const topics = answerKey.topics || {};

  const questionResults = answerKey.questions.map(aq => {
    const selected = (normalized[aq.id] || []).slice().sort((a, b) => a - b);
    const correct = aq.correct.slice().sort((a, b) => a - b);
    const isCorrect =
      selected.length === correct.length &&
      selected.every((v, i) => v === correct[i]);

    return {
      id: aq.id,
      selected,
      correct,
      isCorrect,
      explanation: aq.explanation
    };
  });

  const totalQuestions = questionResults.length;
  const correctCount = questionResults.filter(r => r.isCorrect).length;
  const score = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const topicStats = {};
  Object.keys(topics).forEach(key => {
    topicStats[key] = { correct: 0, total: 0, label: topics[key] };
  });

  const difficultyStats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
  };

  answerKey.questions.forEach((aq, index) => {
    const result = questionResults[index];
    const t = aq.topic;
    if (topicStats[t]) {
      topicStats[t].total++;
      if (result.isCorrect) topicStats[t].correct++;
    }

    const d = aq.difficulty;
    if (difficultyStats[d]) {
      difficultyStats[d].total++;
      if (result.isCorrect) difficultyStats[d].correct++;
    }
  });

  const startTime = timing && timing.startTime ? parseInt(timing.startTime, 10) : 0;
  const endTime = timing && timing.endTime ? parseInt(timing.endTime, 10) : Date.now();
  const durationSec = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

  return {
    questionResults,
    totalQuestions,
    correctCount,
    incorrectCount: totalQuestions - correctCount,
    score,
    topicStats,
    difficultyStats,
    durationSec,
    passed: score >= passThreshold,
    passThreshold
  };
}

module.exports = {
  loadAnswerKey,
  gradeSubmission
};
