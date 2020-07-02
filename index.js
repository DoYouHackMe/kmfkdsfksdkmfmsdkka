const fs = require("fs");
const mineflayer = require("mineflayer");
const Discord = require("discord.js");
const settings = require("./settings.json");

let client = new Discord.Client();


let helpEmbed = new Discord.RichEmbed()
.setTitle("Help")
.setColor("#f6d443")
.addField("Connect", "connect [all / number] [host]")
.addField("Disconnect", "disconnect [all / username] (sometimes messes up, better use .restart)")
.addField("Message", "message [all / username] [message]")
.addField("Auto message", "automessage [all / username / stop] [interval in seconds] [message]")
.addField("Restart", "restart")
.setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");


let disconnectEmbed;
let messageEmbed;
let args = [];
let account = [];
let botArray = [];
let botNames = [];
let lowerCaseNames = [];

function connect(message, arg) {
  
  lowerCaseNames = [];
  botArray = [];
  botNames = [];

  
  var list = fs.readFileSync("./alts.txt", "utf-8").split("\r\n");
  
  if (args[1] === "all") {
    let embed = new Discord.RichEmbed()
    .setTitle("Connected accounts [0] -> " + arg)
    .setDescription("None")
    .setColor("#f6d443")
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");
    
    message.channel.send(embed).then(msg => {
      for (let i = 0; i < list.length; i++) {
        setTimeout(() => {
          account = list[i].split(":");
          let bot = mineflayer.createBot({
            username: account[0],
            password: account[1],
            host: arg,
            version: settings.version,

            plugins: {
              conversions: false,
              furnace: false,
              math: false,
              painting: false,
              scoreboard: false,
              villager: false,
              bed: false,
              book: false,
              boss_bar: false,
              chest: false,
              command_block: false,
              craft: false,
              digging: false,
              dispenser: false,
              enchantment_table: false,
              experience: false,
              rain: false,
              ray_trace: false,
              sound: false,
              tablist: false,
              time: false,
              title: false,
              physics: false,
              blocks: false,
              block_actions: false
            }
          });
          bot.on("login", () => {
            
            lowerCaseNames.push(bot.username.toLowerCase()) // used for the message function
            botArray.push([bot, account[0], account[1]]); // data is set up for the possible future auto reconnect
            botNames.push(bot.username);
            msg.edit(embed.setDescription(botNames.join("\n")).setTitle("Connected accounts [" + botArray.length + "] -> " + arg));
          });
          bot.on('kicked', (reason) => {
            lowerCaseNames.splice(lowerCaseNames.indexOf(bot.username.toLowerCase()), 1)
            botArray.splice(botArray.indexOf(bot), 1);
            botNames.splice(botNames.indexOf(bot.username), 1);
            msg.edit(embed.setDescription(botNames.join("\n")).setTitle("Connected accounts [" + botArray.length + "] -> " + arg));
          })
          bot.on('end', () => {
            lowerCaseNames.splice(lowerCaseNames.indexOf(bot.username.toLowerCase()), 1)
            botArray.splice(botArray.indexOf(bot), 1);
            botNames.splice(botNames.indexOf(bot.username), 1);
            msg.edit(embed.setDescription(botNames.join("\n")).setTitle("Connected accounts [" + botArray.length + "] -> " + arg));
          })
        }, i * settings.interval);
      }
    });
  }
  
  if (args[1].match(/^[0-9]*$/gm)) {
    if (args[1] > list.length) return message.channel.send("There isn't enough alts!");
    let embed = new Discord.RichEmbed()
    .setTitle("Connected accounts [0] -> " + arg)
    .setDescription("None")
    .setColor("#f6d443")
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");
    
    message.channel.send(embed).then(msg => {
      for (let i = 0; i < args[1]; i++) {
        setTimeout(() => {
          account = list[i].split(":");
          let bot = mineflayer.createBot({
            username: account[0],
            password: account[1],
            host: arg,
            version: settings.version,
            plugins: {
              chest: false,
              conversions: false,
              dispenser: false,
              enchantment_table: false,
              furnace: false,
              math: false,
              painting: false,
              scoreboard: false,
              scoreboard: false,
              villager: false,
              bed: false,
              block_actions: false,
              blocks: false,
              book: false,
              boss_bar: false,
              chest: false,
              command_block: false,
              craft: false,
              digging: false,
              dispenser: false,
              enchantment_table: false,
              experience: false,
              furnace: false,
              physics: false,
              rain: false,
              ray_trace: false,
              scoreboard: false,
              simple_inventory: false,
              sound: false,
              tablist: false,
              time: false,
              title: false,
              villager: false
            }
          });
          bot.on("login", () => {

            bot.settings.viewDistance = "tiny"
            bot.settings.colorsEnabled = false;

            lowerCaseNames.push(bot.username.toLowerCase()) // used for the message function
            botArray.push([bot, account[0], account[1]]); // data is set up for the possible future auto reconnect
            botNames.push(bot.username);
            
            msg.edit(embed.setDescription(botNames.join("\n")).setTitle("Connected accounts [" + botArray.length + "] -> " + arg));
          });
          bot.on('kicked', (reason) => {
            lowerCaseNames.splice(lowerCaseNames.indexOf(bot.username.toLowerCase()), 1)
            botArray.splice(botArray.indexOf(bot), 1);
            botNames.splice(botNames.indexOf(bot.username), 1);
            msg.edit(embed.setDescription(botNames.join("\n")).setTitle("Connected accounts [" + botArray.length + "] -> " + arg));
          })
          bot.on('end', () => {
            lowerCaseNames.splice(lowerCaseNames.indexOf(bot.username.toLowerCase()), 1)
            botArray.splice(botArray.indexOf(bot), 1);
            botNames.splice(botNames.indexOf(bot.username), 1);
            msg.edit(embed.setDescription(botNames.join("\n")).setTitle("Connected accounts [" + botArray.length + "] -> " + arg));
          })

        }, i * settings.interval);
      }
    });
  }
}

