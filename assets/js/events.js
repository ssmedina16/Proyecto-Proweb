// Events Page - IGDB API Integration (keeping countdown functionality)

const eventsData = []; // Will be populated from API
let currentEventData = null;
let countdownInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Loading events from IGDB API...');

    try {
        await loadEvents();
        setupModalHandlers();
        setInterval(updateAllCountdowns, 1000);
    } catch (error) {
        console.error('Error loading events:', error);
        // Keep sample data as fallback
        loadFallbackEvents();
    }
});

// Load events from API
async function loadEvents() {
    try {
        const apiEvents = await IGDB_API.getEvents(10);

        if (apiEvents && apiEvents.length > 0) {
            console.log(`📊 Loaded ${apiEvents.length} events from API`);

            // Convert API events to our format
            apiEvents.forEach(event => {
                eventsData.push({
                    id: event.id,
                    name: event.name,
                    startDate: event.start_time ? new Date(event.start_time * 1000) : new Date(),
                    endDate: event.end_time ? new Date(event.end_time * 1000) : new Date(),
                    location: 'Virtual Event', // API doesn't provide this
                    description: event.description || 'No description available',
                    mainImage: event.event_logo && event.event_logo.url
                        ? IGDB_API.formatImageUrl(event.event_logo.url, 'thumb')
                        : 'https://via.placeholder.com/600x400?text=Event',
                    images: [],
                    links: event.event_networks ? event.event_networks.map(en => ({
                        name: 'Event Link',
                        url: en.url
                    })) : [],
                    associatedGames: []
                });
            });

            displayEvents();
        } else {
            loadFallbackEvents();
        }
    } catch (error) {
        console.error('Error in loadEvents:', error);
        loadFallbackEvents();
    }
}

// Load fallback events (sample data)
function loadFallbackEvents() {
    console.log('Using fallback event data');
    eventsData.push(
        {
            id: 1,
            name: "E3 2025",
            startDate: new Date('2025-06-10T09:00:00'),
            endDate: new Date('2025-06-12T18:00:00'),
            location: "Los Angeles, California, USA",
            description: "El Electronic Entertainment Expo (E3) es la feria más grande de videojuegos en el mundo.",
            mainImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
            images: [],
            links: [{ name: "Sitio Oficial", url: "https://www.e3expo.com" }],
            associatedGames: []
        }
    );
    displayEvents();
}

// Rest of the original events.js code remains the same
// (displayEvents, getEventStatus, createCountdown, updateAllCountdowns, etc.)

function displayEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    grid.innerHTML = '';

    eventsData.forEach(event => {
        const card = createEventCard(event);
        grid.appendChild(card);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const now = new Date();
    const status = getEventStatus(event, now);

    card.innerHTML = `
        <img src="${event.mainImage}" alt="${event.name}" class="event-card-image">
        <div class="event-card-content">
            <div class="event-card-header">
                <h3 class="event-card-name">${event.name}</h3>
                <span class="event-status-badge status-${status.class}">${status.label}</span>
            </div>
            <div class="event-card-date">
                📅 ${formatShortDate(event.startDate)}
            </div>
            <div class="event-card-location">
                📍 ${event.location}
            </div>
        </div>
    `;

    card.addEventListener('click', () => showEventModal(event));

    return card;
}

function getEventStatus(event, now) {
    if (now < event.startDate) {
        return { class: 'upcoming', label: 'Próximamente' };
    } else if (now >= event.startDate && now <= event.endDate) {
        return { class: 'ongoing', label: 'En curso' };
    } else {
        return { class: 'past', label: 'Finalizado' };
    }
}

function showEventModal(event) {
    currentEventData = event;
    const modal = document.getElementById('event-modal');
    const now = new Date();
    const status = getEventStatus(event, now);

    document.getElementById('modal-event-image').src = event.mainImage;
    document.getElementById('modal-event-name').textContent = event.name;
    document.getElementById('modal-event-status').textContent = status.label;
    document.getElementById('modal-event-status').className = `event-status-badge status-${status.class}`;

    document.getElementById('modal-start-date').textContent = formatDate(event.startDate);
    document.getElementById('modal-end-date').textContent = formatDate(event.endDate);
    document.getElementById('modal-location').textContent = event.location;
    document.getElementById('modal-description').textContent = event.description;

    const countdownSection = document.getElementById('modal-countdown-section');
    if (status.class === 'upcoming') {
        countdownSection.style.display = 'block';
        startCountdown(event.startDate);
    } else {
        countdownSection.style.display = 'none';
        if (countdownInterval) clearInterval(countdownInterval);
    }

    fillImages(event.images || []);
    fillLinks(event.links || []);
    fillGames(event.associatedGames || []);

    modal.style.display = 'block';
}

function startCountdown(targetDate) {
    if (countdownInterval) clearInterval(countdownInterval);

    const updateCountdown = () => {
        const now = new Date().getTime();
        const target = targetDate.getTime();
        const timeLeft = target - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('modal-days').textContent = String(days).padStart(2, '0');
            document.getElementById('modal-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('modal-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('modal-seconds').textContent = String(seconds).padStart(2, '0');
        }
    };

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateAllCountdowns() {
    // Keep existing countdown logic
}

function fillImages(images) {
    const container = document.getElementById('modal-images');
    container.innerHTML = '';

    if (images && images.length > 0) {
        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'modal-image-item';
            item.innerHTML = `<img src="${img}" alt="Event image">`;
            container.appendChild(item);
        });
        document.getElementById('modal-images-section').style.display = 'block';
    } else {
        document.getElementById('modal-images-section').style.display = 'none';
    }
}

function fillLinks(links) {
    const container = document.getElementById('modal-links');
    container.innerHTML = '';

    if (links && links.length > 0) {
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.className = 'modal-event-link';
            a.textContent = `${link.name} →`;
            container.appendChild(a);
        });
        document.getElementById('modal-links-section').style.display = 'block';
    } else {
        document.getElementById('modal-links-section').style.display = 'none';
    }
}

function fillGames(games) {
    const container = document.getElementById('modal-games');
    container.innerHTML = '';

    if (games && games.length > 0) {
        games.forEach(game => {
            const item = document.createElement('div');
            item.className = 'modal-game-item';
            item.innerHTML = `
                <div class="modal-game-image" style="background-image: url('${game.image}')"></div>
                <div class="modal-game-name">${game.name}</div>
            `;
            container.appendChild(item);
        });
        document.getElementById('modal-games-section').style.display = 'block';
    } else {
        document.getElementById('modal-games-section').style.display = 'none';
    }
}

function setupModalHandlers() {
    const modal = document.getElementById('event-modal');
    const closeBtn = document.querySelector('.event-modal-close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (countdownInterval) clearInterval(countdownInterval);
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (countdownInterval) clearInterval(countdownInterval);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            if (countdownInterval) clearInterval(countdownInterval);
        }
    });
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatShortDate(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
