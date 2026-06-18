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

  const MOTION_OK = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const REVEAL_OK = MOTION_OK && 'IntersectionObserver' in window;
  let progressShown = 0;

  orderedQuestions.forEach((q, position) => {
    const displayNum = position + 1;
    const card = document.createElement('article');
    const isCapstone = !!q.capstone;
    card.className = 'question-card morph-card' +
      (isCapstone ? ' capstone-card' : '') +
      (REVEAL_OK ? ' q-reveal' : '');
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
    const numberHtml = isCapstone
      ? '<div class="question-number capstone-number ' + topicClass + '" title="Final Integration">' +
          icon('trophy', 'capstone-num-icon') +
        '</div>'
      : '<div class="question-number ' + topicClass + '">' + displayNum + '</div>';

    const briefHtml = isCapstone ? renderCapstoneBrief(q) : '';
    const questionHtml = isCapstone
      ? ''
      : '<p class="question-text">' + formatQuestion(q.question) + '</p>';

    card.innerHTML =
      '<div class="question-header">' +
        numberHtml +
        '<div class="question-body">' +
          '<div class="question-meta">' +
            '<span class="badge badge-topic ' + topicClass + '">' + escapeHtml(q.topicLabel) + '</span>' +
            '<span class="badge badge-' + q.difficulty + '">' + q.difficulty + '</span>' +
            (isCapstone ? '<span class="badge badge-capstone">Capstone</span>' : '') +
            (q.multiSelect ? '<span class="badge badge-multi">Multi-select</span>' : '') +
            (!isCapstone && q.chart ? '<span class="badge badge-viz">Read Chart</span>' : '') +
          '</div>' +
          briefHtml +
          questionHtml +
          chartHtml +
          (q.multiSelect ? '<p class="question-hint">' +
            (isCapstone
              ? 'Read every panel above, then select <strong>all</strong> sound statements.'
              : 'Select all that apply.') +
          '</p>' : '') +
          '<button type="button" class="mark-review-btn" data-qid="' + q.id + '">' +
            markLabel(ExamSession.isMarked(q.id)) +
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
      card.querySelector('.mark-review-btn').innerHTML = markLabel(marked);
      const starIcon = card.querySelector('.mark-review-btn .icon-svg');
      if (MOTION_OK && starIcon) {
        starIcon.classList.add('pop');
        starIcon.addEventListener('animationend', () => starIcon.classList.remove('pop'), { once: true });
      }
      updateNavigator();
    });
  });

  if (window.Icons && typeof window.Icons.hydrate === 'function') {
    window.Icons.hydrate(container);
  }

  buildNavigator(orderedQuestions);

  if (typeof initChartsInContainer === 'function') {
    initChartsInContainer(container);
  }

  if (typeof typesetMath === 'function') {
    typesetMath(container);
  }

  setupReveal();
  setupScrollSpy();
  setupRipples();

  updateProgress();
  startTimer();

  document.getElementById('submit-btn').addEventListener('click', submitExam);
  setupConfirmModal();

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
      if (q.capstone) cls += ' nav-capstone';
      if (answered) cls += ' answered';
      if (marked) cls += ' marked';
      const label = q.capstone ? '★' : String(num);
      return '<button type="button" class="' + cls + '" data-target="question-' + q.id + '" data-num="' + num + '" title="' +
        (q.capstone ? 'Final Integration Challenge' : 'Question ' + num) + '">' + label + '</button>';
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
    const wasAnswered = card.classList.contains('answered');
    const current = loadAnswers();
    current[q.id] = selected;
    saveAnswers(current);

    card.classList.toggle('answered', selected.length > 0);
    card.classList.remove('unanswered-highlight');

    if (MOTION_OK && selected.length > 0 && !wasAnswered) {
      card.classList.remove('answer-pulse');
      void card.offsetWidth;
      card.classList.add('answer-pulse');
      card.addEventListener('animationend', function done() {
        card.classList.remove('answer-pulse');
        card.removeEventListener('animationend', done);
      });
      popNavCell(q.id);
    }

    updateProgress();
    updateNavigator();
  }

  function popNavCell(qid) {
    if (!MOTION_OK) return;
    const cell = navGrid.querySelector('[data-target="question-' + qid + '"]');
    if (!cell) return;
    cell.classList.remove('pop');
    void cell.offsetWidth;
    cell.classList.add('pop');
    cell.addEventListener('animationend', () => cell.classList.remove('pop'), { once: true });
  }

  function setActiveNav(qid) {
    navGrid.querySelectorAll('.nav-cell').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === 'question-' + qid);
    });
  }

  function setupReveal() {
    const cards = Array.from(container.querySelectorAll('.q-reveal'));
    if (!cards.length) return;
    const start = performance.now();
    let batch = 0;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = (performance.now() - start < 450) ? Math.min(batch++, 8) * 65 : 0;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('in-view');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    cards.forEach(c => io.observe(c));
    // Safety: never leave a card hidden if the observer misbehaves.
    setTimeout(() => cards.forEach(c => c.classList.add('in-view')), 1800);
  }

  function setupScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const cards = Array.from(container.querySelectorAll('.question-card'));
    if (!cards.length) return;
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveNav(entry.target.dataset.questionId);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    cards.forEach(c => spy.observe(c));
  }

  function setupRipples() {
    if (!MOTION_OK) return;
    container.addEventListener('pointerdown', e => {
      const label = e.target.closest('.option-label');
      if (!label) return;
      const rect = label.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.15;
      const ripple = document.createElement('span');
      ripple.className = 'option-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      label.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
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
    setProgressText(answered, total);
    document.getElementById('progress-fill').style.width = pct + '%';

    const submitBtn = document.getElementById('submit-btn');
    const complete = answered >= total;
    submitBtn.disabled = !complete;
    submitBtn.classList.toggle('breathe', complete);
    document.getElementById('submit-warning').classList.toggle('visible', !complete);

    const markedCount = ExamSession.loadMarked().length;
    const markedEl = document.getElementById('marked-count');
    if (markedEl) markedEl.textContent = markedCount;
  }

  function setProgressText(answered, total) {
    const el = document.getElementById('progress-text');
    if (!el) return;
    if (!MOTION_OK || progressShown === answered) {
      el.textContent = answered + ' / ' + total + ' answered';
      progressShown = answered;
      return;
    }
    const from = progressShown;
    const startT = performance.now();
    const dur = Math.min(450, Math.abs(answered - from) * 140 + 120);
    (function frame(now) {
      const t = Math.min(1, (now - startT) / dur);
      const val = Math.round(from + (answered - from) * t);
      el.textContent = val + ' / ' + total + ' answered';
      if (t < 1) requestAnimationFrame(frame);
      else progressShown = answered;
    })(startT);
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

    openConfirmModal();
  }

  function openConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const note = document.getElementById('confirm-marked-note');
    const marked = ExamSession.loadMarked();

    if (marked.length > 0) {
      note.innerHTML = icon('warning', 'icon-inline') + 'You still have ' + marked.length + ' question(s) marked for review.';
      note.hidden = false;
    } else {
      note.hidden = true;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('confirm-submit').focus();
  }

  function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function setupConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    document.getElementById('confirm-cancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirm-submit').addEventListener('click', function () {
      closeConfirmModal();
      doSubmit();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeConfirmModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeConfirmModal();
    });
  }

  function doSubmit() {
    const ans = loadAnswers();
    const apiUrl = window.EXAM_CONFIG && window.EXAM_CONFIG.GRADE_API_URL;
    if (!apiUrl || apiUrl.includes('YOUR_PROJECT') || apiUrl.includes('REPLACE_ME')) {
      alert('Grading API is not configured. Set GRADE_API_URL in js/config.js to your Vercel URL.');
      return;
    }
    if (/localhost|127\.0\.0\.1/.test(apiUrl) && !/^https?:\/\/(localhost|127\.0\.0\.1)/.test(location.origin)) {
      alert('config.js points to localhost but the exam is not running locally. Update GRADE_API_URL to your Vercel URL and push to GitHub.');
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
        studentName: sessionStorage.getItem('examStudentName') || '',
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
        let msg = err.message || 'Could not submit exam.';
        if (msg === 'Failed to fetch' || (err.name === 'TypeError' && /fetch/i.test(msg))) {
          msg =
            'Cannot reach the grading server (network/CORS).\n\n' +
            'Checklist:\n' +
            '1. Set GRADE_API_URL in js/config.js to your Vercel URL\n' +
            '2. Deploy api/ to Vercel with ANSWER_KEY_JSON set\n' +
            '3. On Vercel set ALLOW_GITHUB_PAGES=true\n' +
            '4. Push config.js to GitHub and wait for Pages to update';
        }
        alert(msg);
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
      if (MOTION_OK) {
        timerEl.classList.remove('tick');
        void timerEl.offsetWidth;
        timerEl.classList.add('tick');
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  function renderCapstoneBrief(q) {
    const panels = q.capstonePanels || [];
    const grid = panels.map(function (p) {
      const lines = String(p.text || '').split('\n').filter(Boolean);
      const list = lines.map(function (line) {
        return '<li>' + escapeHtml(line) + '</li>';
      }).join('');
      return (
        '<article class="capstone-panel">' +
          '<div class="capstone-panel-head">' +
            '<span class="capstone-panel-icon icon" data-icon="' + escapeHtml(p.icon) + '"></span>' +
            '<h3 class="capstone-panel-title">' + escapeHtml(p.title) + '</h3>' +
          '</div>' +
          '<ul class="capstone-panel-list">' + list + '</ul>' +
        '</article>'
      );
    }).join('');

    return (
      '<div class="capstone-brief">' +
        '<div class="capstone-hero">' +
          '<span class="capstone-hero-icon icon" data-icon="trophy"></span>' +
          '<div class="capstone-hero-text">' +
            '<p class="capstone-eyebrow">Final Integration Challenge</p>' +
            '<p class="capstone-scenario">QuickBite delivery — rainy-season campaign brief</p>' +
          '</div>' +
        '</div>' +
        '<p class="capstone-guide">Five facts from your analysis. Read each panel, then answer below.</p>' +
        '<div class="capstone-panel-grid">' + grid + '</div>' +
        '<div class="capstone-task">' +
          '<span class="capstone-task-icon icon" data-icon="target"></span>' +
          '<p class="capstone-task-text">' + escapeHtml(q.question) + '</p>' +
        '</div>' +
      '</div>'
    );
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

  function markLabel(marked) {
    return (
      icon(marked ? 'star-filled' : 'star') +
      '<span>' + (marked ? 'Marked for review' : 'Mark for review') + '</span>'
    );
  }
})();
