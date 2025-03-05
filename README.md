### Logging into AWS

We can use an IAM user to run this.

In "Identity and Access Management" we head to the users tab.

Select the user with permission for Bedrock.

Then create an access key, which generates key ID and secret key.

1. use `aws configure`
2. enter the necessary details from the IAM user
3. use `aws sts get-caller-identity` to verify
