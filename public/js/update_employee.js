//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the update employee javascript: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Citation for general form of using onclick to load updating employee form found here:
// Date: 11/12/2023
// title: How to Use the onclick event in JavaScript
// website: Free codecamp.org
// Source URL: https://www.freecodecamp.org/news/html-button-onclick-javascript-click-event-tutorial/


  // Citation for scroll to update form information on method found at:
  // date: 11/14/2023
  // source URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  
// store the selected ID
let selectedEmployeeId;

// update js
let updateEmployeeForm = document.getElementById('update-employee-form-ajax');

// function to update the form instructions
function setUpdateFormValues(employeeID, firstName, lastName) {
  const instruction = `To update records for ${firstName} ${lastName} (employeeID: ${employeeID}), please complete the form.`;
  document.getElementById('update-instruction').innerText = instruction;
}

// function to laod the Update form with values from the selected employee
function updateEmployee(ID) {
  // Store the selected employee as a variable
  selectedEmployeeId = ID;

   // Store the selected row as the variable selectedRow
  let selectedRow = document.querySelector(`tr[data-value="${ID}"]`);

  // Extract text values from the selected row
  let firstNameText= selectedRow.querySelector('td:nth-child(2)').innerText;
  let lastNameText = selectedRow.querySelector('td:nth-child(3)').innerText;
  let phoneText = selectedRow.querySelector('td:nth-child(4)').innerText;
  let emailText = selectedRow.querySelector('td:nth-child(5)').innerText;

  // Get the select elements
  let inputPhone = document.getElementById("input-update-phone");
  let inputEmail= document.getElementById("input-update-email");

  // fill in the input form fields 
  inputPhone.value = phoneText;
  inputEmail.value = emailText;

  //update the form instructions
  setUpdateFormValues(ID, firstNameText, lastNameText)

  // Show the update form 
  updateEmployeeForm.style.display = "block";

  updateEmployeeForm.scrollIntoView({ behavior: 'instant'});
}


// listen for submit of form
updateEmployeeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract values from the form
  let updatePhone = document.getElementById("input-update-phone").value;
  let updateEmail = document.getElementById("input-update-email").value;

  // Create a data object with the updated values
  let updatedData = {
    phone: updatePhone,
    email: updateEmail,
    ID: selectedEmployeeId
  };

  // Send AJAX request to update the employee
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-employee-ajax/", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Handle success (e.g., update the table)
      updateRow(xhttp.response);

      // Clear the input fields for another transaction
      updatePhone = '';
      updateEmail = '';

      // Hide the update form 
      updateEmployeeForm.style.display = "none";
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
    // grab browse table from employee.hbs
    let table = document.getElementById("employee-table");
    console.log("PARSEDDATA", parsedData)

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == parsedData[0].ID) {

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value that changed
            let tdPhone = updateRowIndex.getElementsByTagName("td")[3];
            let tdemail = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign values we updated to
            tdPhone.innerHTML = parsedData[0].phone;
            tdemail.innerHTML = parsedData[0].email; 
            
       }
    }
}