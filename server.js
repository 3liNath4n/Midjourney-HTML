const http = require('http');
const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const dotenv = require('dotenv');

dotenv.config()

const client = new Client({
    checkUpdate: false,
});

client.on('message', async (message) => {
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});

function mj(text) {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    channel.sendSlash(process.env.BOT_ID, 'imagine', text);
}

http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/submit") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const params = new URLSearchParams(body);
            const text = params.get("input");
            console.log(text);
            mj(text);

            res.writeHead(200, { "Content-Type": "text/html" });
            const html = fs.readFileSync("./index.html");
            res.end(html);
        });
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        const html = fs.readFileSync("./index.html");
        res.end(html);
    }

}).listen(3000, () => {
    console.log('Server is running on port 3000');
});

client.login(process.env.TOKEN);