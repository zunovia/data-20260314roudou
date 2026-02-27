/* ======================================================
   令和6年度 孤独・孤立調査レポート — スクリプト
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. スクロールプログレスバー ── */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ── 2. スクロールトップボタン ── */
  const scrollTopBtn = document.getElementById('scroll-top');
  function updateScrollTop() {
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    }
  }
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. アクティブナビゲーション ── */
  const navItems  = document.querySelectorAll('.nav-item[data-section]');
  const sections  = document.querySelectorAll('.section[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── 4. フェードインアニメーション ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));

  /* ── 5. KPI カウントアップ ── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const start    = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val   = target * eased;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const kpiObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.kpi-grid').forEach(el => kpiObserver.observe(el));

  /* ── 6. バーアニメーション ── */
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.bar-section').forEach(el => barObserver.observe(el));

  /* ── 7. ライトボックス ── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');

  document.querySelectorAll('.chart-body img').forEach(img => {
    img.addEventListener('click', () => {
      if (lbImg) lbImg.src = img.src;
      if (lightbox) lightbox.classList.add('show');
    });
  });
  [lightbox, lbClose].forEach(el => {
    if (el) el.addEventListener('click', () => lightbox.classList.remove('show'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox) lightbox.classList.remove('show');
  });

  /* ── 8. サイドバートグル（モバイル） ── */
  const sidebar = document.querySelector('.sidebar');
  const toggle  = document.getElementById('sidebar-toggle');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ── 統合スクロールイベント ── */
  window.addEventListener('scroll', () => {
    updateProgress();
    updateScrollTop();
    updateActiveNav();
  }, { passive: true });

  /* ── 9. Chart.js グラフ初期化 ── */
  initCharts();
});

