const express = require('express');
const cds = require('@sap/cds');
const fetch = require('node-fetch');
const sharp = require('sharp');

function getSignedUrl(url) {
    const cfsign = require('aws-cloudfront-sign');
    
    let twoDays = 2 * 24 * 60 * 60 * 1000;
    let signingParams = {
        keypairId: process.env.PUBLIC_KEY,
        privateKeyString: process.env.PRIVATE_KEY,
        expires: Math.floor((Date.now() + twoDays) / 1000),
        // Optional - this can be used as an alternative to privateKeyString
        privateKeyPath: './.aws/private_key.pem'
    };
    // Generating a signed URL
    let signedUrl = cfsign.getSignedUrl(url, signingParams);
    console.log(signedUrl);
    return signedUrl;
};
cds.once('bootstrap',(app)=>{
  app.get('/getImageSrv', async function (req, res) {
      if(req.query && req.query.url){
        let height = Number(req.query.height);
        let width = Number(req.query.width);
        let imageResponse = await fetch(getSignedUrl(req.query.url));
        let origBuffer = await imageResponse.buffer();
        let resizedBuffer = await sharp(origBuffer).resize(width, height).toBuffer();
        return res.type(imageResponse.headers.get("content-type")).status(200).end(resizedBuffer);
      }else{
          return res.type("text/plain").status(500).send(`ERROR: Please provide a valid image url`)
      }
    });
});
module.exports = cds.server;
