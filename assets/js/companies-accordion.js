//********************* Funcionalidad de acordeon para seccion de companias *********************//

    document.addEventListener('DOMContentLoaded', () => {
        const companyAccordion = {
        //********************* Inicializa elementos del acordeon *********************//
            init() {
            this.companyHeaders = document.querySelectorAll('.company-header');

            if (!this.companyHeaders.length) return;

            this.attachEvents();
        },

        //********************* Adjunta eventos de click a cabeceras de compania *********************//
            attachEvents() {
            this.companyHeaders.forEach(header => {
                header.addEventListener('click', (e) => {
                    this.toggleCompany(header.parentElement);
                });
            });
        },

        //********************* Expande o colapsa item de compania *********************//
            toggleCompany(companyItem) {
            const isExpanded = companyItem.classList.contains('expanded');
            const toggleIcon = companyItem.querySelector('.toggle-icon');

            if (isExpanded) {
                companyItem.classList.remove('expanded');
                toggleIcon.textContent = '+';
            } else {
                companyItem.classList.add('expanded');
                toggleIcon.textContent = '-';
            }
        }
    };

if (document.querySelector('.companies-section')) {
    companyAccordion.init();
}
});
