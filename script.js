const colorArea = document.getElementById("colorArea");
const colorSelector = document.getElementById("colorSelector");
const hueSlider = document.getElementById("hueSlider");
const colorDisplay = document.getElementById("colorDisplay");
const hexValue = document.getElementById("hexValue");
const rgbaValue = document.getElementById("rgbaValue");
const hslValue = document.getElementById("hslValue");

let hue = 0;
let saturation = 0;
let lightness = 100;
let isDragging = false;


function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);

    return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function updateColorArea() {
    const hueColor = `hsl(${hue}, 100%, 50%)`;
    colorArea.style.background = `
        linear-gradient(to top, black, transparent), 
        linear-gradient(to right, white, ${hueColor})
    `;
}

function updateColor() {
    const [r, g, b] = hslToRgb(hue, saturation, lightness).map(Math.round);

    const rgbString = `rgba(${r}, ${g}, ${b}, 1)`;
    const hslString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hexString = rgbToHex(r, g, b);

    colorDisplay.style.backgroundColor = rgbString;
    hexValue.textContent = hexString;
    rgbaValue.textContent = rgbString;
    hslValue.textContent = hslString;
}

function moveSelector(x, y) {
    const rect = colorArea.getBoundingClientRect();

    const clampedX = Math.max(0, Math.min(x - rect.left, rect.width));
    const clampedY = Math.max(0, Math.min(y - rect.top, rect.height));

    saturation = Math.round((clampedX / rect.width) * 100);
    lightness = 100 - Math.round((clampedY / rect.height) * 100);

    colorSelector.style.left = `${clampedX}px`;
    colorSelector.style.top = `${clampedY}px`;

    updateColor();
}

colorArea.addEventListener("mousedown", e => {
    isDragging = true;
    moveSelector(e.clientX, e.clientY);
});

document.addEventListener("mousemove", e => {
    if (isDragging) {
        moveSelector(e.clientX, e.clientY);
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

hueSlider.addEventListener("input", e => {
    hue = e.target.value;
    updateColorArea();
    updateColor();
});

updateColorArea();
updateColor();
