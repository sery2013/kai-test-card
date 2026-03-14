// --- КОНФИГУРАЦИЯ (Замени на свои данные) ---
const DISCORD_CLIENT_ID = "ТВОЙ_CLIENT_ID"; // Берем из Discord Dev Portal
const REDIRECT_URI = window.location.origin + "/api/auth";

// Соответствие ID ролей из Discord названиям на карточке
const ROLE_MAP = {
    "123456789012345678": "Gold",
    "876543210987654321": "Explorer",
    "111222333444555666": "Content Creator Tier 1",
    // Добавь все ID своих ролей здесь
};

let particles = [];
let animationId = null;
let currentAvatarImg = null;
let isGenerating = false;
let scanLineY = 0;

// 1. Авторизация
function loginDiscord() {
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
}

// 2. Обработка данных после логина
async function handleAuth() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    document.getElementById('loaderText').innerText = "Syncing Roles...";
    document.getElementById('discordLoginBtn').style.display = 'none';

    try {
        const response = await fetch(`/api/auth?code=${code}`);
        const data = await response.json();

        if (data.username) {
            document.getElementById('username').value = data.username;
            document.getElementById('statusInfo').style.display = 'block';
            
            // Форматируем дату
            const d = new Date(data.joined_at);
            document.getElementById('date').value = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            // Загружаем аватар
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                currentAvatarImg = img;
                generateCard();
            };
            img.src = data.avatar;

            // Обработка ролей
            const rolesDiv = document.getElementById('roles-hidden');
            rolesDiv.innerHTML = '';
            data.roles.forEach(roleId => {
                const roleName = ROLE_MAP[roleId];
                if (roleName) {
                    const el = document.createElement('span');
                    el.className = 'role-data';
                    el.innerText = roleName;
                    rolesDiv.appendChild(el);
                }
            });

            // Очищаем URL
            window.history.replaceState({}, document.title, "/");
        }
    } catch (err) {
        console.error("Auth error:", err);
        document.getElementById('loaderText').innerText = "Sync Failed!";
    }
}

// 3. Рисование (измененная часть для ролей)
function renderAll(ctx, canvas, avatarImg) {
    // ... (весь твой код отрисовки фона и частиц остается прежним) ...

    // Читаем данные из скрытых полей
    const username = document.getElementById("username").value || "User";
    const date = document.getElementById("date").value || "Joined Date";
    const bioText = document.getElementById("userBio").value || "Sync with Discord to update...";

    // Отрисовка ролей (меняем логику получения)
    const selectedRoles = Array.from(document.querySelectorAll("#roles-hidden .role-data")).map(el => el.innerText);
    
    // ... (дальше идет твоя логика отрисовки ролей и текста, она не меняется) ...
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    initDigitalFlow();
    handleAuth();
});

// (Вставь сюда все остальные свои функции: generateCard, downloadCard, initDigitalFlow, renderAll и т.д.)
// ВНИМАНИЕ: в renderAll убедись, что получение ролей идет через const selectedRoles как я написал выше.
