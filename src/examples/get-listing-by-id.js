const API_URL = "https://api.magisat.io/external";
const API_KEY = "";
const LISTING_ID = "";

(async () => {
    // make the request to delete the listing
    const getResponse = await fetch(`${API_URL}/v1/listing/${LISTING_ID}`, {
        method: "GET",
        headers: {
            "X-MGST-API-KEY": API_KEY,
            "Content-Type": "application/json",
        },
    });
    // check response confirmation
    if (!(getResponse && getResponse.ok)) {
        // something went wrong, stop here and check the response for more info
        throw new Error(
            `Error getting listing. Status: ${
                getResponse.status
            }. Body: ${await getResponse.text()}`
        );
    }

    const listing = await getResponse.json();
    console.log(`Listing Response: ${JSON.stringify(listing, null, 2)}`);
})();
