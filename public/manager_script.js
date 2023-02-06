const db = require('../db');
const form = document.querySelector("form");
cField = form.querySelector("SMS"),
cInput = cField.querySelector("input"),
form.onsubmit = (c)=>
{
  c.preventDefault();
  (cInput.value == "") ? cField.classList.add("shake", "error") : checkNumber();
  setTimeout(() =>
  { 
    cField.classList.remove("shake");
  }, 500);
  cInput.onkeypress = () =>
  {
    checkNumber();
  }
  function checkNumber()
  {
    console.log("checked number");
    let pattern = /^\d{10}$/;
    if(!cInput.value.match(pattern))
    {
      cField.classList.add("error");
      cField.classList.remove("valid");
      let errorTxt = cField.querySelector(".error-txt");
      (cInput.value != "") ? errorTxt.innerText = "Enter a valid phone number" : errorTxt.innerText = "SMS can't be blank";
    } else {
      cField.classList.remove("error");
      cField.classList.add("valid");
    }
    /*let unique = db.checkManagerNum(cInput.value)
    if(unique == 'valid')
    {
      cField.classList.remove("error");
      cField.classList.add("valid");
    } else {
      cField.classList.remove("valid");
      cField.classList.add("error");
    }*/
  }
  if(!cField.classList.contains("error"))
  {
    window.location.href = form.getAttribute("action");
  }
}