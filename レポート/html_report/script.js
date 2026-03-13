'use strict';

/* ============================================================
   孤独・孤立実態調査 分析レポート
   Chart.js インタラクティブグラフ & アニメーション
   ============================================================ */

// ----- 共通フォント設定 -----
Chart.defaults.font.family = "'Yu Gothic', 'Meiryo', 'Hiragino Kaku Gothic ProN', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#546e7a';

/* ----------------------------------------------------------
   1. UCLA スコア分布（ドーナツチャート）
   ---------------------------------------------------------- */
const distCtx = document.getElementById('distChart');
if (distCtx) {
  new Chart(distCtx, {
    type: 'doughnut',
    data: {
      labels: ['3点（決してない）14.2%', '4-6点（低）38.0%', '7-9点（中）39.2%', '10-12点（高）6.5%'],
      datasets: [{
        data: [14.2, 38.0, 39.2, 6.5],
        backgroundColor: ['#26a69a', '#66bb6a', '#ffa726', '#ef5350'],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 13, padding: 10, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => `  ${ctx.label}`
          }
        }
      }
    }
  });
}

/* ----------------------------------------------------------
   2. 年齢別 UCLA 高スコア率（棒グラフ + 平均線）
   ---------------------------------------------------------- */
const ageCtx = document.getElementById('ageChart');
if (ageCtx) {
  new Chart(ageCtx, {
    type: 'bar',
    data: {
      labels: ['16-19歳', '20代', '30代', '40代', '50代', '60代', '70代'],
      datasets: [
        {
          label: 'UCLA高スコア（10-12点）',
          data: [4.2, 9.1, 9.5, 7.2, 7.6, 6.7, 3.9],
          backgroundColor: [
            '#90caf9', '#1565c0', '#1565c0',
            '#42a5f5', '#42a5f5', '#64b5f6', '#90caf9'
          ],
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: '全体平均 (6.5%)',
          data: [6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5],
          type: 'line',
          borderColor: '#e53935',
          borderWidth: 2,
          borderDash: [6, 3],
          pointRadius: 0,
          fill: false,
          tension: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 13, padding: 10 }
        },
        tooltip: {
          callbacks: {
            label: ctx => `  ${ctx.dataset.label}: ${ctx.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 12,
          ticks: { callback: v => v + '%' },
          title: { display: true, text: 'UCLA高スコア率 (%)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

/* ----------------------------------------------------------
   3. 孤独感レベル別 社会参加率（横棒グラフ）
   ---------------------------------------------------------- */
const participCtx = document.getElementById('participChart');
if (participCtx) {
  new Chart(participCtx, {
    type: 'bar',
    data: {
      labels: [
        ['10-12点', '（常にある）'],
        ['7-9点', '（時々ある）'],
        ['4-6点', '（ほとんどない）'],
        ['3点', '（決してない）']
      ],
      datasets: [{
        label: '社会参加率',
        data: [24.3, 41.2, 52.2, 58.2],
        backgroundColor: ['#ef5350', '#ffa726', '#66bb6a', '#26a69a'],
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `  社会参加率: ${ctx.parsed.x}%`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 70,
          ticks: { callback: v => v + '%' },
          title: { display: true, text: '社会参加率 (%)' }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });
}

/* ----------------------------------------------------------
   4. 生活満足度 × UCLA 高スコア（棒グラフ）
   ---------------------------------------------------------- */
const satisfCtx = document.getElementById('satisfChart');
if (satisfCtx) {
  new Chart(satisfCtx, {
    type: 'bar',
    data: {
      labels: ['満足している', 'まあ満足', 'どちらとも\nいえない', 'やや不満', '不満である'],
      datasets: [{
        label: 'UCLA高スコア（10-12点）',
        data: [1.0, 2.3, 8.2, 13.8, 31.5],
        backgroundColor: ['#81c784', '#a5d6a7', '#fff176', '#ffa726', '#ef5350'],
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `  UCLA高スコア率: ${ctx.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 36,
          ticks: { callback: v => v + '%' },
          title: { display: true, text: 'UCLA高スコア率 (%)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

/* ----------------------------------------------------------
   スクロールアニメーション（IntersectionObserver）
   ---------------------------------------------------------- */
const animateTargets = document.querySelectorAll(
  '.fig-card, .insight-box, .chart-container, .callout, ' +
  '.stat-mini, .policy-card, .ref-card, .cycle-box, .data-table'
);
animateTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

animateTargets.forEach(el => observer.observe(el));

/* ----------------------------------------------------------
   要因ランキング バーアニメーション
   ---------------------------------------------------------- */
const factorObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.factor-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      factorObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const factorList = document.querySelector('.factor-list');
if (factorList) factorObserver.observe(factorList);

/* ----------------------------------------------------------
   ナビゲーション アクティブ状態（スクロール連動）
   ---------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => navObserver.observe(s));

// Active nav link style (injected)
const navStyle = document.createElement('style');
navStyle.textContent = '.nav-links a.active { background: rgba(255,255,255,0.22); color: #fff; }';
document.head.appendChild(navStyle);
