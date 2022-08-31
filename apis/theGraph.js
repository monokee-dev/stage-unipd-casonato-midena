const express = require("express");
const app = express();

app.post("/thegraph/monokeeERC721Token", (req, res) => {
    console.log("NFT api connected");
    res.json({
        "name": "Monokee",
        "description": "Monokee is a collection of 10,000 unique NFTs. Each Monokee is a unique combination of 5 different traits: body, head, eyes, mouth, and background. Each trait has 10 different options, giving each Monokee a 1 in 10,000 chance of being unique. Monokees are stored on the Ethereum blockchain and can be viewed on OpenSea.",
        "image": "https://monokee.io/images/monokee.png",
    });
});