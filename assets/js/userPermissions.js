//********** ASYNC FUNCTION FOR GROUP PERMISSIONS *******************//

async function fetchData() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");
  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    toastr.error("Unauthorized access!");
    return;
  }
  try {
    const response = await fetch(apiBaseUrl + "/userpermissions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    // Call the function to populate the table with the fetched data
    populateTable(responseData.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// FUNCTION TO POPULATE THE GROUP PERMISSION TABLE WITH DATA
async function populateTable(permissionsData, page = 1, itemsPerPage = 5) {
  // Initialize DataTable for permissions
  const permissionsTable = $("#permissionsTable").DataTable({
    lengthMenu: [5, 10, 25, 50],
    bDestroy: true,
    dom: "Bfrtip",
    scrollX: true,
    scrollCollapse: true,
    fixedColumns: {
      leftColumns: 2,
    },
    columnDefs: [
      {
        targets: [2],
        className: "noVis",
      },
    ],
    buttons: [
      {
        extend: "colvis",
        columns: ":not(.noVis)",
      },
    ],
  });

  // Clear the existing table
  permissionsTable.clear().draw();

  await Promise.all(
    permissionsData.map(async (permission, index) => {
      // Check if the current permission is one of the seeded permissions
      const isSeededPermission = index < 2;

      // Add the row to DataTable
      permissionsTable.row
        .add([
          // Add data for each column in the permissions table
          index + 1,
          permission.user.username,
          `<input type="checkbox" ${
            permission.view_users ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.add_user ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.assign_user_group ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_user ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.update_user ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.delete_user ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_groups ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.add_group ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_group ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.update_group ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.delete_group ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_group_memberships ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.add_group_membership ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_group_membership ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.update_group_membership ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.delete_group_membership ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_user_permissions ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.add_user_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_user_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.update_user_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.delete_user_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_group_permissions ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.add_group_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.view_group_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.update_group_permission ? "checked" : ""
          } disabled>`,
          `<input type="checkbox" ${
            permission.delete_group_permission ? "checked" : ""
          } disabled>`,

          // Add a delete button
          `<a
          href="#"
          onclick="event.preventDefault(); editPermissions(${
            permission.id
          })" data-toggle="modal" data-target="#editPermissionModal" title="edit"><i class="fa fa-edit"></i>
        </a>&nbsp;&nbsp;
        ${
          isSeededPermission
            ? `<i class="fa fa-trash" style="color: lightgrey; cursor: not-allowed;" title="Cannot delete this permission" aria-disabled="true"></i>`
            : `<a href="#" onclick="event.preventDefault(); confirmDeletePermissionModal(${permission.id})" title="delete"><i class="fa fa-trash"></i></a>`
        }`,
        ])
        .draw(false);
    })
  );
  // Show the permissions table container
  $("#permissionsTableContainer").show();

  // Generate pagination links
  const totalPages = Math.ceil(permissionsData.total / itemsPerPage);
  const paginationElement = $("#permissionsPagination");
  paginationElement.empty();

  if (totalPages > 1) {
    const prevLink = `<a href="#" onclick="populateGroupPermissionsTable(${
      page - 1
    }, ${itemsPerPage})" class="page-link">«</a>`;
    paginationElement.append(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = `<a href="#" onclick="populateGroupPermissionsTable(${i}, ${itemsPerPage})" class="page-link ${
        i === page ? "active" : ""
      }">${i}</a>`;
      paginationElement.append(pageLink);
    }

    const nextLink = `<a href="#" onclick="populateGroupPermissionsTable(${
      page + 1
    }, ${itemsPerPage})" class="page-link">»</a>`;
    paginationElement.append(nextLink);
  }
}

// Function to reset modal state
function resetModalState() {
  const userSelect = document.getElementById("userSelect");
  const checkboxContainer = document.getElementById("checkboxContainer");

  // Reset selected values in dropdowns
  userSelect.value = "";

  // Hide checkboxes
  checkboxContainer.style.display = "none";
}

// FUNCTION TO POPULATE USERS DYNAMICALLY AND INITIATE TOM SELECT
function populateUserOptions() {
  const bearerToken = localStorage.getItem("edms_token");
  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    toastr.error("Unauthorized access!");
    return;
  }

  // Make AJAX requests to fetch user data
  $.ajax({
    url: apiBaseUrl + "/users",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (usersData) {
      const userSelect = document.getElementById("userSelect");
      userSelect.innerHTML = "";

      // Check if there are users in the response
      if (usersData.data.data && usersData.data.data.length > 0) {
        // Iterate over the users and populate the dropdown
        usersData.data.data.forEach(function (user) {
          const option = document.createElement("option");
          option.value = user.id;
          option.text = user.name;
          userSelect.appendChild(option);
        });
      } else {
        // If no users are found, you may want to handle this case
        console.error("No users found.");
      }

      // Initialize Tom Select with fetched options
      new TomSelect("#userSelect", {
        create: false,
        placeholder: "Select User",
        options: userSelect,
        sortField: {
          field: "text",
          direction: "asc",
        },
      });
    },
    error: function (error) {
      console.error("Error fetching user data:", error);
    },
  });
}

// FUNCTION TO POPULATE CHECKBOXES DYNAMICALLY
function populateCheckboxOptions() {
  const bearerToken = localStorage.getItem("edms_token");
  const checkboxContainer = document.getElementById("checkboxContainer");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    toastr.error("Unauthorized access!");
    return;
  }

  // Make an AJAX request to fetch permission data
  $.ajax({
    url: apiBaseUrl + "/userpermissions",
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
        // Skip certain properties like 'id'
        if (
          key !== "id" &&
          key !== "user" &&
          key !== "user_id" &&
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
// Call the function to populate users
$("#createPermissionModal").on("show.bs.modal", function () {
  populateUserOptions();
  populateCheckboxOptions();
});
// Show checkboxes when both user
$(document).on("change", "#userSelect", function () {
  const userSelect = document.getElementById("userSelect");
  const checkboxContainer = document.getElementById("checkboxContainer");
  if (userSelect.value) {
    checkboxContainer.style.display = "block"; // Display checkboxes
  } else {
    checkboxContainer.style.display = "none"; // Hide checkboxes if either user or group is not selected
  }
});

// Call the function to populate checkboxes when the page loads
$(document).ready(function () {
  populateCheckboxOptions();
});

// FUNCTION TO HANDLE THE FORM SUBMISSION AND CREATE GROUP PERMISSIONS
function createPermission() {
  try {
    // Get the bearer token from local storage
    const bearerToken = localStorage.getItem("edms_token");
    // Check if the token is present in localStorage
    if (!bearerToken) {
      console.error("Unauthorized");
      toastr.error("Unauthorized access!");
      return;
    }

    // Get references to HTML elements
    const userSelect = document.getElementById("userSelect");
    const checkboxContainer = document.getElementById("checkboxContainer");

    // Get selected values from dropdowns
    const userId = userSelect.value;

    // Get selected checkboxes excluding 'on'
    const selectedCheckboxes = [
      ...checkboxContainer.querySelectorAll('input[type="checkbox"]:checked'),
    ]
      .filter((checkbox) => checkbox.value !== "on")
      .map((checkbox) => checkbox.value);

    // Check if user is selected
    if (!userId) {
      toastr.error("Please select user");
      return;
    }

    // Check if at least one permission is selected
    if (selectedCheckboxes.length === 0) {
      toastr.error("Please select at least one permission.");
      return;
    }

    // Disable the submit button and show loading text
    const submitButton = $("#createPermissionModalBtn");
    submitButton
      .prop("disabled", true)
      .html('<i class="fa fa-spinner fa-spin"></i> Assigning...');

    // Prepare data for the AJAX request
    const requestData = {
      user_id: userId,
      // Add individual permissions to the request data
      ...selectedCheckboxes.reduce(
        (acc, permission) => ({ ...acc, [permission]: 1 }),
        {}
      ),
    };

    // Make an AJAX request to store group permissions
    $.ajax({
      url: apiBaseUrl + "/userpermission/store",
      type: "POST",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(requestData),
    })
      .then(function (response) {
        // Close the modal after successfully storing permissions
        $("#createPermissionModal").modal("hide");

        toastr.success("User assigned permission successfully");
        fetchData();
        populateTable(response.data.data);
        // Enable the submit button and revert the text
        submitButton.prop("disabled", false).html("Assign Permission");
      })
      .catch(function (error) {
        // Handle error response
        console.error("Error storing user permissions:", error);
      })
      .finally(function () {
        // Enable the submit button and revert the text
        submitButton.prop("disabled", false).html("Assign Permission");
      });

    // Close the modal
    $("#createPermissionModal").modal("hide");
    fetchData();
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

// FUNCTION TO HANDLE GROUP PERMISSION EDITING
function editPermissions(permissionId) {
  // Call the function to populate data in the modal based on the permissionId
  populateEditPermissionModal(permissionId);
}

// FUNCTION TO POPULATE EDIT GROUP PERMISSION MODAL
function populateEditPermissionModal(permissionId) {
  const bearerToken = localStorage.getItem("edms_token");
  const editUserSelect = document.getElementById("editUserSelect");
  const editPermissionIdInput = document.getElementById("editPermissionId");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    toastr.error("Unauthorized access!");
    return;
  }

  // Make AJAX request to fetch data for the given permissionId
  $.ajax({
    url: `${apiBaseUrl}/userpermission/show/${permissionId}`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (permissionData) {
      const { user_id, ...permissions } = permissionData.data.data;
      // Fetch all users and populate the user dropdown
      fetchAllUsersAndPopulateDropdown(editUserSelect, user_id);

      // Populate checkboxes based on existing permissions
      populateEditCheckboxOptions(permissions);

      // Show the "Edit User Permission" modal
      $("#editPermissionModal").modal("show");

      // Set the group permission ID in the hidden input field
      editPermissionIdInput.value = permissionId;
    },
    error: function (error) {
      console.error("Error fetching data for permissionId:", error);
    },
  });
}

// Function to fetch all users and populate the dropdown
function fetchAllUsersAndPopulateDropdown(selectElement, selectedUserId) {
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    toastr.error("Unauthorized access!");
    return;
  }
  $.ajax({
    url: `${apiBaseUrl}/users`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    success: function (userData) {
      selectElement.innerHTML = "";

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select User";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectElement.appendChild(defaultOption);

      userData.data.data.forEach(function (user) {
        const option = document.createElement("option");
        option.value = user.id;
        option.text = user.name;
        selectElement.appendChild(option);
      });

      // Set the selected user based on the permission data
      selectElement.value = selectedUserId;
    },
    error: function (error) {
      console.error("Error fetching User data:", error);
    },
  });
}

// FUNCTION TO POPULATE CHECKBOXES DYNAMICALLY FOR EDITING User PERMISSION
function populateEditCheckboxOptions(permissions) {
  const checkboxContainer = document.getElementById("editCheckboxContainer");

  // Clear existing checkboxes
  checkboxContainer.innerHTML = "";

  const heading = document.createElement("h4");
  heading.appendChild(document.createTextNode("Edit Permissions:"));
  checkboxContainer.appendChild(heading);

  Object.entries(permissions).forEach(([permission, value]) => {
    // Skip certain properties like 'id', 'group_id', 'user_id', etc.
    if (
      permission !== "id" &&
      permission !== "user_id" &&
      permission !== "user" &&
      permission !== "created_at" &&
      permission !== "updated_at"
    ) {
      // Create a checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = permission;
      checkbox.id = `edit_checkbox_${permission}`; // Set a unique ID for each checkbox

      // Check the checkbox if the permission is granted
      checkbox.checked = value === 1;

      // Create a label for the checkbox with a non-breaking space
      const label = document.createElement("label");
      label.htmlFor = `edit_checkbox_${permission}`;
      label.innerHTML = `&nbsp;&nbsp;${permission}`;

      // Create a div to hold the checkbox and label
      const checkboxDiv = document.createElement("div");
      checkboxDiv.appendChild(checkbox);
      checkboxDiv.appendChild(label);

      // Append the checkbox div to the container
      checkboxContainer.appendChild(checkboxDiv);
    }
  });

  // Keep the checkboxes visible
  checkboxContainer.style.display = "block";
}

// FUNCTION TO SUBMIT THE EDIT PERMISSION FORM
function submitEditPermissionsForm() {
  try {
    // Fetch form data
    const userId = $("#editUserSelect").val();
    const groupPermissionId = $("#editPermissionId").val();

    // Fetch the selected checkboxes for permissions
    const selectedPermissions = getSelectedPermissions();

    // Disable the submit button and show loading text
    const submitButton = $("#updatePermissionModalBtn");
    submitButton
      .prop("disabled", true)
      .html('<i class="fa fa-spinner fa-spin"></i> Updating...');

    // Construct the request payload
    const requestData = {
      user_id: userId,
      ...selectedPermissions,
    };

    // Make an AJAX request to update the group permission
    $.ajax({
      url: `${apiBaseUrl}/userpermission/update/${groupPermissionId}`,
      type: "POST",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(requestData),
    })
      .then(function (response) {
        // Close the modal after successfully updating permissions
        $("#editPermissionModal").modal("hide");

        toastr.success("User permission updated successfully");
        // Enable the submit button and revert the text
        submitButton.prop("disabled", false).html("Save Changes");
        fetchData();
      })
      .catch(function (error) {
        console.error("Error updating group permission:", error);
      })
      .finally(function () {
        // Enable the submit button and revert the text
        submitButton.prop("disabled", false).html("Save Changes");
      });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

// Helper function to get selected permissions from checkboxes
function getSelectedPermissions() {
  const selectedPermissions = {};

  $("#editCheckboxContainer input[type='checkbox']").each(function () {
    // Determine the value based on the checked state
    const value = this.checked ? 1 : 0;

    // Assign the value to the corresponding permission
    selectedPermissions[this.value] = value;
  });

  return selectedPermissions;
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
    toastr.error("Unauthorized access!");
    return;
  }

  // Disable the delete button and show loading text
  const deleteButton = $("#deletePermissionBtn");
  deleteButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

  // Make a GET request to delete the permission
  fetch(`${apiBaseUrl}/userpermission/delete/${permissionToDeleteId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
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
