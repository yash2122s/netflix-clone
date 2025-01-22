const API_URL = 'https://netflix-clone-yash.onrender.com/api'; // Update to your Render URL

// Temporary user data for frontend testing
const TEST_USERS = [
    { email: 'admin@netflix.com', password: 'admin123', role: 'admin' },
    { email: 'user@netflix.com', password: 'user123', role: 'user' }
];

// Check if user is already logged in when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check current page and authentication
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Don't check auth on login page
    if (currentPage !== 'login.html') {
        checkAuth();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Find user
    const user = TEST_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user info in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert('Invalid email or password');
    }
}

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add logout handler to profile menu if it exists
    const profileMenu = document.querySelector('.profile');
    if (profileMenu) {
        profileMenu.addEventListener('click', logout);
    }
});

// Add this to check current login state
function getCurrentUser() {
    return {
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userRole: localStorage.getItem('userRole')
    };
} 