// --- КОНФИГУРАЦИЯ ---
const DISCORD_CLIENT_ID = "ТВОЙ_ID"; 
const ROLE_MAP = {
    "111222333": "Gold",
    "444555666": "Explorer",
    "777888999": "Content Creator Tier 1"
};

let particles = [];
let animationId = null;
let currentAvatarImg = null;
let isGenerating = false;
let scanLineY = 0;

// Инициализация частиц фона
function initDigitalFlow() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * 800,
            y: Math.random() * 400,
            speed: Math.random() * 1.5 + 0.5,
            length: Math.random() * 80 + 30,
            opacity: Math.random() * 0.4
        });
    }
}

// Авторизация
function loginDiscord() {
    const redirectUri = encodeURIComponent(window.location.origin + "/api/auth");
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
}

// Проверка URL на наличие кода после логина
async function handleAuth() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    document.getElementById('loaderText').innerText = "SYNCING DATA...";
    
    try {
        const response = await fetch(`/api/auth?code=${code}`);
        const data = await response.json();

        if (data.username) {
            document.getElementById('username').value = data.username;
            const d = new Date(data.joined_at);
            document.getElementById('date').value = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            // Сохраняем роли в скрытый див
            const rolesDiv = document.getElementById('roles-hidden');
            rolesDiv.innerHTML = '';
            data.roles.forEach(id => {
                if (ROLE_MAP[id]) {
                    const span = document.createElement('span');
                    span.innerText = ROLE_MAP[id];
                    rolesDiv.appendChild(span);
                }
            });

            // Загрузка аватара
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                currentAvatarImg = img;
                generateCard();
            };
            img.src = data.avatar;

            window.history.replaceState({}, document.title, "/");
        }
    } catch (e) {
        console.error(e);
        document.getElementById('loaderText').innerText = "AUTH FAILED";
    }
}

function generateCard() {
    const canvas = document.getElementById("cardCanvas");
    const skeleton = document.getElementById("skeleton");
    canvas.style.display = "block";
    skeleton.style.display = "none";

    isGenerating = true;
    setTimeout(() => isGenerating = false, 2500);

    const ctx = canvas.getContext("2d");
    if (particles.length === 0) initDigitalFlow();
    
    function frame() {
        renderAll(ctx, canvas, currentAvatarImg);
        animationId = requestAnimationFrame(frame);
    }
    if (animationId) cancelAnimationFrame(animationId);
    frame();
}

function renderAll(ctx, canvas, avatarImg) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем твои частицы
    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > 400) p.y = -p.length;
        ctx.strokeStyle = `rgba(255, 122, 24, ${p.opacity})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.length); ctx.stroke();
    });

    // Данные
    const name = document.getElementById('username').value || "User";
    const date = document.getElementById('date').value || "Date";
    const bio = document.getElementById('userBio').value || "ORO Explorer";

    // Отрисовка аватара
    ctx.strokeStyle = "rgba(255, 122, 24, 0.7)";
    ctx.strokeRect(25, 70, 140, 140);
    if (avatarImg) ctx.drawImage(avatarImg, 26, 71, 138, 138);

    // Имя и дата
    ctx.fillStyle = "white"; ctx.font = "bold 30px Fredoka";
    ctx.fillText("USER CARD", 25, 45);
    
    ctx.font = "bold 24px Fredoka";
    ctx.fillText(name, 205, 100);
    ctx.fillStyle = "#aaa"; ctx.font = "18px Fredoka";
    ctx.fillText("Joined: " + date, 205, 152);

    // Роли из скрытого дива
    const roles = Array.from(document.querySelectorAll("#roles-hidden span")).map(s => s.innerText);
    let x = 185;
    roles.forEach(role => {
        ctx.fillStyle = "#ff7a18";
        ctx.font = "bold 13px Fredoka";
        const w = ctx.measureText(role).width + 20;
        ctx.beginPath(); ctx.roundRect(x, 180, w, 25, 6); ctx.fill();
        ctx.fillStyle = "white"; ctx.fillText(role, x + 10, 197);
        x += w + 10;
    });

    // Эффект сканирования
    if (isGenerating) {
        scanLineY = (scanLineY + 5) % 400;
        ctx.fillStyle = "rgba(255, 122, 24, 0.3)";
        ctx.fillRect(0, scanLineY, canvas.width, 2);
    }
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "oro-card.png";
    link.href = canvas.toDataURL();
    link.click();
}

window.onload = () => {
    initDigitalFlow();
    handleAuth();
};
