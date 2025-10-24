// Helpers
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

const siteHeader = $('.site-header');
const nav        = $('.nav');
const spacer     = $('#header-space');
const toggle     = $('.nav-toggle');
const panel      = $('#menu-panel');
const yearSpan   = $('#year');

// Año del footer
const yearElm = document.getElementById('year');
if (yearElm) yearElm.textContent = new Date().getFullYear();

// Transición corta al navegar a páginas externas (Blog)
document.querySelectorAll('a[data-external]').forEach(a => {
  a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return; // respeta abrir en nueva pestaña
    e.preventDefault();
    const href = a.getAttribute('href');
    if (!href) return;
    document.body.classList.add('fade-out');
    setTimeout(() => { window.location.href = href; }, 220);
  });
});

// Ajusta la altura real del header para espaciador y menú móvil
function setHeaderHeight() {
  const h = siteHeader.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-h', `${h}px`);
  spacer.style.height = `calc(${h}px + 10px)`;
}
window.addEventListener('load', setHeaderHeight);
window.addEventListener('resize', setHeaderHeight);
window.addEventListener('orientationchange', setHeaderHeight);

// Abrir / Cerrar menú móvil
function openMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
}
toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  openMenu(!isOpen);
});
// Cerrar al hacer click en link (móvil) + scroll suave con offset del header
$$('.nav-links a').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href?.startsWith('#')) return;
    e.preventDefault();
    const el = $(href);
    if (!el) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
    const y = el.getBoundingClientRect().top + window.scrollY - (headerH + 8);
    window.scrollTo({ top: y, behavior: 'smooth' });
    if (window.matchMedia('(max-width: 860px)').matches) openMenu(false);
  });
});

// Año del footer
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Scroll Spy: resalta link activo
const sections = $$('.section, #nosotros, #aplicacion, #blog, #descargar');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    if (!id) return;
    const link = $(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      $$('.nav-links a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
sections.forEach(s => s.id && obs.observe(s));

// ======= GRÁFICAS (Chart.js) =======
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;

  // Paleta
  const teal = '#12d6b0';
  const cyan = '#7be7d8';
  const purple = '#b07cff';
  const magenta = '#ff6bb3';
  const grid = 'rgba(255,255,255,.12)';
  const ticks = '#dfe8ff';

  // 1) Barras: áreas vocacionales
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Tecnología', 'Salud', 'Arte/Diseño', 'Negocios', 'Educación', 'Ciencias'],
        datasets: [{
          label: 'Preferencias (%)',
          data: [28, 18, 16, 20, 8, 10],
          backgroundColor: teal,
          borderRadius: 8
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: ticks }},
          y: { grid: { color: grid }, ticks: { color: ticks, callback: v => v + '%' }, suggestedMax: 40 }
        }
      }
    });
  }

  // 2) Línea: usuarios vs finalizaciones
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        datasets: [
          {
            label: 'Usuarios activos',
            data: [60, 80, 120, 150, 180, 210, 240, 260, 300, 320, 350, 380],
            borderColor: cyan, tension: .35, fill: false
          },
          {
            label: 'Tests finalizados',
            data: [30, 50, 70, 95, 120, 150, 170, 190, 210, 230, 250, 280],
            borderColor: magenta, tension: .35, fill: false
          }
        ]
      },
      options: {
        plugins: { legend: { labels: { color: ticks } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: ticks }},
          y: { grid: { color: grid }, ticks: { color: ticks } }
        }
      }
    });
  }

  // 3) Dona: tipos de test completados
  const doughnutCtx = document.getElementById('doughnutChart');
  if (doughnutCtx) {
    new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Vocacional', 'Personalidad', 'Emprendimiento'],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: [teal, purple, magenta],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom', labels: { color: ticks } }
        },
        cutout: '62%'
      }
    });
  }
});
