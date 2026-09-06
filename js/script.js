const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.querySelector('.nav-container');

function closeMenu() {
    navContainer.classList.remove('active');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
    const isOpen = navContainer.classList.toggle('active');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
        closeMenu();

        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (!targetElement) {
            return;
        }

        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
    });
});

const INITIAL_VISIBLE_REPOS = 6;

function renderRepos(repos, grid) {
    grid.innerHTML = '';

    const visibleRepos = repos.filter(repo => !repo.fork);

    visibleRepos.forEach((repo, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (index >= INITIAL_VISIBLE_REPOS) {
            card.classList.add('project-card--extra');
        }

        const content = document.createElement('div');
        content.className = 'project-content';

        const type = document.createElement('p');
        type.className = 'project-type';
        type.textContent = repo.language || 'Code';

        const title = document.createElement('h3');
        title.textContent = repo.name;

        const desc = document.createElement('p');
        desc.className = 'project-desc';
        desc.textContent = repo.description || 'No description provided.';

        const links = document.createElement('div');
        links.className = 'project-links';

        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.rel = 'noopener';
        repoLink.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"></path></svg>`;
        links.appendChild(repoLink);

        if (repo.homepage) {
            const liveLink = document.createElement('a');
            liveLink.href = repo.homepage;
            liveLink.target = '_blank';
            liveLink.rel = 'noopener';
            liveLink.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
            links.appendChild(liveLink);
        }

        content.append(type, title, desc, links);
        card.appendChild(content);
        grid.appendChild(card);
    });

    setupShowMoreButton(grid, visibleRepos.length);
}

function setupShowMoreButton(grid, totalCount) {
    const section = grid.closest('.projects');
    let btn = section.querySelector('.show-more-btn');

    if (totalCount <= INITIAL_VISIBLE_REPOS) {
        if (btn) btn.remove();
        return;
    }

    if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'show-more-btn';
        section.appendChild(btn);

        btn.addEventListener('click', () => {
            const isExpanded = btn.classList.toggle('is-expanded');
            grid.querySelectorAll('.project-card--extra').forEach(card => {
                card.classList.toggle('is-visible', isExpanded);
            });
            updateShowMoreLabel(btn, totalCount, isExpanded);
        });
    }

    updateShowMoreLabel(btn, totalCount, btn.classList.contains('is-expanded'));
}

function updateShowMoreLabel(btn, totalCount, isExpanded) {
    const hiddenCount = totalCount - INITIAL_VISIBLE_REPOS;
    btn.textContent = isExpanded ? 'See less' : `See more projects (${hiddenCount})`;
}

async function getRepos() {
    const grid = document.querySelector('#repo-grid');
    const cacheKey = 'gh-repos-cache';
    const cacheTTL = 60 * 60 * 1000; // 1 hour

    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && Date.now() - cached.timestamp < cacheTTL) {
        renderRepos(cached.data, grid);
        return;
    }

    try {
        const response = await fetch('https://api.github.com/users/joelmohh/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repos = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify({ data: repos, timestamp: Date.now() }));
        renderRepos(repos, grid);
    } catch (error) {
        grid.innerHTML = '<p class="loading">Failed to load repositories.</p>';
        console.error(error);
    }
}

getRepos();

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

if (contactForm && formNote) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        formNote.textContent = 'This form is front-end only for now — no message was sent. Reach me through one of the channels on the right instead. 👉';
        formNote.classList.add('is-visible');
        contactForm.reset();
    });
}

const themeToggleBtn = document.querySelector('.theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggleBtn.innerHTML = theme === 'dark'
        ? '<img src="/img/moon.svg" alt="">'
        : '<img src="/img/sun.svg" alt="">';
}

const savedTheme = localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
});