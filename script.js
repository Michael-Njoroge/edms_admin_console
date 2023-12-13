
    //************************** GLOBAL FUNCTIONS*********************************//


// FUNCTION TO UPDATE THE TABLE ROW NUMBERS DYNAMICALLY
function updateRowNumbers() {
    // Update the rows in the "groupsTab" table
    const tabRows = document.querySelectorAll('#tab tbody tr');
    tabRows.forEach((row, index) => {
        // Update the first cell (index 0) in each row with the new row number
        row.cells[0].textContent = index + 1;
    });

    // Update the rows in the "groupMembershipsTab" table
    const groupMembershipsRows = document.querySelectorAll('#groupMembershipsTab tbody tr');
    groupMembershipsRows.forEach((row, index) => {
        // Update the first cell (index 0) in each row with the new row number
        row.cells[0].textContent = index + 1;
    });
}

// FUNCTION TO HANDLE DATATABLES
// $(document).ready(function() {
//   var table = $('#groupMembershipsTab').DataTable({
//     scrollX: false,
//      scrollCollapse: true,
//     paging: true,
//     fixedHeader: true
//   });});


//******************************** SIDEBAR FUNCTIONS *********************************//


// FUNCTION TO HANDLE TABLE DISPLAY BASED ON SELECTED RADIO BUTTON
$(document).ready(function() {

    // Handle click events for radio buttons
    $('input[name="sidebar_tab1"]').on('change', function() {
      var value = $(this).val();

      // Store the selected tab in localStorage
      localStorage.setItem('lastSelectedTab', value);

      // Hide all tables
      $('.table-container').hide();

      // Show the corresponding table based on the selected radio button
      if (value === '3') {
        $('#groupsTableContainer').show();
      } else if (value === '4') {
        $('#groupMembershipsTableContainer').show();
      }else if (value === '5') {
        $('#groupPermissionsTableContainer').show();
      }
      // Add more conditions for other radio buttons  
    });

    // Retrieve the last selected radio button value from local storage
    var lastSelectedTab = localStorage.getItem('lastSelectedTab');

     // Set the default value if no value is found in local storage
     if (!lastSelectedTab) {
      lastSelectedTab = '1';  
    }

     // Set the last selected radio button as checked
     $('input[name="sidebar_tab1"][value="' + lastSelectedTab + '"]').prop('checked', true);

     // Trigger the change event to display the corresponding table
     $('input[name="sidebar_tab1"][value="' + lastSelectedTab + '"]').change();

     // Trigger display of "Permissions" table on page load
    if (lastSelectedTab === '5') {
        $('#groupPermissionsTableContainer').show();
    }
 
  });



        //**************************** NAVBAR FUNCTIONS*************************//


