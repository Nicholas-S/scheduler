const accountSid = "ACa559a11e662315101bccb0f56db34cdd";
const authToken = "b0e3e785383a2449bf2f25a7dc8bcd56";
const verifySid = "VA80fd259da174e68ec75e901d2411d51b";
const client = require("twilio")(accountSid, authToken);


function sendVerify(number)
{
  const formattedNumber = number.replace(/\D/g, '');
  client.verify.v2.services(verifySid)
                  .verifications.create({ to: `+${formattedNumber}`, channel: "sms" })
                  .then((verification) => console.log(verification.status))
}

async function checkVerify(number, code)
{
  const formattedNumber = number.replace(/\D/g, '');
  const verification_check = await client.verify.v2.services(verifySid)
                                         .verificationChecks
                                         .create({ to: `+${formattedNumber}`, code: `${code}` });
  return verification_check.status;
}

module.exports = { sendVerify , checkVerify };