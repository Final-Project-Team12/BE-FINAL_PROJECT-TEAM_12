const ImageKit = require('imagekit');

// console.log("Public Key:", process.env.IMAGEKIT_PUBLICKEY);
// console.log("Private Key:", process.env.IMAGEKIT_PRIVATEKEY);
// console.log("URL Endpoint:", process.env.IMAGEKIT_URL);

let imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLICKEY,
    privateKey: process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint: process.env.IMAGEKIT_URL
});


module.exports = imagekit;