/* ═══════════════════════════════════════
   Chart.js グラフ定義
═══════════════════════════════════════ */
function initCharts() {
  const fontFamily = "'Noto Sans JP', 'Inter', sans-serif";
  Chart.defaults.font.family = fontFamily;
  Chart.defaults.color = '#eceff1';  /* 全チャートのデフォルト文字色を明るく */

  /* ── 全チャート共通: 濃い背景プラグイン ── */
  const darkBg = {
    id: 'darkBg',
    beforeDraw(chart) {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.fillStyle = '#0d1b2a';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  };

  /* ── UCLA孤独感尺度 ドーナツ ── */
  const ctxUCLA = document.getElementById('chart-ucla');
  if (ctxUCLA) {
    new Chart(ctxUCLA, {
      type: 'doughnut',
      data: {
        labels: ['常にある\n(10-12点)', '時々ある\n(7-9点)', 'ほとんどない\n(4-6点)', '決してない\n(3点)'],
        datasets: [{
          data: [6.5, 39.2, 38.0, 14.2],
          backgroundColor: ['#e53935', '#ef9a9a', '#a5d6a7', '#43a047'],
          borderColor: '#0d1b2a',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 14, font: { size: 11, family: fontFamily },
              color: '#eceff1', boxWidth: 12, boxHeight: 12 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label.replace('\\n', ' ')}: ${ctx.parsed}%`
            }
          }
        }
      },
      plugins: [darkBg]
    });
  }

  /* ── 直接質問 ドーナツ ── */
  const ctxDirect = document.getElementById('chart-direct');
  if (ctxDirect) {
    new Chart(ctxDirect, {
      type: 'doughnut',
      data: {
        labels: ['しばしば/常に', '時々ある', 'たまにある', 'ほとんどない', '決してない'],
        datasets: [{
          data: [4.3, 15.4, 19.6, 38.2, 22.5],
          backgroundColor: ['#ad1457', '#e53935', '#fb8c00', '#7cb342', '#2e7d32'],
          borderColor: '#0d1b2a',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 14, font: { size: 11, family: fontFamily },
              color: '#eceff1', boxWidth: 12, boxHeight: 12 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      },
      plugins: [darkBg]
    });
  }

  /* ── 社会的サポート複合 ── */
  const ctxCombo = document.getElementById('chart-combo');
  if (ctxCombo) {
    new Chart(ctxCombo, {
      type: 'doughnut',
      data: {
        labels: ['3つとも「いる」', '2つ「いる」', '1つ「いる」', '3つとも「いない」'],
        datasets: [{
          data: [86.1, 8.2, 2.0, 3.7],
          backgroundColor: ['#2e7d32', '#66bb6a', '#ffa726', '#e53935'],
          borderColor: '#0d1b2a',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 12, font: { size: 11, family: fontFamily },
              color: '#eceff1', boxWidth: 12, boxHeight: 12 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      },
      plugins: [darkBg]
    });
  }

  /* ── 年齢別孤独感（しばしば常にある）横棒 ── */
  const ctxAge = document.getElementById('chart-age');
  if (ctxAge) {
    new Chart(ctxAge, {
      type: 'bar',
      data: {
        labels: ['16-19歳', '20代', '30代', '40代', '50代', '60代', '70代', '80歳以上'],
        datasets: [
          {
            label: '男性',
            data: [4.2, 6.8, 6.1, 5.5, 5.8, 5.2, 3.8, 3.1],
            backgroundColor: 'rgba(66,165,245,0.85)',
            borderRadius: 4
          },
          {
            label: '女性',
            data: [3.9, 7.1, 5.8, 4.2, 3.5, 3.1, 2.8, 2.5],
            backgroundColor: 'rgba(239,83,80,0.85)',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, max: 12,
            title: { display: true, text: '割合（%）', font: { size: 11 }, color: '#cfd8dc' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#cfd8dc', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#cfd8dc', font: { size: 11, family: fontFamily } }
          }
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11, family: fontFamily }, color: '#eceff1' } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } },
          annotation: {}
        }
      },
      plugins: [darkBg]
    });
  }

  /* ── 孤独感 年次推移（2021-2024） ── */
  const ctxTrend = document.getElementById('chart-trend');
  if (ctxTrend) {
    /* 値ラベルを描画するプラグイン（背景はdarkBgで共通化） */
    const trendBgPlugin = darkBg;

    /* 各データポイント上に値ラベル（白抜き）を描画するプラグイン */
    const trendLabelPlugin = {
      id: 'trendLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const labelColors = ['#ff8a80', '#82b1ff'];
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;
          meta.data.forEach((point, index) => {
            const val = dataset.data[index];
            const text = val + '%';
            ctx.save();
            ctx.font = `bold 13px ${fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            /* 白いアウトラインで可読性を確保 */
            ctx.strokeStyle = 'rgba(13,27,42,0.9)';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';
            ctx.strokeText(text, point.x, point.y - 10);
            ctx.fillStyle = labelColors[i] || '#fff';
            ctx.fillText(text, point.x, point.y - 10);
            ctx.restore();
          });
        });
      }
    };

    new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['令和3年\n(2021)', '令和4年\n(2022)', '令和5年\n(2023)', '令和6年\n(2024)'],
        datasets: [
          {
            label: '孤独感あり（たまに以上）',
            data: [40.3, 40.0, 39.1, 39.3],
            borderColor: '#ff5252', backgroundColor: '#ff5252',
            borderWidth: 3, pointRadius: 7, pointHoverRadius: 10,
            pointBackgroundColor: '#ff5252', pointBorderColor: '#fff', pointBorderWidth: 2,
            fill: false, tension: 0.3
          },
          {
            label: '孤独感「しばしば/常にある」',
            data: [4.8, 4.5, 4.1, 4.3],
            borderColor: '#448aff', backgroundColor: '#448aff',
            borderWidth: 3, pointRadius: 7, pointHoverRadius: 10,
            pointBackgroundColor: '#448aff', pointBorderColor: '#fff', pointBorderWidth: 2,
            fill: false, tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        layout: { padding: { top: 32, right: 16, bottom: 8, left: 8 } },
        scales: {
          y: {
            beginAtZero: true, min: 0, max: 50,
            title: { display: true, text: '割合（%）', font: { size: 12 }, color: '#cfd8dc' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#cfd8dc', font: { size: 12 }, callback: v => v + '%' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#cfd8dc', font: { size: 12, family: fontFamily } }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 14, font: { size: 12, family: fontFamily }, color: '#eceff1' }
          },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } }
        }
      },
      plugins: [trendBgPlugin, trendLabelPlugin]
    });
  }
}
