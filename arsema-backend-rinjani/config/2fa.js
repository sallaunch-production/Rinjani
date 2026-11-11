const {authenticator} = require('otplib') ;
const crypto = require('crypto');
const QRCode = require('qrcode');

module.exports = {
    generateSecret: ()=> authenticator.generateSecret(),
    generateToken: (secret) => authenticator.generate(secret),
    verify: (token, secret)=> authenticator.verify({secret, token}),
    generateQRCode: (user, secret) => {

        const otp = authenticator.keyuri(user, "Dhanapatra", secret);
        var imagePath='';
       
        const bufferImage = QRCode.toDataURL(otp, (err, imageUrl) => {
            if (err) {
                console.log('Could not generate QR code', err);
                return;
            }
             imageUrl
        });
        console.log(bufferImage);
        return bufferImage;
    }
}