(function (global) {
  function fisherYates(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getOrCreateShuffle() {
    try {
      const saved = sessionStorage.getItem('examShuffle');
      if (saved) return JSON.parse(saved);
    } catch (_) { /* new shuffle */ }

    const questionOrder = fisherYates(EXAM_QUESTIONS.map(q => q.id));
    const optionOrders = {};
    EXAM_QUESTIONS.forEach(q => {
      optionOrders[q.id] = fisherYates(q.options.map((_, i) => i));
    });

    const shuffle = { questionOrder, optionOrders };
    sessionStorage.setItem('examShuffle', JSON.stringify(shuffle));
    return shuffle;
  }

  function getOrderedQuestions() {
    const { questionOrder } = getOrCreateShuffle();
    const map = {};
    EXAM_QUESTIONS.forEach(q => { map[q.id] = q; });
    return questionOrder.map(id => map[id]).filter(Boolean);
  }

  function getOptionOrder(questionId) {
    const { optionOrders } = getOrCreateShuffle();
    return optionOrders[questionId] || [];
  }

  function loadMarked() {
    try {
      return JSON.parse(sessionStorage.getItem('examMarked') || '[]');
    } catch {
      return [];
    }
  }

  function saveMarked(ids) {
    sessionStorage.setItem('examMarked', JSON.stringify(ids));
  }

  function toggleMarked(questionId) {
    const marked = loadMarked();
    const idx = marked.indexOf(questionId);
    if (idx >= 0) marked.splice(idx, 1);
    else marked.push(questionId);
    saveMarked(marked);
    return marked;
  }

  function isMarked(questionId) {
    return loadMarked().includes(questionId);
  }

  global.ExamSession = {
    getOrCreateShuffle,
    getOrderedQuestions,
    getOptionOrder,
    loadMarked,
    toggleMarked,
    isMarked
  };
})(window);
