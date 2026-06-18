/**
 * Frontend config — API URL switches automatically for local vs production.
 */
(function () {
  const isLocal =
    location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  window.EXAM_CONFIG = {
    GRADE_API_URL: isLocal ? '/api/grade' : 'https://dc-exam.vercel.app/api/grade',
    REQUIRE_EXAM_CODE: true,
    EXAM_DURATION_MINUTES: 120
  };
})();
