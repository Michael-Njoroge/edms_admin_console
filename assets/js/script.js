//************************** GLOBAL FUNCTIONS*********************************//

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

//FUNCTION TO FETCH AND POPULATE DROPDOWNS WITH EXISTING GROUPS AND USERS

async function populateDropdowns() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Fetch existing groups
  const groupsResponse = await fetch("http://127.0.0.1:8000/api/groups", {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const groupsData = await groupsResponse.json();

  const assignGroupDropdown = $("#assign_group");
  assignGroupDropdown.empty();

  // Add default "Select" option
  assignGroupDropdown.append(
    '<option value="" disabled selected>Select Group</option>'
  );

  groupsData.data.data.forEach((group) => {
    assignGroupDropdown.append(
      `<option value="${group.id}">${group.group_name}</option>`
    );
  });

  // Fetch existing users
  const usersResponse = await fetch("http://127.0.0.1:8000/api/users", {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const usersData = await usersResponse.json();
  const assignUsersDropdown = $("#assign_users");

  // Fetch the selected group
  const selectedGroupId = assignGroupDropdown.val();

  // Get users in the selected group
  const selectedGroup = groupsData.data.data.find(
    (group) => group.id == selectedGroupId
  );
  const usersInGroup = selectedGroup
    ? selectedGroup.users.map((user) => user.id)
    : [];

  assignUsersDropdown.empty();

  // Add default "Select" option
  assignUsersDropdown.append(
    '<option value="" disabled selected>Select User</option>'
  );

  usersData.data.data.forEach((user) => {
    assignUsersDropdown.append(
      `<option value="${user.id}">${user.username}</option>`
    );
  });
}

// Call populateDropdowns when the document is ready
$(document).ready(function () {
  populateDropdowns();
});
