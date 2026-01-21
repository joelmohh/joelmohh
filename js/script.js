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