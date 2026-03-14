export default async function handler(req, res) {
    const { code } = req.query;
    const guildID = "ID_ТВОЕГО_СЕРВЕРА"; // Обязательно замени!

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
                scope: 'identify',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokenData = await tokenResponse.json();
        
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userResponse.json();

        const memberResponse = await fetch(`https://discord.com/api/guilds/${guildID}/members/${userData.id}`, {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        });
        const memberData = await memberResponse.json();

        res.status(200).json({
            username: userData.username,
            avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=256`,
            roles: memberData.roles || [],
            joined_at: memberData.joined_at
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
