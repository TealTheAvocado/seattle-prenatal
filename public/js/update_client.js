//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the update client javascript: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Citation for general form of using onclick to load updating client form found here:
// Date: 11/12/2023
// title: How to Use the onclick event in JavaScript
// website: Free codecamp.org
// Source URL: https://www.freecodecamp.org/news/html-button-onclick-javascript-click-event-tutorial/

// Citation scroll to update form information on method found at:
// date: 11/14/2023
// source URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

// store the selected client ID
let selectedClientId;

// update_client.js
let updateClientForm = document.getElementById('update-client-form-ajax');

// function to update the form instructions
function setUpdateFormValues(clientID, firstName, lastName) {
  const instruction = `To update records for ${firstName} ${lastName} (clientID: ${clientID}), please complete the form.`;
  document.getElementById('update-instruction').innerText = instruction;
}

// function to laod the Update client form with values from the selected client
function updateClient(ID) {
  // Store the selected client as a variable
  selectedClientId = ID;

   // Store the selected row as the variable selectedRow
  let selectedRow = document.querySelector(`tr[data-value="${ID}"]`);

  // Extract text values from the selected row
  let firstNameText= selectedRow.querySelector('td:nth-child(2)').innerText;
  let lastNameText = selectedRow.querySelector('td:nth-child(3)').innerText;
  let providerText = selectedRow.querySelector('td:nth-child(7)').innerText;
  let phoneText = selectedRow.querySelector('td:nth-child(5)').innerText;
  let emailText = selectedRow.querySelector('td:nth-child(6)').innerText;
  console.log('emailText', emailText), 'firstNameText', firstNameText;

  // Get the select elements
  let inputProviderSelect = document.getElementById("input-provider");
  let inputPhone = document.getElementById("input-update-phone");
  let inputEmail= document.getElementById("input-update-email");
  
// Iterate through the Provider and find the one with the text that matches the text from the selected row for that field
  for (let i = 0; i < inputProviderSelect.options.length; i++) {
    if (inputProviderSelect.options[i].innerText === providerText) {
      // Set the value of the provider option to match the selected row
      inputProviderSelect.value = inputProviderSelect.options[i].value;
      inputProviderSelect.options[0].innerText = inputProviderSelect.options[i].innerText;
      break;
      }
    }

  // fill in the input form fields 
  inputPhone.value = phoneText;
  inputEmail.value = emailText;


  //update the form instructions
  setUpdateFormValues(ID, firstNameText, lastNameText)

  // Show the update form 
  updateClientForm.style.display = "block";
  updateClientForm.scrollIntoView({ behavior: 'instant'});
}


// listen for submit of add client form
updateClientForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract values from the form
  let updateProvider = document.getElementById("input-provider").value;
  let updatePhone = document.getElementById("input-update-phone").value;
  let updateEmail = document.getElementById("input-update-email").value;

  // check if provider is null 
  if (updateProvider === "Null") {
    updateProvider = null;
}
  // Create a data object with the updated values
  let updatedData = {
    Provider: updateProvider,
    phone: updatePhone,
    email: updateEmail,
    ID: selectedClientId
  };

  // Send AJAX request to update the client
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-client-ajax/", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Handle success (e.g., update the table)
      updateRow(xhttp.response);

      // Clear the input fields for another transaction
      updateProvider = '';
      updatePhone = '';
      updateEmail = '';

      // Hide the update form 
      updateClientForm.style.display = "none";
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the update.");
    }
  }

  // Send the request with the updated data
  xhttp.send(JSON.stringify(updatedData));
});

// update the browse table
function updateRow(data, ID){
    // grab data from app.js
    let parsedData = JSON.parse(data);
    // grab browse table from clients.hbs
    let table = document.getElementById("client-table");
    console.log("PARSEDDATA", parsedData)

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == parsedData[0].ID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let tdfirstName = updateRowIndex.getElementsByTagName("td")[1];
            let tdlastName = updateRowIndex.getElementsByTagName("td")[2];
            let tdBirthday = updateRowIndex.getElementsByTagName("td")[3];
            let tdPhone = updateRowIndex.getElementsByTagName("td")[4];
            let tdemail = updateRowIndex.getElementsByTagName("td")[5];
            let tdProvider = updateRowIndex.getElementsByTagName("td")[6];
  
            // Reassign values we updated to
            tdfirstName.innerHTML = parsedData[0].firstName;
            tdlastName.innerHTML = parsedData[0].lastName;
            tdBirthday.innerHTL = parsedData[0].birthday;  
            tdPhone.innerHTML = parsedData[0].phone;
            tdemail.innerHTML = parsedData[0].email; 
            tdProvider.innerHTML = parsedData[0].Provider;
          
            window.location.reload();
            
       }
    }
}