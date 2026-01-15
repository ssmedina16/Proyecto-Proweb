//********************* Pagina de detalle de compania integracion con API de IGDB *********************//

    document.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const companyId = urlParams.get('id');

        if (!companyId) {
            document.querySelector('.company-detail-main').innerHTML = '<h1>Select cione una compania</h1>';
            return;
        }

        showLoading();

        try {
            const company = await IGDB_API.getCompanyDetails(companyId);

            if (!company) {
                document.querySelector('.company-detail-main').innerHTML = '<h1>Compania no encontrada</h1>';
                return;
            }

            populateCompanyDetails(company);
        } catch (error) {
            console.error('Error loading company details:', error);
            document.querySelector('.company-detail-main').innerHTML = '<h1>Error al cargar la compania</h1>';
        }
    });

//********************* Muestra estado de carga *********************//
    function showLoading() {
        const main = document.querySelector('.company-detail-main');
        if (main) {
            main.innerHTML = '<div style="text-align: center; padding: 60px;"><h2>Cargando...</h2></div>';
        }
    }

    //********************* Puebla detalles completos de compania incluyendo juegos estadisticas y enlaces *********************//
        function populateCompanyDetails(company) {
            document.title = `${company.name} - Detalle`;
            setText('company-name', company.name);
            setText('company-description', company.description || 'No description available.');
            setText('company-status', 'Active');
            setText('company-country', company.country ? getCountryName(company.country) : 'N/A');

            const logoContainer = document.querySelector('.company-logo-container');
            if (logoContainer && company.logo && company.logo.url) {
                logoContainer.innerHTML = `<img src="${IGDB_API.formatImageUrl(company.logo.url, 'logo_med')}" alt="${company.name}" class="company-logo" style="max-width: 100%; height: auto;">`;
            } else {
                logoContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">No logo available</div>';
            }

            populateWebsites(company.websites);

            const allGames = [
                ...(company.developed || []),
                ...(company.published || [])
            ];

            const avgRating = calculateAverageRating(allGames);
            setText('company-rating', avgRating);

            const platformStats = generatePlatformStats(allGames);
            const genreStats = generateGenreStats(allGames);
            displayPlatformStats(platformStats);
            displayGenreStats(genreStats);

            const dlcs = extractDLCs(allGames);
            displayDLCs(dlcs);

            const top10 = getTop10Games(allGames);
            displayTopGames(top10);
        }

        //********************* Establece contenido de texto en elemento *********************//
            function setText(elementId, text) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = text || 'N/A';
                }
            }

            //********************* Convierte codigo de pais a nombre de pais *********************//
                function getCountryName(code) {
                    const countries = {
                        1: 'Europe', 2: 'North America', 3: 'Australia', 4: 'New Zealand',
                        5: 'Japan', 6: 'China', 7: 'Asia', 8: 'Worldwide',
                        392: 'Japan', 840: 'United States', 826: 'United Kingdom',
                        276: 'Germany', 250: 'France', 124: 'Canada'
                    };
                    return countries[code] || `Country ${code}`;
                }

                //********************* Puebla enlaces y sitios web de la compania *********************//
                    function populateWebsites(websites) {
                        const container = document.getElementById('company-links');
                        if (!container) return;

                        container.innerHTML = '';

                        if (!websites || websites.length === 0) {
                            container.innerHTML = '<span style="color: #999;">No links available</span>';
                            return;
                        }

                        const categoryNames = {
                            1: 'Official Website',
                            2: 'Wikia',
                            3: 'Wikipedia',
                            4: 'Facebook',
                            5: 'Twitter',
                            6: 'Twitch',
                            8: 'Instagram',
                            9: 'YouTube',
                            13: 'Steam',
                            14: 'Reddit'
                        };

                        websites.forEach(site => {
                            const name = categoryNames[site.category] || 'Website';
                            const link = document.createElement('a');
                            link.href = site.url;
                            link.target = '_blank';
                            link.className = 'company-link';
                            link.textContent = name;
                            container.appendChild(link);
                        });
                    }

                    //********************* Calcula rating promedio de juegos *********************//
                        function calculateAverageRating(games) {
                            const ratedGames = games.filter(g => g.rating && g.rating > 0);

                            if (ratedGames.length === 0) {
                                return 'N/A';
                            }

                            const sum = ratedGames.reduce((total, game) => total + game.rating, 0);
                            const avg = sum / ratedGames.length;
                            return `${Math.round(avg)}/100`;
                        }

                        //********************* Genera estadisticas de plataformas contando juegos por plataforma *********************//
                            function generatePlatformStats(games) {
                                const platformCounts = {};

                                games.forEach(game => {
                                    if (game.platforms && Array.isArray(game.platforms)) {
                                        game.platforms.forEach(platform => {
                                            const name = platform.name || 'Unknown';
                                            platformCounts[name] = (platformCounts[name] || 0) + 1;
                                        });
                                    }
                                });

                                return Object.entries(platformCounts)
                                    .map(([name, count]) => ({ name, count }))
                                    .sort((a, b) => b.count - a.count);
                            }

                            //********************* Genera estadisticas de generos contando juegos por genero *********************//
                                function generateGenreStats(games) {
                                    const genreCounts = {};

                                    games.forEach(game => {
                                        if (game.genres && Array.isArray(game.genres)) {
                                            game.genres.forEach(genre => {
                                                const name = genre.name || 'Unknown';
                                                genreCounts[name] = (genreCounts[name] || 0) + 1;
                                            });
                                        }
                                    });

                                    return Object.entries(genreCounts)
                                        .map(([name, count]) => ({ name, count }))
                                        .sort((a, b) => b.count - a.count);
                                }

                                //********************* Muestra estadisticas de plataformas *********************//
                                    function displayPlatformStats(stats) {
                                        const container = document.getElementById('stats-platform-list');
                                        if (!container) return;

                                        container.innerHTML = '';

                                        if (stats.length === 0) {
                                            container.innerHTML = '<div style="color: #999;">No platform data</div>';
                                            return;
                                        }

                                        stats.forEach(stat => {
                                            const div = document.createElement('div');
                                            div.className = 'stat-item';
                                            div.innerHTML = `<span>${stat.name}</span> <span>${stat.count} juegos</span>`;
                                            container.appendChild(div);
                                        });
                                    }

                                    //********************* Muestra estadisticas de generos *********************//
                                        function displayGenreStats(stats) {
                                            const container = document.getElementById('stats-genre-list');
                                            if (!container) return;

                                            container.innerHTML = '';

                                            if (stats.length === 0) {
                                                container.innerHTML = '<div style="color: #999;">No genre data</div>';
                                                return;
                                            }

                                            stats.forEach(stat => {
                                                const div = document.createElement('div');
                                                div.className = 'stat-item';
                                                div.innerHTML = `<span>${stat.name}</span> <span>${stat.count} juegos</span>`;
                                                container.appendChild(div);
                                            });
                                        }

                                        //********************* Extrae DLCs expansiones y mods de lista de juegos *********************//
                                            function extractDLCs(games) {
                                                const dlcCategories = [8, 9, 10, 13, 14];
                                                return games.filter(g => g.category && dlcCategories.includes(g.category));
                                            }

                                            //********************* Muestra lista de DLCs *********************//
                                                function displayDLCs(dlcs) {
                                                    const container = document.getElementById('dlcs-list');
                                                    const section = document.getElementById('dlcs-section');

                                                    if (!container || !section) return;

                                                    if (dlcs.length === 0) {
                                                        section.style.display = 'none';
                                                        return;
                                                    }

                                                    section.style.display = 'block';
                                                    container.innerHTML = '';

                                                    dlcs.forEach(dlc => {
                                                        const div = document.createElement('div');
                                                        div.className = 'dlc-item';
                                                        div.textContent = dlc.name;
                                                        container.appendChild(div);
                                                    });
                                                }

                                                //********************* Obtiene top 10 juegos por rating *********************//
                                                    function getTop10Games(games) {
                                                        return games
                                                            .filter(g => g.rating && g.rating > 0)
                                                            .sort((a, b) => b.rating - a.rating)
                                                            .slice(0, 10);
                                                    }

                                                    //********************* Muestra top 10 juegos mejor valorados *********************//
                                                        function displayTopGames(games) {
                                                            const container = document.getElementById('top-games-list');
                                                            if (!container) return;

                                                            container.innerHTML = '';

                                                            if (games.length === 0) {
                                                                container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No games available</div>';
                                                                return;
                                                            }

                                                            games.forEach((game, index) => {
                                                                const card = document.createElement('div');
                                                                card.className = 'game-card-small';

                                                                const coverUrl = game.cover && game.cover.url
                                                                    ? IGDB_API.formatImageUrl(game.cover.url, 'cover_small')
                                                                    : 'https://via.placeholder.com/90x120?text=No+Image';

                                                                card.innerHTML = `
            <div style="position: relative;">
                <img src="${coverUrl}" alt="${game.name}" style="width: 100%; border-radius: 8px;">
                <div style="position: absolute; top: 5px; right: 5px; background: rgba(255, 107, 129, 0.95); color: white; padding: 3px 8px; border-radius: 5px; font-weight: bold; font-size: 0.8rem;">
                    #${index + 1}
                </div>
            </div>
            <div class="game-card-title">${game.name}</div>
            <div style="text-align: center; color: #fbbf24; margin-top: 5px;">${Math.round(game.rating)}</div>
        `;

                                                                container.appendChild(card);
                                                            });
                                                        }
