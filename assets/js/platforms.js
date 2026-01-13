// Platforms Page - IGDB API Integration

let platformsData = [];
let currentPlatformIndex = 0;
let isLoadingFromAPI = false;

// Fallback mock data (used if API fails)
const fallbackPlatformsData = [
    {
        id: 1,
        name: "PlayStation 5",
        logo: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=150&fit=crop",
        description: "La PlayStation 5 es una consola de videojuegos doméstica desarrollada por Sony Interactive Entertainment.",
        manufacturer: "Sony Interactive Entertainment",
        generation: "Novena generación",
        releaseDate: "12 de noviembre de 2020",
        hardware: {
            "CPU": "AMD Zen 2 8 núcleos",
            "GPU": "AMD RDNA 2",
            "RAM": "16 GB GDDR6"
        },
        versions: ["PS5 Standard", "PS5 Digital Edition"],
        officialLink: "https://www.playstation.com/es-es/ps5/",
        images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop"],
        thumbnail: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=250&h=150&fit=crop",
        topGames: []
    },
    {
        id: 2,
        name: "Xbox Series X",
        logo: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&h=150&fit=crop",
        description: "Xbox Series X es la consola más potente de Microsoft, diseñada para ofrecer juegos en 4K a 60fps.",
        manufacturer: "Microsoft",
        generation: "Novena generación",
        releaseDate: "10 de noviembre de 2020",
        hardware: {
            "CPU": "AMD Zen 2 8 núcleos",
            "GPU": "AMD RDNA 2",
            "RAM": "16 GB GDDR6"
        },
        versions: ["Xbox Series X", "Xbox Series S"],
        officialLink: "https://www.xbox.com/es-ES/consoles/xbox-series-x",
        images: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop"],
        thumbnail: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=250&h=150&fit=crop",
        topGames: []
    },
    {
        id: 3,
        name: "Nintendo Switch",
        logo: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&h=150&fit=crop",
        description: "Nintendo Switch es una consola híbrida que puede ser usada como consola de sobremesa o portátil.",
        manufacturer: "Nintendo",
        generation: "Octava generación",
        releaseDate: "3 de marzo de 2017",
        hardware: {
            "CPU": "NVIDIA Custom Tegra",
            "GPU": "NVIDIA Maxwell",
            "RAM": "4 GB LPDDR4"
        },
        versions: ["Switch Original", "Switch OLED", "Switch Lite"],
        officialLink: "https://www.nintendo.es/Nintendo-Switch/Nintendo-Switch-1148779.html",
        images: ["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop"],
        thumbnail: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=250&h=150&fit=crop",
        topGames: []
    },
    {
        id: 4,
        name: "PC Gaming",
        logo: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&h=150&fit=crop",
        description: "PC Gaming representa la plataforma más versátil y potente para juegos.",
        manufacturer: "Varios fabricantes",
        generation: "Multi-generacional",
        releaseDate: "Desde los años 80",
        hardware: {
            "CPU": "Varía (Intel/AMD)",
            "GPU": "Varía (NVIDIA/AMD)",
            "RAM": "8-64+ GB"
        },
        versions: ["Prearmadas", "Personalizadas", "Portátiles Gaming"],
        officialLink: "https://www.nvidia.com/es-es/geforce/",
        images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop"],
        thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=250&h=150&fit=crop",
        topGames: []
    }
];

// Initialize page on load
document.addEventListener('DOMContentLoaded', async () => {
    showLoadingState();
    await loadPlatformsFromAPI();
    if (platformsData.length > 0) {
        loadPlatformCarousel();
        showPlatform(0);
        setupCarouselNavigation();
    }
});

// Show loading state
function showLoadingState() {
    const carousel = document.getElementById('platform-carousel');
    if (carousel) {
        carousel.innerHTML = '<div style="padding: 40px; text-align: center; color: #aaa; grid-column: 1/-1;"><div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>Cargando plataformas...</div>';
    }
}

// Load platforms from IGDB API
async function loadPlatformsFromAPI() {
    isLoadingFromAPI = true;

    try {
        console.log('🎮 Loading platforms from IGDB API...');
        const apiPlatforms = await IGDB_API.getPlatforms(12);

        if (apiPlatforms && apiPlatforms.length > 0) {
            console.log(`✅ Loaded ${apiPlatforms.length} platforms from API`);

            // Convert API format to our format
            platformsData = apiPlatforms.map(platform => ({
                id: platform.id,
                name: platform.name,
                logo: platform.platform_logo && platform.platform_logo.url
                    ? IGDB_API.formatImageUrl(platform.platform_logo.url, 'logo_med')
                    : 'https://via.placeholder.com/300x150?text=Platform',
                description: platform.summary || 'No description available.',
                manufacturer: platform.category ? getCategoryName(platform.category) : 'N/A',
                generation: platform.generation ? `Generación ${platform.generation}` : 'N/A',
                releaseDate: 'N/A',
                hardware: {
                    "Category": getCategoryName(platform.category || 0)
                },
                versions: platform.versions || [],
                officialLink: platform.websites && platform.websites.length > 0 ? platform.websites[0].url : null,
                images: [platform.platform_logo && platform.platform_logo.url ? IGDB_API.formatImageUrl(platform.platform_logo.url, 'screenshot_big') : 'https://via.placeholder.com/400x300?text=Platform'],
                thumbnail: platform.platform_logo && platform.platform_logo.url
                    ? IGDB_API.formatImageUrl(platform.platform_logo.url, 'thumb')
                    : 'https://via.placeholder.com/250x150?text=Platform',
                topGames: [] // Will be loaded on demand
            }));
        } else {
            console.warn('⚠️ No platforms from API, using fallback data');
            platformsData = fallbackPlatformsData;
        }
    } catch (error) {
        console.error('❌ Error loading platforms from API:', error);
        console.log('Using fallback data...');
        platformsData = fallbackPlatformsData;
    } finally {
        isLoadingFromAPI = false;
    }
}

