import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3({ region: process.env.REGION });

export const handleGetRequest = async (event) => {
  const bucketName = event.queryStringParameters.bucketName;
  const objectKey = event.queryStringParameters.objectKey;

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: signedUrl }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Error getting signed URL for object ${objectKey} from bucket ${bucketName}.`,
      }),
    };
  }
};
