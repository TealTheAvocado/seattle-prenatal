//Authors: Sonja Lavin, Flora Zhang
// Contents: Seattle Prenatal Clinic
// Citation for the delete appointment javascript using jquery: 
// Date: 11/20/2023
// Copied from CS340 OSU course:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// function to delete based on ID pulled from browse table 
function deleteAppointment(perinatalApptID, name) {

    // ask the user for confirmation before proceeding
    var confirmation = window.confirm("Are you sure you want to delete this Appointment? ID: " + perinatalApptID + ", Name: " + name);
  
    if (confirmation) {
      let link = '/delete-appointment-ajax/';
      let data = {
         // store data in ID object
        ID: perinatalApptID
      };
    
      $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            // alert("The selected appointment has been deleted");
            deleteRow(perinatalApptID);
        },
        error: function(error) {
          alert("The selected appointment is associated with an appointment history and cannot be deleted");
        }
      });
    }
  }
    //delete row function to update browse table, called above if data is successfully deleted from database
    function deleteRow(perinatalApptID){
        let table = document.getElementById("appointments-table");
         // iterate through browse table, searching for the ID that was selected to delete
        for (let i = 0, row; row = table.rows[i]; i++) {
          // when selected row is found, delete. 
           if (table.rows[i].getAttribute("data-value") == perinatalApptID) {
                table.deleteRow(i);
                break;
           }
        }
    }