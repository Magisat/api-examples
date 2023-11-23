const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const { ECPairFactory } = require("ecpair");
const { tapTweakHash } = require("bitcoinjs-lib/src/payments/bip341.js");
const { toXOnly } = require("bitcoinjs-lib/src/psbt/bip371.js");

// ecc initialization
bitcoin.initEccLib(ecc);
const network = bitcoin.networks.bitcoin;
const ECPair = ECPairFactory(ecc);

const WalletTypes = {
  LEGACY: "LEGACY",
  NATIVE_SEGWIT: "NATIVE_SEGWIT",
  NESTED_SEGWIT: "NESTED_SEGWIT",
  TAPROOT: "TAPROOT",
};

function getAddress(ecPair, walletType) {
  switch (walletType) {
    case WalletTypes.LEGACY:
      return bitcoin.payments.p2pkh({
        pubkey: ecPair.publicKey,
        network,
      }).address;
    case WalletTypes.NATIVE_SEGWIT:
      return bitcoin.payments.p2wpkh({
        pubkey: ecPair.publicKey,
        network,
      }).address;
    case WalletTypes.NESTED_SEGWIT:
      return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: ecPair.publicKey, network }),
        network,
      }).address;
    case WalletTypes.TAPROOT:
      return bitcoin.payments.p2tr({
        internalPubkey: toXOnly(ecPair.publicKey),
        network,
      }).address;
    default:
      throw new Error("Invalid wallet type!");
  }
}

function normalValidator(pubkey, msghash, signature) {
  return ECPair.fromPublicKey(pubkey).verify(msghash, signature);
}

function schnorrValidator(pubkey, msghash, signature) {
  return ecc.verifySchnorr(msghash, pubkey, signature);
}

function tweakSigner(signer) {
  let privateKey = signer.privateKey;
  if (!privateKey) {
    throw new Error("Private key is required for tweaking signer!");
  }
  if (signer.publicKey[0] === 3) {
    privateKey = ecc.privateNegate(privateKey);
  }

  const tweakedPrivateKey = ecc.privateAdd(
    privateKey,
    tapTweakHash(toXOnly(signer.publicKey))
  );
  if (!tweakedPrivateKey) {
    throw new Error("Invalid tweaked private key!");
  }

  return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey));
}

module.exports = {
  network,
  ECPair,
  WalletTypes,
  getAddress,
  normalValidator,
  schnorrValidator,
  tweakSigner,
};
