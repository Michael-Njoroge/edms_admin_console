//********** ASYNC FUNCTION FOR GROUP PERMISSIONS *******************//
async function fetchData() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/grouppermissions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();

    // Call the function to populate the card container with the fetched data
    populateCards(responseData.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Updated populateCards function
async function populateCards(permissionsData) {
  const cardContainer = document.getElementById(
    "groupPermissionsCardContainer"
  );

  // Create a flex container for the cards
  const flexContainer = document.createElement("div");
  flexContainer.classList.add("custom-flex-container");

  permissionsData.forEach(async (permission) => {
    const card = document.createElement("div");
    card.classList.add("custom-card", "mb-3", "mx-2"); // Adjust spacing as needed

    card.innerHTML = `
      <div class="custom-card-header">
        <h5 class="custom-card-title">Group: ${permission.group.group_name}</h5>
        <p class="custom-card-text">Folder: ${await getFolderName(
          permission.folder_id
        )}</p>
      </div>
      <div class="custom-card-body">
        
        <p class="custom-card-text">User: ${
          permission.view_users ? "View" : "No Access"
        }</p>
        <p class="custom-card-text">Group Membership: ${
          permission.view_group_memberships ? "View" : "No Access"
        }</p>
        <!-- Add other permission details as needed -->
      </div>
      <div class="custom-card-footer">
        <button type="button" class="custom-btn custom-btn-primary" onclick="editPermissions(${
          permission.id
        })"><i class="fa fa-edit"></i>&nbsp; Edit</button>
        <button type="button" class="custom-btn custom-btn-danger" onclick="confirmDeletePermissionModal(${
          permission.id
        })"><i class="fa fa-trash"></i>&nbsp; Delete</button>
      </div>
    `;

    // Append the card to the flex container
    flexContainer.appendChild(card);
  });

  // Append the flex container to the card container
  cardContainer.appendChild(flexContainer);

  // Show the card container
  document.getElementById("groupPermissionsCardContainer").style.display =
    "flex";
}

// ASYNC FUNCTION TO FETCH THE FOLDER NAME BASED ON FOLDER ID
async function getFolderName(folderId) {
  const bearerToken = localStorage.getItem("edms_token");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/folder/show/${folderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      const folderData = responseData.data.data;
      return folderData.name || "Unknown Folder";
    } else {
      console.error("Error fetching folder:", responseData.message);
      return "Unknown Folder";
    }
  } catch (error) {
    console.error("Error fetching folder:", error);
    return "Unknown Folder";
  }
}

// Function to reset modal state
function resetModalState() {
  const folderSelect = document.getElementById("folderSelect");
  const groupSelect = document.getElementById("groupSelect");
  const checkboxContainer = document.getElementById("checkboxContainer");

  // Reset selected values in dropdowns
  folderSelect.value = "";
  groupSelect.value = "";

  // Hide checkboxes
  checkboxContainer.style.display = "none";
}

// FUNCTION TO POPULATE FOLDERS DYNAMICALLY
function populateFolderOptions() {
  const bearerToken = localStorage.getItem("edms_token");

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

// FUNCTION TO POPULATE GROUPS DYNAMICALLY
function populateGroupOptions() {
  const bearerToken = localStorage.getItem("edms_token");

  // Make AJAX requests to fetch group data
  $.ajax({
    url: "http://127.0.0.1:8000/api/groups",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (groupData) {
      const groupSelect = document.getElementById("groupSelect");
      groupSelect.innerHTML = "";

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Group";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      groupSelect.appendChild(defaultOption);

      groupData.data.data.forEach(function (group) {
        const option = document.createElement("option");
        option.value = group.id;
        option.text = group.group_name;
        groupSelect.appendChild(option);
      });
    },
    error: function (error) {
      console.error("Error fetching group data:", error);
    },
  });
}

// FUNCTION TO POPULATE CHECKBOXES DYNAMICALLY
function populateCheckboxOptions() {
  const bearerToken = localStorage.getItem("edms_token");
  const checkboxContainer = document.getElementById("checkboxContainer");
  const folderSelect = document.getElementById("folderSelect");
  const groupSelect = document.getElementById("groupSelect");

  // Make an AJAX request to fetch permission data
  $.ajax({
    url: "http://127.0.0.1:8000/api/grouppermissions",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (permissionData) {
      checkboxContainer.innerHTML = "";

      // Add a "Check All" checkbox
      const checkAllCheckbox = document.createElement("input");
      checkAllCheckbox.type = "checkbox";
      checkAllCheckbox.id = "checkbox_check_all";
      const checkAllLabel = document.createElement("label");
      checkAllLabel.htmlFor = "checkbox_check_all";
      checkAllLabel.innerHTML = "&nbsp;Select All";

      const checkAllDiv = document.createElement("div");
      checkAllDiv.style.cursor = "pointer"; // Add pointer cursor style
      checkAllDiv.appendChild(checkAllCheckbox);
      checkAllDiv.appendChild(checkAllLabel);
      checkboxContainer.appendChild(checkAllDiv);

      // Take the first permission object assuming the permissions are the same for all
      const permissions = permissionData.data.data[0];

      const heading = document.createElement("h4");
      heading.appendChild(document.createTextNode("Select Permissions:"));
      checkboxContainer.appendChild(heading);

      Object.keys(permissions).forEach(function (key) {
        // Skip certain properties like 'id', 'group', 'group_id', 'folder_id', etc.
        if (
          key !== "id" &&
          key !== "group" &&
          key !== "group_id" &&
          key !== "folder_id" &&
          key !== "created_at" &&
          key !== "updated_at"
        ) {
          // Create a checkbox
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = key;
          checkbox.id = `checkbox_${key}`; // Set a unique ID for each checkbox

          // Create a label for the checkbox with a non-breaking space
          const label = document.createElement("label");
          label.htmlFor = `checkbox_${key}`;
          label.innerHTML = `&nbsp;&nbsp;${key}`;

          // Create a div to hold the checkbox and label
          const checkboxDiv = document.createElement("div");
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);

          // Append the checkbox div to the container
          checkboxContainer.appendChild(checkboxDiv);
        }
      });

      // Initially, hide the checkboxes
      checkboxContainer.style.display = "none";

      // Add event listener for the "Check All" checkbox
      checkAllCheckbox.addEventListener("change", function () {
        const checkboxes = checkboxContainer.querySelectorAll(
          'input[type="checkbox"]'
        );
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = checkAllCheckbox.checked;
        });
      });
    },
    error: function (error) {
      console.error("Error fetching checkbox data:", error);
    },
  });
}

