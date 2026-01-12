/* Internationalization (i18n) for 8BIT LORE */

const translations = {
    es: {
        // Nav
        nav_home: "INICIO",
        nav_games: "JUEGOS",
        nav_companies: "COMPAÑÍAS",
        nav_platforms: "PLATAFORMAS",
        nav_events: "EVENTOS",
        nav_about: "ACERCA DE",
        search_placeholder: "Buscar...",

        // Sections
        section_featured: "Juegos Destacados",
        section_latest_events: "Últimos Eventos",
        section_top_games: "Los 20 Mejores Juegos",
        section_releases: "Lanzamientos",
        section_companies: "Compañías",
        section_platforms: "Plataformas",

        // Buttons
        btn_view_all: "Ver todos",
        btn_view_more: "Ver más",
        btn_load_more: "Cargar más",
        btn_new_releases: "Nuevos lanzamientos",
        btn_upcoming: "Próximamente",

        // Footer
        footer_questions: "preguntas",
        footer_follow: "Síguenos",
        footer_contact: "Contáctanos",
        footer_rights: "© 2026 8BIT LORE. Todos los derechos reservados.",

        // SDG Game
        sdg_mission: "Misión ODS",
        sdg_reset: "Reiniciar Misión",
        sdg_victory_title: "¡MISIÓN COMPLETADA!",
        sdg_victory_text: "Has reunido los 17 Objetivos para transformar el mundo.",
        sdg_btn_continue: "Continuar Explorando",
        sdg_reset_confirm: "¿Reiniciar la misión ODS? Se perderá tu progreso."
    },
    en: {
        // Nav
        nav_home: "HOME",
        nav_games: "GAMES",
        nav_companies: "COMPANIES",
        nav_platforms: "PLATFORMS",
        nav_events: "EVENTS",
        nav_about: "ABOUT",
        search_placeholder: "Search...",

        // Sections
        section_featured: "Featured Games",
        section_latest_events: "Latest Events",
        section_top_games: "Top 20 Games",
        section_releases: "New Releases",
        section_companies: "Companies",
        section_platforms: "Platforms",

        // Buttons
        btn_view_all: "View all",
        btn_view_more: "View more",
        btn_load_more: "Load more",
        btn_new_releases: "New Releases",
        btn_upcoming: "Coming Soon",

        // Footer
        footer_questions: "questions",
        footer_follow: "Follow Us",
        footer_contact: "Contact Us",
        footer_rights: "© 2026 8BIT LORE. All rights reserved.",

        // SDG Game
        sdg_mission: "SDG Mission",
        sdg_reset: "Reset Mission",
        sdg_victory_title: "MISSION COMPLETED!",
        sdg_victory_text: "You have gathered all 17 Goals to transform the world.",
        sdg_btn_continue: "Continue Exploring",
        sdg_reset_confirm: "Restart SDG Mission? Your progress will be lost."
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('8bitlore_lang') || 'es';
        this.init();
    }

    init() {
        // Initial translation
        document.addEventListener('DOMContentLoaded', () => {
            this.injectToggle();
            this.translatePage();

            // Listen for dynamic updates if needed
            window.addEventListener('languageChanged', () => this.translatePage());
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('8bitlore_lang', lang);
        document.documentElement.lang = lang;
        this.translatePage();

        // Update Toggle Button State
        this.updateToggleVisuals();

        // Dispatch event for other scripts (like SDG game)
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'es' ? 'en' : 'es';
        this.setLanguage(newLang);
    }

    translatePage() {
        const t = translations[this.currentLang];

        // Text Content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) el.textContent = t[key];
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (t[key]) el.placeholder = t[key];
        });

        // Titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            if (t[key]) el.title = t[key];
        });
    }

    injectToggle() {
        // Find header container to insert toggle
        const headerContainer = document.querySelector('.header-container');
        if (!headerContainer) return;

        // Create Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'lang-toggle';
        toggleBtn.className = 'lang-toggle-btn';
        toggleBtn.onclick = () => this.toggleLanguage();
        // Insert before Search Bar or inside Nav?
        // Let's modify the styles separately, but typically distinct from nav

        // Visual
        this.updateToggleVisuals(toggleBtn);

        // Insert after nav if exists, or append to container
        const nav = headerContainer.querySelector('nav');
        if (nav) {
            headerContainer.appendChild(toggleBtn);
            // We might need CSS to position it nicely
        }
    }

    updateToggleVisuals(btn = document.getElementById('lang-toggle')) {
        if (!btn) return;
        btn.textContent = this.currentLang === 'es' ? 'EN' : 'ES'; // Show option to switch TO
        btn.title = this.currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español';
    }
}

// Global accessor
window.langManager = new LanguageManager();

// Helper for other scripts (like SDG game) to get current text
window.getTranslation = (key) => {
    const lang = localStorage.getItem('8bitlore_lang') || 'es';
    return translations[lang][key] || key;
};
