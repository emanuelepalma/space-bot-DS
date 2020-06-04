// Load up the discord.js library
const { Client, MessageEmbed } = require("discord.js");

const https = require('https');

function rest_request(url) {
  let prom = new Promise((resolve, reject) => {
    https.get(url, (res) => {

      const {statusCode} = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
           `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
           `Expected application/json but received ${contentType}`);
      }
      if (error) {
        // Consume response data to free up memory
        res.resume();
        reject(error)
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        console.log(chunk)
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData)
          resolve(parsedData)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', (e) => {
      reject(e)
    });
  })
  return (prom)
}

function get_random_date(startDate, endDate) {
    if(!startDate) startDate = new Date();
    if(!endDate) endDate = new Date();

    let diff = endDate.getTime() - startDate.getTime();
    return new Date(Math.random() * diff + startDate.getTime());
}

function format_date(date_ob) {
  // year as 4 digits (YYYY)
  let year = date_ob.getFullYear();
  // month as 2 digits (MM)
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // date as 2 digits (DD)
  let day = ("0" + date_ob.getDate()).slice(-2);
  // date as YYYY-DD-MM format
  outDate = `${year}-${month}-${day}`;
  return (outDate)
}

function get_apod_date(args) {
  let d = new Date();

  // >apod 2 days ago or >apod 2 months ago or >apod 6 years ago
  if (args.length >= 3 &&
     /[0-9]+/.test(args[0]) &&
     ["days", "months", "years"].indexOf(args[1]) !== -1 &&
     args[2] === "ago"
  ) {

    let num = parseInt(args[0])

    switch (args[1]) {
      case "days":
        d.setDate(d.getDate() - num);
        break;
      case "months":
        d.setMonth(d.getMonth() - num);
        break;
      case "years":
        d.setFullYear(d.getFullYear() - num);
        break;
    }

  // >apod mm-dd-yyyy or mm-dd-yy
  } else if (!isNaN(Date.parse(args[0]))) {
    // we search for the specific date
    d = new Date(Date.parse(args[0]));

  // >apod yesterday
  } else if (args[0] === "yesterday") {
    d.setDate(d.getDate() - 1);

  // >apod first
  } else if (args[0] === "first") {
    d = new Date("1995-06-16");

  } else if (args[0] == "random") {
    d = get_random_date(new Date("1995-06-16"))

  // >apod last month or >apod last year
  } else if (args[0] == "last" &&
     ["month", "year"].indexOf(args[1]) !== -1) {

    switch (args[1]) {
      case "month":
        d.setMonth(d.getMonth() - 1);
        break;
      case "year":
        d.setFullYear(d.getFullYear() - 1);
        break;
    }
  }
  return format_date(d)
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

  // Let's go with a few common example commands! Feel free to delete or change those.

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
  }

  // NASA Astronomy Picture Of the Day
  if (command === "apod") {

    let outDate = get_apod_date(args)
    let url = `https://api.nasa.gov/planetary/apod?api_key=${config.nasa_apikey}&thumbs=true&hd=true&date=${outDate}`;

    rest_request(url).then((parsedData) => {
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
      message.channel.send(embed);
    }, (err) => {
      message.channel.send("REQUEST FAILED");
      console.error(err)
    })
  }
});

client.login(config.token);
