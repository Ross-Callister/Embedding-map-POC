import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";
import { NovaHelper } from "./novaHelper";

const bedrockClient = new BedrockRuntimeClient({
  region: "ap-southeast-2",
});

export async function getEmbeddingFromString(str: string): Promise<number[]> {
  const novaHelper = new NovaHelper();
  novaHelper.addSystemMessage(`We are taking a string from a user and attempting to derive the meaning of it.
In the context of a column in a spreadsheet, describe what the meaning of the string is.
Write the response in <response> tags and do not elaborate on the explanation.
<start>`);
  novaHelper.addUserMessage("Name: prod_name");
  novaHelper.addAssistantMessage(
    "<response>prod_name refers to the product name, this signifies the name of the product</response>"
  );
  novaHelper.addUserMessage("Name: Due Date");
  novaHelper.addAssistantMessage(
    "<response>Due Date refers to the payment deadline, the date by which the thing is to be paid for</response>"
  );
  novaHelper.addUserMessage("Name: Total Price");
  novaHelper.addAssistantMessage(
    "<response>Total Price refers to the total cost, the total amount of money paid for the product</response>"
  );
  novaHelper.addUserMessage("Name: status");
  novaHelper.addAssistantMessage(
    "<response>status refers to the current state or condition of a project</response>"
  );

  novaHelper.addUserMessage("Name: " + str);

  try {
    //first let's generate some knowledge using the LLM
    const response: InvokeModelCommandOutput = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: "apac.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(novaHelper.getRequestBody()),
      })
    );

    const textDecoder = new TextDecoder("utf-8");
    const knowledge_body = JSON.parse(textDecoder.decode(response.body));
    const knowledgeResponse = extractResponse(
      knowledge_body.output.message.content[0].text
    );
    console.log(knowledgeResponse);

    //we're using Amazon Titan Embeddings V2 to generate an embedding
    const invokeResponse: InvokeModelCommandOutput = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: "amazon.titan-embed-text-v2:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: knowledgeResponse,
          normalize: true,
        }),
      })
    );

    const embedding_response = JSON.parse(
      textDecoder.decode(invokeResponse.body)
    );
    console.log(
      `Embedding response for "${str}" contains ${embedding_response.embedding.length} elements`
    );
    return embedding_response.embedding;
  } catch (error) {
    throw error;
  }
}

function extractResponse(response: string): string | null {
  const regex = /<response>(.*?)<\/response>/;
  const match = response.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}
