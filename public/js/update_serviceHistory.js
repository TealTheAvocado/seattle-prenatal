//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the update service histories javascript: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Citation for general form of using onclick to load updating service history form found here:
// Date: 11/12/2023
// title: How to Use the onclick event in JavaScript
// website: Free codecamp.org
// Source URL: https://www.freecodecamp.org/news/html-button-onclick-javascript-click-event-tutorial/

// Citation for function to format the date to "yyyy-MM-dd", which is required to update the form
// code based on research from stack exchange question:
// date: 11/14/2023
// source URL: https://stackoverflow.com/questions/5433313/convert-dd-mm-yyyy-to-mm-dd-yyyy-in-javascript

// Citation for scroll to update form information on method found at:
// date: 11/14/2023
// source URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

// store the selected service history ID
let selectedServiceHistoryId;

let updateServiceHistoryForm = document.getElementById('update-serviceHistory-form-ajax');

// function to update the form instructions
function setUpdateFormValues(serviceHistoryID) {
  const instruction = `To update Service History ID: ${serviceHistoryID}, please complete the form.`;
  document.getElementById('update-instruction').innerText = instruction;
}

// function to laod the Update service history form with values from the selected service hisotry 
function updateServiceHistory(ID) {
  // Store the selected service history ID as the variable selectedServiceHistoryId
  selectedServiceHistoryId = ID;

  //update the form instructions
  setUpdateFormValues(ID)

  // Store the selected row as the variable selectedRow
  let selectedRow = document.querySelector(`tr[data-value="${ID}"]`);

  // Extract text values from the selected row
  let clientText= selectedRow.querySelector('td:nth-child(2)').innerText;
  let serviceText = selectedRow.querySelector('td:nth-child(3)').innerText;
  let dateText = selectedRow.querySelector('td:nth-child(4)').innerText;
  let employeeText = selectedRow.querySelector('td:nth-child(5)').innerText;


  // Get the select elements
  let inputClientSelect = document.getElementById("input-client");
  let inputServiceSelect = document.getElementById("input-service");
  let inputDate = document.getElementById("update-date");
  let inputEmployeeSelect = document.getElementById("input-employee");

  
  // Iterate through the Client options and find the one with the text that matches the text from the selected row for that field
  for (let i = 0; i < inputClientSelect.options.length; i++) {
    if (inputClientSelect.options[i].innerText === clientText) {
      // Set the value of the client option in the update form to match the selected row
      inputClientSelect.options[0].value = inputClientSelect.options[i].value;
      inputClientSelect.options[0].innerText = inputClientSelect.options[i].innerText;

      break;
      }
    }

    // Iterate through Service the options and find the one with the text that matches the text from the selected row for that field
  for (let i = 0; i < inputServiceSelect.options.length; i++) {
    if (inputServiceSelect.options[i].innerText === serviceText) {
      // Set the value of the services option to match that of the selected row
      inputServiceSelect.options[0].value = inputServiceSelect.options[i].value;
      inputServiceSelect.options[0].innerText = inputServiceSelect.options[i].innerText;

      break;
      }
    }

     // Iterate through the Employee and find the one with the text that matches the text from the selected row for that field
  for (let i = 0; i < inputEmployeeSelect.options.length; i++) {
    if (inputEmployeeSelect.options[i].innerText === employeeText) {
      // Set the value of the employee option to match the selected row
      inputEmployeeSelect.options[0].value = inputEmployeeSelect.options[i].value;
      inputEmployeeSelect.options[0].innerText = inputEmployeeSelect.options[i].innerText;

      break;
      }
    }
  
  // Fill in the form fields with the date value from the selected row
  inputDate.value = formatDate(dateText);
 

  // Show the updated form 
  updateServiceHistoryForm.style.display = "block";

  updateServiceHistoryForm.scrollIntoView({ behavior: 'instant'});
}



function formatDate(inputDate) {
  // splt the input date into an array of substrings, based on the /
  const parts = inputDate.split('/');
  // inputDate is in "MM/dd/yy" format:
  // to get year put 20 in front of the year, assumes no dates in 1900's, and grab the elements in the index 2 array, corresponding to the year
  // to get month, grab the elements in the index 0, corresponding to the month
  // to get day, grab the elements from the index 1 array, corresponding to the day
  const formattedDate = `20${parts[2]}-${parts[0]}-${parts[1]}`;
  return formattedDate;
}

// listen for submit of add service history form
updateServiceHistoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract values from the form
  let updateClient = document.getElementById("input-client").value;
  let updateService = document.getElementById("input-service").value;
  let updateDate = document.getElementById("update-date").value;
  let updateEmployee = document.getElementById("input-employee").value;
 

    // check if employee is null 
  if (updateEmployee === "Null") {
      updateEmployee = null;
  }
  
  // Create a data object with the updated values
  let updatedData = {
    Client: updateClient,
    Service: updateService,
    Date: updateDate,
    Employee: updateEmployee,
    ID: selectedServiceHistoryId
  };
  console.log("updatdData", updatedData)


  // Send AJAX request to update the service history
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-serviceHistory-ajax/", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Handle success (e.g., update the table)
      updateRow(xhttp.response);

      // Clear the input fields for another transaction
      updateClient = '';
      updateService = '';
      updateDate = '';
      updateEmployee = '';
      selectedServiceHistoryId = '';

      // Hide the update form
      updateServiceHistoryForm.style.display = "none";
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
    // grab browse table from ServiceHistories.hbs
    let table = document.getElementById("serviceHistories-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows of the table
       //rows accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == parsedData[0].ID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let tdClient = updateRowIndex.getElementsByTagName("td")[1];
            let tdService = updateRowIndex.getElementsByTagName("td")[2];
            let tdDate = updateRowIndex.getElementsByTagName("td")[3];
            let tdEmployee = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign values we updated to
            tdClient.innerHTML = parsedData[0].Client;
            tdService.innerHTML = parsedData[0].Service;
            tdDate.innerHTML = parsedData[0].Date; 
            tdEmployee.innerHTML = parsedData[0].Employee;
          
       }
    }
}