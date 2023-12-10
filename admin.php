 <!DOCTYPE html>
 <html lang="en">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
 
  <!-- Main css -->
<link rel="stylesheet" href="style.css">

    <!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<!-- Bootstrap JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Datatables javascript -->
<script type="text/javascript" src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/fixedcolumns/3.2.2/js/dataTables.fixedColumns.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jq-2.2.4/dt-1.10.13/fc-3.2.2/fh-3.1.2/r-2.1.0/sc-1.4.2/datatables.min.css" />

     <!-- Toast -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
</head>
 
<body onload="getData(); getGroupMembershipsData()">
 
<nav class="mnb navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav navbar-right">
         <li class="dropdown">
         
          <a id="user-name" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Loading...</a>
          <ul class="dropdown-menu">
            <li><a href="#" data-toggle="modal" data-target="#profileModal">Profile</a></li>
            <li><a href="#">Upload Signature</a></li>
            <li><a href="#">Upload Stamp</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </li>
        <li><a href="#"><i class="fa fa-bell-o"></i></a></li>
        <li><a href="#"><i class="fa fa-comment-o"></i></a></li>
      </ul>
   
    </div>
  </div>
</nav>

<!--msb: main sidebar-->
<div class="msb" id="msb">
		<nav class="navbar" role="navigation">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<div class="brand-wrapper">
					<!-- Brand -->
                    <center>
					<div class="brand-name-wrapper" >
						<a class="navbar-brand" href="#">
							DISI EDMS
						</a>
					</div>
                </center>
 

				</div>

			</div>

			<!-- Main Menu -->
			<div class="side-menu-container" >
                <center>
				<ul class="nav navbar-nav" >

          <li>
            <input type="radio" name="sidebar_tab1" id="sidebar_tab1" value="1" checked="1"/>
            <label for="sidebar_tab1"><i class="fa fa-dashboard"></i> Dashboard</label>
          </li>

          <li>
            <input type="radio" name="sidebar_tab1" id="sidebar_tab2" value="2"/>
            <label for="sidebar_tab2">
                <i class="fa fa-puzzle-piece"></i> Users
            </label>
          </li>

        <li>
          <input type="radio" name="sidebar_tab1" id="sidebar_tab3" value="3"/>
          <label for="sidebar_tab3"><i class="fa fa-group"></i> Groups</label>
        </li>

        <li>
          <input type="radio" name="sidebar_tab1" id="sidebar_tab4" value="4"/>
          <label for="sidebar_tab4"><i class="fa fa-star"></i> Membership</label>
      </li>

      <li>
        <input type="radio" name="sidebar_tab1" id="sidebar_tab5" value="5"/>
          <label for="sidebar_tab5"><i class="fa fa-signal"></i> Link</label>
      </li>
 
 
 				</ul>
                
			</div><!-- /.navbar-collapse -->
		</nav>  
