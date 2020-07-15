// const fetch = require('node-fetch')
var Airtable = require('airtable');
const sgMail = require('@sendgrid/mail');

const apiKey = process.env.AIRTABLE_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmailTo = user => {
  return new Promise(resolve => {
    const msg = {
      to: user.email,
      from: 'nate@davisolds.com',
      subject: 'Welcome to Anyone Wanna Play BETA',
      text: `Thank you ${user.first_name} for your interest in being a beta tester.  When we have something ready to begin testing we will contact you.`,
      html: `<strong>Thank you ${user.first_name} for your interest in being a beta tester.</strong>  When we have something ready to begin testing we will contact you.`,
    };
    try {
      sgMail.send(msg)
      console.info(`Sent to ${user.email}`)
      resolve(`Sent to ${user.email}`)
    } catch(err) {
      console.error(err)
      resolve(`Error when sending to ${user.email}`)
    }
  })
}

function createUser(first_name,last_name,email) {
  var airtableBase = new Airtable({apiKey: apiKey}).base('appToEv1MITYg6kqf');
  
  return new Promise(
    resolve => {
      airtableBase('Users').create([
        {
          "fields": {
            "phone": "",
            "email": email,
            "preferred_contact": "text",
            "first_name": first_name,
            "last_name": last_name,
            "user_name": email
          }
        }
      ], function(err, records) {
        if (err) {
          console.info(err);
          resolve({})
          return;
        }

        var users = []

        records.forEach(function (record) {
          var user = Object.assign({},record.fields,{id:record.getId()})
          sendConfirmationEmailTo(user)
          users.push(user)
        });

        resolve({users})
      })
    }
  )
}

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') return { statusCode: 400, body: 'Must POST to this function' }

  // send account information along with the POST
  const { email, first_name, last_name } = JSON.parse(event.body)
  if (!email) return { statusCode: 400, body: 'Email missing' }
  if (!first_name) return { statusCode: 400, body: 'First Name missing' }
  if (!last_name) return { statusCode: 400, body: 'Last Name missing' }
  
  const result = await createUser(first_name, last_name, email)

  if (result && result.users !== undefined) {
    return {statusCode:200, body:JSON.stringify({users:result.users})}
  } else {
    return {statusCode:400, body:result}
  }  
}
