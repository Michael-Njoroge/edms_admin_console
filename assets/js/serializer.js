// FUNCTION TO POPULATE THE SERIALISATION TABLE WITH FETCHED DATA
async function serialData(page = 1, itemsPerPage = 5) {
  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Fetch serialisation data with pagination parameters
  const records = await fetch("http://127.0.0.1:8000/api/serialisations", {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await records.json();
  console.log(data);

  // Initialize DataTable
  const serializerTable = $("#serializerTable").DataTable({
    lengthMenu: [5, 10, 25, 50],
    bDestroy: true,
  });

  // Clear the existing table
  serializerTable.clear().draw();

  // Loop through each serialisation and create a table row
  data.data.data.forEach((serializer, index) => {
    // Add the row to DataTable
    serializerTable.row
      .add([
        index + 1,
        serializer.number_format,
        serializer.date_format,
        serializer.prefix,
        serializer.postfix,
        serializer.order_of_items,
        serializer.last_number,
        `<td style="font-size:21px;">
          <center>
            <a href="#" data-toggle="modal" data-target="#" onclick="editSerializer(${serializer.id})" data-serializerid="${serializer.id}" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
            <a href="#" data-toggle="modal" data-target="#" onclick="prepareToDeleteSerializer(${serializer.id})" title="delete"><i class="fa fa-trash"></i></a>
          </center>
        </td>`,
      ])
      .draw(false);
  });

  // Generate pagination links
  const totalPages = Math.ceil(data.data.total / itemsPerPage);
  const paginationElement = $("#serializerPagination");
  paginationElement.empty();

  if (totalPages > 1) {
    const prevLink = `<a href="#" onclick="serialData(${
      page - 1
    }, ${itemsPerPage})" class="page-link">«</a>`;
    paginationElement.append(prevLink);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = `<a href="#" onclick="serialData(${i}, ${itemsPerPage})" class="page-link ${
        i === page ? "active" : ""
      }">${i}</a>`;
      paginationElement.append(pageLink);
    }

    const nextLink = `<a href="#" onclick="serialData(${
      page + 1
    }, ${itemsPerPage})" class="page-link">»</a>`;
    paginationElement.append(nextLink);
  }
}

// Call the function to initially populate the table
serialData();

// FUNCTION TO HANDLE FORM SUBMISSION AND CREATE A NEW SERIALIZER
function createSerializer() {
  // Fetch form data
  const lastNumber = $("#last_number").val();
  const orderOfItems = $("#order_of_items").val();
  const prefix = $("#prefix").val();
  const numberFormat = $("#number_format").val();
  const postfix = $("#postfix").val();
  const dateFormat = $("#date_format").val();

  // Validate required fields
  if (!lastNumber || !orderOfItems) {
    toastr.error("Please fill out all required fields.");
    return;
  }

  // Disable the submit button and show loading text
  const submitButton = $("#serializerSubmitBtn");
  submitButton
    .prop("disabled", true)
    .html('<i class="fa fa-spinner fa-spin"></i> Loading...');

  // Construct the request payload
  const requestData = {
    last_number: lastNumber,
    order_of_items: orderOfItems,
    prefix: prefix,
    number_format: numberFormat,
    postfix: postfix,
    date_format: dateFormat,
  };

  // Retrieve the Bearer token from localStorage
  const bearerToken = localStorage.getItem("edms_token");

  // Check if the token is present in localStorage
  if (!bearerToken) {
    console.error("Unauthorized");
    return;
  }

  // Make a POST request to create a new serializer
  fetch("http://127.0.0.1:8000/api/serialisations/store", {
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
      $("#serializerForm").modal("hide");

      // Clear the serializer form
      $("#serializerCreateForm")[0].reset();

      // Call the function to initially populate the table
      serialData();

      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Submit");

      toastr.success("Serializer created successfully");
    })
    .catch((error) => {
      console.error("Error:", error);

      // Enable the submit button and revert the text
      submitButton.prop("disabled", false).html("Submit");
    });
}
