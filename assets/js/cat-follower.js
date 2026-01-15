//********************* Cursor seguidor de gato pixelado solo para pagina principal *********************//

    let catElement = null;
let mouseX = 0;
let mouseY = 0;
let catX = 0;
let catY = 0;
let isInitialized = false;
let isMoving = false;
let movementTimeout = null;

//********************* Frames de animacion idle fila superior 4 frames *********************//
const idleFrames = [
    { x: 0, y: 0 },
    { x: -32, y: 0 },
    { x: -64, y: 0 },
    { x: -96, y: 0 }
];

//********************* Frames de animacion caminar fila inferior 6 frames *********************//
const walkFrames = [
    { x: 0, y: -32 },
    { x: -32, y: -32 },
    { x: -64, y: -32 },
    { x: -96, y: -32 },
    { x: -128, y: -32 },
    { x: -160, y: -32 }
];

let currentFrame = 0;
let frameCounter = 0;

//********************* Inicializa elemento de gato y eventos de mouse *********************//
    function initCatFollower() {
        if (isInitialized) return;

        catElement = document.createElement('div');
        catElement.id = 'cursor-cat';
        catElement.style.cssText = `
        position: fixed;
        width: 32px;
        height: 32px;
        background-image: url('../assets/images/cat-sprite.png');
        background-size: auto;
        background-position: 0 0;
        background-repeat: no-repeat;
        pointer-events: none;
        z-index: 9999;
        transition: none;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    `;

        document.body.appendChild(catElement);

    //********************* Rastrea posicion del mouse y detecta movimiento *********************//
            document.addEventListener('mousemove', (e) => {
                const prevX = mouseX;
                const prevY = mouseY;
                mouseX = e.clientX;
                mouseY = e.clientY;

                if (Math.abs(mouseX - prevX) > 0.5 || Math.abs(mouseY - prevY) > 0.5) {
                    isMoving = true;

                    clearTimeout(movementTimeout);
                    movementTimeout = setTimeout(() => {
                        isMoving = false;
                        currentFrame = 0;
                    }, 150);
                }
            });

        animateCat();
        isInitialized = true;
    }

    //********************* Anima gato siguiendo cursor con suavizado easing *********************//
        function animateCat() {
            if (!catElement) return;

            const ease = 0.15;
            const prevCatX = catX;
            catX += (mouseX - catX) * ease;
            catY += (mouseY - catY) * ease;

            catElement.style.left = (catX - 16) + 'px';
            catElement.style.top = (catY - 16) + 'px';

            const frames = isMoving ? walkFrames : idleFrames;
            const frameSpeed = isMoving ? 4 : 8;

            frameCounter++;
            if (frameCounter % frameSpeed === 0) {
                currentFrame = (currentFrame + 1) % frames.length;
                const frame = frames[currentFrame];
                catElement.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
            }

    //********************* Voltea sprite basado en direccion de movimiento *********************//
    const deltaX = catX - prevCatX;
            if (Math.abs(deltaX) > 0.1) {
                if (deltaX > 0) {
                    catElement.style.transform = 'scaleX(1)';
                } else {
                    catElement.style.transform = 'scaleX(-1)';
                }
            }

            requestAnimationFrame(animateCat);
        }

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatFollower);
} else {
    initCatFollower();
}
