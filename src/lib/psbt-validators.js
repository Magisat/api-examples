function validateSingleListingPsbt(psbt, utxo, price, sellerReceiveAddress) {
  // verify that the psbt contains only one input
  if (psbt.txInputs.length !== 1) {
    throw new Error(`Expected 1 input, got ${psbt.txInputs.length}`);
  }
  // verify that the input's txId is the same as you specified
  if (psbt.txInputs[0].hash.reverse().toString("hex") !== utxo.split(":")[0]) {
    throw new Error(`Invalid input txId hash`);
  }
  // verify that the input's vout is the same as you specified
  if (psbt.txInputs[0].index !== Number(utxo.split(":")[1])) {
    throw new Error(`Invalid input vout`);
  }

  // verify that the psbt contains only one output
  if (psbt.txOutputs.length !== 1) {
    throw new Error(`Expected 1 output, got ${psbt.txInputs.length}`);
  }
  // verify that the output value is the same as you specified (the price)
  if (psbt.txOutputs[0].value !== Number(price)) {
    throw new Error(`Invalid output's price`);
  }
  // verify that the address to send the output to is the same as you specified
  if (psbt.txOutputs[0].address !== sellerReceiveAddress) {
    throw new BadRequestError(`Invalid output's receiveAddress`);
  }
  console.log("Verified requested message to sign");

  return psbt;
}

module.exports = {
  validateSingleListingPsbt,
};
