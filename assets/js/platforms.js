// Platforms Page - PlayStation Style with Sample Data

// Sample platforms data
const platformsData = [
    {
        id: 1,
        name: "PlayStation 5",
        logo: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=150&fit=crop",
        description: "La PlayStation 5 es una consola de videojuegos doméstica desarrollada por Sony Interactive Entertainment. Lanzada en 2020, representa la novena generación de consolas y sucesora de la PlayStation 4.",
        manufacturer: "Sony Interactive Entertainment",
        generation: "Novena generación",
        releaseDate: "12 de noviembre de 2020",
        hardware: {
            "CPU": "AMD Zen 2 8 núcleos @ 3.5GHz",
            "GPU": "AMD RDNA 2, 10.28 TFLOPs",
            "RAM": "16 GB GDDR6",
            "Almacenamiento": "825 GB SSD",
            "Resolución": "Hasta 8K",
            "Framerate": "Hasta 120 fps"
        },
        versions: ["PS5 Standard", "PS5 Digital Edition"],
        officialLink: "https://www.playstation.com/es-es/ps5/",
        images: [
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop"
        ],
        thumbnail: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=250&h=150&fit=crop",
        topGames: [
            { name: "Spider-Man: Miles Morales", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=250&fit=crop" },
            { name: "Demon's Souls", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=250&fit=crop" },
            { name: "Ratchet & Clank", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=250&fit=crop" },
            { name: "Returnal", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=250&fit=crop" },
            { name: "Horizon Forbidden West", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=250&fit=crop" }
        ]
    },
    {
        id: 2,
        name: "Xbox Series X",
        logo: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&h=150&fit=crop",
        description: "Xbox Series X es la consola más potente de Microsoft, diseñada para ofrecer juegos en 4K a 60fps con soporte para 120fps. Parte de la familia Xbox Series junto con Series S.",
        manufacturer: "Microsoft",
        generation: "Novena generación",
        releaseDate: "10 de noviembre de 2020",
        hardware: {
            "CPU": "AMD Zen 2 8 núcleos @ 3.8GHz",
            "GPU": "AMD RDNA 2, 12 TFLOPs",
            "RAM": "16 GB GDDR6",
            "Almacenamiento": "1 TB SSD NVMe",
            "Resolución": "Hasta 8K",
            "Framerate": "Hasta 120 fps"
        },
        versions: ["Xbox Series X", "Xbox Series S"],
        officialLink: "https://www.xbox.com/es-ES/consoles/xbox-series-x",
        images: [
            "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop"
        ],
        thumbnail: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=250&h=150&fit=crop",
        topGames: [
            { name: "Halo Infinite", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=250&fit=crop" },
            { name: "Forza Horizon 5", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=250&fit=crop" },
            { name: "Gears 5", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=250&fit=crop" },
            { name: "Flight Simulator", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=250&fit=crop" },
            { name: "Sea of Thieves", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=250&fit=crop" }
        ]
    },
    {
        id: 3,
        name: "Nintendo Switch",
        logo: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&h=150&fit=crop",
        description: "Nintendo Switch es una consola híbrida que puede ser usada como consola de sobremesa o portátil. Lanzada en 2017, ofrece una experiencia única de juego.",
        manufacturer: "Nintendo",
        generation: "Octava generación",
        releaseDate: "3 de marzo de 2017",
        hardware: {
            "CPU": "NVIDIA Custom Tegra",
            "GPU": "NVIDIA Maxwell, 393 GFLOPs",
            "RAM": "4 GB LPDDR4",
            "Almacenamiento": "32/64 GB (expandible)",
            "Resolución": "1080p (TV), 720p (portátil)",
            "Pantalla": "6.2\" táctil capacitiva"
        },
        versions: ["Switch Original", "Switch OLED", "Switch Lite"],
        officialLink: "https://www.nintendo.es/Nintendo-Switch/Nintendo-Switch-1148779.html",
        images: [
            "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop"
        ],
        thumbnail: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=250&h=150&fit=crop",
        topGames: [
            { name: "Zelda: Breath of the Wild", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=250&fit=crop" },
            { name: "Super Mario Odyssey", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=250&fit=crop" },
            { name: "Animal Crossing", image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=250&fit=crop" },
            { name: "Mario Kart 8 Deluxe", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=250&fit=crop" },
            { name: "Splatoon 3", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=250&fit=crop" }
        ]
    },
    {
        id: 4,
        name: "PC Gaming",
        logo: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&h=150&fit=crop",
        description: "PC Gaming representa la plataforma más versátil y potente para juegos, ofreciendo gráficos superiores, personalización completa y una biblioteca de juegos incomparable.",
        manufacturer: "Varios fabricantes",
        generation: "Multi-generacional",
        releaseDate: "Desde los años 80",
        hardware: {
            "CPU": "Varía (Intel/AMD)",
            "GPU": "Varía (NVIDIA/AMD)",
            "RAM": "8-64+ GB",
            "Almacenamiento": "HDD/SSD personalizable",
            "Resolución": "Hasta 8K+",
            "Framerate": "Sin límite (depende del hardware)"
        },
        versions: ["Prearmadas", "Personalizadas", "Portátiles Gaming"],
        officialLink: "https://www.nvidia.com/es-es/geforce/",
        images: [
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1587202372634-32a8e7e41a4e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop"
        ],
        thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=250&h=150&fit=crop",
        topGames: [
            { name: "Counter-Strike 2", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=250&fit=crop" },
            { name: "League of Legends", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=250&fit=crop" },
            { name: "Valorant", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=250&fit=crop" },
            { name: "Baldur's Gate 3", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=250&fit=crop" },
            { name: "Cyberpunk 2077", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=250&fit=crop" }
        ]
    }
];

let currentPlatformIndex = 0;

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    loadPlatformCarousel();
    showPlatform(0);
    setupCarouselNavigation();
});

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
function showPlatform(index) {
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

    // Update top games
    loadTopGames(platform.topGames);
}

// Load top 20 games
function loadTopGames(games) {
    const gamesGrid = document.getElementById('top-games-grid');
    gamesGrid.innerHTML = '';

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
