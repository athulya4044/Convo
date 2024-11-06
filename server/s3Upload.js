// server/s3Upload.js
import AWS from "aws-sdk";
import fs from "fs";

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file) => {
  const fileContent = fs.readFileSync(file.path); 
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: fileContent,
    ACL: "public-read",
  };

  try {
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return null;
  }
};