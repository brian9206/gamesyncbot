# GameSyncBot
[![Add Bot to Server](https://img.shields.io/badge/add%20bot%20on-Discord-7289da.svg)](https://discordapp.com/api/oauth2/authorize?client_id=587610124747800576&permissions=522304&scope=bot)

A simple Discord bot which tracks the current map of game servers.

## Discord Commands (Server admin only)
You can click the badge above to add the bot to your Discord server.

| Command     | Description                                 | Usage                                                   |
|-------------|---------------------------------------------|---------------------------------------------------------|
| !addserver  | Add a game server to the tracking list      | `!addserver <game type> <host>:<port> [color hex code]` |
| !delserver  | Remove a game server from the tracking list | `!delserver <host>:<port>`                              |
| !listserver | List all game servers in the tracking list  | `!listserver`                                           |

[Click here to view all supported game type](https://www.npmjs.com/package/gamedig#supported)

## Discord Commands (Private message)
You can send commands through private message to tell the bot to notify you when a game server changed to certain map.

| Command      | Description                                 | Usage                                                          |
|--------------|---------------------------------------------|----------------------------------------------------------------|
| !addmention  | Add a mention request to your list          | `!addmention <game type> <host>:<port> <map> [color hex code]` |
| !delmention  | Remove a mention request in your list       | `!delmention <host>:<port> <map>`                              |
| !listmention | List all your mention requests              | `!listmention`                                                 |

[Click here to view all supported game type](https://www.npmjs.com/package/gamedig#supported)  
\* You can use `*` to match any tailing string for `<map>`. For example: `ze_ff*` will match all FF maps.

---

## Host your own bot instance
The following instruction is for the one who wants to host your own bot instance on your own computer.

## Usage
1. Rename `.env.example` to `.env`
2. Modify `AUTH_TOKEN` in `.env`
3. `yarn start` or `npm start`

## Docker image
[![](https://images.microbadger.com/badges/version/brian9206/gamesyncbot.svg)](https://microbadger.com/images/brian9206/gamesyncbot "Get your own version badge on microbadger.com")

Default user ID is `1001`
```bash
chown 1001:1001 /some/dir/.env
chown 1001:1001 /some/dir/db

docker run -d \
    -v /some/dir/.env:/app/.env \
    -v /some/dir/db:/app/db \
    brian9206/gamesyncbot
```
