// Cat Cursor Follower - Only for Home Page
// Top row: Idle animation (4 frames)
// Bottom row: Walking animation (6 frames)

let catElement = null;
let mouseX = 0;
let mouseY = 0;
let catX = 0;
let catY = 0;
let isInitialized = false;
let isMoving = false;
let movementTimeout = null;

// Idle animation frames (top row - 4 frames)
const idleFrames = [
    { x: 0, y: 0 },
    { x: -32, y: 0 },
    { x: -64, y: 0 },
    { x: -96, y: 0 }
];

// Walking animation frames (bottom row - 6 frames)
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

// Initialize cat follower
function initCatFollower() {
    if (isInitialized) return;

    // Create cat element
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

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        const prevX = mouseX;
        const prevY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Check if mouse is actually moving
        if (Math.abs(mouseX - prevX) > 0.5 || Math.abs(mouseY - prevY) > 0.5) {
            isMoving = true;

            // Reset timeout
            clearTimeout(movementTimeout);
            movementTimeout = setTimeout(() => {
                isMoving = false;
                currentFrame = 0; // Reset to first idle frame
            }, 150);
        }
    });

    // Start animation loop
    animateCat();

    isInitialized = true;
}

// Animate cat following cursor
function animateCat() {
    if (!catElement) return;

    // Smooth following with easing
    const ease = 0.15;
    const prevCatX = catX;
    catX += (mouseX - catX) * ease;
    catY += (mouseY - catY) * ease;

    // Update cat position
    catElement.style.left = (catX - 16) + 'px';
    catElement.style.top = (catY - 16) + 'px';

    // Choose animation based on movement
    const frames = isMoving ? walkFrames : idleFrames;
    const frameSpeed = isMoving ? 4 : 8; // Walking faster, idle slower

    // Animate sprite
    frameCounter++;
    if (frameCounter % frameSpeed === 0) {
        currentFrame = (currentFrame + 1) % frames.length;
        const frame = frames[currentFrame];
        catElement.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
    }

    // Flip cat based on movement direction
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatFollower);
} else {
    initCatFollower();
}
