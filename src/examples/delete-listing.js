const API_URL = "https://api.magisat.io/external";
const API_KEY = "";
const LISTING_ID = "";

(async () => {
  // make the request to delete the listing
  const deleteResponse = await fetch(`${API_URL}/v1/listing/${LISTING_ID}`, {
    method: "DELETE",
    headers: {
      "X-MGST-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });
  // check response confirmation
  if (!(deleteResponse && deleteResponse.ok)) {
    // something went wrong, stop here and check the response for more info
    throw new Error(
      `Error deleting listing. Status: ${
        deleteResponse.status
      }. Body: ${await deleteResponse.text()}`
    );
  }

  const deleteResponseBody = await deleteResponse.json();
  console.log(
    `Delete Response: ${JSON.stringify(deleteResponseBody, null, 2)}`
  );
})();