function messageCommand(arg, message) {
  
  if(arg === "all") {

    messageEmbed = new Discord.RichEmbed()
    .addField("Message", message + " sent to ALL bots")
    .setColor("#f6d443")
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");


    for(let i = 0; i < botNames.length; i++) {
      setTimeout(()=> {
        
        botArray[i][0].chat(message)
        
      }, i * settings.timeBetweenMessages)
    }
  }
  

  if(lowerCaseNames.includes(arg)) {

    messageEmbed = new Discord.RichEmbed()
    .addField("Message", message + " sent to " + arg)
    .setColor("#f6d443")
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");

    for(let i = 0; i < lowerCaseNames.length; i++) {
      
      if(lowerCaseNames[i] === arg) return botArray[i][0].chat(message);
      
    }
  }
} 



function disconnect(arg) {
  
  if(arg === "all") {

    disconnectEmbed = new Discord.RichEmbed()
    .addField("Disconnect", "Disconnected ALL bots")
    .setColor("#f6d443")
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");

    for(let i = 0; i < botNames.length; i++) {
      
      botArray[i][0].end();
      
  }
}

  if(lowerCaseNames.includes(arg.toLowerCase())) {
    
    disconnectEmbed = new Discord.RichEmbed()
    .addField("Disconnect", "Disconnected " + arg)
    .setColor("#f6d443")
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK");



    for(let i = 0; i < botNames.length; i++) {
      
      if(lowerCaseNames[i] === arg.toLowerCase()) return botArray[i][0].end();

    }
  }
}

 
// automessage all 60 meesage meesage meesage meesage meesage meesage 

var autoMsgLoop;

function autoMessage(discordMessageVar, args) {
  if(args[1] === "all") {
    
    if(botNames.length === 0) return discordMessageVar.channel.send("No bots are connected")
    
    if(!args[2].match(/^[0-9]*$/gm) && !args[3] && !args[4]) return discordMessageVar.channel.send(helpEmbed);
    let content = args.slice(3).join(" ")

    let embed = new Discord.RichEmbed()
    .setColor("#f6d443")
    .setTitle("Sent 0 times to ALL bots")
    .setDescription(content)
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK")
    .setTimestamp();

    discordMessageVar.channel.send(embed).then((msg)=> {
      let counter = 0;
    autoMsgLoop = setInterval(()=> {
      for(let i = 0; i < botNames.length; i++) {
        botArray[i][0].chat(content)

      }
      counter++
      msg.edit(embed.setTitle("Sent " + counter + " times to ALL bots").setTimestamp())

    }, args[2] * 1000)

  })
  }

  if(lowerCaseNames.includes(args[1].toLowerCase())) {

    if(!args[2].match(/^[0-9]*$/gm) && !args[3] && !args[4]) return discordMessageVar.channel.send(helpEmbed);
    let content = args.slice(3).join(" ")

    let embed = new Discord.RichEmbed()
    .setColor("#f6d443")
    .setTitle("Sent 0 times to " + args[1])
    .setDescription(content)
    .setFooter("Hadan Bots -> https://discord.gg/dYdJtSK")
    .setTimestamp();



    discordMessageVar.channel.send(embed).then((msg)=> {
      let counter = 0;
    autoMsgLoop = setInterval(()=> {
      for(let i = 0; i < lowerCaseNames.length; i++) {
        if(botArray[i][0].username.toLowerCase() === args[1].toLowerCase()) {

          botArray[i][0].chat(content)

        }
      }
      counter++
      msg.edit(embed.setTitle("Sent " + counter + " times to" + args[1]).setTimestamp())

    }, args[2] * 1000)

  })
  }

  if(args[1] === "stop") {
    
    clearInterval(autoMsgLoop)
    discordMessageVar.channel.send("Stopped the loop")

  }
}





client.on("message", message => {

//whitelist

  if(!settings.whitelist.includes(message.author.id)) return;


  if (!message.content.startsWith(settings.prefix)) return;
  if (message.author.bot) return;
  
  args = message.content.toLowerCase().substring(settings.prefix.length).split(" ");
  
  switch (args[0]) {
    case "connect":

      if (args[1] === undefined || args[2] === undefined) return message.channel.send(helpEmbed);
      connect(message, args[2]);


    break;
      

    case "help":
        
      message.channel.send(helpEmbed)
        

    break;
        

    case "restart": 
      message.channel.send("Bot will restart in a couple of seconds!")
      setTimeout(() => {
        process.exit();
    }, 500)


    break;
    

    case "message":

      if(args[1] === undefined || args[2] === undefined) return message.channel.send(helpEmbed);

      let content = args.slice(2).join(" ")

      messageCommand(args[1], content)
      message.channel.send(messageEmbed);


    break;
      

    case "disconnect":

    if(args[1] === undefined) return message.channel.send(helpEmbed);
    disconnect(args[1])
    message.channel.send(disconnectEmbed);
    break;
    case "automessage":

    autoMessage(message, args)

    break;

    default:
      message.channel.send(helpEmbed);
    }
  });
  
  client.on("ready", () => {
  console.log("ready");
});

client.login(settings.token);
