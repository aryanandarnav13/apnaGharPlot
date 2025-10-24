# ⚠️ BEFORE YOU DEPLOY - Critical Actions

## 🔴 MUST DO (5 minutes)

### 1. Set Strong JWT Secret
When deploying to Render/Railway, set environment variable:
```
JWT_SECRET=<generate-a-very-long-random-string-here>
```

**Generate secure secret:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Use online generator
# https://randomkeygen.com/ (CodeIgniter Encryption Keys)
```

### 2. Plan Admin Password Change
After deployment, **immediately**:
- Login: `admin@example.com / password123`
- Change password in admin panel (or update in database)

### 3. Set Correct CORS URL
In hosting platform environment variables:
```
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

---

## 🟡 SHOULD DO (10 minutes)

### 4. Update Contact Information
Edit these in production:
- [ ] Footer email (currently: `info@apnagharplots.com`)
- [ ] Footer address (currently: `Sector 45, Gurgaon, Haryana`)
- [ ] Owner information via admin panel
- [ ] Default contact in admin settings

### 5. Update Social Media Links
If you don't have accounts, either:
- Remove the icons from `frontend/src/components/Footer.jsx`
- Or link to your actual Facebook/Instagram pages

### 6. Verify Database URL
Make sure your database connection string is correct:
```
# MySQL
DB_HOST=your-host
DB_PORT=3306
DB_NAME=apnaghar_plots
DB_USER=your-user
DB_PASSWORD=your-password

# OR PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## 🟢 GOOD TO DO (After Deployment)

### 7. Add Content
- [ ] Add real plot data
- [ ] Upload actual plot images/videos
- [ ] Add real house designs
- [ ] Update owner bio and photo

### 8. Set Up Monitoring
- [ ] Create UptimeRobot account
- [ ] Add monitor for backend URL
- [ ] Set interval to 5 minutes (keeps backend awake)

### 9. Test Everything
- [ ] Home page loads
- [ ] Language switcher works
- [ ] Plot listing works
- [ ] Plot detail page works
- [ ] Inquiry form works
- [ ] Admin login works
- [ ] Admin can manage all entities
- [ ] Mobile responsive

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
- ❌ Use `password123` in production (change admin password!)
- ❌ Use weak JWT_SECRET like `"secret"` or `"12345"`
- ❌ Forget to set NODE_ENV=production
- ❌ Use wrong database URL (internal vs external)
- ❌ Forget to run seed script (database will be empty!)
- ❌ Leave test data in production (clean it later)

### ✅ DO:
- ✅ Generate strong random JWT_SECRET (64+ characters)
- ✅ Set all environment variables before deployment
- ✅ Test in production after deployment
- ✅ Change admin password immediately
- ✅ Keep database credentials secure
- ✅ Monitor logs for first few days

---

## 📋 Quick Pre-Deployment Checklist

Copy this and check off before deploying:

```
BACKEND SETUP:
[ ] Database created (Supabase/Render)
[ ] Strong JWT_SECRET generated
[ ] All environment variables prepared
[ ] Seed script ready to run

FRONTEND SETUP:
[ ] Production API URL ready
[ ] Contact information updated (optional)
[ ] Social links updated (optional)

SECURITY:
[ ] JWT_SECRET is strong and random
[ ] Plan to change admin password
[ ] CORS URL is correct
[ ] NODE_ENV=production

POST-DEPLOYMENT:
[ ] Run seed script
[ ] Test all features
[ ] Change admin password
[ ] Set up UptimeRobot
```

---

## ✅ You're Ready When:

- ✅ You have generated a strong JWT_SECRET
- ✅ You have your database credentials ready
- ✅ You have your frontend URL (or will get it from Vercel)
- ✅ You understand you need to change admin password after deployment
- ✅ You've read QUICK_DEPLOY_CHECKLIST.md

---

## 🚀 Next Step

Open `QUICK_DEPLOY_CHECKLIST.md` and follow the steps!

**Estimated deployment time**: 30 minutes
**Estimated setup time**: 5 minutes (this document)
**Total**: 35 minutes to go live! 🎉

---

**Remember**: It's better to deploy and iterate than to wait for perfection. Your app is production-ready! 🚀

