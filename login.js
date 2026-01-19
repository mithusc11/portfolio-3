// Firebase Config (Replace with your Firebase project config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully.');
} catch (error) {
    console.error('Firebase initialization error:', error.message);
    alert('Failed to initialize Firebase. Check console for details.');
}
const auth = firebase.auth();

// Check auth state and redirect if logged in
try {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User logged in:', user.email, 'Redirecting to dashboard.html');
            window.location.href = 'dashboard.html';
        } else {
            console.log('No user logged in, staying on login page.');
        }
    });
} catch (error) {
    console.error('Auth state check error:', error.message);
}

// Login Form Submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted.');
        
        const username = document.getElementById('login-username')?.value;
        const password = document.getElementById('login-password')?.value;
        console.log('Login attempt:', { username, password });

        if (!username || !password) {
            alert('Please enter username and password.');
            console.warn('Missing username or password.');
            return;
        }

        if (username !== 'Mithu122') {
            alert('Invalid username. Use: Mithu1122');
            console.warn('Invalid username:', username);
            return;
        }

        const email = 'mithu1122@swadesh.com'; // Replace with your Firebase user email
        try {
            console.log('Attempting Firebase login with:', email);
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful:', userCredential.user.email);
            console.log('Redirecting to dashboard.html');
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert('Login failed: ' + error.message);
            console.error('Login error:', error.code, error.message);
        }
    });
} else {
    console.error('Login form not found. Ensure <form id="login-form"> exists in login.html.');
}

// Password Toggle
function togglePassword() {
    const passwordInput = document.getElementById('login-password');
    const toggleIcon = document.querySelector('.toggle-password');
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.textContent = '🙈';
            console.log('Password shown.');
        } else {
            passwordInput.type = 'password';
            toggleIcon.textContent = '👁️';
            console.log('Password hidden.');
        }
    } else {
        console.warn('Toggle elements missing:', { passwordInput, toggleIcon });
    }
}