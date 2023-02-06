// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "ACa559a11e662315101bccb0f56db34cdd";
const authToken = "30759199fdd88caaa820a06da82e84d7";
const verifySid = "VA893d12709d59c5e2f071b5d2c9f3cbff";
const client = require("twilio")(accountSid, authToken);


function sendVerify(number)
{
  client.verify.v2.services(verifySid)
                  .verifications.create({ to: ${number}, channel: "sms" })
                  .then((verification) => console.log(verification.status))
}


client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+19253817647", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+19253817647", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });