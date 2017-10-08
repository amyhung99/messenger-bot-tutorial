//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48
 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
    // res.send(2039606914)
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id

      if (event.message && event.message.text) {
  	    let text = event.message.text
  	    // if (text === 'Generic') {
  		    // sendGenericMessage(sender)
  		    // continue
  	    // }
  	    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }

      // if (event.postback) {
  	  //   let text = JSON.stringify(event.postback)
  	  //   sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
  	  //   continue
      // }
      //
      if(event.message.attachments[0].type=="location"){
        var lat = event.message.attachments[0].payload.coordinates.lat
        var lng = event.message.attachments[0].payload.coordinates.long
        console.log(lat,lng)
        sendLocationMessage(sender,event)
        // continue
      }
      // else  if(text=="where am i"){
      //   sendLocationPlaceMessage(sender)
      //   continue
      // }

    }
    res.sendStatus(200)
  })
const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
  let messageData = { text:text,
    "quick_replies":[
      {"content_type":"location",}
    ]
  }
  console.log("#############" + sender)

    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "First card",
				    "subtitle": "Element #1 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendLocationMessage(sender,event){
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": 'Location Shared By Bot',
          "subtitle": "Location Subtitle",
          "image_url": "https://maps.googleapis.com/maps/api/staticmap?key=" + "  AIzaSyBFwMNFL402Cy0KUwaSdxw1oXtCAo03MSs" +
          "&markers=color:red|label:B|" + event.message.attachments[0].payload.coordinates.lat + "," + event.message.attachments[0].payload.coordinates.long + "&size=360x360&zoom=13"
        }]
      }
    }

  }

     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendLocationPlaceMessage(sender){
    let messageData = { text:"where are you?",
                      "quick_replies":[
                      {"content_type":"location",}
                    ]
                  }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
