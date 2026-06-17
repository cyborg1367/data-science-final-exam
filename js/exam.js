(function () {
  const studentName = sessionStorage.getItem('examStudentName');
  if (!studentName) {
    window.location.href = 'index.html';
    return;
  }

  if (sessionStorage.getItem('examSubmitted') === 'true') {
    window.location.href = 'results.html';
    return;
  }

  document.getElementById('display-name').textContent = studentName;
  const qCountEl = document.getElementById('question-count');
  if (qCountEl) qCountEl.textContent = EXAM_QUESTIONS.length;

  const container = document.getElementById('questions-container');
  const navGrid = document.getElementById('nav-grid');
  const answers = loadAnswers();
  const letters = 'ABCDEFGHIJ';
  const orderedQuestions = ExamSession.getOrderedQuestions();

  orderedQuestions.forEach((q, position) => {
    const displayNum = position + 1;
    const card = document.createElement('article');
    card.className = 'question-card morph-card';
    card.id = 'question-' + q.id;
    card.dataset.questionId = q.id;
    card.dataset.displayNum = displayNum;

    const saved = answers[q.id] || [];
    if (saved.length > 0) card.classList.add('answered');
    if (ExamSession.isMarked(q.id)) card.classList.add('marked-review');

    const inputType = q.multiSelect ? 'checkbox' : 'radio';
    const inputName = 'q-' + q.id;
    const optionOrder = ExamSession.getOptionOrder(q.id);

    const optionsHtml = optionOrder.map((origIdx, displayIdx) => {
      const checked = saved.includes(origIdx) ? 'checked' : '';
      return (
        '<li class="option-item">' +
          '<input type="' + inputType + '" name="' + inputName + '" id="q' + q.id + '-opt' + origIdx + '" value="' + origIdx + '" ' + checked + '>' +
          '<label class="option-label" for="q' + q.id + '-opt' + origIdx + '">' +
            '<span class="option-marker"></span>' +
            '<span class="option-text"><span class="option-letter">' + letters[displayIdx] + '.</span>' + escapeHtml(q.options[origIdx]) + '</span>' +
          '</label>' +
        '</li>'
      );
    }).join('');

    const chartHtml = q.chart && typeof renderChartHtml === 'function'
      ? renderChartHtml(q.id, q.chart, q.chartCaption)
      : '';

    const topicClass = 'topic-' + q.topic;

    card.innerHTML =
      '<div class="question-header">' +
        '<div class="question-number ' + topicClass + '">' + displayNum + '</div>' +
        '<div class="question-body">' +
          '<div class="question-meta">' +
            '<span class="badge badge-topic ' + topicClass + '">' + q.topicLabel + '</span>' +
            '<span class="badge badge-' + q.difficulty + '">' + q.difficulty + '</span>' +
            (q.multiSelect ? '<span class="badge badge-multi">Multi-select</span>' : '') +
            (q.chart ? '<span class="badge badge-viz">Read Chart</span>' : '') +
          '</div>' +
          '<p class="question-text">' + formatQuestion(q.question) + '</p>' +
          chartHtml +
          (q.multiSelect ? '<p class="question-hint">Select all that apply.</p>' : '') +
          '<button type="button" class="mark-review-btn" data-qid="' + q.id + '">' +
            (ExamSession.isMarked(q.id) ? '★ Marked for review' : '☆ Mark for review') +
          '</button>' +
        '</div>' +
      '</div>' +
      '<ul class="options-list">' + optionsHtml + '</ul>';

    container.appendChild(card);

    card.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => handleAnswerChange(q, card));
    });

    card.querySelector('.mark-review-btn').addEventListener('click', () => {
      ExamSession.toggleMarked(q.id);
      const marked = ExamSession.isMarked(q.id);
      card.classList.toggle('marked-review', marked);
      card.querySelector('.mark-review-btn').textContent = marked ? '★ Marked for review' : '☆ Mark for review';
      updateNavigator();
    });
  });

  buildNavigator(orderedQuestions);

  if (typeof initChartsInContainer === 'function') {
    initChartsInContainer(container);
  }

  updateProgress();
  startTimer();

  document.getElementById('submit-btn').addEventListener('click', submitExam);

  const navToggle = document.getElementById('nav-toggle');
  const navigator = document.getElementById('question-navigator');
  if (navToggle && navigator) {
    navToggle.addEventListener('click', () => {
      navigator.classList.toggle('nav-open');
    });
  }

  function buildNavigator(questions) {
    navGrid.innerHTML = questions.map((q, i) => {
      const num = i + 1;
      const answered = (answers[q.id] || []).length > 0;
      const marked = ExamSession.isMarked(q.id);
      let cls = 'nav-cell';
      if (answered) cls += ' answered';
      if (marked) cls += ' marked';
      return '<button type="button" class="' + cls + '" data-target="question-' + q.id + '" data-num="' + num + '">' + num + '</button>';
    }).join('');

    navGrid.querySelectorAll('.nav-cell').forEach(btn => {
      btn.addEventListener('click', () => {
        const el = document.getElementById(btn.dataset.target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('nav-highlight');
          setTimeout(() => el.classList.remove('nav-highlight'), 1200);
        }
        navigator.classList.remove('nav-open');
      });
    });
  }

  function updateNavigator() {
    const currentAnswers = loadAnswers();
    navGrid.querySelectorAll('.nav-cell').forEach(btn => {
      const targetId = btn.dataset.target.replace('question-', '');
      const answered = (currentAnswers[targetId] || []).length > 0;
      const marked = ExamSession.isMarked(parseInt(targetId, 10));
      btn.classList.toggle('answered', answered);
      btn.classList.toggle('marked', marked);
    });
  }

  function handleAnswerChange(q, card) {
    const selected = getSelectedIndices(q.id);
    const current = loadAnswers();
    current[q.id] = selected;
    saveAnswers(current);

    card.classList.toggle('answered', selected.length > 0);
    card.classList.remove('unanswered-highlight');
    updateProgress();
    updateNavigator();
  }

  function getSelectedIndices(questionId) {
    const inputs = document.querySelectorAll('input[name="q-' + questionId + '"]:checked');
    return Array.from(inputs).map(inp => parseInt(inp.value, 10));
  }

  function loadAnswers() {
    try {
      return JSON.parse(sessionStorage.getItem('examAnswers') || '{}');
    } catch {
      return {};
    }
  }

  function saveAnswers(data) {
    sessionStorage.setItem('examAnswers', JSON.stringify(data));
  }

  function updateProgress() {
    const ans = loadAnswers();
    let answered = 0;
    EXAM_QUESTIONS.forEach(q => {
      if ((ans[q.id] || []).length > 0) answered++;
    });

    const total = EXAM_QUESTIONS.length;
    const pct = Math.round((answered / total) * 100);
    document.getElementById('progress-text').textContent = answered + ' / ' + total + ' answered';
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('submit-btn').disabled = answered < total;
    document.getElementById('submit-warning').classList.toggle('visible', answered < total);

    const markedCount = ExamSession.loadMarked().length;
    const markedEl = document.getElementById('marked-count');
    if (markedEl) markedEl.textContent = markedCount;
  }

  function submitExam() {
    const ans = loadAnswers();
    const unanswered = [];
    EXAM_QUESTIONS.forEach(q => {
      if (!(ans[q.id] || []).length) unanswered.push(q.id);
    });

    if (unanswered.length > 0) {
      document.getElementById('submit-warning').classList.add('visible');
      const first = unanswered[0];
      const card = document.querySelector('[data-question-id="' + first + '"]');
      if (card) {
        card.classList.add('unanswered-highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const marked = ExamSession.loadMarked();
    let msg = 'Are you sure you want to submit? You cannot change answers after submission.';
    if (marked.length > 0) {
      msg += '\n\nYou have ' + marked.length + ' question(s) marked for review.';
    }
    if (!confirm(msg)) return;

    const apiUrl = window.EXAM_CONFIG && window.EXAM_CONFIG.GRADE_API_URL;
    if (!apiUrl || apiUrl.includes('YOUR_PROJECT')) {
      alert('Grading API is not configured. Ask your instructor to set js/config.js.');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const endTime = Date.now();

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: ans,
        startTime: sessionStorage.getItem('examStartTime'),
        endTime: endTime,
        examCode: sessionStorage.getItem('examAccessCode') || ''
      })
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) {
            throw new Error(data.error || 'Submission failed');
          }
          return data;
        });
      })
      .then(function (results) {
        sessionStorage.setItem('examResults', JSON.stringify(results));
        sessionStorage.setItem('examSubmitted', 'true');
        sessionStorage.setItem('examEndTime', String(endTime));
        window.location.href = 'results.html';
      })
      .catch(function (err) {
        alert(err.message || 'Could not submit exam. Check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  }

  function startTimer() {
    const startTime = parseInt(sessionStorage.getItem('examStartTime') || Date.now(), 10);
    const timerEl = document.getElementById('timer');

    function tick() {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const secs = (elapsed % 60).toString().padStart(2, '0');
      timerEl.textContent = mins + ':' + secs;
    }

    tick();
    setInterval(tick, 1000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatQuestion(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
  }
})();
