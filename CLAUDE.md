# Maskatech Labs website

Static one-page marketing site: plain HTML, CSS and JavaScript, no build step. `README.md` describes every file,
`CONTENT-REVIEW.md` lists each factual claim on the page and its source, and `deploy/aws/` holds the S3 + CloudFront
deployment. Agent files (`CLAUDE.md`, `.mcp.json`, `.claude/`) are excluded from the published site by
`.github/workflows/pages.yml` and `deploy/aws/deploy.sh`; keep those exclusion lists in step if you add more.

AWS access for agents is set up with the AWS Agent Toolkit. The AWS MCP server is declared in `.mcp.json` (profile
`MM`, Region `us-east-1`) and the toolkit's skills live in `.claude/skills/`. Credentials come from `aws login`
on the machine running the agent; see `deploy/aws/AGENT-TOOLKIT.md`.

<!-- BEGIN AWS Agent Toolkit rules -->
# AWS Guidance

- Where these AWS rules conflict with the project's own instructions, the
  project's instructions take precedence.
- Prefer the AWS MCP Server for AWS interactions — it provides sandboxed
  execution, observability, and audit logging. If unavailable, use the
  AWS CLI directly.
- Before starting a task, check whether a relevant AWS skill is available.
  Load the skill with `retrieve_skill` and prefer its guidance over
  general knowledge.
- When uncertain about specific AWS details (API parameters, permissions,
  limits, error codes), verify against documentation rather than guessing.
  State uncertainty explicitly if you cannot confirm.
- When creating infrastructure, prefer infrastructure-as-code (AWS CDK or
  CloudFormation) over direct CLI commands.
- When working with infrastructure, follow AWS Well-Architected Framework
  principles.
- Do not use em dashes in AWS resource names or descriptions. Use
  hyphens instead.

## Secret Safety

- MUST load the `aws-secrets-manager` skill first for any secret,
  credential, API key, token, or password task. MUST NOT call
  `secretsmanager get-secret-value` or `batch-get-secret-value`, and MUST
  NOT hit the Secrets Manager Agent daemon directly. MUST use
  `{{resolve:secretsmanager:secret-id:SecretString:json-key}}` with
  `asm-exec` so the secret resolves at runtime without entering context.

<!-- END AWS Agent Toolkit rules -->