// Helper: Get platform category name
function getCategoryName(category) {
    const categories = {
        1: 'Console',
        2: 'Arcade',
        3: 'Platform',
        4: 'Operating System',
        5: 'Portable Console',
        6: 'Computer'
    };
    return categories[category] || 'Platform';
}

// Load platform thumbnails in carousel
function loadPlatformCarousel() {
    const carousel = document.getElementById('platform-carousel');
    carousel.innerHTML = '';

    platformsData.forEach((platform, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `platform-thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `
            <div class="platform-thumb-image" style="background-image: url('${platform.thumbnail}')"></div>
            <div class="platform-thumb-name">${platform.name}</div>
        `;
        thumbnail.addEventListener('click', () => showPlatform(index));
        carousel.appendChild(thumbnail);
    });
}

// Show platform details
async function showPlatform(index) {
    const platform = platformsData[index];
    currentPlatformIndex = index;

    // Update active thumbnail
    document.querySelectorAll('.platform-thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    // Update platform logo
    document.getElementById('platform-logo').src = platform.logo;
    document.getElementById('platform-logo').alt = platform.name;

    // Update platform info
    document.getElementById('platform-name').textContent = platform.name;
    document.getElementById('platform-description').textContent = platform.description;
    document.getElementById('platform-manufacturer').textContent = platform.manufacturer;
    document.getElementById('platform-generation').textContent = platform.generation;
    document.getElementById('platform-release').textContent = platform.releaseDate;

    // Update hardware specs
    const specsContainer = document.getElementById('hardware-specs');
    specsContainer.innerHTML = '';
    Object.entries(platform.hardware).forEach(([key, value]) => {
        const specItem = document.createElement('div');
        specItem.className = 'spec-item';
        specItem.innerHTML = `
            <span class="spec-label">${key}:</span>
            <span class="spec-value">${value}</span>
        `;
        specsContainer.appendChild(specItem);
    });

    // Update versions
    if (platform.versions && platform.versions.length > 0) {
        const versionsContainer = document.getElementById('platform-versions');
        versionsContainer.innerHTML = '';
        platform.versions.forEach(version => {
            const versionTag = document.createElement('span');
            versionTag.className = 'version-tag';
            versionTag.textContent = version;
            versionsContainer.appendChild(versionTag);
        });
        document.getElementById('versions-section').style.display = 'block';
    } else {
        document.getElementById('versions-section').style.display = 'none';
    }

    // Update official link
    if (platform.officialLink) {
        document.getElementById('official-link').href = platform.officialLink;
        document.getElementById('official-link-section').style.display = 'block';
    } else {
        document.getElementById('official-link-section').style.display = 'none';
    }

    // Update platform images
    const imagesContainer = document.getElementById('platform-images');
    imagesContainer.innerHTML = '';
    platform.images.slice(0, 4).forEach(imageUrl => {
        const imageItem = document.createElement('div');
        imageItem.className = 'platform-image-item';
        imageItem.innerHTML = `<img src="${imageUrl}" alt="${platform.name}">`;
        imagesContainer.appendChild(imageItem);
    });

    // Load top games from API if not cached
    if ((!platform.topGames || platform.topGames.length === 0) && isLoadingFromAPI) {
        const gamesGrid = document.getElementById('top-games-grid');
        gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #aaa;">Cargando juegos...</div>';

        try {
            const platformGames = await IGDB_API.getGamesByPlatform(platform.id, 20);
            if (platformGames && platformGames.length > 0) {
                platform.topGames = platformGames.map(game => ({
                    name: game.name,
                    image: game.cover ? IGDB_API.formatImageUrl(game.cover.url, 'cover_big') : 'https://via.placeholder.com/200x250?text=Game'
                }));
            }
        } catch (error) {
            console.error('Error loading platform games:', error);
        }
    }

    // Update top games
    loadTopGames(platform.topGames || []);
}

// Load top 20 games
function loadTopGames(games) {
    const gamesGrid = document.getElementById('top-games-grid');
    gamesGrid.innerHTML = '';

    if (!games || games.length === 0) {
        gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #aaa;">No hay juegos disponibles para esta plataforma</div>';
        return;
    }

    // Display up to 20 games (we'll repeat if less)
    const gamesToShow = [];
    while (gamesToShow.length < 20 && games.length > 0) {
        gamesToShow.push(...games.slice(0, Math.min(20 - gamesToShow.length, games.length)));
    }

    gamesToShow.slice(0, 20).forEach((game, index) => {
        const gameCard = document.createElement('div');
        gameCard.className = 'top-game-card';
        gameCard.innerHTML = `
            <div class="top-game-image" style="background-image: url('${game.image}')"></div>
            <div class="top-game-title">${game.name}</div>
        `;
        gameCard.addEventListener('click', () => {
            window.location.href = '../games/index.html';
        });
        gamesGrid.appendChild(gameCard);
    });
}

// Setup carousel navigation buttons
function setupCarouselNavigation() {
    const carousel = document.getElementById('platform-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -270, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 270, behavior: 'smooth' });
    });
}
