// Weather Icon SVGs
const iconMap = {
    sunny: `<circle cx="50" cy="50" r="30" fill="#FFB84D"/>`,
    
    cloudy: `<path d="M25 60C15 60 10 55 10 45C10 35 20 30 28 30C32 20 40 15 48 15C58 15 66 23 68 35C78 38 85 45 85 55C85 65 78 72 68 72H30C22 72 25 70 25 60Z" fill="#9CA3AF"/>`,
    
    rainy: `
        <path d="M25 55C15 55 10 50 10 40C10 30 20 25 28 25C32 15 40 10 48 10C58 10 66 18 68 30C78 33 85 40 85 50C85 60 78 67 68 67H30C22 67 25 65 25 55Z" fill="#9CA3AF"/>
        <circle cx="35" cy="75" r="4" fill="#60A5FA"/>
        <circle cx="52" cy="80" r="4" fill="#60A5FA"/>
        <circle cx="68" cy="75" r="4" fill="#60A5FA"/>
    `,
    
    stormy: `
        <path d="M25 55C15 55 10 50 10 40C10 30 20 25 28 25C32 15 40 10 48 10C58 10 66 18 68 30C78 33 85 40 85 50C85 60 78 67 68 67H30C22 67 25 65 25 55Z" fill="#4B5563"/>
        <circle cx="35" cy="75" r="4" fill="#60A5FA"/>
        <circle cx="52" cy="80" r="4" fill="#60A5FA"/>
        <circle cx="68" cy="75" r="4" fill="#60A5FA"/>
    `,
    
    thunderstorm: `
        <path d="M25 55C15 55 10 50 10 40C10 30 20 25 28 25C32 15 40 10 48 10C58 10 66 18 68 30C78 33 85 40 85 50C85 60 78 67 68 67H30C22 67 25 65 25 55Z" fill="#2C3E50"/>
        <polygon points="45,70 50,80 48,80 55,95 52,85 60,85" fill="#FFD700"/>
        <polygon points="60,75 65,85 63,85 70,100 67,90 75,90" fill="#FFD700"/>
        <polygon points="30,80 35,90 33,90 40,105 37,95 45,95" fill="#FFD700"/>
        <polygon points="75,70 80,80 78,80 85,95 82,85 90,85" fill="#FFD700"/>
    `,
    
    snowy: `
        <path d="M25 55C15 55 10 50 10 40C10 30 20 25 28 25C32 15 40 10 48 10C58 10 66 18 68 30C78 33 85 40 85 50C85 60 78 67 68 67H30C22 67 25 65 25 55Z" fill="#D1D5DB"/>
        <circle cx="35" cy="75" r="5" fill="white"/>
        <circle cx="52" cy="80" r="5" fill="white"/>
        <circle cx="68" cy="75" r="5" fill="white"/>
    `,
    
    foggy: `<path d="M25 55C15 55 10 50 10 40C10 30 20 25 28 25C32 15 40 10 48 10C58 10 66 18 68 30C78 33 85 40 85 50C85 60 78 67 68 67H30C22 67 25 65 25 55Z" fill="#B0B9C1"/>`,
    
    night: `<path d="M70 20C60 20 52 28 52 38C52 48 60 56 70 56C75 56 80 54 83 50C70 50 60 40 60 30C60 25 62 20 70 20Z" fill="#374151"/>`
};

// AQI Status
function getAQIStatus(value) {
    if (value <= 50) return { status: 'Good', color: '#4caf50' };
    if (value <= 100) return { status: 'Moderate', color: '#8bc34a' };
    if (value <= 150) return { status: 'Unhealthy for Sensitive Groups', color: '#ffc107' };
    if (value <= 200) return { status: 'Unhealthy', color: '#ff9800' };
    if (value <= 300) return { status: 'Very Unhealthy', color: '#ff5722' };
    return { status: 'Hazardous', color: '#f44336' };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateWeatherDisplay();
    setCurrentDate();
});

