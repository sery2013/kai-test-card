Что нужно сделать в Vercel:
Зайди в настройки проекта в Vercel -> Environment Variables.

Добавь следующие переменные:

DISCORD_CLIENT_ID (из Discord Dev Portal)

DISCORD_CLIENT_SECRET (из Discord Dev Portal)

DISCORD_BOT_TOKEN (токен твоего бота)

DISCORD_REDIRECT_URI (например: https://твой-сайт.vercel.app/api/auth)


в файле script.js   замени в const DISCORD_CLIENT_ID = "ТВОЙ_ID"; 
