# GameSyncBot
A simple Discord bot which tracks the current map of game servers.

## Commands
| Command     | Description                                 | Usage                                                 |   |   |
|-------------|---------------------------------------------|-------------------------------------------------------|---|---|
| !addserver  | Add a game server to the tracking list      | !addserver <game type> <host>:<port> [color hex code] |   |   |
| !delserver  | Remove a game server from the tracking list | !delserver <host>:<port>                              |   |   |
| !listserver | List all game servers in the tracking list  | !listserver                                           |   |   |

## Usage
1. Rename `.env.example` to `.env`
2. Modify `AUTH_TOKEN` in `.env`
3. `yarn start` or `npm start`