// Call the function to reset modal state and populate checkboxes when the modal is hidden
$("#createPermissionModal").on("hidden.bs.modal", function () {
  resetModalState();
});

// Call the function to populate folders and groups when the modal is shown
$("#createPermissionModal").on("show.bs.modal", function () {
  populateFolderOptions();
  populateGroupOptions();
  populateCheckboxOptions();
});

// Show checkboxes when both folder and group are selected
$(document).on("change", "#folderSelect, #groupSelect", function () {
  const folderSelect = document.getElementById("folderSelect");
  const groupSelect = document.getElementById("groupSelect");
  const checkboxContainer = document.getElementById("checkboxContainer");

  if (folderSelect.value && groupSelect.value) {
    checkboxContainer.style.display = "block"; // Display checkboxes
  } else {
    checkboxContainer.style.display = "none"; // Hide checkboxes if either folder or group is not selected
  }
});

// Call the function to populate checkboxes when the page loads
$(document).ready(function () {
  populateCheckboxOptions();
});
// FUNCTION TO HANDLE THE FORM SUBMISSION AND CREATE GROUP PERMISSIONS
function createPermission() {
  // Get the bearer token from local storage
  const bearerToken = localStorage.getItem("edms_token");

  // Get references to HTML elements
  const folderSelect = document.getElementById("folderSelect");
  const groupSelect = document.getElementById("groupSelect");
  const checkboxContainer = document.getElementById("checkboxContainer");

  // Get selected values from dropdowns
  const folderId = folderSelect.value;
  const groupId = groupSelect.value;

  // Get selected checkboxes excluding 'on'
  const selectedCheckboxes = [
    ...checkboxContainer.querySelectorAll('input[type="checkbox"]:checked'),
  ]
    .filter((checkbox) => checkbox.value !== "on")
    .map((checkbox) => checkbox.value);

  // Select the submit button
  const submitButton = $("#createPermissionModalBtn");

  // Check if folder and group are selected
  if (!folderId || !groupId) {
    toastr.error("Please select both a folder and a group.");
    return;
  }

  // Check if at least one permission is selected
  if (selectedCheckboxes.length === 0) {
    toastr.error("Please select at least one permission.");
    return;
  }

  // Disable the submit button and show loading text
  submitButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Assigning...');

  // Prepare data for the AJAX request
  const requestData = {
    group_id: groupId,
    folder_id: folderId,
    // Add individual permissions to the request data
    ...selectedCheckboxes.reduce(
      (acc, permission) => ({ ...acc, [permission]: 1 }),
      {}
    ),
  };

  // Make an AJAX request to store group permissions
  $.ajax({
    url: "http://127.0.0.1:8000/api/grouppermissions/store",
    type: "POST",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(requestData),
    success: function (response) {
      // Close the modal after successfully storing permissions
      $("#createPermissionModal").modal("hide");

      toastr.success("Group permissions stored successfully");

      populateTable(response.data.data);
    },
    error: function (error) {
      // Handle error response
      console.error("Error storing group permissions:", error);
    },
    complete: function () {
      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Assign Permission");
    },
  });
  // Close the modal
  $("#createPermissionModal").modal("hide");
}

// FUNCTION TO HANDLE GROUP PERMISSION EDITING
function editPermissions(permissionId) {
  console.log(`Editing permissions for ID: ${permissionId}`);
}

// GLOBAL VARIABLE TO STORE THE PERMISSION ID TO BE DELETED
let permissionToDeleteId;

// FUNCTION TO PREPARE FOR PERMISSION DELETION BY SETTING THE PERMISSION ID
function confirmDeletePermissionModal(permissionId) {
  // Set the permission ID to the global variable
  permissionToDeleteId = permissionId;
  $("#confirmDeletePermissionModal").modal("show");
}

// FUNCTION TO HANDLE PERMISSION DELETION
function deletePermission() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Disable the delete button and show loading text
  const deleteButton = $("#deletePermissionBtn");
  deleteButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

  // Make a GET request to delete the permission
  fetch(
    `http://127.0.0.1:8000/api/grouppermissions/delete/${permissionToDeleteId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // Check the response
      if (data.success) {
        toastr.success("Permission deleted successfully");
        const tableBody = document.getElementById("permissionsTbody");
        tableBody.innerHTML = "";

        // Refresh the data by calling the fetchData() function
        fetchData();
      } else {
        console.error("Failed to delete permission:", data.message);
      }
    })
    .finally(() => {
      // Enable the delete button and revert the text
      deleteButton.prop("disabled", false).html("Delete");

      // Hide the confirmation modal
      $("#confirmDeletePermissionModal").modal("hide");
    });
}
