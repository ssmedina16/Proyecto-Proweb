// Companies Accordion Functionality

document.addEventListener('DOMContentLoaded', () => {
    const companyAccordion = {
        init() {
            this.companyHeaders = document.querySelectorAll('.company-header');

            if (!this.companyHeaders.length) return;

            this.attachEvents();
        },

        attachEvents() {
            this.companyHeaders.forEach(header => {
                header.addEventListener('click', (e) => {
                    this.toggleCompany(header.parentElement);
                });
            });
        },

        toggleCompany(companyItem) {
            const isExpanded = companyItem.classList.contains('expanded');
            const toggleIcon = companyItem.querySelector('.toggle-icon');

            if (isExpanded) {
                // Collapse
                companyItem.classList.remove('expanded');
                toggleIcon.textContent = '+';
            } else {
                // Expand
                companyItem.classList.add('expanded');
                toggleIcon.textContent = '-';
            }
        }
    };

    // Initialize companies accordion
    if (document.querySelector('.companies-section')) {
        companyAccordion.init();
    }
});
