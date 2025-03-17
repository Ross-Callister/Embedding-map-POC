# Embedding Mapping POC

This project demonstrates how to use embeddings from AWS Bedrock to map one set of strings to another. Specifically, it maps between human-readable column names (like "First Name") and database/code-friendly column names (like "first_name").

## How It Works

1. The project uses Amazon Titan Embeddings V2 to generate vector embeddings for each string
2. It enhances the embedding process by first using Amazon Nova LLM to generate contextual knowledge about each string
3. It calculates cosine similarity between embeddings to find the best matches
4. Embeddings are cached in a SQLite database to avoid regenerating them
5. The project evaluates the accuracy of the mapping by comparing it to a known true mapping

## Setup

### Logging into AWS

We can use an IAM user to run this.

In "Identity and Access Management" we head to the users tab.

Select the user with permission for Bedrock.

Then create an access key, which generates key ID and secret key.

1. use `aws configure`
2. enter the necessary details from the IAM user
3. use `aws sts get-caller-identity` to verify

### Installation

```bash
yarn install
```

### Running the Project

```bash
yarn start
```

This will run the mapping process and output the accuracy of the matches.
