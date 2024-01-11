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

  // Get the table body element
  const tableBody = document.getElementById("serializerTbody");
  tableBody.innerHTML = ""; // Clear the existing table body content

  // Loop through each serialisation and create a table row
  data.data.data.forEach((serializer, index) => {
    // Create a table row
    const row = document.createElement("tr");

    // Add data cells to the row
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${serializer.number_format}</td>
      <td>${serializer.date_format}</td>
      <td>${serializer.prefix}</td>
      <td>${serializer.postfix}</td>
      <td>${serializer.order_of_items}</td>
      <td>${serializer.last_number}</td>
      <td style="font-size:21px;">
        <center>
          <a href="#" onclick="editSerializer(${
            serializer.id
          })" data-serializerid="${
      serializer.id
    }" title="edit"><i class="fa fa-edit"></i></a> &nbsp;
          <a href="#" onclick="prepareToDeleteSerializer(${
            serializer.id
          })" title="delete"><i class="fa fa-trash"></i></a>
        </center>
      </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });

  // Generate pagination links (if needed)
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

serialData();
