//********************* Pagina Acerca De tecnologias equipo y contacto *********************//

//********************* Datos de tecnologias utilizadas en el proyecto *********************//
const technologiesData = [
    {
        id: 1,
        name: "HTML5",
        icon: "",
        description: "Lenguaje de marcado estandar para crear la estructura y el contenido de paginas web. Proporciona elementos semanticos para una mejor accesibilidad y SEO."
    },
    {
        id: 2,
        name: "CSS3",
        icon: "",
        description: "Hojas de estilo en cascada para disenar y dar formato visual a paginas web. Incluye animaciones, transiciones, gradientes y diseno responsivo."
    },
    {
        id: 3,
        name: "JavaScript (ES6+)",
        icon: "",
        description: "Lenguaje de programacion que permite crear contenido dinamico e interactivo en paginas web. Utilizado para carruseles, modales y funcionalidades interactivas."
    },
    {
        id: 4,
        name: "IGDB API",
        icon: "",
        description: "API de base de datos de videojuegos de Internet Games Database, que proporciona informacion detallada sobre juegos, companias, plataformas y eventos."
    }
];

//********************* Datos de miembros del equipo *********************//
const teamData = [
    {
        id: 1,
        name: "Sara",
        role: "Desarrolladora",
        description: "Hola! soy sara. Soy de esas personas que no pueden quedarse quietas si tienen una idea en la cabeza. Me gusta aprender de todo un poco, probar cosas nuevas y ver hasta donde puedo llegar cuando me propongo algo. Este proyecto es solo una parte de todo lo que me gusta crear."
    },
    {
        id: 2,
        name: "Santiago",
        role: "Desarrollador",
        description: "Soy estudiante de Ingenieria Informatica en la Universidad Catolica Andres Bello (UCAB). A mis 19 anos, combino mi formacion academica con una curiosidad insaciable por entender como la tecnologia puede resolver problemas reales. Me considero una persona analitica, proactiva y en constante aprendizaje. Mi objetivo no es solo escribir codigo, sino crear soluciones eficientes e innovadoras. Actualmente, estoy enfocado en fortalecer mis habilidades en desarrollo web y busco oportunidades para aplicar mis conocimientos en proyectos desafiantes."
    },
    {
        id: 3,
        name: "Charbel",
        role: "Desarrollador",
        description: "Soy estudiante de Ingenieria Informatica en la Universidad Catolica Andres Bello (UCAB). A mis 19 anos, combino mi formacion academica con una pasion creciente por el desarrollo web y por construir interfaces limpias, funcionales y bien pensadas. Me considero una persona analitica, detallista y orientada a la mejora continua. Disfruto entender como cada decision tecnica impacta la experiencia del usuario y como un diseno modular puede transformar un proyecto en algo escalable y elegante. Mi objetivo no es solo programar, sino crear soluciones que integren logica, estetica y eficiencia."
    }
];

let currentTechIndex = 0;
let currentTeamIndex = 0;

//********************* Inicializacion de componentes al cargar pagina *********************//
document.addEventListener('DOMContentLoaded', () => {
    loadTechCarousel();
    loadTeamCarousel();
    setupNavigationHandlers();
    setupContactForm();
    updateRecipient();
});

//********************* Carga carrusel de tecnologias *********************//
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

//********************* Carga carrusel de miembros del equipo *********************//
function loadTeamCarousel() {
    const carousel = document.getElementById('team-carousel');
    carousel.innerHTML = '';

    teamData.forEach((member, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === currentTeamIndex ? 'active' : ''}`;
        item.dataset.index = index;

        item.innerHTML = `
            <div class="team-card">
                <div class="team-avatar"></div>
                <div class="team-card-name">${member.name}</div>
            </div>
        `;

        item.addEventListener('click', () => selectTeam(index));
        carousel.appendChild(item);
    });

    updateTeamInfo();
}

//********************* Selecciona tecnologia y actualiza vista *********************//
function selectTech(index) {
    currentTechIndex = index;

    const items = document.querySelectorAll('#tech-carousel .carousel-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    centerActiveItem('tech-carousel');
    updateTechInfo();
}

//********************* Selecciona miembro del equipo y actualiza vista *********************//
function selectTeam(index) {
    currentTeamIndex = index;

    const items = document.querySelectorAll('#team-carousel .carousel-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    centerActiveItem('team-carousel');
    updateTeamInfo();
    updateRecipient();
}

//********************* Actualiza informacion de tecnologia seleccionada *********************//
function updateTechInfo() {
    const tech = technologiesData[currentTechIndex];
    document.getElementById('tech-name').textContent = tech.name;
    document.getElementById('tech-description').textContent = tech.description;
}

//********************* Actualiza informacion de miembro del equipo seleccionado *********************//
function updateTeamInfo() {
    const member = teamData[currentTeamIndex];
    document.getElementById('team-name').textContent = `${member.name} - ${member.role}`;
    document.getElementById('team-description').textContent = member.description;
}

//********************* Configura botones de navegacion de carruseles y teclado *********************//
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
//********************* Configuracion de EmailJS para formulario de contacto *********************//
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

//********************* Actualiza destinatario del formulario segun miembro seleccionado *********************//
function updateRecipient() {
    const currentMember = teamData[currentTeamIndex];
    document.getElementById('recipient-name').textContent = currentMember.name;
}

    //********************* Configura manejador de envio de formulario de contacto *********************//
    function setupContactForm() {
        const form = document.getElementById('contact-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
    }

//********************* Maneja envio de formulario y validacion con EmailJS *********************//
function handleFormSubmit() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
        showFormStatus('Por favor completa todos los campos', 'error');
        return;
    }

    const currentMember = teamData[currentTeamIndex];
    const recipientEmail = teamEmails[currentMember.name];

    const submitBtn = document.querySelector('.form-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    if (typeof emailjs === 'undefined') {
        showFormStatus('Error: Servicio de email no disponible.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    const templateParams = {
        to_email: recipientEmail,
        to_name: currentMember.name,
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        reply_to: email
    };

    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccess(currentMember.name);
        }, function (error) {
            console.error('FAILED...', error);

            let errorMsg = "Error desconocido";
            if (error.text) errorMsg = error.text;
            else if (JSON.stringify(error)) errorMsg = JSON.stringify(error);

            showFormStatus(`Error Real: ${errorMsg}. Revisa la consola F12.`, 'error');

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });

    function showSuccess(memberName) {
        showFormStatus(`Mensaje enviado exitosamente a ${memberName}!`, 'success');

        setTimeout(() => {
            document.getElementById('contact-form').reset();
            hideFormStatus();
        }, 3000);

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

//********************* Muestra mensaje de estado del formulario *********************//
function showFormStatus(message, type) {
    const statusDiv = document.getElementById('form-status');
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
}

//********************* Oculta mensaje de estado del formulario *********************//
function hideFormStatus() {
    const statusDiv = document.getElementById('form-status');
    statusDiv.className = 'form-status';
}

//********************* Centra el item activo del carrusel en dispositivos moviles *********************//
function centerActiveItem(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const activeItem = carousel.querySelector('.carousel-item.active');
    if (!activeItem) return;

    if (window.innerWidth <= 768) {
        const container = carousel.parentElement;

        const itemLeft = activeItem.offsetLeft;
        const itemWidth = activeItem.offsetWidth;
        const containerWidth = container.offsetWidth;

        const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}
