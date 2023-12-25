//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the add appt histories javascript using ajax: 
// Date: 11/09/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addAppointmentHistoryForm = document.getElementById('add-appointmentHistory-form-ajax');

let addContainer = document.getElementById('add-container');
let toggleAddFormButton = document.getElementById('toggle-add-form');

// Modify the objects
toggleAddFormButton.addEventListener("click", function () {
    // Toggle the visibility of the form container 
    addContainer.style.display = 'block';

    if (addContainer.style.display === 'block') {
        addAppointmentHistoryForm.scrollIntoView({ behavior: 'instant' });
    }
    
});


addAppointmentHistoryForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputClient = document.getElementById("myClientSelect");
    let inputAppointment = document.getElementById("myAppointmentSelect");
    let inputDate = document.getElementById("input-date");
    let inputProvider = document.getElementById("myProviderSelect");
   
    // Get the values from the form fields
    let clientValue = inputClient.value;
    let appointmentValue = inputAppointment.value;
    let dateValue = inputDate.value;
    let providerValue = inputProvider.value;

    // check for null client
    if (clientValue === "Null") {
        alert("Please select a client.");
        return; // Do not proceed with the AJAX request;
    }

    // check for null appoingment
    if (appointmentValue === "Null") {
        alert("Please select an appointment.");
        return;
    }
    // check if provider is null 
    if (providerValue === "Null") {
        providerValue = null;
    }

    // Put our data we want to send in a javascript object
    let data = {
        Client: clientValue,  
        Appointment: appointmentValue,
        Date: dateValue,
        Provider: providerValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-appointmentHistory-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputClient.value = '';
            inputAppointment.value = '';
            inputDate.value = '';
            inputProvider.value = '';

            // hide the form 
            addContainer.style.display = 'none';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row representing a single record, from the add form and adds the row to the table
addRowToTable = (data) => {
    console.log("client side data", data)
    // Get a reference to the current table on the page
    let currentTable = document.getElementById("apptHistories-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let clientCell = document.createElement("TD");
    let appointmentCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let providerCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    let editCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.ID;
    clientCell.innerText = newRow.Client;
    appointmentCell.innerText = newRow.Appointment;
    dateCell.innerText = newRow.Date;
    providerCell.innerText = newRow.Provider;

    // create the delete button
    deleteCell.innerHTML = '<button class="sort" onclick="deleteAppointmentHistory(' + newRow.ID + ', \'' + newRow.Client + '\', \'' + newRow.Appointment + ' appointment with ' + newRow.Provider + ' on ' + newRow.Date + '\')"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#000000}</style><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg></button>';

    // create the edit button
    editCell.innerHTML = editCell.innerHTML = '<button class="sort"  onclick="updateAppointmentHistory(' + newRow.ID + ')"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#000000}</style><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg></button>';
  
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(clientCell);
    row.appendChild(appointmentCell);
    row.appendChild(dateCell);
    row.appendChild(providerCell);
    row.appendChild(deleteCell);
    row.appendChild(editCell);

    row.setAttribute('data-value', newRow.ID);
    
    // Add the row to the table
    currentTable.appendChild(row);

}
