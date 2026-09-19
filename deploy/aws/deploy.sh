#!/usr/bin/env bash
# Publishes the Maskatech Labs site to AWS: CloudFormation stack (private S3 bucket + CloudFront over HTTPS),
# then uploads the site files and invalidates the CloudFront cache. Safe to re-run: it updates in place.
#
# Requirements: AWS CLI v2 (https://aws.amazon.com/cli/) signed in to your account (`aws configure` or SSO).
#
# Usage (from anywhere):
#   bash deploy/aws/deploy.sh                       # publish on the CloudFront domain only (no DNS needed)
#   HOSTED_ZONE_ID=Z0123456789ABC bash deploy/aws/deploy.sh    # custom domain via Route 53 (certificate + DNS created)
#   CERT_ARN=arn:aws:acm:us-east-1:...:certificate/... bash deploy/aws/deploy.sh   # custom domain, DNS stays elsewhere
#
# Optional settings (environment variables):
#   STACK           CloudFormation stack name        (default: maskatech-site)
#   AWS_REGION      Region for the stack             (default: us-east-1 — required when the stack creates the certificate)
#   DOMAIN          Apex domain                      (default: maskatech.com)
#   INCLUDE_WWW     Also serve www. and redirect it  (default: true)
set -euo pipefail

STACK="${STACK:-maskatech-site}"
REGION="${AWS_REGION:-us-east-1}"
DOMAIN="${DOMAIN:-maskatech.com}"
INCLUDE_WWW="${INCLUDE_WWW:-true}"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID:-}"
CERT_ARN="${CERT_ARN:-}"

cd "$(dirname "$0")/../.."      # repository root, where index.html lives
[ -f index.html ] || { echo "index.html not found next to deploy/ — run this from the site repository" >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "The AWS CLI is not installed: https://aws.amazon.com/cli/" >&2; exit 1; }
aws sts get-caller-identity --output text >/dev/null || { echo "The AWS CLI is not signed in (run: aws configure)" >&2; exit 1; }

echo "==> Creating or updating stack '$STACK' in $REGION"
aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "$STACK" \
  --template-file deploy/aws/cloudformation.yml \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    "DomainName=$DOMAIN" \
    "IncludeWww=$INCLUDE_WWW" \
    "HostedZoneId=$HOSTED_ZONE_ID" \
    "CertificateArn=$CERT_ARN"

output() {
  aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET="$(output BucketName)"
DISTRIBUTION_ID="$(output DistributionId)"
SITE_URL="$(output SiteUrl)"
CF_DOMAIN="$(output DistributionDomainName)"

echo "==> Uploading the site to s3://$BUCKET"
# Files that belong to the repository, not to the published site
EXCLUDE=(--exclude ".git/*" --exclude ".github/*" --exclude "deploy/*" --exclude "README.md" --exclude "CONTENT-REVIEW.md"
         --exclude "og.html" --exclude ".gitignore" --exclude ".nojekyll" --exclude ".DS_Store" --exclude "*/.DS_Store")

# 1) Assets (fonts, images, CSS, JS): cached for a day. --delete removes assets that no longer exist.
aws s3 sync . "s3://$BUCKET" --region "$REGION" --delete "${EXCLUDE[@]}" \
  --exclude "*.html" --exclude "*.xml" --exclude "*.txt" --exclude "*.webmanifest" \
  --cache-control "public, max-age=86400"

# 2) Pages and metadata: always revalidated, so a new deploy shows up immediately after the invalidation below.
aws s3 sync . "s3://$BUCKET" --region "$REGION" "${EXCLUDE[@]}" \
  --exclude "*" --include "*.html" --include "*.xml" --include "*.txt" --include "*.webmanifest" \
  --cache-control "no-cache"

# 3) Content types the CLI does not know on every platform
aws s3 cp "s3://$BUCKET/site.webmanifest" "s3://$BUCKET/site.webmanifest" --region "$REGION" \
  --content-type "application/manifest+json" --cache-control "no-cache" --metadata-directive REPLACE >/dev/null
for f in assets/fonts/*.woff2; do
  aws s3 cp "s3://$BUCKET/$f" "s3://$BUCKET/$f" --region "$REGION" \
    --content-type "font/woff2" --cache-control "public, max-age=86400" --metadata-directive REPLACE >/dev/null
done

echo "==> Invalidating the CloudFront cache"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --output text --query 'Invalidation.Id'

echo
echo "Published."
echo "  CloudFront URL : https://$CF_DOMAIN/"
echo "  Site URL       : $SITE_URL"
if [ -n "$HOSTED_ZONE_ID" ]; then
  echo "  DNS            : A/AAAA alias records were created in Route 53 zone $HOSTED_ZONE_ID"
elif [ -n "$CERT_ARN" ]; then
  echo "  DNS            : point $DOMAIN (ALIAS/ANAME) and www.$DOMAIN (CNAME) at $CF_DOMAIN"
else
  echo "  DNS            : none needed — share the CloudFront URL, or re-run with HOSTED_ZONE_ID / CERT_ARN for $DOMAIN"
fi
