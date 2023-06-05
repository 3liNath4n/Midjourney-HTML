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

    //wait until the bot responds with an image.
    client.on('message', async (message) => {
        //if the message is from the bot and has an attachment and mentions the self bot
        if (message.author.id === process.env.BOT_ID && message.attachments.size > 0 && message.mentions.has(client.user)) {
            //get the image media link from the bot's response
            const image = message.attachments.first().url;
            //send the image to the channel
            channel.send(image);
            console.log("IMAGE RECEIVED");


            //the image slot is called imagePlaceholder, so replace the src of the imagePlaceholder with the image link
            const html = fs.readFileSync("./index.html", "utf8");
            //replace the src of the imagePlaceholder with the image link
            const newHtml = html.replace('imagePlaceholder', image);
            //write the new html to the file
            fs.writeFileSync("./index.html", newHtml);

            //once the program terminates, revert the html file back to the original
            process.on('SIGINT', function () {
                const html = fs.readFileSync("./index.html", "utf8");
                const newHtml = html.replace(image, 'imagePlaceholder');
                fs.writeFileSync("./index.html", newHtml);
                process.exit();
            });

        }
    });

}

let server = http.createServer((req, res) => {
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

});


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

client.login(process.env.TOKEN);