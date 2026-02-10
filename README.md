# NegotiateUp — Complete Setup Guide

## What You're Building

A website where people pay $39, fill out a form about their salary negotiation situation, and receive a personalized 10+ page PDF playbook via email in under 10 minutes. The entire process is automated.

**The flow:**
1. Visitor lands on your site → reads the landing page
2. Clicks "Get Playbook" → pays via Stripe ($39)
3. After payment → fills out a detailed form + uploads resume/offer letter
4. Your server → sends their info to Claude AI → generates a custom playbook
5. Server → turns the AI output into a polished PDF
6. Server → emails the PDF to the customer
7. Customer gets their playbook in ~5-10 minutes

---

## What You Need (accounts to create)

| Service | What it does | Cost | Link |
|---------|-------------|------|------|
| **Vercel** | Hosts your website | Free (upgrade to Pro $20/mo for longer AI generation times) | https://vercel.com |
| **Stripe** | Processes payments | Free (2.9% + $0.30 per sale) | https://stripe.com |
| **Anthropic** | AI that writes the playbook | Pay per use (~$0.05-0.15 per playbook) | https://console.anthropic.com |
| **Resend** | Sends the email with PDF | Free up to 3,000 emails/month | https://resend.com |
| **GitHub** | Stores your code | Free | https://github.com |
| **Domain** (optional) | Custom URL like negotiateup.com | ~$12/year | https://namecheap.com |

**Total monthly cost at low volume: ~$0-20/month + payment processing fees**
**Cost per playbook generated: ~$0.10 (AI) + $1.17 (Stripe fee on $39) = ~$1.27**
**Profit per sale: ~$37.73**

---

## Step-by-Step Setup

### Step 1: Create Your Accounts (15 minutes)

#### 1A: GitHub
1. Go to https://github.com and create a free account
2. Download GitHub Desktop: https://desktop.github.com (makes things easier)

#### 1B: Vercel
1. Go to https://vercel.com
2. Click "Sign Up" → Sign up with your GitHub account
3. That's it for now

#### 1C: Stripe
1. Go to https://stripe.com and create an account
2. Complete their verification process (may take 1-2 days for full activation, but you can use test mode immediately)
3. Go to **Dashboard → Developers → API Keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)
6. Now create your products:
   - Go to **Products → Add Product**
   - Product 1: Name "Offer Negotiation Playbook", Price $39.00, One-time
   - Product 2: Name "Raise Negotiation Playbook", Price $39.00, One-time
   - For each product, copy the **Price ID** (starts with `price_`)
7. Set up the webhook:
   - Go to **Developers → Webhooks → Add Endpoint**
   - URL: `https://your-domain.com/api/webhook` (update after deploying)
   - Select events: `checkout.session.completed`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

#### 1D: Anthropic
1. Go to https://console.anthropic.com
2. Create an account and add a payment method
3. Go to **API Keys → Create Key**
4. Copy the key (starts with `sk-ant-`)

#### 1E: Resend
1. Go to https://resend.com and create an account
2. Go to **API Keys → Create API Key**
3. Copy the key (starts with `re_`)
4. **Important:** Add and verify your sending domain under **Domains**
   - If you don't have a custom domain yet, you can use their test domain temporarily

---

### Step 2: Set Up the Code (10 minutes)

#### 2A: Upload to GitHub
1. Open GitHub Desktop
2. **File → Add Local Repository** → select the `negotiateup` folder
3. If it says "not a repository", click **Create a Repository Here**
   - Name: `negotiateup`
   - Keep everything else default
   - Click **Create Repository**
