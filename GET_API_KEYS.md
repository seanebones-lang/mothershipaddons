# How to Get API Keys for ELCA Blockbusters

You need 3 API keys to enable AI generation features.

---

## 1. OpenAI API Key

**Website:** https://platform.openai.com/api-keys

**Steps:**
1. Go to https://platform.openai.com/signup
2. Create account or sign in
3. Click your profile (top right) → "View API keys"
4. Click "+ Create new secret key"
5. Name it "ELCA Blockbusters"
6. Copy the key (starts with `sk-proj-...`)
7. **Save it immediately** (you can't see it again)

**Cost:** 
- Free trial: $5 credit
- Pay-as-you-go: ~$0.01 per sermon generation
- ~$10/month for typical church usage

---

## 2. Anthropic API Key (Claude Sonnet 4.5)

**Website:** https://console.anthropic.com/

**Steps:**
1. Go to https://console.anthropic.com/
2. Create account or sign in
3. Click "API Keys" in left menu
4. Click "+ Create Key"
5. Name it "ELCA Blockbusters"
6. Copy the key (starts with `sk-ant-...`)
7. **Save it immediately**

**Cost:**
- Free trial: $5 credit
- Pay-as-you-go: ~$0.015 per sermon
- ~$15/month for typical church usage

**Note:** Claude Sonnet 4.5 is our PRIMARY provider for ELCA content

---

## 3. X.ai Grok API Key

**Website:** https://x.ai/api

**Steps:**
1. Go to https://x.ai/
2. Click "Get API Access"
3. Sign up with X/Twitter account
4. Navigate to API section
5. Generate API key
6. Copy the key
7. **Save it**

**Cost:**
- Pricing varies
- Fallback provider (rarely used)
- Optional if you have OpenAI + Anthropic

---

## Add Keys to Your Application

### Local Development

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-proj-your_actual_key_here
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here
XAI_API_KEY=your_xai_key_here
```

Then restart backend:
```bash
# Stop backend (Ctrl+C)
cd /Users/seanmcdonnell/Desktop/Motherfucker/mothershipaddons/backend
source venv/bin/activate
uvicorn main:app --reload
```

### Production Deployment (Render)

1. Go to Render dashboard
2. Click your backend service
3. Click "Environment" tab
4. Add variables:
   - `OPENAI_API_KEY` = your key
   - `ANTHROPIC_API_KEY` = your key
   - `XAI_API_KEY` = your key
5. Click "Save Changes"
6. Service auto-redeploys

---

## Test API Keys Work

### Local Test
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "your_pastoral_agent_id",
    "input_data": {
      "type": "sermon",
      "topic": "Test Sermon",
      "scripture": "John 3:16",
      "length": "short"
    }
  }'
```

If keys work, you'll get a generated sermon in the response.

### Frontend Test
1. Open http://localhost:3000
2. Go to AI Pastor tab
3. Enter topic "God's Love"
4. Click "Generate Sermon"
5. Should generate successfully

---

## API Key Security

**✅ DO:**
- Store in .env file (excluded from git)
- Add to Render environment variables
- Never commit to code
- Rotate keys periodically

**❌ DON'T:**
- Put in frontend code
- Commit to GitHub
- Share publicly
- Hardcode in files

---

## Estimated Costs

### Monthly Usage (Typical Small Church)
```
OpenAI (10 sermons/month):      ~$1-2
Anthropic (20 social posts):    ~$3-5
X.ai Grok (backup):              ~$0-1
─────────────────────────────────────
Total:                           ~$5-10/month
```

### Free Tier
Both OpenAI and Anthropic give $5 credit to start - **enough for ~50 sermons for FREE**.

---

## Which API Keys Do You Actually Need?

**Minimum (to start):**
- ✅ ANTHROPIC_API_KEY (Claude Sonnet 4.5 - our primary)

**Recommended:**
- ✅ ANTHROPIC_API_KEY (primary)
- ✅ OPENAI_API_KEY (fallback)

**Optional:**
- XAI_API_KEY (rarely used)

**You can start with just Anthropic and add others later.**

---

## Quick Links

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- X.ai: https://x.ai/api

---

**After getting keys, add them to `backend/.env` and restart the backend server!**

