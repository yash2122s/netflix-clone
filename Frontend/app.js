const API_URL = 'http://localhost:5000/api';

async function loadMovies() {
    try {
        const response = await fetch(`${API_URL}/movies`);
        if (!response.ok) throw new Error('Failed to load movies');
        
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.querySelector('.movie-grid');
    movieGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="playMovie('${movie._id}')">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.category} | ${movie.year}</p>
            </div>
        </div>
    `).join('');
}

async function playMovie(movieId) {
    try {
        const response = await fetch(`${API_URL}/movies/${movieId}`);
        if (!response.ok) throw new Error('Failed to load movie');
        
        const movie = await response.json();
        
        const videoOverlay = document.createElement('div');
        videoOverlay.className = 'video-overlay';
        videoOverlay.innerHTML = `
            <div class="video-player">
                <div class="video-header">
                    <h2>${movie.title}</h2>
                    <button class="close-button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <video controls autoplay>
                    <source src="${movie.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;

        // Add close functionality
        const closeButton = videoOverlay.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(videoOverlay);
        });

        document.body.appendChild(videoOverlay);
    } catch (error) {
        console.error('Error playing movie:', error);
        alert('Failed to play movie');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Check if user is authenticated
    loadMovies(); // Load movies from backend
});

// Navigation scroll effect
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    // Initialize content rows
    initializeContentRows();
});

// Add logout handler to the profile menu
const profileMenu = document.querySelector('.profile');
if (profileMenu) {
    profileMenu.addEventListener('click', logout);
}

function initializeContentRows() {
    const cardsContainer = document.querySelector('.cards-container');
    
    // Create and append movie cards
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        cardsContainer.appendChild(card);
    });

    // Add horizontal scroll with mouse wheel
    cardsContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent vertical scrolling
        cardsContainer.scrollLeft += e.deltaY; // Use deltaY for horizontal scroll
    });

    // Add scroll functionality to row buttons
    const rowLeft = document.querySelector('.row-left');
    const rowRight = document.querySelector('.row-right');
    rowLeft.addEventListener('click', () => {
        cardsContainer.scrollBy({
            left: -cardsContainer.offsetWidth,
            behavior: 'smooth'
        });
    });
    rowRight.addEventListener('click', () => {
        cardsContainer.scrollBy({
            left: cardsContainer.offsetWidth,
            behavior: 'smooth'
        });
    });
}
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
        <div class="card-overlay">
            <div class="card-buttons">
                <button class="card-button play-button" style="background-color: white;">
                    <i class="fas fa-play" style="color: black;"></i>
                </button>
                <button class="card-button" style="background-color: transparent; border: 2px solid #808080;">
                    <i class="fas fa-plus" style="color: white;"></i>
                </button>
                <button class="card-button" style="background-color: transparent; border: 2px solid #808080;">
                    <i class="fas fa-thumbs-up" style="color: white;"></i>
                </button>
            </div>
            <div class="card-title">${movie.title}</div>
        </div>
    `;

    // Add click handlers
    const playButton = card.querySelector('.play-button');
    playButton.addEventListener('click', () => openVideoPlayer(movie));
    
    // Make the entire card clickable
    card.addEventListener('click', () => openVideoPlayer(movie));
    
    return card;
}
function openVideoPlayer(movie) {
    // Create video player overlay
    const videoOverlay = document.createElement('div');
    videoOverlay.className = 'video-overlay';
    videoOverlay.innerHTML = `
        <div class="video-player">
            <div class="video-header">
                <h2>${movie.title}</h2>
                <button class="close-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <video controls autoplay>
                <source src="videos/${movie.id}.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    // Add close functionality
    const closeButton = videoOverlay.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(videoOverlay);
    });

    // Close on clicking outside the video player
    videoOverlay.addEventListener('click', (e) => {
        if (e.target === videoOverlay) {
            document.body.removeChild(videoOverlay);
        }
    });

    document.body.appendChild(videoOverlay);
}