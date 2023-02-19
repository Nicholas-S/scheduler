const accountSid = "ACa559a11e662315101bccb0f56db34cdd";
const authToken = "30759199fdd88caaa820a06da82e84d7";
const verifySid = "VA893d12709d59c5e2f071b5d2c9f3cbff";
const client = require("twilio")(accountSid, authToken);


function sendVerify(number)
{
  client.verify.v2.services(verifySid)
                  .verifications.create({ to: `${number}`, channel: "sms" })
                  .then((verification) => console.log(verification.status))
}

module.exports = { sendVerify };