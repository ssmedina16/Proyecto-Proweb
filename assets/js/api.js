// IGDB API Integration
const IGDB_API = {
    baseURL: '/api/igdb',
    clientId: '93jt6mqjgthmkmzvajqm0rw92opfug',
    clientSecret: 'f9hdul6c5921dbdgbo4l93xy53i9ok',
    tokenEndpoint: '/api/twitch/oauth2/token',



    // Cache
    cache: {
        token: null,
        tokenExpiry: null,
        data: new Map()
    },

    // Get OAuth token from Twitch
    async getAccessToken() {
        // Check if we have a valid cached token
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
            // Set expiry to 1 hour from now (tokens last longer but we refresh earlier)
            this.cache.tokenExpiry = Date.now() + (3600 * 1000);

            return data.access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },

    // Generic API request
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

    // Get popular games
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

    // Get recent releases
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

    // Get upcoming releases
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

    // Get events
    async getEvents(limit = 3) {
        const cacheKey = `events_${limit}`;
        if (this.cache.data.has(cacheKey)) {
            return this.cache.data.get(cacheKey);
        }

        const query = `
            fields name, description, start_time, end_time, event_logo.url, event_networks.url;
            sort start_time desc;
            limit ${limit};
        `;

        const data = await this.apiRequest('events', query);
        if (data) {
            this.cache.data.set(cacheKey, data);
        }
        return data;
    },

    // Get platforms
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

    // Get companies
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

    // Get games with pagination and detailed info
    async getGames(limit = 20, offset = 0) {
        const cacheKey = `games_${limit}_${offset}`;
        if (this.cache.data.has(cacheKey)) {
            return this.cache.data.get(cacheKey);
        }

        const query = `
            fields name, cover.url, rating, summary, first_release_date, 
                   genres.name, platforms.name, involved_companies.company.name;
            where rating_count > 5;
            sort rating desc;
            limit ${limit};
            offset ${offset};
        `;

        const data = await this.apiRequest('games', query);
        if (data) {
            this.cache.data.set(cacheKey, data);
        }
        return data;
    },

    // Get detailed game info by ID
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
                   release_dates.platform.name, release_dates.date;
            where id = ${gameId};
        `;

        const data = await this.apiRequest('games', query);
        if (data && data.length > 0) {
            this.cache.data.set(cacheKey, data[0]);
            return data[0];
        }
        return null;
    },

    // Get games by platform
    async getGamesByPlatform(platformId, limit = 20) {
        const cacheKey = `games_platform_${platformId}_${limit}`;
        if (this.cache.data.has(cacheKey)) {
            return this.cache.data.get(cacheKey);
        }

        const query = `
            fields name, cover.url, rating, first_release_date;
            where platforms = [${platformId}] & rating_count > 3;
            sort rating desc;
            limit ${limit};
        `;

        const data = await this.apiRequest('games', query);
        if (data) {
            this.cache.data.set(cacheKey, data);
        }
        return data;
    },

    // Get games by company
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

    // Get platform details
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

    // Get company details
    async getCompanyDetails(companyId) {
        const cacheKey = `company_detail_${companyId}`;
        if (this.cache.data.has(cacheKey)) {
            return this.cache.data.get(cacheKey);
        }

        const query = `
            fields name, description, logo.url, start_date, country, websites.url;
            where id = ${companyId};
        `;

        const data = await this.apiRequest('companies', query);
        if (data && data.length > 0) {
            this.cache.data.set(cacheKey, data[0]);
            return data[0];
        }
        return null;
    },

    // Helper: Format image URL
    formatImageUrl(url, size = 'cover_big') {
        if (!url) return 'https://via.placeholder.com/300x400?text=No+Image';
        if (url.startsWith('//')) {
            url = 'https:' + url;
        }
        return url.replace('t_thumb', `t_${size}`);
    },

    // Helper: Format date
    formatDate(timestamp) {
        if (!timestamp) return 'TBA';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IGDB_API;
}
