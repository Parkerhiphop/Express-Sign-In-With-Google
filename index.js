const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

// You can create a google API's Project and get a Client ID as documented here
// https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
const CLIENT_ID = "YOUR CLIENT ID Here"
const CLIENT_URL = "http://localhost:5173"

const port = 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Server is up!',
    clientUrl: CLIENT_URL,
    clientId: CLIENT_ID,
  })
})

/** Handle the POST request from onLogin callback in frontend */
app.post('/verify-token', (req, res) => {
  // use google-auth-library to verify token
  const { OAuth2Client } = require('google-auth-library')
  const client = new OAuth2Client(CLIENT_ID);

  async function verify() {
    // get credential from google
    const token = req.body.credential

    console.log('token from credential', token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    })

    const payload = ticket.getPayload()

    // You can store user data in DB and return Authorization Token here.
    res.json({
      email: payload.email,
      email_verified: payload.email_verified,
      picture: payload.picture,
      name: payload.name,
    })
  }

  verify().catch(console.error)
})

app.listen(port, () => {
  console.log(`Express Sign in with google is listening on port ${port}`)
})
