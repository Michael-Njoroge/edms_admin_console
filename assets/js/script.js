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

// FUNCTION TO SHOW THE COUNT OF USERS IN THE DASHBOARD
async function fetchDataAndPopulateUserCount() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  try {
    // Fetch data from the API endpoint
    const response = await fetch("http://127.0.0.1:8000/api/users", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    // Convert the response to JSON format
    const data = await response.json();

    // Update the user count in the first card
    document.getElementById("userCount").innerText = data.data.data.length;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors, e.g., display an error message
    document.getElementById("userCount").innerText = "Error loading data";
  }
}

// Call the async function
fetchDataAndPopulateUserCount();
