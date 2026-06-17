/* Chart.js configs — dark theme, business-grade plots */
(function (global) {
  const FONT = "'Segoe UI', system-ui, sans-serif";
  const GRID = 'rgba(255, 255, 255, 0.06)';
  const TICK = '#9aa8c0';
  const TITLE = '#f0f4fc';

  const palette = {
    blue: '#4f8cff',
    blueSoft: 'rgba(79, 140, 255, 0.15)',
    purple: '#7c5cff',
    teal: '#22d3a7',
    tealSoft: 'rgba(34, 211, 167, 0.2)',
    amber: '#fbbf24',
    rose: '#f87171',
    violet: '#a78bfa'
  };

  function baseOptions(title, xTitle, yTitle) {
    return {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.1,
      plugins: {
        legend: {
          display: true,
          labels: { color: TICK, font: { family: FONT, size: 11 }, boxWidth: 12, padding: 14 }
        },
        title: {
          display: !!title,
          text: title,
          color: TITLE,
          font: { family: FONT, size: 13, weight: '600' },
          padding: { bottom: 16 }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 20, 30, 0.95)',
          titleColor: TITLE,
          bodyColor: TICK,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          titleFont: { family: FONT, size: 12 },
          bodyFont: { family: FONT, size: 11 }
        }
      },
      scales: {
        x: {
          title: xTitle ? { display: true, text: xTitle, color: TICK, font: { family: FONT, size: 11 } } : undefined,
          ticks: { color: TICK, font: { family: FONT, size: 10 } },
          grid: { color: GRID }
        },
        y: {
          title: yTitle ? { display: true, text: yTitle, color: TICK, font: { family: FONT, size: 11 } } : undefined,
          ticks: { color: TICK, font: { family: FONT, size: 10 } },
          grid: { color: GRID },
          beginAtZero: true
        }
      }
    };
  }

  const CHART_DEFINITIONS = {
    line_mrr: {
      build() {
        return {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'MRR ($ thousands)',
              data: [118, 122, 128, 125, 134, 141, 148, 155, 149, 162, 171, 178],
              borderColor: palette.blue,
              backgroundColor: palette.blueSoft,
              borderWidth: 2.5,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: palette.blue,
              pointBorderColor: '#0d1118',
              pointBorderWidth: 2,
              tension: 0.25,
              fill: true
            }]
          },
          options: {
            ...baseOptions('Monthly Recurring Revenue — FinTech SaaS (2024)', 'Month', 'MRR ($ thousands)'),
            plugins: {
              ...baseOptions().plugins,
              annotation: undefined
            }
          }
        };
      }
    },

    scatter_marketing: {
      build() {
        const spend = [8, 12, 15, 18, 22, 25, 28, 31, 34, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82, 85];
        const sales = [31, 38, 42, 48, 52, 58, 61, 67, 71, 76, 82, 88, 91, 97, 102, 108, 112, 118, 121, 127, 133, 138, 142, 148];
        return {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Weekly campaigns (n=24)',
                data: spend.map((x, i) => ({ x, y: sales[i] })),
                backgroundColor: 'rgba(34, 211, 167, 0.75)',
                borderColor: palette.teal,
                borderWidth: 1.5,
                pointRadius: 5,
                pointHoverRadius: 7
              },
              {
                label: 'Outlier week',
                data: [{ x: 60, y: 95 }],
                backgroundColor: palette.amber,
                borderColor: palette.amber,
                borderWidth: 2,
                pointRadius: 7,
                pointStyle: 'triangle'
              }
            ]
          },
          options: {
            ...baseOptions('Weekly Digital Ad Spend vs Revenue — E-commerce', 'Ad Spend ($ thousands)', 'Revenue ($ thousands)'),
            scales: {
              x: { ...baseOptions().scales.x, min: 0, max: 95 },
              y: { ...baseOptions().scales.y, min: 0, max: 160 }
            }
          }
        };
      }
    },

    histogram_wait: {
      build() {
        return {
          type: 'bar',
          data: {
            labels: ['0–2', '2–4', '4–6', '6–8', '8–10', '10–12', '12+'],
            datasets: [{
              label: 'Number of calls',
              data: [412, 538, 391, 224, 118, 52, 18],
              backgroundColor: [
                'rgba(79, 140, 255, 0.85)',
                'rgba(79, 140, 255, 0.7)',
                'rgba(124, 92, 255, 0.6)',
                'rgba(124, 92, 255, 0.45)',
                'rgba(167, 139, 250, 0.35)',
                'rgba(167, 139, 250, 0.25)',
                'rgba(167, 139, 250, 0.15)'
              ],
              borderColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderRadius: 2
            }]
          },
          options: {
            ...baseOptions('Call-Center Wait Time Distribution — Telecom Support', 'Wait time (minutes)', 'Call count'),
            plugins: { ...baseOptions().plugins, legend: { display: false } },
            scales: {
              x: { ...baseOptions().scales.x, grid: { display: false } },
              y: { ...baseOptions().scales.y, title: { display: true, text: 'Number of calls', color: TICK, font: { family: FONT, size: 11 } } }
            }
          }
        };
      }
    },

    boxplot_fulfillment: {
      build() {
        /* Tukey boxplot stats (matplotlib / R boxplot.stats hinges).
           min/max = whisker ends; values beyond Q1−1.5·IQR or Q3+1.5·IQR are outliers. */
        const hubs = [
          {
            label: 'North Hub',
            min: 2.2,
            q1: 2.85,
            median: 3.25,
            q3: 3.75,
            max: 4.4,
            outliers: []
          },
          {
            label: 'Central Hub',
            min: 1.5,
            q1: 2.0,
            median: 2.4,
            q3: 2.8,
            max: 3.2,
            outliers: []
          },
          {
            label: 'West Hub',
            min: 3.1,
            q1: 4.15,
            median: 5.35,
            q3: 6.75,
            max: 8.4,
            outliers: [11.6]
          }
        ];

        return {
          type: 'boxplot',
          data: {
            labels: hubs.map(h => h.label),
            datasets: [{
              label: 'Fulfillment time (days)',
              data: hubs.map(h => ({
                min: h.min,
                q1: h.q1,
                median: h.median,
                q3: h.q3,
                max: h.max,
                outliers: h.outliers
              })),
              backgroundColor: 'rgba(79, 140, 255, 0.35)',
              borderColor: palette.blue,
              borderWidth: 2,
              outlierBackgroundColor: palette.rose,
              outlierBorderColor: palette.rose,
              outlierRadius: 6,
              medianColor: '#f0f4fc',
              itemRadius: 0
            }]
          },
          options: {
            ...baseOptions('Order Fulfillment Time by Warehouse — Retail Logistics', 'Warehouse', 'Days to ship'),
            plugins: { ...baseOptions().plugins, legend: { display: false } },
            boxplot: {
              coef: 1.5,
              whiskersMode: 'nearest'
            },
            scales: {
              ...baseOptions().scales,
              y: {
                ...baseOptions().scales.y,
                min: 0,
                max: 13,
                ticks: { ...baseOptions().scales.y.ticks, stepSize: 2 }
              }
            }
          }
        };
      }
    },

    bar_channels: {
      build() {
        return {
          type: 'bar',
          data: {
            labels: ['In-Store', 'Website', 'Mobile App', 'Marketplace', 'B2B Portal'],
            datasets: [{
              label: 'Q4 Revenue ($ millions)',
              data: [4.2, 6.8, 5.1, 3.4, 2.7],
              backgroundColor: [
                palette.blue,
                palette.teal,
                palette.purple,
                palette.amber,
                palette.rose
              ],
              borderRadius: 6,
              borderSkipped: false
            }]
          },
          options: {
            ...baseOptions('Q4 2024 Revenue by Sales Channel — National Retailer', 'Channel', 'Revenue ($ millions)'),
            plugins: { ...baseOptions().plugins, legend: { display: false } },
            scales: {
              x: { ...baseOptions().scales.x, grid: { display: false } },
              y: {
                ...baseOptions().scales.y,
                max: 8,
                title: { display: true, text: 'Revenue ($ millions)', color: TICK, font: { family: FONT, size: 11 } }
              }
            }
          }
        };
      }
    }
  };

  const chartInstances = new Map();

  function registerBoxPlotPlugin() {
    if (typeof Chart === 'undefined') return false;
    const plugin = global.ChartBoxPlot
      || global['@sgratzl/chartjs-chart-boxplot']
      || global['chartjs-chart-box-and-violin-plot'];
    if (plugin && plugin.BoxPlotController) {
      Chart.register(plugin.BoxPlotController, plugin.BoxAndWiskers);
      return true;
    }
    return false;
  }

  function renderChartHtml(questionId, chartKey, caption) {
    if (!CHART_DEFINITIONS[chartKey]) return '';
    const canvasId = 'chart-q' + questionId;
    const cap = caption
      ? '<div class="chart-caption">' + escapeHtml(caption) + '</div>'
      : '';
    return (
      '<div class="question-chart">' +
        '<div class="chart-canvas-wrap"><canvas id="' + canvasId + '" data-chart-key="' + chartKey + '"></canvas></div>' +
        cap +
      '</div>'
    );
  }

  function initChart(canvasId) {
    if (typeof Chart === 'undefined') return null;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const chartKey = canvas.dataset.chartKey;
    const def = CHART_DEFINITIONS[chartKey];
    if (!def) return null;

    destroyChart(canvasId);

    const config = def.build();
    const instance = new Chart(canvas, config);
    chartInstances.set(canvasId, instance);
    return instance;
  }

  function initChartsInContainer(container) {
    if (!container) return;
    container.querySelectorAll('canvas[data-chart-key]').forEach(function (canvas) {
      initChart(canvas.id);
    });
  }

  function destroyChart(canvasId) {
    const existing = chartInstances.get(canvasId);
    if (existing) {
      existing.destroy();
      chartInstances.delete(canvasId);
    }
  }

  function destroyChartsInContainer(container) {
    if (!container) return;
    container.querySelectorAll('canvas[data-chart-key]').forEach(function (canvas) {
      destroyChart(canvas.id);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  registerBoxPlotPlugin();

  global.CHART_DEFINITIONS = CHART_DEFINITIONS;
  global.renderChartHtml = renderChartHtml;
  global.initChart = initChart;
  global.initChartsInContainer = initChartsInContainer;
  global.destroyChartsInContainer = destroyChartsInContainer;
})(typeof window !== 'undefined' ? window : this);
