import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import parser from "aws-lambda-multipart-parser";

const s3Client = new S3Client({ region: process.env.REGION });

export const handlerPostRequest = async (event) => {
  const result = parser.parse(event, true); // El segundo argumento es para decodificar base64.
  if (!result.files || result.files.length === 0) {
    return {
      statusCode: 400,
      body: "No hay archivo",
    };
  }

  const file = result.files;
  if (!file || !file.content || !file.filename) {
    return {
      statusCode: 400,
      body: "Archivo no se ha podido cargar",
    };
  }
  const filename = result.filename;
  const bucketName = result.bucketName;

  if (!bucketName) {
    return {
      statusCode: 400,
      body: "No se ha ingresado el nombre del bucket",
    };
  }

  const uploadParams = {
    Bucket: bucketName,
    Key: filename,
    Body: file.content,
    ContentType: file.contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Archivo subido correctamente",
      }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: "Failed to upload file.",
    };
  }
};
