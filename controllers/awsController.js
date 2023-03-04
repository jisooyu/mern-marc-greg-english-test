// require("dotenv").config();
const config = require('config');
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const bucketName = config.get('aws.s3.bucketName');
const region = config.get('aws.s3.region');
const accessKeyId = config.get('aws.s3.accessKeyId');
const secretAccessKey = config.get('aws.s3.secretAccessKey');

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
async function upload(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return await s3.upload(uploadParams).promise();
}

async function getList() {
  const params = { Bucket: bucketName };
  await s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.log("Error from getList()", err, err.stack);
    } else {
      console.log("Data from bucket", data);
      console.log("get succeeded");
    }
  });
}

module.exports = { upload, getList };
