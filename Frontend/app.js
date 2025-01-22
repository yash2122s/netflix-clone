const API_URL = 'http://localhost:5000/api';

// Cloudinary configuration
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvtrsojsa/video/list';
const CLOUDINARY_PRESET = 'netflix-clone';

// Sample movie data (until backend is ready)
const SAMPLE_MOVIES = [
    {
        id: 1,
        title: "Stranger Things",
        category: "TV Shows",
        year: "2022",
        image: "https://res.cloudinary.com/dvtrsojsa/image/upload/v1/netflix-clone/posters/stranger-things",
        video: "https://res.cloudinary.com/dvtrsojsa/video/upload/v1/netflix-clone/videos/stranger-things"
    },
    {
        id: 2,
        title: "The Witcher",
        category: "TV Shows",
        year: "2021",
        image: "https://res.cloudinary.com/dvtrsojsa/image/upload/v1/netflix-clone/posters/witcher",
        video: "https://res.cloudinary.com/dvtrsojsa/video/upload/v1/netflix-clone/videos/witcher"
    }
];

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
    const movieGrid = document.querySelector('.cards-container');
    if (!movieGrid) return;

    movieGrid.innerHTML = movies.map(movie => `
        <div class="card" onclick="playMovie('${movie.id}')">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="card-overlay">
                <div class="card-buttons">
                    <button class="card-button play-button">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="card-button">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="card-button">
                        <i class="fas fa-thumbs-up"></i>
                    </button>
                </div>
                <div class="card-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.category} • ${movie.year}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers for play buttons
    document.querySelectorAll('.play-button').forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            playMovie(movies[index].id);
        });
    });
}

function playMovie(movieId) {
    const movie = SAMPLE_MOVIES.find(m => m.id === parseInt(movieId));
    if (!movie) return;

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

    // Close on clicking outside
    videoOverlay.addEventListener('click', (e) => {
        if (e.target === videoOverlay) {
            document.body.removeChild(videoOverlay);
        }
    });

    document.body.appendChild(videoOverlay);
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