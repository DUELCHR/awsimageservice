function getSignedUrl(url) {
    const cfsign = require('aws-cloudfront-sign');

    var twoDays = 2 * 24 * 60 * 60 * 1000;
    var signingParams = {
        keypairId: process.env.PUBLIC_KEY,
        privateKeyString: process.env.PRIVATE_KEY,
        expires: Math.floor((Date.now() + twoDays) / 1000),
        // Optional - this can be used as an alternative to privateKeyString
        privateKeyPath: './.aws/private_key.pem'
    };
    // Generating a signed URL
    var signedUrl = cfsign.getSignedUrl(url, signingParams);
    console.log(signedUrl);
    return signedUrl;
};
async function getImage(url) {
    const fetch = require('node-fetch');
    const signedUrl = getSignedUrl(url);
    const response = await fetch(signedUrl);
    const buffer = await response.buffer();
    return {
        image: buffer.toString('base64'),
        url: signedUrl
    };
};
module.exports = (ImageService) => {
    ImageService.on('getImage', req => getImage(req.data.url));
    ImageService.on('getSignedUrl', req => getSignedUrl(req.data.url));
};