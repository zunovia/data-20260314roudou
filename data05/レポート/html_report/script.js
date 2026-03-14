/* =========================================================
   労働力調査 長期時系列分析レポート — script.js
   Chart.js 4.x  |  Light theme
   ========================================================= */

'use strict';

/* ── DATA ── */
const DATA = {
  unemployment: {
    labels: [1990,1995,2000,2002,2005,2008,2009,2010,2012,2015,2018,2020,2021,2022,2023,2024,2025],
    total:  [2.1, 3.2, 4.7, 5.4, 4.4, 4.0, 5.1, 5.1, 4.3, 3.4, 2.4, 2.8, 2.8, 2.6, 2.5, 2.5, 2.4],
    male:   [2.4, 3.5, 5.3, 6.0, 4.9, 4.5, 5.8, 5.8, 4.9, 3.8, 2.6, 3.1, 3.1, 2.9, 2.8, 2.8, 2.7],
    female: [1.8, 2.7, 4.0, 4.7, 3.8, 3.4, 4.3, 4.3, 3.6, 3.0, 2.1, 2.5, 2.5, 2.2, 2.2, 2.2, 2.1],
  },
  employment: {
    labels:   [2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
    regular:  [3272,3279,3317,3367,3432,3476,3494,3485,3558,3592,3644,3671,3695],
    irregular:[1906,1962,1986,2023,2036,2120,2165,2090,2064,2101,2124,2150,2150],
  },
  regional: {
    labels: ['北海道','東北','南関東','北関東甲信','北陸','東海','近畿','中国四国','九州沖縄'],
    data:   [2.9, 2.5, 2.5, 2.0, 1.9, 2.2, 2.9, 2.4, 2.4],
  },
};

/* ── Utilities ── */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── Chart.js defaults ── */
Chart.defaults.font.family = "'Noto Sans JP', sans-serif";
Chart.defaults.font.size   = 12;
Chart.defaults.color       = '#4a5568';

/* ── Chart initialisation ── */
function initCharts() {
  /* --- 完全失業率推移 --- */
  const ctxUnemp = document.getElementById('chartUnemployment');
  if (ctxUnemp) {
    new Chart(ctxUnemp, {
      type: 'line',
      data: {
        labels: DATA.unemployment.labels,
        datasets: [
          {
            label: '男女計',
            data: DATA.unemployment.total,
            borderColor: '#1A6EBD',
            backgroundColor: hexToRgba('#1A6EBD', 0.1),
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: false,
          },
          {
            label: '男性',
            data: DATA.unemployment.male,
            borderColor: '#E84A3C',
            backgroundColor: hexToRgba('#E84A3C', 0.08),
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: false,
            borderDash: [5,3],
          },
          {
            label: '女性',
            data: DATA.unemployment.female,
            borderColor: '#2E8B57',
            backgroundColor: hexToRgba('#2E8B57', 0.08),
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: false,
            borderDash: [3,3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 16, padding: 16 },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,.06)' },
            ticks: { maxRotation: 0 },
            title: { display: true, text: '年', font: { size: 11 } },
          },
          y: {
            min: 0,
            max: 7,
            grid: { color: 'rgba(0,0,0,.07)' },
            title: { display: true, text: '完全失業率（%）', font: { size: 11 } },
            ticks: { callback: v => v + '%' },
          },
        },
      },
    });
  }

  /* --- 正規・非正規雇用 --- */
  const ctxEmp = document.getElementById('chartEmployment');
  if (ctxEmp) {
    new Chart(ctxEmp, {
      type: 'bar',
      data: {
        labels: DATA.employment.labels,
        datasets: [
          {
            label: '正規雇用者（万人）',
            data: DATA.employment.regular,
            backgroundColor: hexToRgba('#1A6EBD', 0.82),
            borderColor: '#1A6EBD',
            borderWidth: 1,
            stack: 'emp',
          },
          {
            label: '非正規雇用者（万人）',
            data: DATA.employment.irregular,
            backgroundColor: hexToRgba('#E84A3C', 0.75),
            borderColor: '#E84A3C',
            borderWidth: 1,
            stack: 'emp',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 14, padding: 14 },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}万人`,
              footer: items => {
                const total = items.reduce((s, i) => s + i.parsed.y, 0);
                const irr = items.find(i => i.datasetIndex === 1);
                if (!irr) return '';
                const pct = ((irr.parsed.y / total) * 100).toFixed(1);
                return `非正規比率: ${pct}%`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            title: { display: true, text: '年', font: { size: 11 } },
          },
          y: {
            stacked: true,
            min: 0,
            max: 7000,
            grid: { color: 'rgba(0,0,0,.06)' },
            title: { display: true, text: '万人', font: { size: 11 } },
            ticks: { callback: v => v.toLocaleString() },
          },
        },
      },
    });
  }

  /* --- 地域別完全失業率（横棒） --- */
  const ctxRegion = document.getElementById('chartRegional');
  if (ctxRegion) {
    const barColors = DATA.regional.data.map(v =>
      v >= 2.8 ? hexToRgba('#E84A3C', 0.8) :
      v >= 2.4 ? hexToRgba('#F5A623', 0.8) :
                 hexToRgba('#1A6EBD', 0.75)
    );
    new Chart(ctxRegion, {
      type: 'bar',
      data: {
        labels: DATA.regional.labels,
        datasets: [{
          label: '完全失業率（%）',
          data: DATA.regional.data,
          backgroundColor: barColors,
          borderColor: barColors.map(c => c.replace(/[\d.]+\)$/, '1)')),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` 完全失業率: ${ctx.parsed.x}%`,
            },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 4,
            grid: { color: 'rgba(0,0,0,.07)' },
            ticks: { callback: v => v + '%' },
            title: { display: true, text: '完全失業率（%）', font: { size: 11 } },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
        },
      },
    });
  }
}

/* ── Chart Modal ── */
function initChartModal() {
  const modal    = document.getElementById('chartModal');
  const modalImg = document.getElementById('chartModalImg');
  if (!modal || !modalImg) return;

  function openModal(src) {
    modalImg.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Static images */
  document.querySelectorAll('.chart-img-wrap img').forEach(img => {
    img.addEventListener('click', () => openModal(img.src));
  });

  /* Chart.js canvases — wait for render */
  setTimeout(() => {
    document.querySelectorAll('.chartjs-canvas-wrap canvas').forEach(canvas => {
      canvas.addEventListener('click', () => openModal(canvas.toDataURL('image/png')));
    });
  }, 500);

  /* Close triggers */
  document.querySelector('.chart-modal-backdrop')?.addEventListener('click', closeModal);
  document.querySelector('.chart-modal-close')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── Scroll animation ── */
function initScrollAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ── Smooth scroll nav ── */
function initNavScroll() {
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 60;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initChartModal();
  initScrollAnimation();
  initNavScroll();
});
