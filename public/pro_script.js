const form = document.querySelector("form");
cField = form.querySelector(".SMS");
cInput = cField.querySelector("input");
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
    let pattern = /^1?[2-9]\d{2}[2-9]\d{6}$/;
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
  }
  if(!cField.classList.contains("error"))
  {
    window.location.href = `${form.getAttribute("action")}?SMS=${encodeURIComponent(cInput.value)}`;
  }
}