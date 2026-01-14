//*********PAGINA ACERCA DE*******/


/*********************************************************/
/*********************DATOS DE TECNOLOGIAS***************/
/*******************************************************/

const technologiesData = [
    {
        id: 1,
        name: "HTML5",
        icon: "🌐",
        description: "Lenguaje de marcado estándar para crear la estructura y el contenido de páginas web. Proporciona elementos semánticos para una mejor accesibilidad y SEO."
    },
    {
        id: 2,
        name: "CSS3",
        icon: "🎨",
        description: "Hojas de estilo en cascada para diseñar y dar formato visual a páginas web. Incluye animaciones, transiciones, gradientes y diseño responsivo."
    },
    {
        id: 3,
        name: "JavaScript (ES6+)",
        icon: "⚡",
        description: "Lenguaje de programación que permite crear contenido dinámico e interactivo en páginas web. Utilizado para carruseles, modales y funcionalidades interactivas."
    },
    {
        id: 4,
        name: "IGDB API",
        icon: "🎮",
        description: "API de base de datos de videojuegos de Internet Games Database, que proporciona información detallada sobre juegos, compañías, plataformas y eventos."
    }
];

/*********************************************************/
/*********************DATOS DE NOSOTROS*******************/
/*********************************************************/

const teamData = [
    {
        id: 1,
        name: "Sara",
        role: "Desarrolladora",
        description: "Hola! soy sara. Soy de esas personas que no pueden quedarse quietas si tienen una idea en la cabeza. Me gusta aprender de todo un poco, probar cosas nuevas y ver hasta dónde puedo llegar cuando me propongo algo. Este proyecto es solo una parte de todo lo que me gusta crear."
    },
    {
        id: 2,
        name: "Santiago",
        role: "Desarrollador",
        description: "Soy estudiante de Ingeniería Informática en la Universidad Católica Andrés Bello (UCAB). A mis 19 años, combino mi formación académica con una curiosidad insaciable por entender cómo la tecnología puede resolver problemas reales. Me considero una persona analítica, proactiva y en constante aprendizaje. Mi objetivo no es solo escribir código, sino crear soluciones eficientes e innovadoras. Actualmente, estoy enfocado en fortalecer mis habilidades en desarrollo web y busco oportunidades para aplicar mis conocimientos en proyectos desafiantes."
    },
    {
        id: 3,
        name: "Charbel",
        role: "Desarrollador",
        description: "Soy estudiante de Ingeniería Informática en la Universidad Católica Andrés Bello (UCAB). A mis 19 años, combino mi formación académica con una pasión creciente por el desarrollo web y por construir interfaces limpias, funcionales y bien pensadas. Me considero una persona analítica, detallista y orientada a la mejora continua. Disfruto entender cómo cada decisión técnica impacta la experiencia del usuario y cómo un diseño modular puede transformar un proyecto en algo escalable y elegante. Mi objetivo no es solo programar, sino crear soluciones que integren lógica, estética y eficiencia."
    }
];

let currentTechIndex = 0;
let currentTeamIndex = 0;

/*********************************************************/
/*********************INICIALIZACION*******************/
/*********************************************************/

document.addEventListener('DOMContentLoaded', () => {
    loadTechCarousel();
    loadTeamCarousel();
    setupNavigationHandlers();
    setupContactForm();
    updateRecipient(); // Set initial recipient
});

/*********************************************************/
/***************************FUNCIONES*********************/
/*********************************************************/

function loadTechCarousel() {
    const carousel = document.getElementById('tech-carousel');
    carousel.innerHTML = '';

    technologiesData.forEach((tech, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === currentTechIndex ? 'active' : ''}`;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="tech-card">
                <div class="tech-icon">${tech.icon}</div>
                <div class="tech-card-name">${tech.name}</div>
            </div>
        `;

        item.addEventListener('click', () => selectTech(index));
        carousel.appendChild(item);
    });

    updateTechInfo();
}

/*********************************************************/
/***************************CARGAR CAROUSEL*****************/
/*********************************************************/

function loadTeamCarousel() {
    const carousel = document.getElementById('team-carousel');
    carousel.innerHTML = '';

    teamData.forEach((member, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === currentTeamIndex ? 'active' : ''}`;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="team-card">
                <div class="team-avatar">👤</div>
                <div class="team-card-name">${member.name}</div>
            </div>
        `;

        item.addEventListener('click', () => selectTeam(index));
        carousel.appendChild(item);
    });

    updateTeamInfo();
}

/*********************************************************/
/**************SELECCIONAR (TECNOLOGIA)*******************/
/*********************************************************/

