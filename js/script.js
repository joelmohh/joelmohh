const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.querySelector('.nav-container');

menuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
});

document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', () => {
        navContainer.classList.remove('active');
    });
});

async function getRepos() {
    const grid = document.querySelector('#repo-grid');

    try {
        const response = await fetch(`https://api.github.com/users/joelmohh/repos?sort=updated&per_page=6`);
        const repos = await response.json();

        grid.innerHTML = ''; 
        repos.forEach(repo => {
            if(repo.fork) return;

            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <div class="project-content">
                    <p class="project-type">${repo.language || 'Code'}</p>
                    <h3>${repo.name}</h3>
                    <p class="project-desc">${repo.description || 'Sem descrição no repositório.'}</p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"></path></svg>
                        </a>
                        ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>` : ''}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = '<p>Fail to load repositories.</p>';
        console.error(error);
    }
}

getRepos();



// theme-toggle button

const themeToggleBtn = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
        themeToggleBtn.innerHTML = '<img src="/img/moon.svg" alt="">';
    } else {
        themeToggleBtn.innerHTML = '<img src="/img/sun.svg" alt="">';
    }
}

themeToggleBtn.addEventListener('click', function() {
    let theme = document.documentElement.getAttribute("data-theme");
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggleBtn.innerHTML = '<img src="/img/moon.svg" alt="">';
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeToggleBtn.innerHTML = '<img src="/img/sun.svg" alt="">';
    }
});