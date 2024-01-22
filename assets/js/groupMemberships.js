// ****************************GROUP MEMBERSHIPS FUNCTIONS************************ //
async function getGroupMembershipsData(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Fetch group memberships data with pagination parameters
  const membershipsResponse = await fetch(
    `${apiBaseUrl}/groupmemberships?page=${page}&itemsPerPage=${itemsPerPage}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const membershipsData = await membershipsResponse.json();

  // Get the table element
  const membershipsTable = $("#groupMembershipsTab").DataTable({
    lengthMenu: [5, 10, 25, 50],
    destroy: true,
  });

  // Clear the existing table rows
  membershipsTable.clear().draw();

  // Function to fetch user data based on user_id
  const fetchUserData = async (userId) => {
    const userResponse = await fetch(`${apiBaseUrl}/user/show/${userId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    const userData = await userResponse.json();
    return userData.data.data.username;
  };

  // Function to fetch group data based on group_id
  const fetchGroupData = async (groupId) => {
    const groupResponse = await fetch(`${apiBaseUrl}/group/show/${groupId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    const groupData = await groupResponse.json();
    return groupData.data.data.group_name;
  };

  // Iterate through the data and append rows to the DataTable
  for (let index = 0; index < membershipsData.data.data.length; index++) {
    const membership = membershipsData.data.data[index];
    const username = await fetchUserData(membership.user_id);
    const groupName = await fetchGroupData(membership.group_id);

    membershipsTable.row
      .add([
        index + 1,
        username,
        groupName,
        `<a href="#" onclick="confirmDeleteGroupMembership(${membership.id})" title="delete"><i class="fa fa-trash"></i></a>`,
      ])
      .draw(false);
  }

  // Call updateRowNumbers after appending rows to the table body
  updateRowNumbers();

  // Generate pagination links
  const totalPages = Math.ceil(membershipsData.data.total / itemsPerPage);
  const paginationElement = $("#membershipsPagination");
  paginationElement.empty();

  if (totalPages > 1) {
    const prevLink = `<a href="#" onclick="getGroupMembershipsData(${
      page - 1
    }, ${itemsPerPage})" class="page-link">«</a>`;
    paginationElement.append(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = `<a href="#" onclick="getGroupMembershipsData(${i}, ${itemsPerPage})" class="page-link ${
        i === page ? "active" : ""
      }">${i}</a>`;
      paginationElement.append(pageLink);
    }

    const nextLink = `<a href="#" onclick="getGroupMembershipsData(${
      page + 1
    }, ${itemsPerPage})" class="page-link">»</a>`;
    paginationElement.append(nextLink);
  }
}

// FUNCTION TO HANDLE FORM SUBMISSION AND ASSIGN USERS TO A GROUP
function assignUsersToGroup() {
  // Fetch form data
  const groupId = $("#assign_group").val();
  const userIds = $("#assign_users").val();

  // Check if both group and user options are selected
  if (!groupId || !userIds || userIds.length === 0) {
    toastr.error("Please select both a group and at least one user.");
    return;
  }

  // Disable the submit button and show loading text
  const submitButton = $("#assignUsersBtn");
  submitButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Assigning...');

  // Construct the request payload
  const requestData = {
    group_id: groupId,
    user_id: userIds,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Make a POST request to assign group to a group permissions
  fetch(apiBaseUrl + "/groupmemberships/store", {
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
      $("#assignUsersModal").modal("hide");
      $("#assignUsersForm")[0].reset();

      toastr.success("User Assigned to Group successfully");

      // Refresh the data by calling the getData() function
      getData();

      getGroupMembershipsData();
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Assign Users");
    });
}
// Reset the form when the modal is hidden
$("#assignUsersModal").on("hidden.bs.modal", function () {
  $("#assignUsersForm")[0].reset();
});

// FUNCTION TO HANDLE THE CLICK EVENT OF THE DELETE BUTTON IN EACH ROW
function confirmDeleteGroupMembership(membershipId) {
  // Set the membership ID in the hidden input field of the confirmation modal
  document.getElementById("deleteMembershipId").value = membershipId;

  // Show the confirmation modal
  $("#confirmDeleteMmebershipModal").modal("show");
}

// Add this function to handle the click event of the delete button in the confirmation modal
async function deleteGroupMembership() {
  // Retrieve the membership ID from the hidden input field
  const membershipId = document.getElementById("deleteMembershipId").value;

  try {
    // Disable the delete button
    const deleteButton = $("#deleteGroupMembershipBtn");
    deleteButton.prop("disabled", true);

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem("edms_token");

    // Perform the API call to delete the group membership
    const apiUrl = `${apiBaseUrl}/groupmemberships/delete/${membershipId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Handle the response, update the UI, or show a success message
    console.log("Group membership deleted successfully:", data);

    // Close the confirmation modal
    $("#confirmDeleteMmebershipModal").modal("hide");

    toastr.success("Group Membership Deleted Successfully");

    // Refresh the table or update the UI as needed
    getGroupMembershipsData();

    // Refresh the data by calling the getData() function
    getData();
  } catch (error) {
    console.error("Error deleting group membership:", error);

    // Close the confirmation modal
    $("#confirmDeleteMmebershipModal").modal("hide");
  }
}
