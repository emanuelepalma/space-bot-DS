# Discord Space bot 

This is a simple Discord bot to monitor stars and satellite.

## Supported commands

`>help` will provide a complete list of commands directly on Discord.

## Start

To start the bot you will need to generate a bot token from the Discord Developer site, then invite the bot to your server. 

- setup [Discord App](https://discordpy.readthedocs.io/en/latest/discord.html)
- get [NASA API key](https://api.nasa.gov/)

Create a `config.json` file:
```
{
  "token": "DISCORD-TOKEN",
  "prefix": "@SpaceBot",
  "nasa_apikey": "NASA_APIKEY"
}
```

Then start the app:
```
npm start
```

## Development

```
npm install 
```
