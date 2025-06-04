// Fuera del DOMContentLoaded:
function updateUserStatus() {
    const userEmail = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberedUser');
    const loginLink = document.getElementById('login-link');
    const userProfile = document.getElementById('user-profile');
    const usernameDisplay = document.getElementById('username-display');

    if (userEmail) {
        const userName = userEmail.split('@')[0];
        if (loginLink) loginLink.style.display = 'none';
        if (usernameDisplay) usernameDisplay.textContent = userName;
        if (userProfile) userProfile.style.display = 'flex'; // Usar flex para alinear items
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('rememberedUser');
            updateUserStatus();
            window.location.reload(); // Recargar para limpiar completamente
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // *** Importante: Llamar a updateUserStatus y setupLogout aquí ***
    updateUserStatus();
    setupLogout();

    // Función para el modal de producto (anteriormente 'verProducto', ahora 'abrirModal' para consistencia)
    // Se elimina la función duplicada aquí, se mantiene solo la del script del index.html
    // La lógica de 'verProducto' que estaba aquí debe estar integrada en la función 'abrirModal' del index.html
    // para evitar duplicidad y mantener un solo punto de control para el modal.
    // Si la función 'verProducto' tenía una lógica diferente, por favor acláralo.
    // Por ahora, asumiré que la lógica del modal se gestiona en el script del index.html.

    // Carrusel automático
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 5000;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });

        indicators.forEach(indicator => indicator.classList.remove('active'));

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        slides[currentIndex].style.opacity = '1';
        indicators[currentIndex].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startCarousel() {
        stopCarousel();
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopCarousel() {
        clearInterval(slideInterval);
    }

    nextBtn?.addEventListener('click', () => {
        stopCarousel();
        nextSlide();
        startCarousel();
    });

    prevBtn?.addEventListener('click', () => {
        stopCarousel();
        prevSlide();
        startCarousel();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopCarousel();
            showSlide(index);
            startCarousel();
        });
    });

    carousel?.addEventListener('mouseenter', stopCarousel);
    carousel?.addEventListener('mouseleave', startCarousel);

    showSlide(0);
    startCarousel();


    // Verificar login para páginas protegidas
    const protectedPages = ['carrito.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        const userEmail = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberedUser');
        if (!userEmail) {
            window.location.href = 'Login.html';
        }
    }

    // Pausar carrusel al cambiar de pestaña
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCarousel();
        } else {
            startCarousel();
        }
    });
});