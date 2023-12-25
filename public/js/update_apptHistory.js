//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the update appt histories javascript: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Citation for general form of using onclick to load updating service history form found here:
// Date: 11/12/2023
// title: How to Use the onclick event in JavaScript
// website: Free codecamp.org
// Source URL: https://www.freecodecamp.org/news/html-button-onclick-javascript-click-event-tutorial/

// Citation for scroll to update form information on method found at:
//date: 11/14/2023
// source URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

// Citation for function to format the date to "yyyy-MM-dd", which is required to update the form
// code based on research from stack exchange question:
// date: 11/14/2023
// source URL: https://stackoverflow.com/questions/5433313/convert-dd-mm-yyyy-to-mm-dd-yyyy-in-javascript

// store the selected appointment history ID
let selectedAppointmentHistoryId;

// update_appointmentHistory.js
let updateAppointmentHistoryForm = document.getElementById('update-appointmentHistory-form-ajax');

// function to update the form instructions
function setUpdateFormValues(serviceHistoryID) {
  const instruction = `To update Appointment History ID: ${serviceHistoryID}, please complete the form.`;
  document.getElementById('update-instruction').innerText = instruction;
}

// function to laod the Update appointment history form with values from the selected appointment hisotry
function updateAppointmentHistory(ID) {
  // Store the selected appointment history ID as the variable selectedAppointmentHistoryId
  selectedAppointmentHistoryId = ID;

   //update the form instructions
   setUpdateFormValues(ID)

   // Store the selected row as the variable selectedRow
  let selectedRow = document.querySelector(`tr[data-value="${ID}"]`);

  // Extract text values from the selected row
  let clientText= selectedRow.querySelector('td:nth-child(2)').innerText;
  let apptText = selectedRow.querySelector('td:nth-child(3)').innerText;
  let dateText = selectedRow.querySelector('td:nth-child(4)').innerText;
  let providerText = selectedRow.querySelector('td:nth-child(5)').innerText;

  // Get the select elements
  let inputClientSelect = document.getElementById("input-client");
  let inputAppointmentSelect = document.getElementById("input-appointment");
  let inputDate = document.getElementById("update-date");
  let inputProviderSelect = document.getElementById("input-provider");
 
  
  // Iterate through the Client options and find the one with the matching text from the selected row for that field
  for (let i = 0; i < inputClientSelect.options.length; i++) {
    if (inputClientSelect.options[i].innerText === clientText) {
      // Set the value of the client option to match the selected row
      inputClientSelect.options[0].value = inputClientSelect.options[i].value;
      inputClientSelect.options[0].innerText = inputClientSelect.options[i].innerText;

      break;
      }
    }

    // Iterate through Appointment the options and find the text that matches the text from the selected row for that field
  for (let i = 0; i < inputAppointmentSelect.options.length; i++) {
    if (inputAppointmentSelect.options[i].innerText === apptText) {
      // Set the value of the appointment option to match the selected row
      inputAppointmentSelect.options[0].value = inputAppointmentSelect.options[i].value;
      inputAppointmentSelect.options[0].innerText = inputAppointmentSelect.options[i].innerText;

      break;
      }
    }

     // Iterate through the Provider and find the one with the text that matches the text from the selected row for that field
  for (let i = 0; i < inputProviderSelect.options.length; i++) {
    if (inputProviderSelect.options[i].innerText === providerText) {
      // Set the value of the provider option to match the selected row
      inputProviderSelect.options[0].value = inputProviderSelect.options[i].value;
      inputProviderSelect.options[0].innerText = inputProviderSelect.options[i].innerText;

      break;
      }
    }
  
  // Fill in the form fields with the date values
  inputDate.value = formatDate(dateText);
 

  // Show the update form 
  updateAppointmentHistoryForm.style.display = "block";
  updateAppointmentHistoryForm.scrollIntoView({ behavior: 'instant'});
}


function formatDate(inputDate) {
  // splt the input date into an array of substrings, based on the /
  const parts = inputDate.split('/');
  // inputDate is in "MM/dd/yy" format:
  // to get year put 20 in front of the year, assumes no dates in 1900's, and grab the elements in the index 2 array, corresponding to the year
  // to get month, grab the elements in the index 0, corresponding to the month
  // to get day, grab the elements from the index 1 array, corresponding to the day
  const formattedDate = `20${parts[2]}-${parts[0]}-${parts[1]}`;
  console.log("date", formattedDate);
  return formattedDate;
}

// listen for submit of add service history form
updateAppointmentHistoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract values from the form
  let updateClient = document.getElementById("input-client").value;
  let updateAppointment = document.getElementById("input-appointment").value;
  let updateDate = document.getElementById("update-date").value;
  let updateProvider = document.getElementById("input-provider").value;

  // check if provider is null 
  if (updateProvider === "Null") {
    updateProvider = null;
}
  // Create a data object with the updated values
  let updatedData = {
    Client: updateClient,
    Appointment: updateAppointment,
    Date: updateDate,
    Provider: updateProvider,
    ID: selectedAppointmentHistoryId
  };

  // Send AJAX request to update the appointment history
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-appointmentHistory-ajax/", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Handle success (e.g., update the table)
      updateRow(xhttp.response);

      // Clear the input fields for another transaction
      updateClient = '';
      updateAppointment = '';
      updateDate = '';
      updateProvider = '';
      selectedAppointmentHistoryId = '';

      // Hide the update form 
      updateAppointmentHistoryForm.style.display = "none";
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
    // grab browse table from AppointmentHistories.hbs
    let table = document.getElementById("apptHistories-table");
    console.log("PARSEDDATA", parsedData)

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == parsedData[0].ID) {
        console.log("ParsedData0", parsedData[0])

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let tdClient = updateRowIndex.getElementsByTagName("td")[1];
            let tdAppointment = updateRowIndex.getElementsByTagName("td")[2];
            let tdDate = updateRowIndex.getElementsByTagName("td")[3];
            let tdProvider = updateRowIndex.getElementsByTagName("td")[4]
           
            console.log("client", parsedData[0].Client)
            // Reassign values we updated to
            tdClient.innerHTML = parsedData[0].Client;
            tdAppointment.innerHTML = parsedData[0].Appointment;
            tdDate.innerHTML = parsedData[0].Date; 
            tdProvider.innerHTML = parsedData[0].Provider;
       }
    }
}