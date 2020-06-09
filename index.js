// Load up the discord.js library
const { Client, MessageEmbed } = require("discord.js");
const { get_apod_date, rest_request } = require("lib.js");

async function do_ping(message, args) {
      // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
}

function do_apod(message, args) {

    let outDate = get_apod_date(args)
    let url = `https://api.nasa.gov/planetary/apod?api_key=${config.nasa_apikey}&thumbs=true&hd=true&date=${outDate}`;

    rest_request(url).then(parsedData => {
      let embed = new MessageEmbed()
         .setTitle(parsedData.title)
         .setColor(0xf4f4ff)
         .setDescription(parsedData.explanation)
         .setTimestamp(new Date())
         .setURL(parsedData.url)
         .setAuthor("NASA Astronomy Picture Of the Day")
         .setFooter(`Media type: ${parsedData.media_type}`)
         .setThumbnail(parsedData.thumbnail_url)
         .addField("APOD date", parsedData.date)

      if (parsedData.media_type !== "video") {
        if (parsedData.hasOwnProperty("hdurl")) {
          embed.setImage(parsedData.hdurl)
             .setURL(parsedData.hdurl)
        } else {
          embed.setImage(parsedData.url)
        }
      }
      message.channel.send(embed).catch(console.error)
    }, err => {
      message.channel.send("REQUEST FAILED");
      console.error(err)
    })
}

function show_help (message, args) {
  let commands = Object.keys(capabilities)
  commands = commands.map(command => {
    return `${command}: ${capabilities[command]["help"]}`
  })
  message.channel
     .send(`Supported commands are:\n\n${commands.join("\n")}`)
     .catch(console.error)
}

const capabilities = {
  help : {
    worker : show_help,
    help : "display this message"
  },
  ping : {
    worker : do_ping,
    help : "test latency"
  },
  apod : {
    worker : do_apod,
    help : "get NASA Astronomy Picture Of the Day"
  }
}



// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => console.log("Ready!"));

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // check for command against the keys of capability object.
  // If command is a valid key execute the worker function
  if (Object.keys(capabilities).indexOf(command) !== -1) {
    capabilities[command]["worker"](message, args);
  }

});

client.login(config.token);