function selectTech(index) {
    currentTechIndex = index;

    const items = document.querySelectorAll('#tech-carousel .carousel-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Center the active item on mobile
    centerActiveItem('tech-carousel');

    updateTechInfo();
}

/*********************************************************/
/*******SELECCIONAR (MIEMBRO EQUIPO)*******************/
/*********************************************************/

function selectTeam(index) {
    currentTeamIndex = index;

    const items = document.querySelectorAll('#team-carousel .carousel-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // Center the active item on mobile
    centerActiveItem('team-carousel');

    updateTeamInfo();
    updateRecipient(); // Update form recipient when team member changes
}

/*********************************************************/
/**************ACTUALIZAR (TECNOLOGIA)*******************/
/*********************************************************/

function updateTechInfo() {
    const tech = technologiesData[currentTechIndex];
    document.getElementById('tech-name').textContent = tech.name;
    document.getElementById('tech-description').textContent = tech.description;
}

/*********************************************************/
/**************ACTUALIZAR (MIEMBRO EQUIPO)*******************/
/*********************************************************/

function updateTeamInfo() {
    const member = teamData[currentTeamIndex];
    document.getElementById('team-name').textContent = `${member.name} - ${member.role}`;
    document.getElementById('team-description').textContent = member.description;
}

/*********************************************************/
/**************CONFIGURACION (NAVEGACION)*******************/
/*********************************************************/

function setupNavigationHandlers() {
    document.getElementById('tech-prev').addEventListener('click', () => {
        currentTechIndex = (currentTechIndex - 1 + technologiesData.length) % technologiesData.length;
        selectTech(currentTechIndex);
    });

    document.getElementById('tech-next').addEventListener('click', () => {
        currentTechIndex = (currentTechIndex + 1) % technologiesData.length;
        selectTech(currentTechIndex);
    });

    document.getElementById('team-prev').addEventListener('click', () => {
        currentTeamIndex = (currentTeamIndex - 1 + teamData.length) % teamData.length;
        selectTeam(currentTeamIndex);
    });

    document.getElementById('team-next').addEventListener('click', () => {
        currentTeamIndex = (currentTeamIndex + 1) % teamData.length;
        selectTeam(currentTeamIndex);
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentTechIndex = (currentTechIndex - 1 + technologiesData.length) % technologiesData.length;
            selectTech(currentTechIndex);
        } else if (e.key === 'ArrowRight') {
            currentTechIndex = (currentTechIndex + 1) % technologiesData.length;
            selectTech(currentTechIndex);
        }
    });
}

/*********************************************************/
/**************CONTACT FORM FUNCTIONS*********************/
/*********************************************************/

const EMAILJS_CONFIG = {
    serviceID: 'service_me0fjom',
    templateID: 'template_92cwcns',
    publicKey: 'FwxHq5eAYIGH7iuYC'
};

const teamEmails = {
    'Sara': 'sbpapaianni.24@est.ucab.edu.ve',
    'Santiago': 'ssmedina.24@est.ucab.edu.ve',
    'Charbel': 'cskhalil.24@est.ucab.edu.ve'
};

(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
})();

function updateRecipient() {
    const currentMember = teamData[currentTeamIndex];
    document.getElementById('recipient-name').textContent = currentMember.name;
}

// Setup contact form submission
function setupContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });
}

// Handle form submission with EmailJS
function handleFormSubmit() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Validate
    if (!name || !email || !subject || !message) {
        showFormStatus('Por favor completa todos los campos', 'error');
        return;
    }

    // Get current recipient
    const currentMember = teamData[currentTeamIndex];
    const recipientEmail = teamEmails[currentMember.name];

    // Disable submit button
    const submitBtn = document.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        showFormStatus('Error: Servicio de email no disponible.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    // Template parameters for EmailJS
    const templateParams = {
        to_email: recipientEmail,
        to_name: currentMember.name,
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        reply_to: email
    };

    // Send email using EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccess(currentMember.name);
        }, function (error) {
            console.error('FAILED...', error);

            // DEBUG: Mostrar el error real del servidor
            // Esto ayudará a saber por qué falla (Service ID incorrecto, Template ID, etc)
            let errorMsg = "Error desconocido";
            if (error.text) errorMsg = error.text;
            else if (JSON.stringify(error)) errorMsg = JSON.stringify(error);

            showFormStatus(`❌ Error Real: ${errorMsg}. Revisa la consola F12.`, 'error');

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });

    function showSuccess(memberName) {
        showFormStatus(`✅ Mensaje enviado exitosamente a ${memberName}!`, 'success');

        setTimeout(() => {
            document.getElementById('contact-form').reset();
            hideFormStatus();
        }, 3000);

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show form status message
function showFormStatus(message, type) {
    const statusDiv = document.getElementById('form-status');
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
}

// Hide form status
function hideFormStatus() {
    const statusDiv = document.getElementById('form-status');
    statusDiv.className = 'form-status';
}

/*********************************************************/
/**************CENTER ACTIVE CAROUSEL ITEM****************/
/*********************************************************/

// Helper function to center the active carousel item
function centerActiveItem(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const activeItem = carousel.querySelector('.carousel-item.active');
    if (!activeItem) return;

    // Only center on mobile devices
    if (window.innerWidth <= 768) {
        // Get carousel container
        const container = carousel.parentElement;

        // Calculate scroll position to center the active item
        const itemLeft = activeItem.offsetLeft;
        const itemWidth = activeItem.offsetWidth;
        const containerWidth = container.offsetWidth;

        // Center calculation
        const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

        // Smooth scroll to center
        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}
