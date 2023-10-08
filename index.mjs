import { handlerPostRequest } from "./handlePostRequest.mjs";
import { handleGetRequest } from "./handleGetRequest.mjs";
import { handlerDeleteRequest } from "./handleDeleteRequest.mjs";

export const handler = async (event) => {
  console.log(event.httpMethod);
  switch (event.httpMethod) {
    case "GET":
      return await handleGetRequest(event);
    case "POST":
      return await handlerPostRequest(event);
    case "DELETE":
      return handlerDeleteRequest(event);
    default:
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
  }
};
