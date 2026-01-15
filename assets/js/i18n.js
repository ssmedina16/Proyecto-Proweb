//********************* Internacionalizacion i18n para 8BIT LORE espanol e ingles *********************//

const translations = {
    es: {
        nav_home: "INICIO",
        nav_games: "JUEGOS",
        nav_companies: "COMPANIAS",
        nav_platforms: "PLATAFORMAS",
        nav_events: "EVENTOS",
        nav_about: "ACERCA DE",
        search_placeholder: "Buscar...",
        section_featured: "Juegos Destacados",
        section_latest_events: "Ultimos Eventos",
        section_top_games: "Los 20 Mejores Juegos",
        section_releases: "Lanzamientos",
        section_companies: "Companias",
        section_platforms: "Plataformas",
        btn_view_all: "Ver todos",
        btn_view_more: "Ver mas",
        btn_load_more: "Cargar mas",
        btn_new_releases: "Nuevos lanzamientos",
        btn_upcoming: "Proximamente",
        footer_questions: "preguntas",
        footer_follow: "Siguenos",
        footer_contact: "Contactanos",
        footer_rights: "© 2026 8BIT LORE. Todos los derechos reservados.",
        sdg_mission: "Mision ODS",
        sdg_reset: "Reiniciar Mision",
        sdg_victory_title: "MISION COMPLETADA!",
        sdg_victory_text: "Has reunido los 17 Objetivos para transformar el mundo.",
        sdg_btn_continue: "Continuar Explorando",
        sdg_reset_confirm: "Reiniciar la mision ODS? Se perdera tu progreso."
    },
    en: {
        nav_home: "HOME",
        nav_games: "GAMES",
        nav_companies: "COMPANIES",
        nav_platforms: "PLATFORMS",
        nav_events: "EVENTS",
        nav_about: "ABOUT",
        search_placeholder: "Search...",
        section_featured: "Featured Games",
        section_latest_events: "Latest Events",
        section_top_games: "Top 20 Games",
        section_releases: "New Releases",
        section_companies: "Companies",
        section_platforms: "Platforms",
        btn_view_all: "View all",
        btn_view_more: "View more",
        btn_load_more: "Load more",
        btn_new_releases: "New Releases",
        btn_upcoming: "Coming Soon",
        footer_questions: "questions",
        footer_follow: "Follow Us",
        footer_contact: "Contact Us",
        footer_rights: "© 2026 8BIT LORE. All rights reserved.",
        sdg_mission: "SDG Mission",
        sdg_reset: "Reset Mission",
        sdg_victory_title: "MISSION COMPLETED!",
        sdg_victory_text: "You have gathered all 17 Goals to transform the world.",
        sdg_btn_continue: "Continue Exploring",
        sdg_reset_confirm: "Restart SDG Mission? Your progress will be lost."
    }
};

//********************* Clase gestora de cambio de idioma con localStorage *********************//
    class LanguageManager {
        constructor() {
            this.currentLang = localStorage.getItem('8bitlore_lang') || 'es';
            this.init();
        }

        init() {
            document.addEventListener('DOMContentLoaded', () => {
                this.injectToggle();
                this.translatePage();
                window.addEventListener('languageChanged', () => this.translatePage());
            });
        }

    //********************* Establece nuevo idioma y actualiza pagina *********************//
    setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('8bitlore_lang', lang);
    document.documentElement.lang = lang;
    this.translatePage();
    this.updateToggleVisuals();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

    //********************* Alterna entre espanol e ingles *********************//
    toggleLanguage() {
    const newLang = this.currentLang === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
}

    //********************* Traduce todos los elementos con atributos data - i18n *********************//
    translatePage() {
    const t = translations[this.currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) el.placeholder = t[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (t[key]) el.title = t[key];
    });
}

    //********************* Crea e inserta boton de cambio de idioma en header *********************//
    injectToggle() {
    const headerContainer = document.querySelector('.header-container');
    if (!headerContainer) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'lang-toggle';
    toggleBtn.className = 'lang-toggle-btn';
    toggleBtn.onclick = () => this.toggleLanguage();

    this.updateToggleVisuals(toggleBtn);

    const nav = headerContainer.querySelector('nav');
    if (nav) {
        headerContainer.appendChild(toggleBtn);
    }
}

    //********************* Actualiza apariencia visual del boton de idioma *********************//
    updateToggleVisuals(btn = document.getElementById('lang-toggle')) {
    if (!btn) return;
    btn.textContent = this.currentLang === 'es' ? 'EN' : 'ES';
    btn.title = this.currentLang === 'es' ? 'Switch to English' : 'Cambiar a Espanol';
}
}

window.langManager = new LanguageManager();

//********************* Funcion helper para obtener traduccion por clave *********************//
    window.getTranslation = (key) => {
        const lang = localStorage.getItem('8bitlore_lang') || 'es';
        return translations[lang][key] || key;
    };
