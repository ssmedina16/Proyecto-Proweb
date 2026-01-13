// Event Detail Page - IGDB API Integration

let countdownInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        document.querySelector('.event-detail-main').innerHTML = '<div style="text-align: center; padding: 60px;"><h1>No se especificó un evento</h1><p><a href="index.html">Volver a eventos</a></p></div>';
        return;
    }

    // Show loading state
    showLoading();

    try {
        const event = await IGDB_API.getEventDetails(eventId);

        if (!event) {
            document.querySelector('.event-detail-main').innerHTML = '<div style="text-align: center; padding: 60px;"><h1>Evento no encontrado</h1><p><a href="index.html">Volver a eventos</a></p></div>';
            return;
        }

        populateEventDetails(event);
    } catch (error) {
        console.error('Error loading event details:', error);
        document.querySelector('.event-detail-main').innerHTML = '<div style="text-align: center; padding: 60px;"><h1>Error al cargar el evento</h1><p><a href="index.html">Volver a eventos</a></p></div>';
    }
});

function showLoading() {
    const main = document.querySelector('.event-detail-main');
    if (main) {
        main.style.opacity = '0.5';
    }
}

function populateEventDetails(event) {
    const main = document.querySelector('.event-detail-main');
    if (main) main.style.opacity = '1';

    // Event name/title
    document.title = `${event.name} - Detalle del Evento`;
    setText('event-name', event.name);

    // Event logo
    const logoContainer = document.getElementById('event-logo-container');
    if (logoContainer) {
        if (event.event_logo && event.event_logo.url) {
            logoContainer.innerHTML = `<img src="${IGDB_API.formatImageUrl(event.event_logo.url, 'logo_med')}" alt="${event.name}" class="event-logo">`;
        } else {
            logoContainer.innerHTML = '<div class="event-logo-placeholder">📅</div>';
        }
    }

    // Dates
    if (event.start_time) {
        const startDate = new Date(event.start_time * 1000);
        setText('event-start-date', formatDate(startDate));

        // Check if event hasn't started yet
        checkAndSetupCountdown(event.start_time);
    } else {
        setText('event-start-date', 'No disponible');
    }

    if (event.end_time) {
        const endDate = new Date(event.end_time * 1000);
        setText('event-end-date', formatDate(endDate));
    } else {
        setText('event-end-date', 'No disponible');
    }

    // Description
    setText('event-description', event.description || 'No hay descripción disponible para este evento.');

    // Videos
    populateVideos(event.videos);

    // Links/Networks
    populateLinks(event.event_networks);

    // Associated Games
    populateGames(event.games);
}

// Helper: Set text content
function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text || '';
    }
}

// Helper: Format date
function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Countdown timer for upcoming events
function checkAndSetupCountdown(startTimestamp) {
    const section = document.getElementById('countdown-section');
    const countdownElement = document.getElementById('event-countdown');

    if (!startTimestamp || !section || !countdownElement) {
        if (section) section.style.display = 'none';
        return;
    }

    const startDate = new Date(startTimestamp * 1000);
    const now = new Date();

    if (startDate > now) {
        // Event hasn't started - show countdown
        section.style.display = 'block';
        startCountdown(startTimestamp, countdownElement);
    } else {
        section.style.display = 'none';
        stopCountdown();
    }
}

function startCountdown(startTimestamp, countdownElement) {
    // Clear any existing countdown
    stopCountdown();

    function updateCountdown() {
        const now = new Date().getTime();
        const startTime = startTimestamp * 1000;
        const distance = startTime - now;

        if (distance < 0) {
            countdownElement.innerHTML = '¡El evento ha comenzado!';
            stopCountdown();
            // Optionally hide the countdown section
            const section = document.getElementById('countdown-section');
            if (section) section.style.display = 'none';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">${days}</span>
                <span class="countdown-label">días</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${hours}</span>
                <span class="countdown-label">hrs</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${minutes}</span>
                <span class="countdown-label">min</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number">${seconds}</span>
                <span class="countdown-label">seg</span>
            </div>
        `;
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Populate videos
function populateVideos(videos) {
    const container = document.getElementById('event-videos');
    const section = document.getElementById('videos-section');

    if (!videos || videos.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        section.style.display = 'block';
        container.innerHTML = '';

        videos.slice(0, 3).forEach(video => {
            const videoFrame = document.createElement('div');
            videoFrame.className = 'video-frame';
            videoFrame.innerHTML = `
                <iframe 
                    width="100%" 
                    height="250" 
                    src="https://www.youtube.com/embed/${video.video_id}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                ${video.name ? `<p class="video-title">${video.name}</p>` : ''}
            `;
            container.appendChild(videoFrame);
        });
    }
}

// Populate links/networks
function populateLinks(networks) {
    const container = document.getElementById('event-links');
    const section = document.getElementById('links-section');

    if (!networks || networks.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        section.style.display = 'block';
        container.innerHTML = '';

        networks.forEach((network, index) => {
            const link = document.createElement('a');
            link.href = network.url;
            link.target = '_blank';
            link.className = 'event-link';
            link.textContent = network.network && network.network.name ? network.network.name : `Enlace ${index + 1}`;
            container.appendChild(link);
        });
    }
}

// Populate associated games
function populateGames(games) {
    const container = document.getElementById('event-games');
    const section = document.getElementById('games-section');

    if (!games || games.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (container && section) {
        section.style.display = 'block';
        container.innerHTML = '';

        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'event-game-card';

            const coverUrl = game.cover && game.cover.url
                ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small')
                : 'https://via.placeholder.com/90x120?text=No+Image';

            card.innerHTML = `
                <img src="${coverUrl}" alt="${game.name}" class="game-cover">
                <div class="game-name">${game.name}</div>
                ${game.rating ? `<div class="game-rating">⭐ ${Math.round(game.rating)}</div>` : ''}
            `;

            container.appendChild(card);
        });
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopCountdown();
});