function setupEventListeners() {
    // Inputs
    document.getElementById('tempInput').addEventListener('input', updateWeatherDisplay);
    document.getElementById('descriptionInput').addEventListener('input', updateWeatherDisplay);
    document.getElementById('aqiSlider').addEventListener('input', (e) => {
        document.getElementById('aqiDisplay').textContent = e.target.value;
        updateWeatherDisplay();
    });
    document.getElementById('humiditySlider').addEventListener('input', (e) => {
        document.getElementById('humidityDisplay').textContent = e.target.value;
        updateWeatherDisplay();
    });
    document.getElementById('windInput').addEventListener('input', updateWeatherDisplay);
    document.getElementById('feelsLikeInput').addEventListener('input', updateWeatherDisplay);
    document.getElementById('pressureInput').addEventListener('input', updateWeatherDisplay);
    document.getElementById('locationInput').addEventListener('input', updateLocation);

    // Warnings
    document.getElementById('addWarningBtn').addEventListener('click', addWarning);
    document.getElementById('warningInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addWarning();
    });

    // Icons
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateWeatherIcon(btn.dataset.icon);
        });
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', resetAll);

    // Set default icon
    document.querySelector('[data-icon="sunny"]').classList.add('active');
}

function updateLocation() {
    const location = document.getElementById('locationInput').value || 'San Francisco';
    document.getElementById('locationName').textContent = location;
}

function setCurrentDate() {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    document.getElementById('locationDate').textContent = date;
}

function updateWeatherDisplay() {
    const temp = document.getElementById('tempInput').value;
    const description = document.getElementById('descriptionInput').value;
    const aqi = parseInt(document.getElementById('aqiSlider').value);
    const humidity = document.getElementById('humiditySlider').value;
    const wind = document.getElementById('windInput').value;
    const feelsLike = document.getElementById('feelsLikeInput').value;
    const pressure = document.getElementById('pressureInput').value;

    // Update display
    document.getElementById('tempDisplay').textContent = temp;
    document.getElementById('weatherDescription').textContent = description;
    document.getElementById('humidity').textContent = humidity + '%';
    document.getElementById('windSpeed').textContent = wind + ' mph';
    document.getElementById('feelsLike').textContent = feelsLike + '°';
    document.getElementById('pressure').textContent = pressure + ' in';

    // Update AQI
    updateAQIDisplay(aqi);
}

function updateAQIDisplay(value) {
    const aqiInfo = getAQIStatus(value);
    document.getElementById('aqiValue').textContent = value + ' · ' + aqiInfo.status;

    // Update bar position
    const percentage = (value / 10000) * 100;
    const aqiBar = document.getElementById('aqiBar');
    aqiBar.style.background = `linear-gradient(90deg, ${aqiInfo.color} ${percentage}%, #e0e0e0 ${percentage}%)`;
}

function updateWeatherIcon(iconType) {
    const iconSVG = iconMap[iconType];
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.innerHTML = iconSVG;
}

function addWarning() {
    const input = document.getElementById('warningInput');
    const warning = input.value.trim();

    if (!warning) return;

    // Add to warnings list in control panel
    const warningsList = document.getElementById('warningsList');
    const warningItem = document.createElement('div');
    warningItem.className = 'warning-item-edit';
    warningItem.innerHTML = `
        <span class="warning-item-text">${escapeHtml(warning)}</span>
        <button class="warning-remove-btn" onclick="this.parentElement.remove(); updateWarningsDisplay();">✕</button>
    `;
    warningsList.appendChild(warningItem);

    input.value = '';
    updateWarningsDisplay();
}

function updateWarningsDisplay() {
    const warnings = Array.from(document.querySelectorAll('.warning-item-text')).map(el => el.textContent);
    const warningsSection = document.getElementById('warningsSection');
    const warningsContainer = document.getElementById('warningsContainer');

    if (warnings.length === 0) {
        warningsSection.style.display = 'none';
    } else {
        warningsSection.style.display = 'block';
        warningsContainer.innerHTML = warnings.map(w => 
            `<div class="warning-item">${escapeHtml(w)}</div>`
        ).join('');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function resetAll() {
    // Reset all inputs
    document.getElementById('tempInput').value = 72;
    document.getElementById('descriptionInput').value = 'Sunny';
    document.getElementById('aqiSlider').value = 50;
    document.getElementById('aqiDisplay').textContent = 50;
    document.getElementById('humiditySlider').value = 45;
    document.getElementById('humidityDisplay').textContent = 45;
    document.getElementById('windInput').value = 8;
    document.getElementById('feelsLikeInput').value = 72;
    document.getElementById('pressureInput').value = 30.12;
    document.getElementById('locationInput').value = '';
    document.getElementById('warningInput').value = '';
    document.getElementById('warningsList').innerHTML = '';

    // Reset icon
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-icon="sunny"]').classList.add('active');

    // Update displays
    updateLocation();
    updateWeatherDisplay();
    updateWeatherIcon('sunny');
    updateWarningsDisplay();
}
