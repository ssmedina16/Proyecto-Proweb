//********************* Integracion con la API de IGDB *********************//
const IGDB_API = {
    baseURL: '/api/igdb',
    clientId: 'lexhrfxh29xqjzpmaozu35s0iocp4y',
    clientSecret: 'vur4q2yrs1foxr51ibn5iuocs24sgn',
    tokenEndpoint: '/api/twitch/oauth2/token',

    cache: {
        token: null,
        tokenExpiry: null,
        data: new Map()
    },

    //********************* Obtiene token de autenticacion OAuth de Twitch *********************//
    async getAccessToken() {
    if (this.cache.token && this.cache.tokenExpiry && Date.now() < this.cache.tokenExpiry) {
        return this.cache.token;
    }

    try {
        const response = await fetch(
            `${this.tokenEndpoint}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
            { method: 'POST' }
        );

        if (!response.ok) {
            throw new Error('Failed to get access token');
        }

        const data = await response.json();
        this.cache.token = data.access_token;
        this.cache.tokenExpiry = Date.now() + (3600 * 1000);

        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
},

    //********************* Realiza peticion generica a la API de IGDB *********************//
    async apiRequest(endpoint, body) {
    const token = await this.getAccessToken();
    if (!token) {
        console.error('No access token available');
        return null;
    }

    try {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Client-ID': this.clientId,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'text/plain'
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
},

    //********************* Obtiene los juegos mas populares *********************//
    async getPopularGames(limit = 10) {
    const cacheKey = `popular_games_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, cover.url, rating, summary, first_release_date, platforms.name;
            where rating_count > 10 & rating > 70;
            sort rating desc;
            limit ${limit};
        `;

    const data = await this.apiRequest('games', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene los top 100 juegos mejor valorados *********************//
    async getTop100Games() {
    const cacheKey = 'top_100_games';
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, cover.url, rating, summary, first_release_date, platforms.name, genres.name;
            where rating_count > 50 & rating > 75;
            sort rating desc;
            limit 100;
        `;

    const data = await this.apiRequest('games', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene lanzamientos recientes ultimos 90 dias *********************//
    async getRecentReleases(limit = 8) {
    const cacheKey = `recent_releases_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const now = Math.floor(Date.now() / 1000);
    const threeMonthsAgo = now - (90 * 24 * 60 * 60);

    const query = `
            fields name, cover.url, first_release_date;
            where first_release_date > ${threeMonthsAgo} & first_release_date < ${now};
            sort first_release_date desc;
            limit ${limit};
        `;

    const data = await this.apiRequest('games', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene proximos lanzamientos siguientes 180 dias *********************//
    async getUpcomingReleases(limit = 8) {
    const cacheKey = `upcoming_releases_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const now = Math.floor(Date.now() / 1000);
    const sixMonthsLater = now + (180 * 24 * 60 * 60);

    const query = `
            fields name, cover.url, first_release_date;
            where first_release_date > ${now} & first_release_date < ${sixMonthsLater};
            sort first_release_date asc;
            limit ${limit};
        `;

    const data = await this.apiRequest('games', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene lista de eventos de gaming *********************//
    async getEvents(limit = 10) {
    const cacheKey = `events_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, description, start_time, end_time, 
                   event_logo.url, event_networks.url;
            where start_time != null;
            sort start_time desc;
            limit ${limit};
        `;

    const data = await this.apiRequest('events', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene detalles completos de un evento especifico *********************//
    async getEventDetails(eventId) {
    const cacheKey = `event_detail_${eventId}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, description, start_time, end_time,
                   event_logo.url, event_networks.url, event_networks.network.name,
                   videos.video_id, videos.name,
                   games.name, games.cover.url, games.rating;
            where id = ${eventId};
        `;

    const data = await this.apiRequest('events', query);
    if (data && data.length > 0) {
        this.cache.data.set(cacheKey, data[0]);
        return data[0];
    }
    return null;
},

    //********************* Obtiene lista de plataformas de videojuegos *********************//
    async getPlatforms(limit = 4) {
    const cacheKey = `platforms_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, platform_logo.url, summary;
            where category = (1,5,6);
            limit ${limit};
        `;

    const data = await this.apiRequest('platforms', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene detalles completos de una plataforma especifica *********************//
    async getPlatformDetails(platformId) {
    const cacheKey = `platform_detail_${platformId}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, summary, platform_logo.url, category, generation;
            where id = ${platformId};
        `;

    const data = await this.apiRequest('platforms', query);
    if (data && data.length > 0) {
        this.cache.data.set(cacheKey, data[0]);
        return data[0];
    }
    return null;
},

    //********************* Obtiene lista de companias desarrolladoras *********************//
    async getCompanies(limit = 4) {
    const cacheKey = `companies_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, description, logo.url, start_date, country;
            where developed.rating_count > 5;
            sort developed.rating_count desc;
            limit ${limit};
        `;

    const data = await this.apiRequest('companies', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene informacion detallada de una compania por ID *********************//
    async getCompanyDetails(companyId) {
    const cacheKey = `company_detail_${companyId}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, description, logo.url, start_date, country, 
                   websites.url, websites.category,
                   developed.name, developed.rating, developed.cover.url, developed.platforms.name, developed.genres.name, developed.category,
                   published.name, published.rating, published.cover.url, published.platforms.name, published.genres.name, published.category;
            where id = ${companyId};
        `;

    const data = await this.apiRequest('companies', query);
    if (data && data.length > 0) {
        this.cache.data.set(cacheKey, data[0]);
        return data[0];
    }
    return null;
},

    //********************* Busqueda global en todas las entidades juegos companias plataformas eventos *********************//
    async globalSearch(query) {
    if (!query || query.length < 2) {
        return { games: [], companies: [], platforms: [], events: [] };
    }

    const searchTerm = query.toLowerCase();

    try {
        const [gamesData, companiesData, platformsData, eventsData] = await Promise.all([
            this.searchGames(searchTerm),
            this.searchCompanies(searchTerm),
            this.searchPlatforms(searchTerm),
            this.searchEvents(searchTerm)
        ]);

        return {
            games: gamesData || [],
            companies: companiesData || [],
            platforms: platformsData || [],
            events: eventsData || []
        };
    } catch (error) {
        console.error('Global search error:', error);
        return { games: [], companies: [], platforms: [], events: [] };
    }
},

    //********************* Busca juegos por nombre *********************//
    async searchGames(query) {
    const cacheKey = `search_games_${query}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const apiQuery = `
            search "${query}";
            fields name, cover.url, rating, first_release_date;
            limit 5;
        `;

    const data = await this.apiRequest('games', apiQuery);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data || [];
},

    //********************* Busca companias por nombre *********************//
    async searchCompanies(query) {
    const cacheKey = `search_companies_${query}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const apiQuery = `
            search "${query}";
            fields name, logo.url, country;
            limit 5;
        `;

    const data = await this.apiRequest('companies', apiQuery);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data || [];
},

    //********************* Busca plataformas por nombre *********************//
    async searchPlatforms(query) {
    const cacheKey = `search_platforms_${query}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const apiQuery = `
            search "${query}";
            fields name, platform_logo.url;
            limit 5;
        `;

    const data = await this.apiRequest('platforms', apiQuery);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data || [];
},

    //********************* Busca eventos por nombre *********************//
    async searchEvents(query) {
    const cacheKey = `search_events_${query}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const apiQuery = `
            search "${query}";
            fields name, start_time, end_time;
            limit 5;
        `;

    const data = await this.apiRequest('events', apiQuery);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data || [];
},

    //********************* Obtiene juegos con paginacion y filtros opcionales *********************//
    async getGames(limit = 20, offset = 0, whereClause = null) {
    const cacheKey = `games_${limit}_${offset}_${whereClause ? whereClause.replace(/\s+/g, '') : 'default'}`;
    if (!whereClause && this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const defaultWhere = 'rating_count > 5';
    const finalWhere = whereClause ? `${defaultWhere} & ${whereClause}` : defaultWhere;

    const query = `
            fields name, cover.url, rating, summary, first_release_date, 
                   genres.name, platforms.name, involved_companies.company.name;
            where ${finalWhere};
            sort rating desc;
            limit ${limit};
            offset ${offset};
        `;

    const data = await this.apiRequest('games', query);
    if (data && !whereClause) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene detalles completos de un juego por ID *********************//
    async getGameDetails(gameId) {
    const cacheKey = `game_detail_${gameId}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, cover.url, rating, summary, storyline, first_release_date,
                   genres.name, platforms.name, game_modes.name, themes.name,
                   franchises.name, age_ratings.rating, age_ratings.category,
                   language_supports.language.name,
                   involved_companies.company.name, involved_companies.developer,
                   release_dates.platform.name, release_dates.date,
                   collection.name,
                   websites.url, websites.category,
                   videos.video_id, videos.name,
                   screenshots.url,
                   similar_games.name, similar_games.cover.url, similar_games.rating;
            where id = ${gameId};
        `;

    const data = await this.apiRequest('games', query);
    if (data && data.length > 0) {
        this.cache.data.set(cacheKey, data[0]);
        return data[0];
    }
    return null;
},

    //********************* Obtiene juegos de una plataforma especifica *********************//
    async getGamesByPlatform(platformId, limit = 20) {
    const cacheKey = `games_platform_${platformId}_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, cover.url, rating, first_release_date;
            where platforms = (${platformId}) & rating != null;
            sort rating desc;
            limit ${limit};
        `;

    const data = await this.apiRequest('games', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Obtiene juegos desarrollados por una compania especifica *********************//
    async getGamesByCompany(companyId, limit = 20) {
    const cacheKey = `games_company_${companyId}_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    const query = `
            fields name, cover.url, rating, first_release_date;
            where involved_companies.company = [${companyId}];
            sort rating desc;
            limit ${limit};
        `;

    const data = await this.apiRequest('games', query);
    if (data) {
        this.cache.data.set(cacheKey, data);
    }
    return data;
},

    //********************* Busqueda completa en todas las categorias con limite personalizado *********************//
    async searchAll(query, limit = 10) {
    if (!query || query.trim().length < 2) {
        return { games: [], companies: [], platforms: [], events: [] };
    }

    const cacheKey = `search_${query}_${limit}`;
    if (this.cache.data.has(cacheKey)) {
        return this.cache.data.get(cacheKey);
    }

    try {
        const results = {
            games: [],
            companies: [],
            platforms: [],
            events: []
        };

        const gamesQuery = `
                fields name, cover.url, rating, summary, first_release_date;
                search "${query}";
                limit ${limit};
            `;
        const gamesResults = await this.apiRequest('games', gamesQuery);
        if (gamesResults) results.games = gamesResults;

        const companiesQuery = `
                fields name, logo.url, description, country;
                search "${query}";
                limit ${limit};
            `;
        const companiesResults = await this.apiRequest('companies', companiesQuery);
        if (companiesResults) results.companies = companiesResults;

        const platformsQuery = `
                fields name, platform_logo.url, summary;
                search "${query}";
                limit ${limit};
            `;
        const platformsResults = await this.apiRequest('platforms', platformsQuery);
        if (platformsResults) results.platforms = platformsResults;

        const eventsQuery = `
                fields name, description, start_time, event_logo.url;
                search "${query}";
                limit ${limit};
            `;
        const eventsResults = await this.apiRequest('events', eventsQuery);
        if (eventsResults) results.events = eventsResults;

        this.cache.data.set(cacheKey, results);
        return results;
    } catch (error) {
        console.error('Search error:', error);
        return { games: [], companies: [], platforms: [], events: [] };
    }
},

    //********************* Formatea URL de imagenes con tamano especifico *********************//
    formatImageUrl(url, size = 'cover_big') {
    if (!url) return 'https://via.placeholder.com/300x400?text=No+Image';
    if (url.startsWith('//')) {
        url = 'https:' + url;
    }
    return url.replace('t_thumb', `t_${size}`);
},

    //********************* Formatea timestamp UNIX a fecha legible en espanol *********************//
    formatDate(timestamp) {
    if (!timestamp) return 'TBA';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IGDB_API;
}
