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
