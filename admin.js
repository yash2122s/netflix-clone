const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get movies from localStorage or use default array
let movies = JSON.parse(localStorage.getItem('movies')) || [
    {
        id: 1,
        title: "Movie 1",
        image: "cards/card1.jpg"
    },
    // ... other movies
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    initializeDashboard();
    
    // Set up navigation
    setupNavigation();
    
    // Load initial data
    loadMovies();
    loadUsers();
    updateStats();
    
    // Add movie button functionality
    const addMovieBtn = document.querySelector('.add-movie-btn');
    addMovieBtn.addEventListener('click', showAddMovieModal);

    // Update total movies count
    updateMoviesCount();
});

function initializeDashboard() {
    // Set up page navigation
    const navItems = document.querySelectorAll('.nav-items li[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding page
            const pageId = item.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Set up search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', handleSearch);
    
    // Set up filters
    const filters = document.querySelectorAll('.filters select');
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageId}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        document.getElementById('page-title').textContent = 
            pageId.charAt(0).toUpperCase() + pageId.slice(1);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const currentPage = document.querySelector('.page-content.active');
    
    if (currentPage.id === 'movies-page') {
        filterMovies(searchTerm);
    } else if (currentPage.id === 'users-page') {
        filterUsers(searchTerm);
    }
}

function filterMovies(searchTerm) {
    const movieCards = document.querySelectorAll('.movie-grid .admin-movie-card');
    movieCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function filterUsers(searchTerm) {
    const userRows = document.querySelectorAll('.users-table tbody tr');
    userRows.forEach(row => {
        const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        row.style.display = 
            name.includes(searchTerm) || email.includes(searchTerm) ? '' : 'none';
    });
}

function loadUsers() {
    const tbody = document.querySelector('.users-table tbody');
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'active' },
        // Add more sample users
    ];
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="user-status status-${user.status}">${user.status}</span></td>
            <td>
                <button onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load movies from backend
async function loadMovies() {
    try {
        const response = await fetch(`${API_URL}/movies`, {
            headers: {
                'x-auth-token': getToken()
            }
        });
        
        if (!response.ok) throw new Error('Failed to load movies');
        
        const movies = await response.json();
        displayMovies(movies);
        updateMoviesCount(movies.length);
    } catch (error) {
        console.error('Error loading movies:', error);
        alert('Failed to load movies');
    }
}

// Display movies in the grid
function displayMovies(movies) {
    const movieGrid = document.querySelector('.movie-grid');
    movieGrid.innerHTML = movies.map(movie => `
        <div class="admin-movie-card">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="admin-movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.category} | ${movie.year}</p>
                <div class="admin-movie-actions">
                    <button onclick="editMovie('${movie._id}')" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteMovie('${movie._id}')" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add new movie
async function addMovie(formData) {
    try {
        const response = await fetch(`${API_URL}/movies`, {
            method: 'POST',
            headers: {
                'x-auth-token': getToken()
            },
            body: formData // FormData for file upload
        });
        
        if (!response.ok) throw new Error('Failed to add movie');
        
        const movie = await response.json();
        loadMovies(); // Reload movies list
        return movie;
    } catch (error) {
        console.error('Error adding movie:', error);
        throw error;
    }
}

// Delete movie
async function deleteMovie(movieId) {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    
    try {
        const response = await fetch(`${API_URL}/movies/${movieId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': getToken()
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete movie');
        
        loadMovies(); // Reload movies list
    } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete movie');
    }
}

function showAddMovieModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add New Movie</h2>
            <form id="addMovieForm">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" required>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" required>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="year">Year</label>
                    <input type="number" id="year" required>
                </div>
                <div class="form-group">
                    <label for="image">Movie Poster</label>
                    <input type="file" id="image" accept="image/*" required>
                </div>
                <div class="form-group">
                    <label for="video">Movie File</label>
                    <input type="file" id="video" accept="video/*" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">Add Movie</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Form submission handler
    const form = modal.querySelector('#addMovieForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', form.title.value);
        formData.append('category', form.category.value);
        formData.append('year', form.year.value);
        formData.append('image', form.image.files[0]);
        formData.append('video', form.video.files[0]);

        try {
            await addMovie(formData);
            document.body.removeChild(modal);
        } catch (error) {
            alert('Failed to add movie');
        }
    });

    // Cancel button handler
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function editMovie(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Edit Movie</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form class="modal-form" id="editMovieForm">
                <div class="form-input">
                    <label for="movieTitle">Movie Title</label>
                    <input type="text" id="movieTitle" value="${movie.title}" required>
                </div>
                <div class="form-input">
                    <label for="movieImage">Image Path</label>
                    <input type="text" id="movieImage" value="${movie.image}" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('#editMovieForm');

    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateMovie(movieId, form);
        document.body.removeChild(modal);
    });
}

function updateMovie(movieId, form) {
    const title = form.querySelector('#movieTitle').value;
    const image = form.querySelector('#movieImage').value;

    const index = movies.findIndex(m => m.id === movieId);
    if (index !== -1) {
        movies[index] = { ...movies[index], title, image };
        saveMovies();
        loadMovies();
    }
}

function saveMovies() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function updateMoviesCount() {
    const totalMoviesElement = document.querySelector('.stat-card p');
    if (totalMoviesElement) {
        totalMoviesElement.textContent = movies.length;
    }
}

function updateStats() {
    // Update total movies count
    const totalMovies = movies.length;
    document.getElementById('total-movies').textContent = totalMovies;
    
    // Add more stat updates here
}

// Add more admin functionality as needed 