// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require ('axios');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'comm493group3@gmail.com',
        pass: 'commerce493'
    }
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  

 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function RefundRequestHandler(agent){
    const {
      name, email, reason
    } = agent.parameters;
    const data = [{
      Name: name,
      Email: email,
      Complaint: reason
      
    }];
    axios.post('https://sheet.best/api/sheets/469f3796-30dd-4b51-8c9e-e721d802239e', data); 
  	 const mailOptions = {
        from: "Urban Closet", // sender address
        to: email, // list of receivers
        subject: "Urban Closet Support Team", // Subject line
        html: `<p> Hello ${name}, </p>
                <p> Your Ticket has been created.<br />
                Our support representative will contact you soon.<br />
                Ticket Details are, <br />
                Name: ${name}<br />
                Reason: ${reason}<br />
                
                <br />
                Sincerely,<br />
                <br />
                <br />
                Team 3<br />
                <i>COMM 493</i></p>`
    };
    
     transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        {
          console.log(err);
        }
    });
  
  }
  

  	function OTrackOnumHandler(agent) {
    const {onumber }= agent.parameters;
    function getSpreadsheetData(){
    return axios.get('https://sheetdb.io/api/v1/cf4anvsxmwkjn');
  }
    return getSpreadsheetData().then(res => {
      res.data.map(person => {
        if(person.Onumber === onumber)
        agent.add(`Item # ${person.Order_Item} Product ID: ${person.Product_ID}, Product : ${person.Product}, Ship Date: ${person.Ship_Date} Order Status: ${person.Status} ` ); 
      });
    });
  }
  	function ExchangeRequestHandler(agent) {
    const {name, email, reason
    } = agent.parameters;
    const data = [{
      Name: name,
      Email: email,
      Complaint: reason
      
    }];
    axios.post('https://sheet.best/api/sheets/469f3796-30dd-4b51-8c9e-e721d802239e', data); 
  	 const mailOptions = {
        from: "Urban Closet", // sender address
        to: email, // list of receivers
        subject: "Urban Closet Support Team", // Subject line
        html: `<p> Hello ${name}, </p>
                <p> Your Ticket has been created.<br />
                Our support representative will contact you soon.<br />
                Ticket Details are, <br />
                Name: ${name}<br />
                Reason: ${reason}<br />
               
                <br />
                Sincerely,<br />
                <br />
                <br />
                Team 3<br />
                <i>COMM 493</i></p>`
    };
    
     transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        {
          console.log(err);
        }
    });
  
  }
	function StoreHoursLocationHandler(agent) {
    const {city}= agent.parameters; 
    function getstorehourslocation(){
    return axios.get('https://sheetdb.io/api/v1/9hxleyuk1vccu');
    
 }
    return getstorehourslocation().then(res => {
      res.data.map(store => {
        if(store.City === city)
        agent.add(`In ${city}, our store Address is ${store.Address}, ${city}. Opening Hours: ${store.Hours}.  Phone: ${store.Phone} ` ); 
      });
    });
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Refund Request - no' , RefundRequestHandler );
  intentMap.set('Order Tracking', OTrackOnumHandler);
  intentMap.set('Exchange Request - no', ExchangeRequestHandler);
  intentMap.set('Hours & Location',StoreHoursLocationHandler);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
