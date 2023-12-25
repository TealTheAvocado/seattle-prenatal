//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete service javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete based on serviceID pulled from service browse table 
function deleteService(serviceID, name) {

    // ask the user for confirmation before proceeding
    var confirmation = window.confirm("Are you sure you want to delete this service? ID: " + serviceID + ", Name: " + name);
  
    if (confirmation) {
      let link = '/delete-service-ajax/';
      let data = {
         // store data in ID object
        ID: serviceID
      };
    
      $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
           // alert("The selected service has been deleted");
            deleteRow(serviceID);
        },
        error: function(error) {
          alert("The selected service is associated with a service history and cannot be deleted");
        }
      });
    }
  }
    //delete row function to update browse table, called above if data is successfully deleted from database
    function deleteRow(serviceID){
        let table = document.getElementById("service-table");
         // iterate through service browse table, searching for the serviceID that was selected to delete
        for (let i = 0, row; row = table.rows[i]; i++) {
          // when selected row is found, delete. 
           if (table.rows[i].getAttribute("data-value") == serviceID) {
                table.deleteRow(i);
                break;
           }
        }
    }