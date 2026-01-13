# Google Cloud Vertex AI Setup Guide

This project now uses **Google Cloud Vertex AI** instead of the free Gemini API. This provides better quota limits, production-grade reliability, and pay-as-you-go pricing.

## Why Vertex AI?

- **Better Quotas**: Higher rate limits than free tier
- **Production Ready**: Enterprise-grade infrastructure
- **Pay-as-you-go**: Only pay for what you use (~$0.10 per 1M input tokens)
- **No Daily Limits**: Unlike free tier's 0 quota limits

## Prerequisites

1. **Google Cloud Account** - Sign up at https://console.cloud.google.com/
2. **Billing Enabled** - You need a credit card, but usage is very cheap
3. **GitHub Repository** - Where your code is hosted

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., `gemini-github-bot`)
4. Note your **Project ID** (you'll need this later)

## Step 2: Enable Vertex AI API

1. Go to https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
2. Select your project
3. Click "Enable"

## Step 3: Enable Billing

1. Go to https://console.cloud.google.com/billing
2. Link a billing account to your project
3. Don't worry - Gemini usage is very cheap:
   - Input: ~$0.10 per 1M tokens
   - Output: ~$0.30 per 1M tokens
   - Typical issue handling: < $0.01

## Step 4: Set Up Authentication for GitHub Actions

You have two options for authentication:

### Option A: Workload Identity Federation (Recommended - More Secure)

1. **Enable Required APIs**:
```bash
gcloud services enable iamcredentials.googleapis.com
gcloud services enable sts.googleapis.com
```

2. **Create Workload Identity Pool**:
```bash
gcloud iam workload-identity-pools create "github-actions-pool" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool"
```

3. **Create Workload Identity Provider**:
```bash
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="YOUR_PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="github-actions-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

4. **Create Service Account**:
```bash
gcloud iam service-accounts create github-actions-sa \
  --project="YOUR_PROJECT_ID" \
  --display-name="GitHub Actions Service Account"
```

5. **Grant Vertex AI Permissions**:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

6. **Allow GitHub to Impersonate Service Account**:
```bash
gcloud iam service-accounts add-iam-policy-binding \
  "github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --project="YOUR_PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/YOUR_GITHUB_USERNAME/gemini-git"
```

Note: Replace `PROJECT_NUMBER` with your numeric project number from https://console.cloud.google.com/

7. **Update GitHub Secrets**:
```bash
gh secret set GOOGLE_CLOUD_PROJECT_ID --body "YOUR_PROJECT_ID"
gh secret set WORKLOAD_IDENTITY_PROVIDER --body "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider"
gh secret set SERVICE_ACCOUNT_EMAIL --body "github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

### Option B: Service Account Key (Simpler but Less Secure)

1. **Create Service Account**:
```bash
gcloud iam service-accounts create github-actions-sa \
  --project="YOUR_PROJECT_ID" \
  --display-name="GitHub Actions Service Account"
```

2. **Grant Vertex AI Permissions**:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

3. **Create and Download Key**:
```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

4. **Add to GitHub Secrets**:
```bash
# Add the project ID
gh secret set GOOGLE_CLOUD_PROJECT_ID --body "YOUR_PROJECT_ID"

# Add the entire contents of key.json
gh secret set GOOGLE_CLOUD_CREDENTIALS < key.json

# Delete the local key file (important for security!)
rm key.json
```

## Step 5: Update GitHub Actions Workflow

Your workflow needs to authenticate with Google Cloud. The workflow has been updated to use Vertex AI.

If using Workload Identity (Option A), ensure your workflow includes:
```yaml
permissions:
  contents: write
  issues: write
  pull-requests: write
  id-token: write  # Required for Workload Identity

- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ secrets.WORKLOAD_IDENTITY_PROVIDER }}
    service_account: ${{ secrets.SERVICE_ACCOUNT_EMAIL }}
```

If using Service Account Key (Option B), ensure your workflow includes:
```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    credentials_json: ${{ secrets.GOOGLE_CLOUD_CREDENTIALS }}
```

## Step 6: Test Locally (Optional)

1. **Install gcloud CLI**: https://cloud.google.com/sdk/docs/install

2. **Authenticate**:
```bash
gcloud auth application-default login
```

3. **Create .env file**:
```bash
cp .env.example .env
```

4. **Edit .env** and add your project ID:
```
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

5. **Test the connection**:
```bash
npm run test-api
```

## Step 7: Test on GitHub

1. **Commit and push** all changes
2. **Create a test issue**:
```bash
gh issue create --title "Test Vertex AI" --body "@gemini-cli please confirm you're working"
```

3. **Check the workflow logs**:
```bash
gh run list
gh run view --log
```

## Pricing Estimate

Typical costs for this bot:
- **Per issue**: $0.001 - $0.01 (< 1 cent)
- **Per month** (10 issues): < $0.10
- **Per month** (100 issues): < $1.00

The free trial includes $300 credit, enough for ~30,000 issues!

## Troubleshooting

### Error: "Permission denied"
- Make sure you enabled the Vertex AI API
- Check that the service account has `roles/aiplatform.user`

### Error: "Project not found"
- Verify your project ID is correct
- Make sure billing is enabled

### Error: "Quota exceeded"
- This shouldn't happen with Vertex AI
- Check your quota at https://console.cloud.google.com/iam-admin/quotas

## Support

If you encounter issues:
1. Check workflow logs: `gh run view --log`
2. Test locally: `npm run test-api`
3. Create an issue in this repo

## Resources

- Vertex AI Documentation: https://cloud.google.com/vertex-ai/docs
- Gemini Pricing: https://cloud.google.com/vertex-ai/generative-ai/pricing
- Workload Identity: https://cloud.google.com/iam/docs/workload-identity-federation
