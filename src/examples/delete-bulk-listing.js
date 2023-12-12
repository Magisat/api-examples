const API_URL = "https://api.magisat.io/external";
const API_KEY = "";
const LISTING_IDS = [""];

(async () => {
    // make the request to delete the listing
    const url = new URL(`${API_URL}/v1/listing/bulk`);
    url.searchParams.append("listingIds", LISTING_IDS);
    const deleteResponse = await fetch(url, {
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
            `Error deleting listings. Status: ${
                deleteResponse.status
            }. Body: ${await deleteResponse.text()}`
        );
    }

    const deleteResponseBody = await deleteResponse.json();
    console.log(
        `Delete Response: ${JSON.stringify(deleteResponseBody, null, 2)}`
    );
})();

