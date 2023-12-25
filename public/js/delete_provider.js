//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete provider javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete provider based on providerID pulled from employee browse table 
function deleteProvider(providerID, providerName) {
    // Ask the user for confirmation before proceeding
    var confirmation = window.confirm("Are you sure you want to delete this provider? ID: " + providerID + ", Name: " + providerName);

    if (confirmation) {
      let link = '/delete-provider-ajax/';
      let data = {
        // store data in ID object
        ID: providerID
      };

      $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
          deleteRow(providerID);
        }
      });
    }
    }

  //delete row function to update browse table, called above if data is successfully deleted from database
  function deleteRow(providerID){
      let table = document.getElementById("provider-table");
       // iterate through provider browse table, searching for the providerID that was selected to delete
      for (let i = 0, row; row = table.rows[i]; i++) {
        // when selected row is found, delete. 
         if (table.rows[i].getAttribute("data-value") == providerID) {
              table.deleteRow(i);
              break;
         }
      }
  }