const https = require('https');
const fs = require('fs');

// Load up the discord.js library
const { Client, MessageAttachment, MessageEmbed } = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }


  // NASA Astronomy Picture Of the Day
  if (command === "apod") {

    if(args.length >1){

      var dateString = args.join("-");

      var outDate = dateString;


    }else{


    var dateString = args[0];


    if (dateString === undefined) {

      var sl0 = Date.now();
      var date_ob = new Date(sl0);
      // year as 4 digits (YYYY)
      var year = date_ob.getFullYear();
      // month as 2 digits (MM)
      var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      // date as 2 digits (DD)
      var date = ("0" + date_ob.getDate()).slice(-2);
      // date as YYYY-MM-DD format
      var outDate = year + "-" + month + "-" + date;

    } else {

      switch (dateString) {

        case "yesterday":

          var sl0 = Date.now();
          var date_ob = new Date(sl0);
          // year as 4 digits (YYYY)
          var year = date_ob.getFullYear();
          // month as 2 digits (MM)
          var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          // date as 2 digits (DD)
          var date0 = date_ob.getDate();
          var date0 = date0 - 1;
          var date = ("0" + date0).slice(-2);
          // date as YYYY-MM-DD format
          var outDate = year + "-" + month + "-" + date;
          break;


        case "today":
          // initialize new Date object
          var sl0 = Date.now();
          var date_ob = new Date(sl0);
          // year as 4 digits (YYYY)
          var year = date_ob.getFullYear();
          // month as 2 digits (MM)
          var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          // date as 2 digits (DD)
          var date = ("0" + date_ob.getDate()).slice(-2);
          // date as YYYY-MM-DD format
          var outDate = year + "-" + month + "-" + date;
          break;

        case "onemonthago":
          // initialize new Date object
          var sl0 = Date.now();
          var date_ob = new Date(sl0);
          // year as 4 digits (YYYY)
          var year = date_ob.getFullYear();
          // month as 2 digits (MM)
          var month0 = (date_ob.getMonth() + 1);
          var month0 = month0 - 1;
          var month = ("0" + month0).slice(-2);
          // date as 2 digits (DD)
          var date = ("0" + date_ob.getDate()).slice(-2);
          // date as YYYY-MM-DD format
          var outDate = year + "-" + month + "-" + date;

          break;

        case "oneyearago":

          var sl0 = Date.now();
          var date_ob = new Date(sl0);
          // year as 4 digits (YYYY)
          var year = date_ob.getFullYear();
          var year = year - 1;
          // month as 2 digits (MM)
          var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          // date as 2 digits (DD)
          var date = ("0" + date_ob.getDate()).slice(-2);
          // date as YYYY-MM-DD format
          var outDate = year + "-" + month + "-" + date;

          break;

        case "tenyearsago":
          var sl0 = Date.now();
          var date_ob = new Date(sl0);
          // year as 4 digits (YYYY)
          var year = date_ob.getFullYear();
          var year = year - 10;
          // month as 2 digits (MM)
          var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          // date as 2 digits (DD)
          var date = ("0" + date_ob.getDate()).slice(-2);
          // date as YYYY-MM-DD format
          var outDate = year + "-" + month + "-" + date;

          break;



      }

    }
  }
    var urlfinal = `https://api.nasa.gov/planetary/apod?api_key=${config.nasa_apikey}&thumbs=true&hd=true&date=` + outDate;


    let url = new URL(urlfinal);


    https.get(url, (res) => {
      const { statusCode } = res;
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
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }
    
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
    	  let embed = new MessageEmbed()
			.setTitle(parsedData.title)
			.setColor(0xf4f4ff)
		        .setDescription(`${parsedData.explanation}`)
		        .setTimestamp(new Date())
		        .setURL(parsedData.url)
		        .setAuthor(`NASA Astronomy Picture Of the Day`)
		        .setFooter(`Media type: ${parsedData.media_type}`)
		        .setThumbnail(parsedData.thumbnail_url)
		        .addField("APOD date", parsedData.date)

   	  if(parsedData.media_type !== "video") {
		if(parsedData.hasAttribute("hdurl")) {
			embed.setImage(parsedData.hdurl)
			     .setURL(parsedData.hdurl)
		} else{
			embed.setImage(parsedData.url)
		}
	  }
		        
	  message.channel.send(embed);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }


});

client.login(config.token);
