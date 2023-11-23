// libs configuration
const bitcoin = require("bitcoinjs-lib");
const { isTaprootInput, toXOnly } = require("bitcoinjs-lib/src/psbt/bip371.js");
const { validateSingleListingPsbt } = require("../lib/psbt-validators.js");
const {
  network,
  ECPair,
  WalletTypes,
  getAddress,
  normalValidator,
  schnorrValidator,
  tweakSigner,
} = require("../lib/bitcoinjs-lib-tweaks.js");

const WIF = "";
const WALLET_TYPE = WalletTypes.LEGACY;
const API_URL = "https://api.magisat.io/external";
const API_KEY = "";
// specify the utxo you want to list here, format txid:vout
const UTXO = "";
// specify the price in satoshis here as a string
const PRICE = "546";
// the address where you want to receive the payment
// can be different from the one you list
const SELLER_RECEIVE_ADDRESS = "";

(async () => {
  // initialize wallet
  const ecPair = ECPair.fromWIF(WIF, network);
  // this is the address of your wallet
  // make sure to use the correct payment method depending on your address type
  const address = getAddress(ecPair, WALLET_TYPE);
  const sellerAddress = address;
  const sellerPublicKey = ecPair.publicKey.toString("hex");

  // get the message to be signed from our api
  const messageToSignResponse = await fetch(`${API_URL}/v1/psbt/listing`, {
    method: "POST",
    headers: {
      "X-MGST-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sellerAddress,
      sellerPublicKey,
      listings: [
        {
          utxo: UTXO,
          price: PRICE,
          sellerReceiveAddress: SELLER_RECEIVE_ADDRESS,
        },
      ],
    }),
  });
  if (!(messageToSignResponse && messageToSignResponse.ok)) {
    // something went wrong, stop here and check the response for more info
    throw new Error(
      `Error getting message to sign. Status: ${
        messageToSignResponse.status
      }. Body: ${await messageToSignResponse.text()}`
    );
  }
  // get the json response
  const messageToSign = await messageToSignResponse.json();

  // verify that the psbt is the one you requested
  const psbt = bitcoin.Psbt.fromBase64(messageToSign.psbtToBase64, { network });
  validateSingleListingPsbt(psbt, UTXO, PRICE, SELLER_RECEIVE_ADDRESS);

  // sign the psbt
  // taproot addresses requires a tweak to sign
  let validator = normalValidator;
  let signer = ecPair;
  if (isTaprootInput(psbt.data.inputs[0])) {
    signer = tweakSigner(ecPair);
    validator = schnorrValidator;
  }

  psbt.signInput(0, signer, [
    bitcoin.Transaction.SIGHASH_SINGLE |
      bitcoin.Transaction.SIGHASH_ANYONECANPAY,
  ]);
  psbt.validateSignaturesOfAllInputs(validator);
  psbt.finalizeInput(0);
  const signedMessage = psbt.toBase64();
  console.log("Message signed");

  // send the signed message to our api to finalize the listing
  const listingResponse = await fetch(`${API_URL}/v1/listing/bulk`, {
    method: "POST",
    headers: {
      "X-MGST-API-KEY": API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sellerAddress,
      sellerPublicKey,
      sellerSignature: signedMessage,
      listings: [
        {
          utxo: UTXO,
          price: PRICE,
          sellerReceiveAddress: SELLER_RECEIVE_ADDRESS,
        },
      ],
    }),
  });
  if (!(listingResponse && listingResponse.ok)) {
    // something went wrong, stop here and check the response for more info
    throw new Error(
      `Error creating listing. Status: ${
        listingResponse.status
      }. Body: ${await listingResponse.text()}`
    );
  }
  const listingsCreated = await listingResponse.json();
  console.log(
    `ListingIds created: ${JSON.stringify(
      listingsCreated.map((l) => l.id),
      null,
      2
    )}`
  );
  console.log(`Listings Created: ${JSON.stringify(listingsCreated, null, 2)}`);
})();
