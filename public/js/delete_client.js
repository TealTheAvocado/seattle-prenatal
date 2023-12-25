//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete client javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete client based on employeeID pulled from client browse table 
function deleteClient(clientID, clientName) {

   // Ask the user for confirmation before proceeding
   var confirmation = window.confirm("Are you sure you want to delete this client? ID: " + clientID + ", Name: " + clientName);

   if (confirmation) {
      let link = '/delete-client-ajax/';
      // store data in ID object
      let data = {
        ID: clientID
      };
    
      $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
          deleteRow(clientID);
        }
      });
    }
  }
  
  //delete row function to update browse table, called above if data is successfully deleted from database
  function deleteRow(clientID){
      let table = document.getElementById("client-table");
      // iterate through client browse table, searching for the clientID that was selected to delete
      for (let i = 0, row; row = table.rows[i]; i++) {
        // when selected row is found, delete. 
         if (table.rows[i].getAttribute("data-value") == clientID) {
              table.deleteRow(i);
              break;
         }
      }
  }