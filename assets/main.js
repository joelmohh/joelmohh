// Animação de fade-in com IntersectionObserver e stagger
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.fade-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, Number(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    elements.forEach((el, i) => {
        el.style.willChange = 'opacity, transform';
        el.dataset.delay = String(i * 100);
        observer.observe(el);
    });
}
window.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Smooth scroll para navegação
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const target = href && document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
  });
});

// Menu responsivo (hamburger) + overlay + ESC + bloqueio de scroll
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.getElementById('primary-navigation');
    const overlay = document.getElementById('menu-overlay');
    const body = document.body;
    if (!btn || !nav || !overlay) return;

    function setMenu(open) {
        nav.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        overlay.classList.toggle('is-visible', open);
        overlay.hidden = !open;
        body.classList.toggle('no-scroll', open);
    }

    btn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    overlay.addEventListener('click', () => setMenu(false));
    nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
});

// Carregar projetos do GitHub com animação
async function fetchGitHubProjects() {
    const username = 'joelmohh';
    const container = document.getElementById('projects-container');
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        if (!Array.isArray(repos) || repos.length === 0 || repos.message) {
            container.innerHTML = '<p style="text-align:center;color:#888;">Nenhum projeto encontrado no momento.</p>';
            return;
        }
        container.innerHTML = repos.map((repo, i) => `
            <div class="project-card fade-scroll" data-delay="${i*120}">
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Projeto desenvolvido com dedicação.'}</p>
                    <div class="project-tech">
                        ${repo.language ? `<span class="tech-badge">${repo.language}</span>` : ''}
                        <span class="tech-badge"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span class="tech-badge"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> Código
                        </a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                    </div>
                </div>
            </div>
    `).join('');
    // Reconfigurar observador para os novos elementos inseridos
    setupScrollAnimations();
    } catch (error) {
        container.innerHTML = `<p style="text-align:center;color:#888;">Erro ao carregar projetos. <a href='https://github.com/${username}' target='_blank'>Acesse meu GitHub</a></p>`;
    }
}
window.addEventListener('DOMContentLoaded', fetchGitHubProjects);

// Tema claro/escuro com persistência
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.theme-toggle');
  const icon = btn && btn.querySelector('i');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.setAttribute('data-theme', 'dark');
  }
  updateIcon();

  function updateIcon() {
    if (!icon) return;
    const dark = root.getAttribute('data-theme') === 'dark';
    icon.classList.toggle('fa-moon', !dark);
    icon.classList.toggle('fa-sun', dark);
  }

  btn && btn.addEventListener('click', () => {
    const dark = root.getAttribute('data-theme') === 'dark';
    const next = dark ? 'light' : 'dark';
    if (next === 'light') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', next);
    updateIcon();
  });
});

// FAQ accordion
window.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  items.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      if (!expanded) {
        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove('is-open');
          const otherButton = other.querySelector('.faq-question');
          otherButton && otherButton.setAttribute('aria-expanded', 'false');
        });
      }

      button.setAttribute('aria-expanded', String(!expanded));
      item.classList.toggle('is-open', !expanded);
    });
  });
});