4. In the bottom left, type "Initial commit" as the summary
5. Click **Commit to main**
6. Click **Publish Repository** (top bar)
   - Uncheck "Keep this code private" if you want (doesn't matter)
   - Click **Publish**

#### 2B: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click **Add New → Project**
3. Find `negotiateup` in your GitHub repos → click **Import**
4. **Before clicking Deploy**, click **Environment Variables**
5. Add ALL of these (one at a time):

```
STRIPE_SECRET_KEY = sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY = pk_test_your_key_here
STRIPE_WEBHOOK_SECRET = whsec_your_secret_here
STRIPE_PRICE_OFFER = price_your_offer_price_id
STRIPE_PRICE_RAISE = price_your_raise_price_id
ANTHROPIC_API_KEY = sk-ant-your_key_here
RESEND_API_KEY = re_your_key_here
FROM_EMAIL = playbook@yourdomain.com
NEXT_PUBLIC_URL = https://your-project.vercel.app
```

6. Click **Deploy**
7. Wait 2-3 minutes for it to build
8. Vercel will give you a URL like `https://negotiateup.vercel.app`
9. **Update** `NEXT_PUBLIC_URL` in Vercel settings to match this URL
10. **Update** your Stripe webhook URL to `https://your-url.vercel.app/api/webhook`

---

### Step 3: Connect a Custom Domain (optional, 10 minutes)

1. Buy a domain (e.g., negotiateup.com) from Namecheap, Google Domains, or similar
2. In Vercel: **Project Settings → Domains → Add Domain**
3. Enter your domain name
4. Vercel will show you DNS records to add
5. Go to your domain registrar and add those DNS records
6. Wait 5-30 minutes for DNS to propagate
7. Update `NEXT_PUBLIC_URL` in Vercel to your custom domain
8. Update Stripe webhook URL to use your custom domain
9. Update Resend sending domain

---

### Step 4: Test Everything (15 minutes)

1. **Test the landing page:** Visit your site, scroll through, make sure everything looks good
2. **Test payment flow:**
   - Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
   - Click "Get Offer Playbook" → complete test payment
   - You should be redirected to the upload form
3. **Test playbook generation:**
   - Fill out the form with test data
   - Upload a test PDF resume (any PDF works)
   - Click "Generate My Playbook"
   - Check your email for the playbook PDF
4. **Test the raise flow** the same way
5. **Go live with Stripe:**
   - In Stripe Dashboard, toggle from "Test mode" to "Live mode"
   - Get your LIVE API keys (start with `pk_live_` and `sk_live_`)
   - Create the same two products in live mode
   - Update all Stripe environment variables in Vercel with live keys
   - Redeploy

---

### Step 5: Upgrades to Consider

#### Recommended (Vercel Pro - $20/month)
The free Vercel plan has a 10-second timeout on API routes. Since AI generation can take 30-60 seconds, you should upgrade to Vercel Pro ($20/month) which gives you 120-second timeouts. Without this, playbook generation may fail.

**Alternative:** Use a background job approach where:
1. The form submission returns immediately
2. A background job generates the playbook
3. Email is sent when complete
This is more complex but works on the free plan.

#### Nice to Have
- **Analytics:** Add Google Analytics or Plausible to track visitors
- **Error monitoring:** Add Sentry to catch errors
- **Customer support:** Add a Crisp or Intercom chat widget

---

## File Structure Reference

```
negotiateup/
├── app/
│   ├── api/
│   │   ├── create-checkout/     # Creates Stripe checkout session
│   │   │   └── route.js
│   │   ├── generate-playbook/   # Main engine: AI + PDF + email
│   │   │   └── route.js
│   │   └── webhook/             # Stripe payment webhooks
│   │       └── route.js
│   ├── new-offer/               # Upload form for offer negotiation
│   │   └── page.js
│   ├── raise/                   # Upload form for raise negotiation
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js                  # Landing page
├── components/                  # All landing page sections
│   ├── Nav.js
│   ├── Hero.js
│   ├── StatBar.js
│   ├── TwoPaths.js
│   ├── PainPoints.js
│   ├── HowItWorks.js
│   ├── WhatYouGet.js
│   ├── Comparison.js
│   ├── Pricing.js
│   ├── FAQ.js
│   ├── FinalCTA.js
│   └── Footer.js
├── lib/
│   ├── prompts.js               # AI prompts (the "secret sauce")
│   ├── pdf-generator.js         # Creates the PDF
│   └── email.js                 # Sends the email via Resend
├── .env.example                 # Template for environment variables
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md                    # This file
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Payment not found" after Stripe | Make sure `NEXT_PUBLIC_URL` matches your actual domain |
| Playbook generation times out | Upgrade to Vercel Pro ($20/mo) for longer timeouts |
| Email not arriving | Check spam folder. Verify your domain in Resend. |
| PDF looks wrong | Edit `lib/pdf-generator.js` to adjust formatting |
| AI output quality is poor | Edit `lib/prompts.js` to improve the prompts |
| Stripe webhook errors | Make sure webhook URL is correct and includes `/api/webhook` |

## Customizing

- **Change pricing:** Update prices in Stripe Dashboard, no code changes needed
- **Change copy:** Edit the components in `components/` folder
- **Improve AI output:** Edit the prompts in `lib/prompts.js`
- **Change PDF look:** Edit `lib/pdf-generator.js`
- **Change email template:** Edit `lib/email.js`

## Going Live Checklist

- [ ] All Stripe keys switched from test to live
- [ ] Custom domain connected
- [ ] Resend domain verified
- [ ] Test purchase completed end-to-end with real payment
- [ ] Email delivery confirmed (not in spam)
- [ ] Vercel Pro plan activated (for reliable generation)
- [ ] Stripe webhook updated with production URL
