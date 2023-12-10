 

// Function to prepare for group deletion by setting the group ID to be deleted
function prepareToDeleteGroup(groupId) {
  // Set the group ID to the global variable
  groupToDeleteId = groupId;

}

// Function to handle table display based on selected radio button
$(document).ready(function() {
      // Handle click events for radio buttons
      $('input[name="sidebar_tab1"]').on('change', function() {
        var value = $(this).val();

        // Hide all tables
        $('.table-container').hide();

        // Show the corresponding table based on the selected radio button
        if (value === '3') {
          $('#groupsTableContainer').show();
        } else if (value === '4') {
          $('#groupMembershipsTableContainer').show();
        }
        // Add more conditions for other radio buttons if needed
      });
    });

// $(document).ready(function() {
//   var table = $('#groupMembershipsTab').DataTable({
//     scrollX: false,
//      scrollCollapse: true,
//     paging: true,
//     fixedHeader: true
//   });});

// Function to fetch user information based on the logged-in user's ID
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
 
        // Call populateDropdowns once user information is retrieved
        populateDropdowns();
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
    });
}

// Function to update the user's name in the navigation bar
function updateUserNameInNavbar(userName) {
    // Update the user's name in the navigation bar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.innerText = userName;
    }
}

// Function to update the profile modal
function updateProfileModal(userData) {
  const profileUsernameElement = document.getElementById('profile-username');
  const profileNameElement = document.getElementById('profile-name');

  if (profileUsernameElement && profileNameElement) {
    profileUsernameElement.innerText = userData.username;
 
    profileNameElement.innerText = userData.name;
  }
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

// Execute the rest of the script when the document is ready
$(document).ready(function() {
    // ... your existing code ...

    // Call populateDropdowns when the document is ready
    populateDropdowns();
});



// Function to handle form submission and create a new group
function createGroup() {
  // Fetch form data
  const groupName = $('#group_name').val();
  const adminId = $('#admin_id').val();

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

// Function to update the table row numbers dynamically
function updateRowNumbers() {
    // Update the rows in the "tab" table
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


// Fuction to call and display data
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

      row.innerHTML += `<td style="font-size:21px; ">
        <center>
          <a href="#" data-toggle="modal" data-target="#editForm" onclick="editGroup(${group.id})" data-groupid="${group.id}" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
          <a href="#" data-toggle="modal" data-target="#confirmDeleteModal" onclick="prepareToDeleteGroup(${group.id})" title="delete"> <i class="fa fa-trash"></i></a>
        </center>
    </td>`;

    tableBody.appendChild(row);

   
});
    // Call updateRowNumbers after appending rows to the table body
    updateRowNumbers();
}


// Function to fetch and populate dropdowns with existing groups and users
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
    usersData.data.data.forEach(user => {
      assignUsersDropdown.append(`<option value="${user.id}">${user.username}</option>`);
    });
}

// Call populateDropdowns when the document is ready
$(document).ready(function() {
  populateDropdowns();
});

// Function to handle form submission and assign users to a group
function assignUsersToGroup() {
  // Fetch form data
  const groupId = $('#assign_group').val();
  const userIds = $('#assign_users').val();

  // Construct the request payload
  const requestData = {
    group_id: groupId,
    user_id: userIds,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Make a POST request to assign users to a group
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
  });
}


//function to edit group
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


// Function to submit the edit form
function submitEditForm() {
    // Fetch form data
    const groupId = $('#edit_group_admin_id').val();
    const groupName = $('#edit_group_name').val();
    const group_id = $('#edit_group_id').val();

    // Construct the request payload
    const requestData = {
        group_name: groupName,
        group_admin_id: groupId,
        // Add other fields as needed
    };

    // Retrieve the Bearer token from localStorage
    const bearerToken = localStorage.getItem('edms_token');

    // Check if the token is present in localStorage
    if (!bearerToken) {
        console.error('Unauthorized');
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

      toastr.success('Group updated successfully');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to handle group deletion
function deleteGroup(groupId) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem('edms_token');

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error('Unauthorized');
    return;
  }

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
      // Hide the confirmation modal
      $('#confirmDeleteModal').modal('hide');
    });
}


// Function to fetch and display group memberships data
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
          <a href="#" data-toggle="modal" data-target="#editForm" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
          <a href="#" data-toggle="modal" data-target="#confirmDeleteModal" title="delete"> <i class="fa fa-trash"></i></a>
        </center>
    </td>`;

    membershipsTableBody.appendChild(row);
  }

  // Call updateRowNumbers after appending rows to the table body
  updateRowNumbers();
}
 
 