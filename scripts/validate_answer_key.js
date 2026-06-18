const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const key = JSON.parse(fs.readFileSync(path.join(ROOT, 'api/data/answer-key.json'), 'utf8'));
const pubText = fs.readFileSync(path.join(ROOT, 'js/questions-public.js'), 'utf8');
const pubMatch = pubText.match(/const EXAM_QUESTIONS = (\[[\s\S]*\]);/);
if (!pubMatch) {
  console.error('Could not parse public questions');
  process.exit(1);
}
const pub = eval(pubMatch[1]);

const issues = [];
const warnings = [];
const pubById = Object.fromEntries(pub.map((q) => [q.id, q]));

if (key.passThreshold !== 60) issues.push('passThreshold is ' + key.passThreshold);
if (pub.length !== key.questions.length) {
  issues.push('Count mismatch: public=' + pub.length + ' key=' + key.questions.length);
}

for (let i = 1; i <= 35; i++) {
  if (!key.questions.find((q) => q.id === i)) issues.push('Missing id ' + i);
}

key.questions.forEach((kq) => {
  const pq = pubById[kq.id];
  if (!pq) {
    issues.push('Q' + kq.id + ': not in public');
    return;
  }
  if (kq.topic !== pq.topic) issues.push('Q' + kq.id + ': topic mismatch');
  if (kq.difficulty !== pq.difficulty) issues.push('Q' + kq.id + ': difficulty mismatch');
  if (!key.topics[kq.topic]) issues.push('Q' + kq.id + ': unknown topic ' + kq.topic);
  const optCount = pq.options.length;
  kq.correct.forEach((c) => {
    if (c < 0 || c >= optCount) {
      issues.push('Q' + kq.id + ': correct index ' + c + ' out of range (0-' + (optCount - 1) + ')');
    }
  });
  const isMulti = pq.multiSelect === true;
  if (isMulti && kq.correct.length < 2) {
    warnings.push('Q' + kq.id + ': multiSelect but only ' + kq.correct.length + ' correct');
  }
  if (!isMulti && kq.correct.length !== 1) {
    issues.push('Q' + kq.id + ': single-select but ' + kq.correct.length + ' correct answers');
  }
  if (!kq.explanation || kq.explanation.length < 20) {
    issues.push('Q' + kq.id + ': explanation too short/missing');
  }
});

const diff = { easy: 0, medium: 0, hard: 0 };
const topic = {};
key.questions.forEach((q) => {
  diff[q.difficulty] = (diff[q.difficulty] || 0) + 1;
  topic[q.topic] = (topic[q.topic] || 0) + 1;
});

console.log('=== VALIDATION ===');
console.log('Questions:', key.questions.length);
console.log('Difficulty:', JSON.stringify(diff));
console.log('Per topic:', JSON.stringify(topic));
console.log('Issues:', issues.length ? issues.join('\n  ') : 'none');
console.log('Warnings:', warnings.length ? warnings.join('\n  ') : 'none');
process.exit(issues.length ? 1 : 0);
