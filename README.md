# Magisat External API - Examples

## Introduction
This repository contains ready-to-use code for integrating the ```/external``` API of [magisat.io](https://magisat.io/docs/api/v1) - using a backend-stored wallet.

Our snippets only use crypto-related 3rd party packages, in order to keep it at minimum dependencies
- bitcoinjs-lib
- ecpair
- tiny-secp256k1

Current API version is 1.3.0 - as of 11th Dec 2023

Current features covered in this example
- Listing a single UTXO
    - retrieve the PSBT from our dedicated enpoint
    - validate the PSBT on your side
    - sign the PSBT and submit it on the listing endpoint 
- Reading a listing
    - retrieve a listing status and other data by id
- Deleting a listing
    - delete a listing by id
    - bulk delete listings

### Access
You may request an API Key [here](https://docs.google.com/forms/d/1t2ONUxBKnxn5J2I9L-6vvMjE_CGlXdj_VRjkUBjmbUE/viewform?edit_requested=true)

### Coming up soon (examples) 
- Preparing
- Buying

## Installation

```shell
npm i
```

## Usage

For each file you need to configure some variables in code before running. You will find the variable definition at the beginning of the file, right after the imports section.

### Create a listing

The code will sign the psbt using a WIF-instantiated wallet. Together with the listing settings, the full list of variables you need to declare is:
- WIF
- Wallet type - Legacy, Segwit (native/nested), or Taproot
- API Key
- UTXO - the output you wish to list
- PRICE - listing price (in sats)
- SELLER_RECEIVE_ADDRESS - payment destination 

```shell
node src/examples/new-listing.js
```

### Delete a listing (single/bulk)

No need to sign here. Variables:
- API Key
- Listing ID - the one you wish to cancel

```shell
node src/examples/delete-listing.js
```

```shell
node src/examples/delete-bulk-listing.js
```

### Read a listing

No need to sign here. Variables:
- API Key
- Listing ID - the one you wish to read

```shell
node src/examples/get-listing-by-id.js
```