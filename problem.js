require("dotenv").config();
const Discord = require('discord.js');
const bodyParser = require('body-parser');
var Twit = require('twit')

var T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET

});


//POSTING DMs TO TWITTER VIA DISCORD
// const client = new Discord.Client();

// client.once('ready', () => {
//     console.log('Ready!');
// });

// client.on('message',message => {
//   if(message.content.startsWith(`!send`)){
//     var array = message.content.split("/");
//     var taker = array[1];
//     var msg = array[2];

//     function heavy_mist(err, data, response) {
//       var rece_id = data[0].id_str;
//       var params = {
//         "event": {
//           "type": "message_create",
//           "message_create": {
//             "target": { "recipient_id": rece_id },
//             "message_data": { "text": msg }
//           }
//         }
//       }

//       T.post("direct_messages/events/new", params, function (
//         err,
//         data,
//         response
//       ) {
//         console.log(data);
//         message.channel.send(`Message sent to @${taker}`);
//       });

//     }
//     T.get('users/lookup', { screen_name: taker }, heavy_mist);

//   }
// })
// client.login(process.env.BOT_TOKEN);



//************************************************************************************** */

//FOR FETCHING DMs
const { Autohook } = require("twitter-autohook");

(async (start) => {
  try {
    const webhook = new Autohook();

    webhook.on("event", async (event) => {
      if (event.direct_message_events) {
        var senderId = event.direct_message_events[0].message_create.sender_id;
        var text = event.direct_message_events[0].message_create.message_data.text;
        T.get("users/show", { user_id: senderId }, function (
          err,
          data,
          response
        ) {
          console.log(data.screen_name + " said " + text);
        });
      }
    });
    await webhook.removeWebhooks();
    await webhook.start();
    await webhook.subscribe({
      oauth_token: process.env.TWITTER_ACCESS_TOKEN,
      oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();


const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message',message => {
    if(message.content.startsWith(`${prefix}kick`)){
        message.channel.send(`You just got a kick beacuse "${prefix}" prefix is presnet`);
    }
})



client.login(process.env.BOT_TOKEN);
