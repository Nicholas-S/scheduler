const db = require('../db');
const form = document.querySelector("form");
cField = form.querySelector(".SMS"),
cInput = cField.querySelector("input"),
form.onsubmit = (e)=>
{
  e.preventDefault(); //preventing from form submitting
                      //if email and password is blank then add shake class in it else call specified function
  (cInput.value == "") ? cField.classList.add("shake", "error") : checkNumber();
  setTimeout(() => //set shake class timeout to 500ms
  { 
    cField.classList.remove("shake");
  }, 500);
  cInput.onkeypress = () =>  //calling checkEmail function on email input keyup
  {
    checkNumber();
  }
  function checkNumber()
  { //checkEmail function
    console.log("checked numebr");
    let pattern = '(0|91)?[6-9][0-9]{9}'; //pattern for validate email
    if(!cInput.value.match(pattern))
    { //if pattern not matched then add error and remove valid class
      cField.classList.add("error");
      cField.classList.remove("valid");
      let errorTxt = cField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      (cInput.value != "") ? errorTxt.innerText = "Enter a valid phone number" : errorTxt.innerText = "SMS can't be blank";
    } else { //if pattern matched then remove error and add valid class
      cField.classList.remove("error");
      cField.classList.add("valid");
    }
    
  }
  //if cField and pField doesn't contains error class that mean user filled details properly
  if(!cField.classList.contains("error"))
  {
    window.location.href = form.getAttribute("action"); //redirecting user to the specified url which is inside action attribute of form tag
  }
}