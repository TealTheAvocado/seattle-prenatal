//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the update service javascript: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Citation for general form of using onclick to load updating service form found here:
// Date: 11/12/2023
// title: How to Use the onclick event in JavaScript
// website: Free codecamp.org
// Source URL: https://www.freecodecamp.org/news/html-button-onclick-javascript-click-event-tutorial/

// Citation for scroll to update form information on method found at:
// date: 11/14/2023
// source URL: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

// store the selected service ID
let selectedServiceId;


let updateServiceForm = document.getElementById('update-service-form-ajax');

// function to update the form instructions
function setUpdateFormValues(serviceID, name) {
  const instruction = `To update Service ID: ${serviceID}, ${name}, please complete the form.`;
  document.getElementById('update-instruction').innerText = instruction;
}

// function to laod the Update form with values from the selected service
function updateService(ID) {
  // Store the selected service as a variable
  selectedServiceId = ID;

   // Store the selected row as the variable selectedRow
  let selectedRow = document.querySelector(`tr[data-value="${ID}"]`);

  // Extract text values from the selected row
  let nameText= selectedRow.querySelector('td:nth-child(2)').innerText;
  let descriptionText = selectedRow.querySelector('td:nth-child(3)').innerText;
  console.log("descriptionText", descriptionText)

  // Get the input element
  let inputDescription = document.getElementById("update-description");
  

  //update the form instructions
  setUpdateFormValues(ID, nameText)

  // Fill in the form field with the description value from the selected row
  inputDescription.innerText = descriptionText;
  inputDescription.value = descriptionText;

  // Show the update form 
  updateServiceForm.style.display = "block";
  updateServiceForm.scrollIntoView({ behavior: 'instant'});
}


// listen for submit of add client form
updateServiceForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Extract values from the form
  let updateDescription = document.getElementById("update-description").value;


  // Create a data object with the updated values
  let updatedData = {
    Description: updateDescription,
    ID: selectedServiceId
  };

  // Send AJAX request to update the client
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-service-ajax/", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Handle success (e.g., update the table)
      updateRow(xhttp.response);

      // Clear the input fields for another transaction
      updateDescription = '';

      // Hide the update form 
      updateServiceForm.style.display = "none";
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
    let table = document.getElementById("service-table");
    console.log("PARSEDDATA", parsedData)

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == parsedData[0].ID) {
        console.log("ParsedData0", parsedData[0])

            // Get the location of the row where we found the matching ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            // let tdname = updateRowIndex.getElementsByTagName("td")[1];
            let tddescription = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign values we updated to
            // tdname.innerHTML = parsedData[0].firstName;
            tddescription.innerHTML = parsedData[0].description;

       }
    }
}