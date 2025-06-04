document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');
    const rememberCheckbox = document.getElementById('remember');

    // 1. Verificar si hay sesión guardada al cargar la página
    checkSavedSession();

    // En el event listener del registro (simplificar):
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const repeatPassword = document.getElementById('repeat-password').value;

        if (password !== repeatPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        registerUser(email, password);
        // Eliminamos el alert y el reset porque ahora redirige
    });
    // 3. Manejar el inicio de sesión
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = rememberCheckbox.checked;

        // Verificar credenciales
        if (authenticateUser(email, password)) {
            // Guardar sesión si marcó "Recuérdame"
            if (rememberMe) {
                saveSession(email, true); // true para recordar permanentemente
            } else {
                // Solo guardar para esta sesión (sessionStorage)
                saveSession(email, false); // false para recordar solo por la sesión
            }

            // Redirigir a la página principal
            window.location.href = '../index.html';
        } else {
            alert('Email o contraseña incorrectos');
        }
    });

    // En la función registerUser (cambiar el final):
    function registerUser(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.email === email)) {
            alert('Este email ya está registrado');
            return false;
        }

        const newUser = {
            email: email,
            password: password,
            name: email.split('@')[0] // Creamos un nombre a partir del email
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Guardar sesión inmediatamente después de registrar
        saveSession(email, true); // Por defecto, se recuerda después del registro

        // Redirigir a index.html
        window.location.href = '../index.html';
        return true;
    }

    // Función para autenticar usuarios
    function authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email && user.password === password);
    }

    function saveSession(email, rememberMe) {
        sessionStorage.setItem('currentUser', email);
        if (rememberMe) {
            localStorage.setItem('rememberedUser', email);
        } else {
            localStorage.removeItem('rememberedUser'); // Asegurarse de que no haya un usuario recordado si no se marcó
        }
    }

    // Función para verificar sesión guardada
    function checkSavedSession() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        const currentUser = sessionStorage.getItem('currentUser');

        // Si hay usuario recordado o sesión activa, redirigir (opcional, si quieres que no se quede en el login)
        if (rememberedUser || currentUser) {
            // Esto redirige si ya hay una sesión. Puedes descomentar si quieres que el usuario no pueda acceder a login.html si ya está logueado.
            // window.location.href = '../index.html';
            
            // Si hay un usuario recordado, precargar el email y marcar la casilla
            if (rememberedUser) {
                document.getElementById('login-email').value = rememberedUser;
                rememberCheckbox.checked = true;
            }
        }
    }

    // Sistema de tabs (ya existente en tu HTML)
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.form-content').forEach(form => form.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
});