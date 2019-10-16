//import 'source-map-support/register';

// load dotenv
require('dotenv').config();

import Discord from 'discord.js';
import Datastore from 'nedb-promises';
import Gamedig from 'gamedig';
import db from './database';

import sendGameServerMessage from './sendGameServerMessage';
import sendMentionMessage from './sendMentionMessage';
import addserver from './commands/addserver';
import delserver from './commands/delserver';
import listserver from './commands/listserver';
import addmention from './commands/addmention';
import delmention from './commands/delmention';
import listmention from './commands/listmention';

// init cache
const cache = Datastore.create();

// init discord client
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Discord bot connected as ${client.user.tag}`);
    
    client.user.setPresence({
        game: { 
            name: 'Source code: github.com/brian9206/gamesyncbot'
        },
        status: 'online' 
    });
});

client.on('message', msg => {
    if (!msg.content.startsWith('!')) {
        return;
    }

    // parse user input
    const [ , command, _args ] = msg.content.match(/^!([^ ]+) ?(.*)$/);
    const args = _args.match(/("[^"]+"|[^\s"]+)/g);

    // not a private message?
    if (msg.member) {
        // not guild admin?
        if (!msg.member.hasPermission('MANAGE_GUILD')) {
            return;
        }

        switch (command) {
            case 'addserver':
                addserver(msg, args);
                break;
    
            case 'delserver':
                delserver(msg, args);
                break;
    
            case 'listserver':
                listserver(msg);
                break;
        }
    }

    // this is a private message?
    else {
        switch (command) {
            case 'addmention':
                addmention(msg, args);
                break;
    
            case 'delmention':
                delmention(msg, args);
                break;

            case 'listmention':
                listmention(msg);
                break;

            default:
                msg.send('Oops, no such command. You can check my manual in my GitHub repository\nhttps://github.com/brian9206/gamesyncbot');
                break;
        }
    }
});

// load database and connect
client.login(process.env.AUTH_TOKEN).then(() => {
    // tracker timer
    async function onTimer() {
        const servers = {};

        // find all tracking servers
        let docs = await db.find();

        docs.forEach(doc => {
            const key = `${doc.host}:${doc.port}`;

            if (servers.hasOwnProperty(key)) {
                servers[key].push(doc);
            }
            else {
                servers[key] = [doc];
            }
        });

        // find all mention requests
        docs = await db.mention.find();

        docs.forEach(doc => {
            const key = `${doc.host}:${doc.port}`;

            if (servers.hasOwnProperty(key)) {
                servers[key].push(doc);
            }
            else {
                servers[key] = [doc];
            }
        });

        // query all servers
        const results = await Promise.all(Object.keys(servers).map(key => new Promise(async resolve => {
            const { host, port, type } = servers[key][0];

            try {
                console.log(`Querying ${host}:${port} - ${type}...`);
                const srv = await Gamedig.query({ host, port, type });
                
                // check cache
                const doc = await cache.findOne({ host, port });
                resolve({ ...srv, docs: servers[key], announce: !doc || doc.map !== srv.map });

                // update cache
                cache.update({ host, port }, { 
                    host,
                    port,
                    map: srv.map,
                    time: new Date()
                }, {
                    multi: true,
                    upsert: true
                });
                
                console.log(`${host}:${port} - ${type} is playing ${srv.map}`);
            }
            catch (err) {
                resolve({ docs: servers[key], announce: false });
                //cache.remove({ host, port }); // removed to reduce bot noise
                console.log(`${host}:${port} - ${type} is currently offline.`);
            }
        })));

        results
            .filter(result => result.announce)
            .forEach(srv => {
                srv.docs.forEach(async doc => {
                    // this is a channel tracking?
                    if (doc.channel) {
                        const channel = client.channels.get(doc.channel);

                        if (!channel) {
                            return;
                        }
    
                        sendGameServerMessage(channel, srv, doc.host, doc.port, doc.type, doc.color);
                    }
                    
                    // this is a mention request?
                    else if (doc.user) {
                        // check user requested map
                        if (doc.map.toLowerCase() !== srv.map.toLowerCase()) {
                            if (doc.map.endsWith('*')) {
                                const map = doc.map.substring(0, doc.map.length - 1);

                                if (!srv.map.toLowerCase().startsWith(map.toLowerCase())) {
                                    return;
                                }
                            }
                            else {
                                return;
                            }
                        }

                        try {
                            const user = await client.fetchUser(doc.user);
                            sendMentionMessage(user, srv, doc.host, doc.port, doc.type, doc.color);
                        }
                        catch (err) {
                            return;
                        }
                    }
                    
                });
            });
    }

    setInterval(onTimer, process.env.UPDATE_FREQ * 1000);
    onTimer();
}).catch(err => {
    console.error('Discord login fails', err);
    process.exit(1);
});
