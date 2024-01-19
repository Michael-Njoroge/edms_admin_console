// ******************************* GROUPS FUNCTIONS **************************** //

// FUNCTION TO POPULATE THE GROUPS TABLE WITH FETCHED GROUP DATA
async function getData(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Fetch groups data with pagination parameters
  const records = await fetch("http://127.0.0.1:8000/api/groups", {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await records.json();

  // Initialize DataTable
  const groupsTable = $("#tab").DataTable({
    lengthMenu: [5, 10, 25, 50],
    bDestroy: true,
  });

  // Clear the existing table
  groupsTable.clear().draw();

  // Loop through each group and create a table row
  data.data.data.forEach((group, index) => {
    const statusLabel = group.is_active === 1 ? "Active" : "InActive";
    const statusColor = group.is_active === 1 ? "green" : "red";

    // Determine the action buttons based on the user status
    const activateButton = `<a href="#" onclick="performUserAction('${group.group_name}', 'activate')" style="margin-left: 20px;"><i class="fa fa-check" title="Activate" style="color: green; font-size: 18px;"></i></a>`;
    const deactivateButton = `<a href="#" onclick="performUserAction('${group.group_name}', 'deactivate')" style="margin-left: 20px;"><i class="fa fa-ban" title="Deactivate" style="color: red; font-size: 18px; "></i></a>`;

    // Get usernames of group members
    const memberUsernames = group.users.map((user) => user.username).join(", ");

    // Check if the group is one of the seeded groups
    const isSeededGroup = index < 2;

    // Add the row to DataTable
    groupsTable.row
      .add([
        index + 1,
        group.group_name,
        group.admin.name,
        group.users.length,
        memberUsernames,
        `<span style="color: ${statusColor};">${statusLabel}</span>`,
        `<td style="font-size:21px;">
        <center>
          <a href="#" data-toggle="modal" data-target="#editForm" onclick="editGroup(${
            group.id
          })" data-groupid="${
          group.id
        }" title="edit"><i class="fa fa-edit"></i></a> &nbsp;&nbsp;
          ${
            group.id === 1 || group.id === 2
              ? `<i class="fa fa-trash" style="color: lightgrey; cursor: not-allowed;" title="Cannot delete this group" aria-disabled="true"></i>`
              : `<a href="#" data-toggle="modal" data-target="#confirmDeleteModal" onclick="prepareToDeleteGroup(${group.id})" title="delete"><i class="fa fa-trash"></i></a>`
          }
           
        </center>
      </td>`,
      ])
      .draw(false);
  });

  // Generate pagination links
  const totalPages = Math.ceil(data.data.total / itemsPerPage);
  const paginationElement = $("#pagination");
  paginationElement.empty();

  if (totalPages > 1) {
    const prevLink = `<a href="#" onclick="populateGroupsTable(${
      page - 1
    }, ${itemsPerPage})" class="page-link">«</a>`;
    paginationElement.append(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = `<a href="#" onclick="populateGroupsTable(${i}, ${itemsPerPage})" class="page-link ${
        i === page ? "active" : ""
      }">${i}</a>`;
      paginationElement.append(pageLink);
    }

    const nextLink = `<a href="#" onclick="populateGroupsTable(${
      page + 1
    }, ${itemsPerPage})" class="page-link">»</a>`;
    paginationElement.append(nextLink);
  }
}

// FUNCTION TO POPULATE THE FOLDERS DROPDOWN IN THE MODAL
async function populateFoldersDropdown() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Make AJAX requests to fetch folder data
  $.ajax({
    url: "http://127.0.0.1:8000/api/folders/1",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (folderData) {
      const folderSelect = document.getElementById("folderSelect");
      folderSelect.innerHTML = "";

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Folder";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      folderSelect.appendChild(defaultOption);

      // Check if there are folders in the response
      if (folderData.data.data && folderData.data.data.length > 0) {
        // Iterate over the folders and populate the dropdown
        folderData.data.data.forEach(function (folder) {
          const option = document.createElement("option");
          option.value = folder.id;
          option.text = folder.name;
          folderSelect.appendChild(option);
        });
      } else {
        // If no folders are found, you may want to handle this case
        console.error("No folders found.");
      }
    },
    error: function (error) {
      console.error("Error fetching folder data:", error);
    },
  });
}

// Function to fetch group permissions based on the selected folder
async function fetchGroupPermissions() {
  const folderSelect = document.getElementById("folderSelect");
  const selectedFolderId = folderSelect.value;

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Fetch the group details including permissions using the provided endpoint with the Bearer token in headers
  const groupId = 1; // Replace with the actual group ID
  const endpoint = `http://127.0.0.1:8000/api/group/show/${groupId}?folderId=${selectedFolderId}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    const groupData = await response.json();

    // Check if the response is successful
    if (groupData.success) {
      // Display the permissions for the group and selected folder
      displayPermissionsForFolder(selectedFolderId, groupData.data.data);
    } else {
      // Handle the case where the API request is not successful
      console.error("Error fetching group details:", groupData.message);
    }
  } catch (error) {
    // Handle the case where there is an error with the API request
    console.error("Error fetching group details:", error);
  }

  // Close the modal
  $("#selectFolderModal").modal("hide");
}

// Call populateFoldersDropdown when the modal is shown
$("#selectFolderModal").on("show.bs.modal", function (event) {
  populateFoldersDropdown();
});

// FUNCTION TO HANDLE FORM SUBMISSION AND CREATE A NEW GROUP
function createGroup() {
  // Fetch form data
  const groupName = $("#group_name").val();
  // Update to get the selected user ID from the dropdown
  const adminId = $("#adminSelect").val();

  // Validate form fields
  if (!groupName || !adminId) {
    toastr.error("Please fill out all fields.");
    return;
  }

  // Disable the submit button and show loading text
  const submitButton = $("#submitBtn");
  submitButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Loading...');

  // Construct the request payload
  const requestData = {
    group_name: groupName,
    group_admin_id: adminId,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Make a POST request to create a new group
  fetch("http://127.0.0.1:8000/api/groups/store", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Close the modal after successful submission
      $("#form").modal("hide");

      // Clear the add group form
      $("#createForm")[0].reset();

      // Refresh the data by calling the getData() function
      getData();

      // Update the dropdowns after deleting the group
      populateDropdowns();

      getGroupMembershipsData();

      fetchDataAndPopulateCounts();

      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Submit");

      toastr.success("Group created successfully");
    })
    .catch((error) => {
      console.error("Error:", error);

      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Submit");
    });
}

// Fetch existing users and populate the dropdown when the document is ready
function fetchAndPopulateUsersDropdown() {
  const adminSelect = $("#adminSelect");

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Fetch existing users from your API
  fetch("http://127.0.0.1:8000/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const assignUserDropdown = $("#adminSelect");
      assignUserDropdown.empty();
      // Add default "Select" option
      assignUserDropdown.append(
        '<option value="" disabled selected>Select Admin</option>'
      );

      // Populate the dropdown with existing users
      data.data.data.forEach((user) => {
        adminSelect.append(`<option value="${user.id}">${user.name}</option>`);
      });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

// Call fetchAndPopulateUsersDropdown when the document is ready
$(document).ready(async function () {
  fetchAndPopulateUsersDropdown();
});

// Call populateDropdowns when the document is ready
populateDropdowns();

///// FUNCTION TO SHOW EDIT MODAL BASED ON GROUP ID
// Store the original values when the edit modal is opened
let originalGroupName, originalGroupAdminId;

function editGroup(groupId) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");
  // Fetch group data based on the group ID
  fetch(`http://127.0.0.1:8000/api/group/show/${groupId}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Store the original values
      originalGroupName = data.data.data.group_name;
      originalGroupAdminId = data.data.data.group_admin_id;

      // Populate the edit form fields
      $("#edit_group_id").val(data.data.data.id);
      $("#edit_group_admin_id").val(data.data.data.group_admin_id);
      $("#edit_group_name").val(data.data.data.group_name);

      // Fetch and populate the edit modal's admin dropdown
      fetchAndPopulateEditUsersDropdown();

      // Select the current admin in the dropdown
      const currentAdminId = originalGroupAdminId;
      $("#edit_adminSelect").val(currentAdminId);

      // Show the modal for editing
      $("#editForm").modal("show");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// FUNCTION TO SUBMIT THE EDIT FORM
function submitEditForm() {
  // Fetch form data
  const groupId = $("#edit_group_admin_id").val();
  const groupName = $("#edit_group_name").val();
  const newAdminId = $("#edit_adminSelect").val();
  const group_id = $("#edit_group_id").val();

  console.log("Original Group Name:", originalGroupName);
  console.log("Original Group Admin ID:", originalGroupAdminId);
  console.log("Current Group Name:", groupName);
  console.log("Current Group Admin ID:", newAdminId);

  // Check if values have changed
  if (groupName === originalGroupName && newAdminId === originalGroupAdminId) {
    toastr.warning("No changes detected.");
    return;
  }

  // Disable the submit button and show loading text
  const submitButton = $("#editSubmitBtn");
  submitButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Updating...');

  // Construct the request payload
  const requestData = {
    group_name: groupName,
    group_admin_id: newAdminId,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    toastr.error("Unauthorized.");
    return;
  }

  // Make a POST request to update the group
  fetch(`http://127.0.0.1:8000/api/groups/update/${group_id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Close the modal after successful submission
      $("#editForm").modal("hide");

      // Refresh the data by calling the getData() function
      getData();
      getGroupMembershipsData();

      // Update the dropdowns after editing the group
      populateDropdowns();

      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Submit");

      toastr.success("Group updated successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// FUNCTION TO FETCH AND POPULATE USERS FOR THE EDIT MODAL DROPDOWN
function fetchAndPopulateEditUsersDropdown() {
  const editAdminSelect = $("#edit_adminSelect");

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    toastr.error("Unauthorized.");
    return;
  }

  // Fetch existing users from your API
  fetch("http://127.0.0.1:8000/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear the dropdown before populating
      editAdminSelect.empty();

      // Add default "Select" option
      editAdminSelect.append(
        '<option value="" disabled>Select New Admin</option>'
      );

      // Populate the dropdown with existing users
      data.data.data.forEach((user) => {
        editAdminSelect.append(
          `<option value="${user.id}">${user.name}</option>`
        );
      });

      // Select the current admin in the dropdown
      const currentAdminId = originalGroupAdminId;
      editAdminSelect.val(currentAdminId);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

// FUNCTION TO PREPARE FOR GROUP DELETION BY SETTING THE GROUP ID TO BE DELETED
function prepareToDeleteGroup(groupId) {
  // Set the group ID to the global variable
  groupToDeleteId = groupId;
}

// FUNCTION TO HANDLE GROUP DELETION
function deleteGroup() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Disable the delete button and show loading text
  const deleteButton = $("#deleteGroupBtn");
  deleteButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

  // Make a DELETE request to delete the group
  fetch(`http://127.0.0.1:8000/api/groups/delete/${groupToDeleteId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Check the response and handle accordingly
      if (data.success) {
        // Clear the add group form
        $("#createForm")[0].reset();

        // Refresh the data by calling the getData() function
        getData();

        getGroupMembershipsData();

        fetchDataAndPopulateCounts();

        // Update the dropdowns after deleting the group
        populateDropdowns();

        toastr.success("Group deleted successfully");
      } else {
        console.error("Failed to delete group:", data.message);
      }
    })
    .finally(() => {
      // Enable the delete button and revert the text
      deleteButton.prop("disabled", false).html("Delete");

      // Hide the confirmation modal
      $("#confirmDeleteModal").modal("hide");
    });
}

// Call populateDropdowns when the document is ready
$(document).ready(async function () {
  await populateDropdowns();
});

async function populateDropdowns() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  try {
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
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
