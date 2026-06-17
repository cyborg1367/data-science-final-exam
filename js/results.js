(function () {
  const studentName = sessionStorage.getItem('examStudentName');
  const submitted = sessionStorage.getItem('examSubmitted');

  if (!studentName || submitted !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  let results;
  try {
    results = JSON.parse(sessionStorage.getItem('examResults') || 'null');
  } catch {
    results = null;
  }

  if (!results || !results.questionResults) {
    window.location.href = 'index.html';
    return;
  }

  const PASS_THRESHOLD = results.passThreshold || 60;
  const questionMap = {};
  EXAM_QUESTIONS.forEach(q => { questionMap[q.id] = q; });

  results.questionResults = results.questionResults.map(r => ({
    ...r,
    question: questionMap[r.id]
  })).filter(r => r.question);

  const letters = 'ABCDEFGHIJ';

  document.getElementById('banner-student').textContent = studentName;
  document.getElementById('exam-date').innerHTML =
    'Completed: <strong>' + formatDate(new Date()) + '</strong>';

  renderHero(results);
  renderInfoPanel(results);
  renderStats(results);
  renderDifficulty(results);
  renderStrengthsWeaknesses(results);
  renderTopicCards(results);
  renderStudyPlan(results);
  renderReview(results, 'all');
  setupFilters(results);

  const allFilterBtn = document.querySelector('[data-filter="all"]');
  if (allFilterBtn) allFilterBtn.textContent = 'All (' + results.totalQuestions + ')';

  function renderHero(results) {
    const scoreEl = document.getElementById('score-number');
    animateScore(scoreEl, results.score);

    const circumference = 2 * Math.PI * 72;
    const ring = document.getElementById('score-ring-fill');
    const offset = circumference - (results.score / 100) * circumference;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;

    const color = results.score >= 80 ? 'var(--success)'
      : results.score >= PASS_THRESHOLD ? 'var(--accent)'
      : results.score >= 40 ? 'var(--warning)'
      : 'var(--danger)';
    ring.setAttribute('stroke', color);

    const badge = document.getElementById('grade-badge');
    if (results.score >= 90) {
      badge.textContent = 'Excellent — Outstanding work!';
      badge.className = 'grade-badge grade-excellent';
    } else if (results.score >= 75) {
      badge.textContent = 'Good — Solid understanding';
      badge.className = 'grade-badge grade-good';
    } else if (results.score >= PASS_THRESHOLD) {
      badge.textContent = 'Pass — Review weak areas';
      badge.className = 'grade-badge grade-fair';
    } else {
      badge.textContent = 'Needs Improvement — Keep studying';
      badge.className = 'grade-badge grade-poor';
    }

    const passEl = document.getElementById('pass-status');
    if (results.passed) {
      passEl.innerHTML = icon('check', 'icon-inline') + 'Passed (≥ ' + PASS_THRESHOLD + '%)';
      passEl.className = 'pass-status passed';
    } else {
      passEl.innerHTML = icon('x', 'icon-inline') + 'Not Passed (need ' + PASS_THRESHOLD + '%)';
      passEl.className = 'pass-status failed';
    }
  }

  function renderInfoPanel(results) {
    const mins = Math.floor(results.durationSec / 60);
    const secs = results.durationSec % 60;
    const timeStr = mins + 'm ' + secs + 's';
    const avgSec = results.totalQuestions
      ? Math.round(results.durationSec / results.totalQuestions)
      : 0;
    const accuracy = results.totalQuestions
      ? Math.round((results.correctCount / results.totalQuestions) * 100)
      : 0;

    document.getElementById('info-rows').innerHTML = `
      <div class="info-row"><span>Student</span><span>${escapeHtml(studentName)}</span></div>
      <div class="info-row"><span>Instructor</span><span>Masoud Ahangary</span></div>
      <div class="info-row"><span>Course</span><span>Basics of Data Science</span></div>
      <div class="info-row"><span>Correct Answers</span><span>${results.correctCount} / ${results.totalQuestions}</span></div>
      <div class="info-row"><span>Accuracy</span><span>${accuracy}%</span></div>
      <div class="info-row"><span>Time Taken</span><span>${timeStr}</span></div>
      <div class="info-row"><span>Avg. per Question</span><span>${avgSec}s</span></div>
    `;

    document.getElementById('summary-text').textContent = buildSummaryText(results);
  }

  function buildSummaryText(results) {
    const topics = Object.entries(results.topicStats)
      .map(([key, s]) => ({
        label: s.label,
        pct: s.total ? Math.round((s.correct / s.total) * 100) : 0
      }))
      .sort((a, b) => b.pct - a.pct);

    const best = topics[0];
    const worst = topics[topics.length - 1];

    let text = studentName + ' scored ' + results.score + '/100 on the Final Exam. ';

    if (results.passed) {
      text += 'You have passed the exam. ';
    } else {
      text += 'You did not reach the passing score of ' + PASS_THRESHOLD + '%. Focus your review on weaker topics below. ';
    }

    if (best && worst && best.label !== worst.label) {
      text += 'Your strongest area is ' + best.label + ' (' + best.pct + '%), while ' + worst.label + ' (' + worst.pct + '%) needs the most attention.';
    }

    return text;
  }

  function renderStats(results) {
    const mins = Math.floor(results.durationSec / 60);
    const secs = results.durationSec % 60;
    const accuracy = Math.round((results.correctCount / results.totalQuestions) * 100);
    const avgSec = Math.round(results.durationSec / results.totalQuestions);

    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-box morph-card">
        <div class="stat-icon" style="color:var(--success)">${icon('check')}</div>
        <div class="stat-value" style="color:var(--success)">${results.correctCount}</div>
        <div class="stat-label">Correct</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon" style="color:var(--danger)">${icon('x')}</div>
        <div class="stat-value" style="color:var(--danger)">${results.incorrectCount}</div>
        <div class="stat-label">Incorrect</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon">${icon('target')}</div>
        <div class="stat-value">${accuracy}%</div>
        <div class="stat-label">Accuracy</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon">${icon('clock')}</div>
        <div class="stat-value">${mins}:${secs.toString().padStart(2, '0')}</div>
        <div class="stat-label">Duration</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon">${icon('clipboard')}</div>
        <div class="stat-value">${results.totalQuestions}</div>
        <div class="stat-label">Total Questions</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon">${icon('bolt')}</div>
        <div class="stat-value">${avgSec}s</div>
        <div class="stat-label">Avg / Question</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon" style="color:${results.passed ? 'var(--success)' : 'var(--warning)'}">${icon(results.passed ? 'trophy' : 'book')}</div>
        <div class="stat-value" style="color:${results.passed ? 'var(--success)' : 'var(--warning)'}">${results.passed ? 'Pass' : 'Review'}</div>
        <div class="stat-label">Status (≥${PASS_THRESHOLD}%)</div>
      </div>
      <div class="stat-box morph-card">
        <div class="stat-icon">${icon('chart')}</div>
        <div class="stat-value">${results.score}</div>
        <div class="stat-label">Final Score</div>
      </div>
    `;
  }

  function renderDifficulty(results) {
    const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
    const container = document.getElementById('difficulty-grid');

    container.innerHTML = ['easy', 'medium', 'hard'].map(d => {
      const s = results.difficultyStats[d];
      const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
      return `
        <div class="difficulty-card morph-card ${d}">
          <div class="difficulty-name">${labels[d]}</div>
          <div class="difficulty-score">${pct}%</div>
          <div class="difficulty-detail">${s.correct} / ${s.total} correct</div>
        </div>`;
    }).join('');
  }

  function renderStrengthsWeaknesses(results) {
    const topics = Object.entries(results.topicStats)
      .map(([key, s]) => ({
        key,
        label: s.label,
        pct: s.total ? Math.round((s.correct / s.total) * 100) : 0,
        correct: s.correct,
        total: s.total
      }))
      .filter(t => t.total > 0);

    const sorted = topics.slice().sort((a, b) => b.pct - a.pct);
    const strengths = sorted.filter(t => t.pct >= 67);
    const weaknesses = sorted.filter(t => t.pct < 67).reverse();

    const strengthsList = document.getElementById('strengths-list');
    const weaknessesList = document.getElementById('weaknesses-list');

    strengthsList.innerHTML = strengths.length
      ? strengths.map(t => `<li>${t.label} — ${t.correct}/${t.total} (${t.pct}%)</li>`).join('')
      : '<li>Keep practicing — strengths will emerge with review!</li>';

    weaknessesList.innerHTML = weaknesses.length
      ? weaknesses.map(t => `<li>${t.label} — ${t.correct}/${t.total} (${t.pct}%)</li>`).join('')
      : '<li>Great job — no major weak areas!</li>';
  }

  function renderTopicCards(results) {
    const tips = {
      descriptive_statistics: 'Review mean vs median, correlation, IQR outliers, and covariance.',
      pandas: 'Practice pandas chains, groupby logic, missing data, and business metrics.',
      probability: 'Focus on conditional probability, addition rule, and base rates.',
      random_variables: 'Review expected value, Binomial, variance, and Law of Large Numbers.',
      linear_regression: 'Study ŷ = β₀ + β₁·x, residuals, R² vs baseline, and model fit.',
      matplotlib: 'Practice reading line, scatter, histogram, box, and bar charts — match plot type to the question.'
    };

    const container = document.getElementById('topic-cards');
    const topics = Object.entries(results.topicStats)
      .filter(([, s]) => s.total > 0)
      .map(([key, s]) => ({
        key,
        label: s.label,
        pct: Math.round((s.correct / s.total) * 100),
        correct: s.correct,
        total: s.total,
        tip: tips[key] || ''
      }));

    container.innerHTML = topics.map(t => {
      const cls = t.pct >= 80 ? 'high' : t.pct >= 50 ? 'mid' : 'low';
      const color = t.pct >= 80 ? 'var(--success)' : t.pct >= 50 ? 'var(--warning)' : 'var(--danger)';

      return `
        <div class="topic-card morph-card">
          <div class="topic-card-header">
            <span class="topic-card-name">${t.label}</span>
            <span class="topic-card-pct ${cls}">${t.pct}%</span>
          </div>
          <div class="topic-card-bar">
            <div class="topic-card-fill" style="width:${t.pct}%;background:${color}"></div>
          </div>
          <div class="topic-card-detail">${t.correct} of ${t.total} questions correct</div>
          ${t.pct < 80 ? `<div class="topic-card-tip">${t.tip}</div>` : ''}
        </div>`;
    }).join('');
  }

  function renderStudyPlan(results) {
    const topicAdvice = {
      descriptive_statistics: 'Revisit skewness, choosing mean vs median, correlation vs causation, and IQR outlier bounds.',
      pandas: 'Redo EDA workflows: dtypes, filtering, groupby aggregation, and matching pandas logic to business questions.',
      probability: 'Practice P(A∩B), conditional probability P(A|B), and identifying dependent vs mutually exclusive events.',
      random_variables: 'Work through expected value calculations, Binomial(n,p), variance, and LLN simulations.',
      linear_regression: 'Review OLS, residuals, R² compared to baseline mean, and reading residual plots.',
      matplotlib: 'Re-read each plot type: trends (line), association (scatter), distribution shape (histogram), spread/outliers (box), comparisons (bar).'
    };

    const weakTopics = Object.entries(results.topicStats)
      .map(([key, s]) => ({
        key,
        label: s.label,
        pct: s.total ? Math.round((s.correct / s.total) * 100) : 0
      }))
      .filter(t => t.pct < 80)
      .sort((a, b) => a.pct - b.pct);

    const list = document.getElementById('study-plan-list');

    if (!weakTopics.length) {
      list.innerHTML = '<li><span class="study-plan-num">' + icon('check') + '</span><span>Excellent performance across all topics! Review the question explanations below to consolidate your understanding.</span></li>';
      return;
    }

    list.innerHTML = weakTopics.map((t, i) => `
      <li>
        <span class="study-plan-num">${i + 1}</span>
        <span><strong>${t.label}</strong> (${t.pct}%) — ${topicAdvice[t.key] || 'Review course materials for this topic.'}</span>
      </li>
    `).join('');
  }

  function renderReview(results, filter) {
    const container = document.getElementById('review-container');
    if (typeof destroyChartsInContainer === 'function') {
      destroyChartsInContainer(container);
    }

    let items = results.questionResults;

    if (filter === 'correct') items = items.filter(r => r.isCorrect);
    if (filter === 'incorrect') items = items.filter(r => !r.isCorrect);

    container.innerHTML = items.map(r => buildReviewCard(r)).join('');

    if (typeof initChartsInContainer === 'function') {
      initChartsInContainer(container);
    }

    if (typeof typesetMath === 'function') {
      typesetMath(container);
    }
  }

  function buildReviewCard(r) {
    const q = r.question;
    const statusClass = r.isCorrect ? 'correct' : 'incorrect';
    const statusText = r.isCorrect
      ? icon('check', 'icon-inline') + 'Correct'
      : icon('x', 'icon-inline') + 'Incorrect';

    const correctSet = new Set(r.correct);
    const selectedSet = new Set(r.selected);

    const answerRows = q.options.map((opt, i) => {
      const isCorrectOpt = correctSet.has(i);
      const isSelected = selectedSet.has(i);

      let rowClass = '';
      let prefix = '';

      if (isSelected && isCorrectOpt) {
        rowClass = 'your-correct';
        prefix = icon('check', 'icon-inline') + 'Your answer (correct): ';
      } else if (isSelected && !isCorrectOpt) {
        rowClass = 'your-wrong';
        prefix = icon('x', 'icon-inline') + 'Your answer (wrong): ';
      } else if (!isSelected && isCorrectOpt) {
        rowClass = 'missed';
        prefix = icon('circle', 'icon-inline') + 'Correct answer you missed: ';
      } else {
        return '';
      }

      return `
        <div class="review-answer-row ${rowClass}">
          <span>${prefix}<strong>${letters[i]}.</strong> ${escapeHtml(opt)}</span>
        </div>`;
    }).filter(Boolean).join('');

    const correctAnswerText = r.correct.map(i => letters[i] + '. ' + q.options[i]).join(' | ');

    return `
      <div class="review-card morph-card ${statusClass}" data-correct="${r.isCorrect}">
        <div class="review-status ${statusClass}">${statusText}</div>
        <div class="question-meta" style="margin-bottom:0.75rem">
          <span class="badge badge-topic">Q${q.id} — ${q.topicLabel}</span>
          <span class="badge badge-${q.difficulty}">${q.difficulty}</span>
          ${q.chart ? '<span class="badge badge-viz">Read Chart</span>' : ''}
        </div>
        <p class="review-question">${formatQuestion(q.question)}</p>
        ${renderChart(q)}
        <div class="review-answers">${answerRows || '<div class="review-answer-row your-wrong">No answer selected</div>'}</div>
        <div class="review-explanation">
          <strong>Why: Correct answer is ${escapeHtml(correctAnswerText)}</strong>
          ${escapeHtml(q.explanation)}
        </div>
      </div>`;
  }

  function setupFilters(results) {
    document.getElementById('review-filters').addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderReview(results, btn.dataset.filter);
    });
  }

  function animateScore(el, target) {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 25);
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatQuestion(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function icon(name, cls) {
    return window.Icons ? window.Icons.svg(name, { className: cls || '' }) : '';
  }

  function renderChart(q) {
    if (!q.chart || typeof renderChartHtml !== 'function') return '';
    return renderChartHtml(q.id, q.chart, q.chartCaption).replace(
      'question-chart',
      'question-chart review-chart'
    );
  }
})();
