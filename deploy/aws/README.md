# Publish on AWS (S3 + CloudFront)

Everything in this folder publishes the site to AWS as a **private S3 bucket behind CloudFront**: HTTPS, HTTP/2 and
HTTP/3, compression, the site's own `404.html` for missing URLs, and an optional custom domain. Nothing in the bucket
is public; CloudFront reads it through Origin Access Control. Expected cost for a site this size is a few cents a month
(S3 storage plus CloudFront requests in the free tier for most small sites).

| File | Purpose |
| --- | --- |
| `cloudformation.yml` | The infrastructure: bucket, bucket policy, Origin Access Control, CloudFront distribution, www→apex redirect function, optional ACM certificate and Route 53 records |
| `deploy.sh` | One command: creates/updates the stack, uploads the site with the right cache headers and content types, invalidates the CloudFront cache |
| `github-deploy-role-policy.json` | IAM permissions for the GitHub Actions role (only needed for the AWS workflow) |
| `../../.github/workflows/deploy-aws.yml` | GitHub Actions workflow that runs `deploy.sh` from the Actions tab |

## Option A — from your computer (fastest)

1. Install the [AWS CLI v2](https://aws.amazon.com/cli/) and sign in (`aws configure`, or `aws sso login`).
2. From the repository folder run:

   ```bash
   bash deploy/aws/deploy.sh
   ```

   About five minutes later (CloudFront takes a while the first time) the script prints a `https://….cloudfront.net/`
   URL where the site is live. Re-run the same command after any change; it updates in place.

## Option B — from GitHub (Actions tab → "Deploy site to AWS" → Run workflow)

One-time setup:

1. In AWS IAM, add GitHub as an OpenID Connect identity provider (`token.actions.githubusercontent.com`, audience
   `sts.amazonaws.com`) if the account does not have it yet.
2. Create an IAM role that trusts that provider for this repository (`repo:m-dminus/m-dminus:*`) and attach the
   permissions in `github-deploy-role-policy.json`.
3. In the repository, Settings → Secrets and variables → Actions: add the secret `AWS_ROLE_ARN` (the role's ARN).
   Optional variables: `AWS_REGION` (default `us-east-1`), `AWS_STACK_NAME`, `SITE_DOMAIN`, `HOSTED_ZONE_ID`,
   `CERT_ARN`, `INCLUDE_WWW`.

Then run the workflow whenever you want to publish.

## Attaching maskatech.com

The stack is deployed in **us-east-1** by default because CloudFront only accepts certificates from that region.

**Route 53 (recommended — everything automatic).** Create a public hosted zone for `maskatech.com` in Route 53, then at
GoDaddy set the domain's nameservers to the four Route 53 nameservers shown in the zone. Run:

```bash
HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ bash deploy/aws/deploy.sh
```

The stack requests a certificate for `maskatech.com` and `www.maskatech.com`, validates it through DNS by itself, and
creates the A/AAAA alias records. The first run waits for the certificate to validate (usually a few minutes after the
nameserver change has propagated). `www.` redirects to the apex domain.

**Keep DNS at GoDaddy.** Request a certificate in ACM (us-east-1) for `maskatech.com` and `www.maskatech.com`, add the
two CNAME validation records it shows to GoDaddy DNS, wait for "Issued", then run:

```bash
CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/… bash deploy/aws/deploy.sh
```

Finally, at GoDaddy point `www` (CNAME) at the CloudFront domain the script prints, and forward the apex domain
`maskatech.com` to `https://www.maskatech.com` (GoDaddy cannot alias an apex domain to CloudFront; forwarding is its
workaround). Remove the existing forwarding rule that currently frames theteethboutique.com first.

## What the deploy uploads

Everything in the repository except the repository-only files: `.git`, `.github`, `deploy/`, `README.md`,
`CONTENT-REVIEW.md`, `og.html`, `.gitignore`, `.nojekyll`. Assets are cached for one day; HTML and metadata are
always revalidated, and every deploy invalidates the whole CloudFront cache, so changes show up within a minute.

## Notes

- The template and script were linted (`cfn-lint`, `bash -n`) but were not executed against an AWS account from this
  repository, since no AWS credentials were available at build time. The first run reports any account-specific
  problem (permissions, an existing stack name) in plain text.
- To take the site down: empty the bucket, then delete the stack. The bucket itself is retained on stack deletion so
  the files are never lost by accident.