// FUNCTION TO FETCH USER INFORMATION BASED ON THE LOGGED-IN USER'S ID
function fetchUserInfoAndUpdateNavbar() {
    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');

    // Check if the token is present in localStorage
    if (!bearerToken) {
        console.error('Unauthorized');
        return;
    }

    // Decode the JWT to extract the user ID
    const decodedToken = parseJwt(bearerToken);
    const userId = decodedToken.sub; // Assuming 'sub' contains the user ID
 
    // Make a GET request to fetch user information based on the user's ID
    fetch(`http://127.0.0.1:8000/api/user/show/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Update the user's name in the navigation bar
        updateUserNameInNavbar(data.data.data.name);

         // Update the profile modal
         updateProfileModal(data.data.data);
 
        // Call populateDropdowns once user information is retrieved
        populateDropdowns();
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
    });
}

// FUNCTION TO UPDATE THE USER'S NAME IN THE NAVIGATION BAR
function updateUserNameInNavbar(userName) {
    // Update the user's name in the navigation bar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.innerText = userName;
    }
}

// FUNCTION TO UPDATE THE PROFILE MODAL
function updateProfileModal(userData) {
  const profileUsernameElement = document.getElementById('profile-username');
  const profileNameElement = document.getElementById('profile-name');
  const profileModalTitleElement = document.getElementById('profileModalLabel');

  if (profileUsernameElement && profileNameElement) {
    profileUsernameElement.innerText = userData.username;
 
    profileNameElement.innerText = userData.name;
  }

    // Update the modal title to include the name
    profileModalTitleElement.innerText = `${userData.name} Profile`;
}

// Function to parse a JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
     const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  
    return JSON.parse(jsonPayload);
}

// Call fetchUserInfoAndUpdateNavbar before the document is ready
fetchUserInfoAndUpdateNavbar();

// Call populateDropdowns when the document is ready
populateDropdowns();
 


// ******************************* GROUPS FUNCTIONS **************************** //


// FUCTION TO CALL AND DISPLAY GROUP DATA
async function getData() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
      console.error('Unauthorized');
      return;
  }

  // Fetch groups
  const records = await fetch('http://127.0.0.1:8000/api/groups', {
      headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
      }
  });

  const data = await records.json();

  const tableBody = document.getElementById('tbody');

  tableBody.innerHTML = '';

  data.data.data.forEach(group => {
      const row = document.createElement('tr');

      // Group information
      row.innerHTML += `<td>${group.id}</td>`;
      row.innerHTML += `<td>${group.group_name}</td>`;
      row.innerHTML += `<td>${group.group_admin_id}</td>`;

      // Users
      const users = group.users.length;
      row.innerHTML += `<td>${users}</td>`;

      // Check if the group is not a seed group (disable delete for groups with id 1 and 2)
      if (group.id === 1 || group.id === 2) {
          row.innerHTML += `<td style="font-size:21px; ">
                <center>
                    <a href="#" data-toggle="modal" data-target="#editForm" onclick="editGroup(${group.id})" data-groupid="${group.id}" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
                    <i class="fa fa-trash" style="color: lightgrey; cursor: not-allowed;" title="Cannot delete this group" aria-disabled="true"></i>
                </center>
            </td>`;
      } else {
          row.innerHTML += `<td style="font-size:21px; ">
                <center>
                    <a href="#" data-toggle="modal" data-target="#editForm" onclick="editGroup(${group.id})" data-groupid="${group.id}" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
                    <a href="#" data-toggle="modal" data-target="#confirmDeleteModal" onclick="prepareToDeleteGroup(${group.id})" title="delete"><i class="fa fa-trash"></i></a>
                </center>
            </td>`;
      }

      tableBody.appendChild(row);
  });

  // Call updateRowNumbers after appending rows to the table body
  updateRowNumbers();
}
    

// FUNCTION TO HANDLE FORM SUBMISSION AND CREATE A NEW GROUP
function createGroup() {
  // Fetch form data
  const groupName = $('#group_name').val();
  const adminId = $('#admin_id').val();

   // Validate form fields
   if (!groupName || !adminId) {
    toastr.error('Please fill out all fields.');
    return;
  }

  // Disable the submit button and show loading text
  const submitButton = $('#submitBtn');
  submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Loading...');

  // Construct the request payload
  const requestData = {
    group_name: groupName,
    group_admin_id: adminId,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

 
  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Make a POST request to create a new group
  fetch('http://127.0.0.1:8000/api/groups/store', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
  .then(response => response.json())
  .then(data => {
   

    //close the modal after successful submission
    $('#form').modal('hide');

    // Clear the add group form
    $('#createForm')[0].reset();

    //refresh the data by calling the getData() function
    getData();

    // Update the dropdowns after deleting the group
    populateDropdowns();

    // Enable the submit button and revert the text
    submitButton.prop('disabled', false).html('Submit');

    toastr.success('Group created successfully');
  })
  .catch(error => {
    console.error('Error:', error);

    // Enable the submit button and revert the text
    submitButton.prop('disabled', false).html('Submit');
  });
}

//FUNCTION TO SHOW EDIT MODAL BASED ON GROUP ID

// Store the original values when the edit modal is opened
let originalGroupName, originalGroupAdminId;

function editGroup(groupId) {
  
    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');
      // Fetch group data based on the group ID
      fetch(`http://127.0.0.1:8000/api/group/show/${groupId}`, {
          headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => {

        // Store the original values
        originalGroupName = data.data.data.group_name;
        originalGroupAdminId = data.data.data.group_admin_id;


          // Populate the edit form fields
          $('#edit_group_id').val(data.data.data.id);
          $('#edit_group_admin_id').val(data.data.data.group_admin_id);        
          $('#edit_group_name').val(data.data.data.group_name);
  
     
          // Show the modal for editing
          $('#editForm').modal('show');
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }   

// FUNCTION TO SUBMIT THE EDIT FORM
function submitEditForm() {
    // Fetch form data
    const groupId = $('#edit_group_admin_id').val();
    const groupName = $('#edit_group_name').val();
    const group_id = $('#edit_group_id').val();

    console.log('Original Group Name:', originalGroupName);
    console.log('Current Group Name:', groupName);
   
 
     // Check if values have changed
     if (groupName === originalGroupName) {
      toastr.warning('No changes detected.');
      return;
  }

    // Disable the submit button and show loading text
    const submitButton = $('#editSubmitBtn');
    submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Updating...');

    // Construct the request payload
    const requestData = {
        group_name: groupName,
        group_admin_id: groupId,
     };

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');

    // Check if the token is present in localStorage
    if (!bearerToken) {
      toastr.error('Unauthorized.');
        return;
    }

    // Make a POST request to update the group
    fetch(`http://127.0.0.1:8000/api/groups/update/${group_id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
 
        //close the modal after successful submission
        $('#editForm').modal('hide');

        //refresh the data by calling the getData() function
        getData();
        getGroupMembershipsData()

        // Update the dropdowns after editing the group
        populateDropdowns();

        // Enable the submit button and revert the text
        submitButton.prop('disabled', false).html('Submit');

      toastr.success('Group updated successfully');
    })
    .catch(error => {
        console.error('Error:', error);
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
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

  // Disable the delete button and show loading text
  const deleteButton = $('#deleteGroupBtn');
  deleteButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Deleting...');

  // Make a DELETE request to delete the group
  fetch(`http://127.0.0.1:8000/api/groups/delete/${groupToDeleteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      // Check the response and handle accordingly
      if (data.success) {
       // Clear the add group form
       $('#createForm')[0].reset();

         // Refresh the data by calling the getData() function
        getData();

        getGroupMembershipsData()

        // Update the dropdowns after deleting the group
        populateDropdowns();

        toastr.success('Group deleted successfully');
      } else {
        console.error('Failed to delete group:', data.message);
      }
    }).finally(() => {
         // Enable the delete button and revert the text
      deleteButton.prop('disabled', false).html('Delete');

      // Hide the confirmation modal
      $('#confirmDeleteModal').modal('hide');
    });
}



// ****************************GROUP MEMBERSHIPS FUNCTIONS************************ //


// FUNCTION TO FETCH AND DISPLAY GROUP MEMBERSHIPS DATA
async function getGroupMembershipsData() {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Fetch group memberships
  const membershipsResponse = await fetch('http://127.0.0.1:8000/api/groupmemberships', {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    }
  });

  const membershipsData = await membershipsResponse.json();

  console.log(membershipsData);

  // Get the table body element
  const membershipsTableBody = document.getElementById('groupMembershipsTbody');
  // Clear the existing table rows
  membershipsTableBody.innerHTML = '';

  // Function to fetch user data based on user_id
  const fetchUserData = async (userId) => {
    const userResponse = await fetch(`http://127.0.0.1:8000/api/user/show/${userId}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    const userData = await userResponse.json();
    return userData.data.data.username;
  };

  // Function to fetch group data based on group_id
  const fetchGroupData = async (groupId) => {
    const groupResponse = await fetch(`http://127.0.0.1:8000/api/group/show/${groupId}`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });
    const groupData = await groupResponse.json();
    return groupData.data.data.group_name;
  };

  // Iterate through the data and append rows to the table
  for (const membership of membershipsData.data.data) {
    const row = document.createElement('tr');

    // Group information
    row.innerHTML += `<td>${membership.id}</td>`;

    // Fetch user data based on user_id
    const username = await fetchUserData(membership.user_id);
    // Fetch group data based on group_id
    const groupName = await fetchGroupData(membership.group_id);

    row.innerHTML += `<td>${username}</td>`;
    row.innerHTML += `<td>${groupName}</td>`;

    row.innerHTML += `<td style="font-size:21px; ">
    <center>
       <a href="#" onclick="confirmDeleteGroupMembership(${membership.id})" title="delete"> <i class="fa fa-trash"></i></a>
    </center>
    </td>`;

    membershipsTableBody.appendChild(row);
  }

  
  // Call updateRowNumbers after appending rows to the table body
  updateRowNumbers();
}

// Add this function to handle the click event of the delete button in each row
function confirmDeleteGroupMembership(membershipId) {

  // Set the membership ID in the hidden input field of the confirmation modal
 document.getElementById('deleteMembershipId').value = membershipId;

   // Show the confirmation modal
   $('#confirmDeleteMmebershipModal').modal('show');
 }

  // Add this function to handle the click event of the delete button in the confirmation modal
  async function deleteGroupMembership() {

    // Retrieve the membership ID from the hidden input field
 const membershipId = document.getElementById('deleteMembershipId').value;

 try {

        // Disable the delete button
        const deleteButton = $('#deleteGroupMembershipBtn');
        deleteButton.prop('disabled', true);
      
      // Retrieve the Bearer token from localStorage
      const bearerToken = localStorage.getItem('edms_token');

       // Perform the API call to delete the group membership
    const apiUrl = `http://127.0.0.1:8000/api/groupmemberships/delete/${membershipId}`;

   const response = await fetch(apiUrl, {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${bearerToken}`,
       'Content-Type': 'application/json'
     },
   });

   const data = await response.json();

   // Handle the response, update the UI, or show a success message
   console.log('Group membership deleted successfully:', data);

   // Close the confirmation modal
   $('#confirmDeleteMmebershipModal').modal('hide');

   toastr.success('Group Membership Deleted Successfully');

   // Refresh the table or update the UI as needed
   getGroupMembershipsData();

    // Refresh the data by calling the getData() function
    getData();
   
 } catch (error) {
   console.error('Error deleting group membership:', error);

    // Close the confirmation modal
   $('#confirmDeleteMmebershipModal').modal('hide');
   
 }
}


//FUNCTION TO FETCH AND POPULATE DROPDOWNS WITH EXISTING GROUPS AND USERS

async function populateDropdowns() {
    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');
   
      // Fetch existing groups
      const groupsResponse = await fetch('http://127.0.0.1:8000/api/groups', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      const groupsData = await groupsResponse.json();
       
      const assignGroupDropdown = $('#assign_group');
      assignGroupDropdown.empty();

      // Add default "Select" option
      assignGroupDropdown.append('<option value="" disabled selected>Select Group</option>');

      groupsData.data.data.forEach(group => {
        assignGroupDropdown.append(`<option value="${group.id}">${group.group_name}</option>`);
      });
  
      // Fetch existing users
      const usersResponse = await fetch('http://127.0.0.1:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }
      });
  
      const usersData = await usersResponse.json();
      const assignUsersDropdown = $('#assign_users');
  
          // Fetch the selected group
      const selectedGroupId = assignGroupDropdown.val();
      
      // Get users in the selected group
      const selectedGroup = groupsData.data.data.find(group => group.id == selectedGroupId);
      const usersInGroup = selectedGroup ? selectedGroup.users.map(user => user.id) : [];
  
      assignUsersDropdown.empty();

      // Add default "Select" option
      assignUsersDropdown.append('<option value="" disabled selected>Select User</option>');

      usersData.data.data.forEach(user => {
        assignUsersDropdown.append(`<option value="${user.id}">${user.username}</option>`);
      });
  }
  
  // Call populateDropdowns when the document is ready
  $(document).ready(function() {
    populateDropdowns();
  });
  
  
// FUNCTION TO HANDLE FORM SUBMISSION AND ASSIGN USERS TO A GROUP
function assignUsersToGroup() {
    // Fetch form data
    const groupId = $('#assign_group').val();
    const userIds = $('#assign_users').val();

        // Check if both group and user options are selected
    if (!groupId || !userIds || userIds.length === 0) {
        toastr.error('Please select both a group and at least one user.');
        return;
    }

     // Disable the submit button and show loading text
  const submitButton = $('#assignUsersBtn');
  submitButton.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Assigning...');

  
    // Construct the request payload
    const requestData = {
      group_id: groupId,
      user_id: userIds,
    };

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');
  
    // Make a POST request to assign group to a group permissions
    fetch('http://127.0.0.1:8000/api/groupmemberships/store', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
   
      // Close the modal after successful submission
      $('#assignUsersModal').modal('hide');
      $('#assignUsersForm')[0].reset();
  
      toastr.success('User Assigned to Group successfully');
  
      // Refresh the data by calling the getData() function
      getData();
  
      getGroupMembershipsData()
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
        // Enable the submit button and revert the text
        submitButton.prop('disabled', false).html('Assign Users');
      });
  }




  //********** */ ASYNC FUNCTION TO FETCH GROUP PERMISSIONS DATA FROM THE API *******************//
  async function fetchData() {

     // Retrieve the Bearer token from localStorage
     const bearerToken = localStorage.getItem('edms_token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/grouppermissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();

      console.log(responseData);

      // Call the function to populate the table with the fetched data
      populateTable(responseData.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  // FUNCTION TO POPULATE THE  GROUP PERMISSION TABLE WITH DATA
  async function populateTable(permissionsData) {
    const permissionsTbody = document.getElementById('permissionsTbody');

    permissionsData.forEach(async(permission, index) => {
    const newRow = permissionsTbody.insertRow();

    newRow.insertCell(0).textContent = index + 1;
    newRow.insertCell(1).textContent = permission.group.group_name; 
    newRow.insertCell(2).textContent = await getFolderName(permission.folder_id);
    newRow.insertCell(3).innerHTML = `<input type="checkbox" ${permission.view_users ? 'checked' : ''} disabled>`;
    newRow.insertCell(4).innerHTML = `<input type="checkbox" ${permission.add_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(5).innerHTML = `<input type="checkbox" ${permission.assign_user_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(6).innerHTML = `<input type="checkbox" ${permission.view_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(7).innerHTML = `<input type="checkbox" ${permission.update_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(8).innerHTML = `<input type="checkbox" ${permission.delete_user ? 'checked' : ''} disabled>`;
    newRow.insertCell(9).innerHTML = `<input type="checkbox" ${permission.view_groups ? 'checked' : ''} disabled>`;
    newRow.insertCell(10).innerHTML = `<input type="checkbox" ${permission.add_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(11).innerHTML = `<input type="checkbox" ${permission.view_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(12).innerHTML = `<input type="checkbox" ${permission.update_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(13).innerHTML = `<input type="checkbox" ${permission.delete_group ? 'checked' : ''} disabled>`;
    newRow.insertCell(14).innerHTML = `<input type="checkbox" ${permission.view_group_memberships ? 'checked' : ''} disabled>`;
    newRow.insertCell(15).innerHTML = `<input type="checkbox" ${permission.add_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(16).innerHTML = `<input type="checkbox" ${permission.view_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(17).innerHTML = `<input type="checkbox" ${permission.update_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(18).innerHTML = `<input type="checkbox" ${permission.delete_group_membership ? 'checked' : ''} disabled>`;
    newRow.insertCell(19).innerHTML = `<input type="checkbox" ${permission.view_group_permissions ? 'checked' : ''} disabled>`;
    newRow.insertCell(20).innerHTML = `<input type="checkbox" ${permission.add_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(21).innerHTML = `<input type="checkbox" ${permission.view_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(22).innerHTML = `<input type="checkbox" ${permission.update_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(23).innerHTML = `<input type="checkbox" ${permission.delete_group_permission ? 'checked' : ''} disabled>`;
    newRow.insertCell(24).innerHTML = `<input type="checkbox" ${permission.view_folders ? 'checked' : ''} disabled>`;
    newRow.insertCell(25).innerHTML = `<input type="checkbox" ${permission.create_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(26).innerHTML = `<input type="checkbox" ${permission.open_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(27).innerHTML = `<input type="checkbox" ${permission.update_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(28).innerHTML = `<input type="checkbox" ${permission.delete_folder ? 'checked' : ''} disabled>`;
    newRow.insertCell(29).innerHTML = `<input type="checkbox" ${permission.view_documents ? 'checked' : ''} disabled>`;
    newRow.insertCell(30).innerHTML = `<input type="checkbox" ${permission.add_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(31).innerHTML = `<input type="checkbox" ${permission.view_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(32).innerHTML = `<input type="checkbox" ${permission.update_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(33).innerHTML = `<input type="checkbox" ${permission.delete_document ? 'checked' : ''} disabled>`;
    newRow.insertCell(34).innerHTML = `<input type="checkbox" ${permission.view_fields ? 'checked' : ''} disabled>`;
    newRow.insertCell(35).innerHTML = `<input type="checkbox" ${permission.add_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(36).innerHTML = `<input type="checkbox" ${permission.view_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(37).innerHTML = `<input type="checkbox" ${permission.update_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(38).innerHTML = `<input type="checkbox" ${permission.delete_field ? 'checked' : ''} disabled>`;
    newRow.insertCell(39).innerHTML = `<input type="checkbox" ${permission.view_docfields ? 'checked' : ''} disabled>`;
    newRow.insertCell(40).innerHTML = `<input type="checkbox" ${permission.create_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(41).innerHTML = `<input type="checkbox" ${permission.view_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(42).innerHTML = `<input type="checkbox" ${permission.update_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(43).innerHTML = `<input type="checkbox" ${permission.delete_docfield ? 'checked' : ''} disabled>`;
    newRow.insertCell(44).innerHTML = `<input type="checkbox" ${permission.view_worksteps ? 'checked' : ''} disabled>`;
    newRow.insertCell(45).innerHTML = `<input type="checkbox" ${permission.add_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(46).innerHTML = `<input type="checkbox" ${permission.view_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(47).innerHTML = `<input type="checkbox" ${permission.update_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(48).innerHTML = `<input type="checkbox" ${permission.delete_workstep ? 'checked' : ''} disabled>`;
    newRow.insertCell(49).innerHTML = `<input type="checkbox" ${permission.view_possible_actions ? 'checked' : ''} disabled>`;
    newRow.insertCell(50).innerHTML = `<input type="checkbox" ${permission.add_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(51).innerHTML = `<input type="checkbox" ${permission.view_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(52).innerHTML = `<input type="checkbox" ${permission.update_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(53).innerHTML = `<input type="checkbox" ${permission.delete_possible_action ? 'checked' : ''} disabled>`;
    newRow.insertCell(54).innerHTML = `<input type="checkbox" ${permission.view_workstep_results ? 'checked' : ''} disabled>`;
    newRow.insertCell(55).innerHTML = `<input type="checkbox" ${permission.add_workstep_result ? 'checked' : ''} disabled>`;
    newRow.insertCell(56).innerHTML = `<input type="checkbox" ${permission.view_workstep_result ? 'checked' : ''} disabled>`;
    newRow.insertCell(57).innerHTML = `<input type="checkbox" ${permission.rewind_workstep_result ? 'checked' : ''} disabled>`;
    newRow.insertCell(58).innerHTML = `<input type="checkbox" ${permission.delete_workstep_result ? 'checked' : ''} disabled>`;

      const editCell = newRow.insertCell();
      editCell.innerHTML = `<button type="button" onclick="editPermissions(${permission.id})">Edit</button>`;
    });
  }


  // FUNCTION TO HANDLE GROUP PERMISSION EDITING
  function editPermissions(permissionId) {
    console.log(`Editing permissions for ID: ${permissionId}`);
  }

  
 // ASYNC FUNCTION TO FETCH THE FOLDER NAME BASED ON FOLDER ID
async function getFolderName(folderId) {
  const bearerToken = localStorage.getItem('edms_token');

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/folder/show/${folderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();
    

    if (response.ok) {
      const folderData = responseData.data.data;
      return folderData.name || 'Unknown Folder';
    } else {
      console.error('Error fetching folder:', responseData.message);
      return 'Unknown Folder';
    }
  } catch (error) {
    console.error('Error fetching folder:', error);
    return 'Unknown Folder';
  }
}

 // FUNCTION TO POPULATE FOLDERS DYNAMICALLY
 function populateFolderOptions() {

  const bearerToken = localStorage.getItem('edms_token');

  // Make AJAX requests to fetch folder data 
  $.ajax({
      url: 'http://127.0.0.1:8000/api/folders/1',  
      type: 'GET',
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      success: function (folderData) {
          const folderSelect = document.getElementById('folderSelect');
          folderSelect.innerHTML = '';
          folderData.data.data.forEach(function (folder) {
            console.log(folder);
              const option = document.createElement('option');
              option.value = folder.id;
              option.text = folder.name;   
              folderSelect.appendChild(option);
          });
      },
      error: function (error) {
          console.error('Error fetching folder data:', error);
      }
  });
}

// FUNCTION TO POPULATE GROUPS DYNAMICALLY
function populateGroupOptions() {
  const bearerToken = localStorage.getItem('edms_token');

  // Make AJAX requests to fetch group data 
  $.ajax({
      url: 'http://127.0.0.1:8000/api/groups',  
      type: 'GET',
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      success: function (groupData) {
          const groupSelect = document.getElementById('groupSelect');
          groupSelect.innerHTML = '';
          groupData.data.data.forEach(function (group) {
              const option = document.createElement('option');
              option.value = group.id;
              option.text = group.group_name; 
              groupSelect.appendChild(option);
          });
      },
      error: function (error) {
          console.error('Error fetching group data:', error);
      }
  });
}


// FUNCTION TO POPULATE PERMISSIONS DYNAMICALLY
function populatePermissionOptions() {
  const bearerToken = localStorage.getItem('edms_token');

  // Make an AJAX request to fetch permission data  
  $.ajax({
      url: 'http://127.0.0.1:8000/api/grouppermissions',  
      type: 'GET',
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      success: function (permissionData) {
          const permissionSelect = document.getElementById('permissionSelect');
          permissionSelect.innerHTML = '';
          permissionData.data.data.forEach(function (permission) {
              const option = document.createElement('option');
              option.value = permission.id;
              option.text = permission.view_users;  
              permissionSelect.appendChild(option);
          });
      },
      error: function (error) {
          console.error('Error fetching permission data:', error);
      }
  });
}

// Call the functions to populate folders and groups when the modal is shown
$('#createPermissionModal').on('show.bs.modal', function () {
  populateFolderOptions();
  populateGroupOptions();
  populatePermissionOptions();
});

// FUNCTION TO CREATE PERMISSION
function createPermission() {
  // Get selected folder ID
  const folderId = document.getElementById('folderSelect').value;

  // Get selected group ID
  const groupId = document.getElementById('groupSelect').value;

  // Get selected permissions
  const permissions = [...document.getElementById('permissionSelect').options].filter(option => option.selected).map(option => option.value);

  // Prepare data to send to the server (you can use AJAX for this)
  const permissionData = {
      folderId: folderId,
      groupId: groupId,
      permissions: permissions
  };

  const bearerToken = localStorage.getItem('edms_token');
  // Send data to the server  
  $.ajax({
      url: 'http://127.0.0.1:8000/api/grouppermissions/store', 
      type: 'POST',
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      contentType: 'application/json',
      data: JSON.stringify(permissionData),
      success: function (response) {
          console.log('Permission created successfully:', response);
          // Optionally, you can update the UI or perform other actions upon success
      },
      error: function (error) {
          console.error('Error creating permission:', error);
          // Optionally, you can handle errors and display an error message
      }
  });

  // Close the modal
  $('#createPermissionModal').modal('hide');
}
