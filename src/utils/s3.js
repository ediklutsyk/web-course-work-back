const configs = require('../configs')
const AWS = require('aws-sdk');

module.exports.generateSignedUrl = (req, res) => {
    console.log('here', req.body)
    const s3 = new AWS.S3({
        accessKeyId: configs.awsKey,
        secretAccessKey: configs.awsSecret,
        signatureVersion: 'v4',
        region: 'eu-north-1'
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: configs.s3BucketName,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        } else {
            const returnData = {
                signedRequest: data,
                url: `https://${configs.s3BucketName}.s3.amazonaws.com/${fileName}`
            };
            return res.status(200).send(returnData);
        }
    });
}