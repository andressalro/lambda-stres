import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.REGION });

export const handlerDeleteRequest = async (event) => {
  const filename = event.pathParameters.filename;
  const bucketName = process.env.BUCKET_NAME;

  const params = {
    Bucket: bucketName,
    Key: filename,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Archivo ${filename} eliminado correctamente.`,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al eliminar el archivo." }),
    };
  }
};
