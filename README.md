# GameSyncBot
[![Add Bot to Server](https://img.shields.io/badge/add%20bot%20on-Discord-7289da.svg)](https://discordapp.com/api/oauth2/authorize?client_id=587610124747800576&permissions=522304&scope=bot)

A simple Discord bot which tracks the current map of game servers.

## Commands
| Command     | Description                                 | Usage                                                 |
|-------------|---------------------------------------------|-------------------------------------------------------|
| !addserver  | Add a game server to the tracking list      | `!addserver <game type> <host>:<port> [color hex code]` |
| !delserver  | Remove a game server from the tracking list | `!delserver <host>:<port>`                              |
| !listserver | List all game servers in the tracking list  | `!listserver`                                           |

## Usage
1. Rename `.env.example` to `.env`
2. Modify `AUTH_TOKEN` in `.env`
3. `yarn start` or `npm start`

## Docker usage
Default user ID is `1001`
```bash
chown 1001:1001 /some/dir/.env
chown 1001:1001 /some/dir/db

docker run -d \
    -v /some/dir/.env:/app/.env \
    -v /some/dir/db:/app/db \
    brian9206/gamesyncbot
```

