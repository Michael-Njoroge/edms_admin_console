// FUNCTION TO UPDATE THE TABLE ROW NUMBERS DYNAMICALLY
function updateRowNumbers() {
  // Update the rows in the "groupsTab" table
  const tabRows = document.querySelectorAll("#tab tbody tr");
  tabRows.forEach((row, index) => {
    // Update the first cell (index 0) in each row with the new row number
    row.cells[0].textContent = index + 1;
  });

  // Update the rows in the "groupMembershipsTab" table
  const groupMembershipsRows = document.querySelectorAll(
    "#groupMembershipsTab tbody tr"
  );
  groupMembershipsRows.forEach((row, index) => {
    // Update the first cell (index 0) in each row with the new row number
    row.cells[0].textContent = index + 1;
  });
}

// FUNCTION TO SHOW THE COUNT IN THE DASHBOARD
async function fetchDataAndPopulateCounts() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  try {
    // Fetch data for users from the API endpoint
    const usersResponse = await fetch(apiBaseUrl + "/users", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const usersData = await usersResponse.json();

    // Update the user count in the first card
    document.getElementById("userCount").innerText = usersData.data.data.length;

    // Fetch data for folders from the API endpoint
    const foldersResponse = await fetch(apiBaseUrl + "/folders/1", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const foldersData = await foldersResponse.json();

    // Update the folder count in the appropriate card
    document.getElementById("folderCount").innerText =
      foldersData.data.data.length;

    // Fetch data for grouppermissions from the API endpoint
    const permissionResponse = await fetch(apiBaseUrl + "/userpermissions", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const permissionsData = await permissionResponse.json();

    // Update the group count in the appropriate card
    document.getElementById("permissionCount").innerText =
      permissionsData.data.data.length;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors, e.g., display an error message
    document.getElementById("userCount").innerText = "Error loading data";
    document.getElementById("folderCount").innerText = "Error loading data";
    document.getElementById("permissionCount").innerText = "Error loading data";
  }
}

// Call the async function
fetchDataAndPopulateCounts();

$(document).ready(function () {
  // Function to handle the click event on the notifications icon
  $("#notifications").click(function (event) {
    // Toggle the "open" class on notifications container
    $("#notificationsli").toggleClass("open");

    // Prevent the default behavior of the anchor link
    event.preventDefault();

    // Stop the click event from propagating to the document
    event.stopPropagation();
  });

  // Function to handle clicks on the document
  $(document).click(function (event) {
    // Check if the clicked element is not part of the notifications container
    if (!$(event.target).closest("#notification-container").length) {
      // Close the notifications container by removing the "open" class
      $("#notificationsli").removeClass("open");
    }
  });
});

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
