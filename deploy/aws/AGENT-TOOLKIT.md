# AWS Agent Toolkit for this repository

The AWS Agent Toolkit gives an AI coding agent (Claude Code here) AWS skills and a connection to the
AWS MCP Server. Everything that can live in the repository is committed, so any clone picks it up:

| Path | What it is |
| --- | --- |
| `CLAUDE.md` | Project instructions, with the AWS agent rules in a marked block |
| `.mcp.json` | The `aws-mcp` server entry, pointed at the AWS CLI profile `MM` through `AWS_MCP_PROXY_PROFILES` |
| `.claude/skills/` | The 24 default AWS skills the toolkit installs (`aws configure agent-toolkit`) |

What cannot live in the repository is **credentials**. They come from `aws login` on whichever machine runs the
agent, and they are never committed. Do that once per machine:

## One-time setup on your computer

1. Install the AWS CLI v2 if `aws --version` does not already work.
   - macOS / Linux: `curl -fsSL 'https://awscli.amazonaws.com/v2/install.sh' | bash` then
     `export PATH="$HOME/.local/bin:$PATH"` (add that line to `~/.zshrc` or `~/.bashrc`).
   - Windows (PowerShell): `irm 'https://awscli.amazonaws.com/v2/install.ps1' | iex`
2. Install `uv` if `uv --version` does not work (the MCP server runs through `uvx`):
   - macOS / Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
   - Windows: `irm https://astral.sh/uv/install.ps1 | iex`
3. Sign in. A browser window opens; no access keys are typed anywhere.

   ```bash
   aws configure set region us-east-1 --profile MM
   aws login --region us-east-1 --profile MM
   aws sts get-caller-identity --profile MM
   ```

   The last command prints your AccountId, Arn and UserId when the sign-in worked. The credentials stay
   valid for 12 hours and renew themselves for up to 90 days without another browser sign-in; after that,
   run `aws login --profile MM` again.
4. Optional, for use outside this repository: install the skills and MCP entry at user level too.

   ```bash
   aws configure agent-toolkit --yes --region us-east-1 --profile MM
   ```

   Then add `"env": { "AWS_MCP_PROXY_PROFILES": "MM" }` to the `aws-mcp` entry it writes to `~/.claude.json`
   (the generated entry otherwise falls back to the `default` profile and fails to start).
5. Check the toolkit can reach the skills catalog:

   ```bash
   aws agent-toolkit list-available-skills --region us-east-1 --profile MM
   ```

The Agent Toolkit service itself runs only in `us-east-1`; keep that Region in the two toolkit commands even if
your resources live elsewhere.

## Using another AWS account later

Run `aws login --profile <name>`, add that profile name to the space-separated `AWS_MCP_PROXY_PROFILES` value in
`.mcp.json` (and in `~/.claude.json` if you did step 4), and restart Claude Code.

## Refreshing the skills

Re-run `aws configure agent-toolkit --yes --region us-east-1 --profile MM` on your computer and copy the folders
that carry an `.aws-skill-metadata` file from `~/.claude/skills/` into `.claude/skills/` here. Browse more with
`aws agent-toolkit search-skills --search-query <text>`.

## Keep the agent files off the published site

`.github/workflows/pages.yml` and `deploy/aws/deploy.sh` both exclude `CLAUDE.md`, `.mcp.json` and `.claude/`.
If you add further agent files, extend both lists.
