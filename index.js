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
  
  function getSpreadsheetData(){
    return axios.get('https://sheetdb.io/api/v1/cf4anvsxmwkjn');
    
  }
 
//
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function RefundRequestHandler(agent){
    const {
      name, email, phone, reason, time
    } = agent.parameters;
    const data = [{
      Name: name,
      Email: email,
      Phone: phone,
      Availaibility: time,
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
                Phone: ${phone}<br />
                Reason: ${reason}<br />
                Availbility: ${time}<br />
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
  
//  function sendEmailHandler(agent){
//    const { email, name } = agent.parameters;
  //  const mailOptions = {
    //    from: "Urban Closet", // sender address
      //  to: email, // list of receivers
//        subject: "Urban Closet Support Team", // Subject line
//        html: `<p> Hello ${name} </p>`
//    };
    
//     transporter.sendMail(mailOptions, function (err, info) {
//        if(err)
//        {
//          console.log(err);
//        }
//    });
  
//  }
  	function OTrackemailHandler(agent) {
    const {email }= agent.parameters; 
    return getSpreadsheetData().then(res => {
      res.data.map(person => {
        if(person.Email === email)
        agent.add(`Here are the Order details for Email: ${email}. Customer Name : ${person.Name}, Order Number: ${person.Number}, Order Status: ${person.Status} ` ); 
      });
    });
  }
  	function OTrackOnumHandler(agent) {
    const {number }= agent.parameters; 
    return getSpreadsheetData().then(res => {
      res.data.map(person => {
        if(person.Number === number)
        agent.add(`Here are the Order details for Order Number: ${number}. Customer Name : ${person.Name}, Email: ${person.Email} Order Status: ${person.Status} ` ); 
      });
    });
  }
  	function ExchangeRequestHandler(agent) {
    const {name, email, phone, reason, time
    } = agent.parameters;
    const data = [{
      Name: name,
      Email: email,
      Phone: phone,
      Availaibility: time,
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
                Phone: ${phone}<br />
                Reason: ${reason}<br />
                Availbility: ${time}<br />
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
  intentMap.set('Refund Request' , RefundRequestHandler );
  intentMap.set('Order Tracking - email', OTrackemailHandler);
  intentMap.set('Order Tracking using Order Number', OTrackOnumHandler);
  intentMap.set('Exchange Request', ExchangeRequestHandler);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
