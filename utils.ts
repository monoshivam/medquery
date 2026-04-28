import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline } from "@xenova/transformers";

let extractor: any = null;

// reuse the pipeline across calls instead of reloading the model every request
async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-large-v1', {
      quantized: false
    });
  }
  return extractor;
}

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  query: string
): Promise<string> {
  const extractor = await getExtractor();

  const output = await extractor([query.replace(/\n/g, ' ')], {
    pooling: 'cls'
  });

  const queryEmbedding = output.tolist()[0];

  const index = client.Index(indexName);
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: false
  });

  console.log(queryResponse);

  if (queryResponse.matches.length > 0) {
    const concatenatedRetrievals = queryResponse.matches
      .map((match, index) => `\nClinical Finding ${index + 1}: \n ${match.metadata?.chunk}`)
      .join(". \n\n");
    return concatenatedRetrievals;
  } else {
    return "<nomatches>";
  }
}