</div>
<!--main content wrapper-->
<div class="mcw">
  <!--navigation here-->
  <!--main content view-->
  <div class="cv">
    <div>
     <div >
       <div class="inbox-sb">
         
       </div>
       <div class="inbox-bx container-fluid">
      
      </div>
         <div class="row">
          
           <div class="col-md-12">
            <div class="card elevation-3">

              <button type="button" data-toggle="modal" data-target="#form" style="background: #355B11; color: white; border: none; border-radius: 15px; padding: 5px; width: 150px; margin-bottom: 15px; ">Add New Group</button>
              <span><button type="button" data-toggle="modal" data-target="#assignUsersModal" style="background: #355B11; color: white; border: none; border-radius: 15px; padding: 5px; width: 200px; margin-bottom: 15px; ">Assign User to Group</button></span>

              <!-- ******************************Create Group modal********************************** -->
              <div class="modal fade" id="form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header border-bottom-0">
                      <h5 class="modal-title" id="exampleModalLabel">Create New Group</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <form id="createForm" onsubmit="event.preventDefault(); createGroup();">
                      <div class="modal-body">
                        <div class="form-group">
                          <label for="group_name">Group Name</label>
                          <input type="text" class="form-control" id="group_name" name="group_name" placeholder="Enter Group Name">
                        </div>
                        <div class="form-group">
                          <label for="admin_id">Group Admin Id</label>
                          <input type="text" class="form-control" id="admin_id" placeholder="Enter Group Id"  >
                        </div>
                        
                      </div>
                      <div class="modal-footer border-top-0 d-flex justify-content-center">
                        <button type="submit" class="btn" style="background: #355B11; color: white;">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>


            <!-- ******************************Edit Group modal********************************** -->
            <div class="modal fade" id="editForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header border-bottom-0">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Group</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <form id="formEdit" onsubmit="event.preventDefault(); submitEditForm();">
                    <div class="modal-body">
                      <input type="hidden" class="form-control" id="edit_group_id" >
                      <input type="hidden" class="form-control" id="edit_group_admin_id" >

                      <div class="form-group">
                        <label for="group_name">Group Name</label>
                        <input type="text" class="form-control" id="edit_group_name" name="edit_group_name" placeholder="Enter Group Name">
                      </div>
                  
                    </div>
                    <div class="modal-footer border-top-0 d-flex justify-content-center">
                      <button type="submit" class="btn" style="background: #355B11; color: white;">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <!-- ******************************Confirm Delete Modal********************************** -->
            <div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header border-bottom-0">
                    <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Delete</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>Are you sure you want to delete this group?</p>
                    <!-- Hidden input field to store the group ID -->
                    <input type="hidden" id="deleteGroupId" />
                  </div>
                  <div class="modal-footer border-top-0 d-flex justify-content-center">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="deleteGroupBtn" onclick="deleteGroup()">Delete</button>
                  </div>
                </div>
              </div>
            </div>


        <!-- Profile Modal -->
        <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="profileModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="profileModalLabel">Profile</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <!-- Display user profile information here -->
                <p><strong>Username:</strong> <span id="profile-username">Loading...</span></p>
                <p><strong>Name:</strong> <span id="profile-name">Loading...</span></p>
              </div>
            </div>
          </div>
        </div>


        <!-- ******************************Assign Users Modal********************************** -->
        <div class="modal fade" id="assignUsersModal" tabindex="-1" role="dialog" aria-labelledby="assignUsersModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header border-bottom-0">
                <h5 class="modal-title" id="assignUsersModalLabel">Assign Users to a Group</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form id="assignUsersForm" onsubmit="event.preventDefault(); assignUsersToGroup();">
                <div class="modal-body">
                  <div class="form-group">
                    <label for="assign_group">Select Group</label>
                    <select class="form-control" id="assign_group" name="assign_group">
        
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="assign_users">Select Users</label>
                    <select class="form-control" id="assign_users" name="assign_users">
        
                    </select>
                  </div>
                </div>
                <div class="modal-footer border-top-0 d-flex justify-content-center">
                  <button type="submit" class="btn" style="background: #355B11; color: white;">Assign Users</button>
                </div>
              </form>
            </div>
          </div>
        </div>



<!-- *******************Groups Table***************** -->
            <div class="card-header">
              <h4 class="card-title"><b>Groups</b></h4>
            </div>
                  <table id="tab" class="table table-hover table-bordered" cellspacing="3" style="  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 100%; border-radius: 10px;" >
               <thead>
                <tr>
                  <th>#</th>
                  <th>Group Name</th>
                  <th>Group Admin ID</th>
                  <th>Users</th>
                  <th>Action</th>
                 </tr>
               </thead>
               <tbody id="tbody"></tbody>
             </table>
             <br>

              <!-- *******************Group Memberships Table***************** -->
              <div class="card-header">
                <h4 class="card-title"><b>Group Memberships</b></h4>
              </div>
              <table id="groupMembershipsTab" class="table table-hover table-bordered" cellspacing="3" style=" justify-content: center;  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 100%;">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Group</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="groupMembershipsTbody"></tbody>
              </table>


             </div>
             
           </div>
         </div>
       </div>
     </div>
    </div>
  </div>
</div>

<script type="text/JavaScript">

// Function to prepare for group deletion by setting the group ID to be deleted
function prepareToDeleteGroup(groupId) {
  // Set the group ID to the global variable
  groupToDeleteId = groupId;

}

$(document).ready(function() {
  // Handle change events for radio buttons
  $('.msb .navbar-nav li input[type="radio"]').on('change', function() {
    // Remove the 'active' class from all list items
    $('.msb .navbar-nav li').removeClass('active');

    // Add the 'active' class to the parent list item of the clicked radio button
    $(this).closest('li').addClass('active');
  });

  // Set the initial active state based on the default checked radio button
  $('.msb .navbar-nav li input[type="radio"]:checked').each(function() {
    $(this).closest('li').addClass('active');
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

    toastr.success('Group created successfully');
  })
  .catch(error => {
    console.error('Error:', error);
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

 
</script>

 
</body>
</html>
 