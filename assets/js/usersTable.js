///////// FUNCTION TO POPULATE THE USERS TABLE WITH FETCHED USER DATA //////////
// Function to parse a JWT
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

async function populateUsersTable(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Decode the JWT to extract the user ID
  const decodedToken = parseJwt(bearerToken);
  const loggedInUserId = decodedToken.sub;
  const loggedInUser = parseInt(loggedInUserId);

  // Fetch users with pagination parameters
  const records = await fetch(apiBaseUrl + "/users", {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await records.json();

  // Initialize DataTable
  const usersTable = $("#usersTable").DataTable({
    lengthMenu: [5, 10, 25, 50],
    bDestroy: true,
  });

  // Loop through each user and create a table row
  data.data.data.forEach((user, index) => {
    // Check if the user has a photo
    const photoUrl = user.user_profile
      ? `${baseUrl}/storage/user_profiles/${user.user_profile}`
      : "../images/no_image.jpg";

    // Check if the user has a stamp
    const stampUrl =
      user.user_stamps.length > 0
        ? `${baseUrl}/storage/user_stamps/${
            user.user_stamps[user.user_stamps.length - 1].user_stamp
          }`
        : "../images/stamp.jpg";

    // Check if the user has a signature
    const signatureUrl = user.user_signature
      ? `${baseUrl}/storage/user_signatures/${user.user_signature}`
      : "../images/signature.png";

    // Check the status and set the corresponding label and color
    const statusLabel = user.is_active === 1 ? "Active" : "Inactive";
    const statusColor = user.is_active === 1 ? "green" : "red";

    // Check if the user ID matches the logged-in user's ID
    const userId = parseInt(user.id);
    const isCurrentUser = userId === loggedInUser;

    // Determine the action buttons based on the user status
    const activateButton = `<a href="#" onclick="performUserAction('${user.id}', 'activate')" style="margin-left: 20px;"><i class="fa fa-check" title="Activate" style="color: green; font-size: 24px;"></i></a>`;
    let deactivateButton = `<a href="#" onclick="performUserAction('${user.id}', 'deactivate')" style="margin-left: 40px;"><i class="fa fa-ban" title="Deactivate" style="color: red; font-size: 24px; "></i></a>`;

    // Disable the deactivate button if the user is the logged-in user
    if (isCurrentUser) {
      deactivateButton = `<a href="#" onclick="return false;" style="margin-left: 40px; pointer-events: none;"><i class="fa fa-ban" title="Deactivate" style="color: gray; font-size: 24px; "></i></a>`;
    }

    // Get group names
    const groupNames = user.groups.map((group) => group.group_name).join(", ");
    // Concatenate the action buttons and the permissions icon
    const actionButtonsHtml =
      statusLabel === "Active" ? deactivateButton : activateButton;
    const permissionsIconHtml = `<a href="#" data-toggle="modal" data-target="#userPermissionsModal"  onclick="showUserPermissions(${user.id})"><i class="fa fa-users" title="View Permissions" style="font-size: 21px;"></i></a>`;

    // Add the row to DataTable
    usersTable.row
      .add([
        index + 1,
        user.name,
        user.username,
        // groupNames,
        `<img src="${photoUrl}" alt="User Photo" class="user-photo" style="width: 40px; height: 40px; border-radius: 50%;" />`,
        // `<img src="${stampUrl}" alt="User Stamp" class="user-stamp" style="width: 40px; height: 40px; border-radius: 50%;" />`,
        // `<img src="${signatureUrl}" alt="User Signature" class="user-signature" style="width: 40px; height: 40px; border-radius: 50%;" />`,
        `<span style="color: ${statusColor};">${statusLabel}</span>`,
        `${actionButtonsHtml}`,
        // &nbsp;&nbsp;&nbsp;&nbsp${permissionsIconHtml}`,
      ])
      .draw(false);
  });

  // Generate pagination links
  const totalPages = Math.ceil(data.data.total / itemsPerPage);
  const paginationElement = $("#usersPagination");
  paginationElement.empty();

  if (totalPages > 1) {
    const prevLink = `<a href="#" onclick="populateUsersTable(${
      page - 1
    }, ${itemsPerPage})" class="page-link">«</a>`;
    paginationElement.append(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = `<a href="#" onclick="populateUsersTable(${i}, ${itemsPerPage})" class="page-link ${
        i === page ? "active" : ""
      }">${i}</a>`;
      paginationElement.append(pageLink);
    }

    const nextLink = `<a href="#" onclick="populateUsersTable(${
      page + 1
    }, ${itemsPerPage})" class="page-link">»</a>`;
    paginationElement.append(nextLink);
  }
}

// Function to activate a user
function activateUser() {
  const userId = document.getElementById("activateUserId").textContent;
  performUserAction(userId, "activate");
}

// Function to deactivate a user
function deactivateUser() {
  const userId = document.getElementById("deactivateUserId").textContent;
  performUserAction(userId, "deactivate");
}

//Function to perform Activate or Deactivate user
async function performUserAction(userId, action) {
  // Set the modalId and buttonId based on the action
  const modalId =
    action === "activate" ? "confirmActivateModal" : "confirmDeactivateModal";
  const buttonId =
    action === "activate" ? "activateUserBtn" : "deactivateUserBtn";

  // Set the user's ID in the modal
  document.getElementById(`${action}UserId`).textContent = userId;

  // Show the modal
  $(`#${modalId}`).modal("show");

  // Display loading spinner and message
  const loadingSpinner = $(`#${modalId} .loading-spinner`);
  const loadingMessage = $(`#${modalId} .loading-message`);

  loadingSpinner.show();
  loadingMessage.text(
    ` ${action === "activate" ? "Activating" : "Deactivating"} user...`
  );

  // Handle submission in the modal
  document.getElementById(buttonId).addEventListener("click", async () => {
    // Close the modal
    $(`#${modalId}`).modal("hide");

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem("edms_token");

    // Check if the token is present in localStorage
    if (!bearerToken) {
      console.error("Unauthorized");
      return;
    }

    try {
      // Perform the user activation or deactivation based on the action
      const response = await fetch(`${apiBaseUrl}/users/update/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: action === "activate" ? 1 : 0,
        }),
      });

      // Check if the action was successful
      if (response.ok) {
        // Initialize DataTable
        const usersTable = $("#usersTable").DataTable({
          lengthMenu: [5, 10, 25, 50],
          bDestroy: true,
        });

        // Clear existing rows from DataTable
        usersTable.clear().draw();

        // Reload or update the users table after the action
        populateUsersTable();

        // Display success message
        toastr.success(
          `${
            action === "activate" ? "Activated" : "Deactivated"
          } user successfully`
        );
      } else {
        console.error(`Failed to ${action} user.`);
        // Display error message
        toastr.error(
          `Failed to ${action === "activate" ? "activate" : "deactivate"} user.`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // Display error message
      toastr.error(
        `An error occurred while ${
          action === "activate" ? "activating" : "deactivating"
        } user.`
      );
    } finally {
      // Hide loading spinner and reset message
      loadingSpinner.hide();
      loadingMessage.text("");
    }
  });
}

//Permissions for specific user

// Function to show user permissions in the side panel
function showUserPermissions(userId) {
  // Fetch user permissions based on the user ID and populate the table
  fetchUserPermissions(userId);
}

// Function to fetch user permissions and populate the table
function fetchUserPermissions(userId) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Fetch user details
  fetch(`${apiBaseUrl}/user/show/${userId}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const userPermissions = data.data.data.user_permissions;

      // Get the tbody element to populate the permissions table
      const userPermissionsBody = document.getElementById(
        "userPermissionsModalBody"
      );
      userPermissionsBody.innerHTML = "";

      // Exclude properties like 'id', 'user', 'user_id', 'created_at', 'updated_at'
      const excludedProperties = [
        "id",
        "user",
        "user_id",
        "created_at",
        "updated_at",
      ];

      // Loop through the permissions object and create table rows
      for (const permission in userPermissions) {
        // Check if the permission should be excluded
        if (!excludedProperties.includes(permission)) {
          const backgroundColor = userPermissions[permission] ? "green" : "red";
          const permissionRow = `<tr>
                                    <td>${permission}</td>
                                   <td style="background-color: ${backgroundColor}; color: white;">
                                  ${
                                    userPermissions[permission]
                                      ? "Granted"
                                      : "Rejected"
                                  }
                                </td>
                                  </tr>`;
          userPermissionsBody.innerHTML += permissionRow;
        }
      }
    })
    .catch((error) => console.error("Error fetching user permissions:", error));
}
