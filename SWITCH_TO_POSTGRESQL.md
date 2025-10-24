# 🔄 Switch to PostgreSQL - Manual Steps

## Run these commands in order:

### Step 1: Install PostgreSQL drivers
```bash
cd backend
npm install pg pg-hstore
npm uninstall mysql2
```

### Step 2: Backup and replace database config
**Windows (Command Prompt):**
```cmd
move config\db.js config\db.mysql.backup
move config\db.postgres.js config\db.js
```

**Windows (PowerShell):**
```powershell
Move-Item config\db.js config\db.mysql.backup
Move-Item config\db.postgres.js config\db.js
```

**Mac/Linux:**
```bash
mv config/db.js config/db.mysql.backup
mv config/db.postgres.js config/db.js
```

### Step 3: Go back to project root
```bash
cd ..
```

### Step 4: Commit changes
```bash
git add .
git commit -m "Switch to PostgreSQL for production deployment"
git push
```

---

## ✅ That's it! You're now using PostgreSQL!

**Next**: Follow `DEPLOY_NOW_GUIDE.md` starting from **STEP 1**

---

## 🔍 Verify the Switch

After Step 2, check that `backend/config/db.js` now has this line:
```javascript
dialect: 'postgres',
```

Instead of:
```javascript
dialect: 'mysql',
```

---

## 📋 What Changed?

- ✅ Removed: `mysql2` package
- ✅ Added: `pg` and `pg-hstore` packages
- ✅ Database config: Now uses PostgreSQL
- ✅ Supports: `DATABASE_URL` (for Render, Supabase, etc.)
- ✅ Backward compatible: Still works with individual DB credentials

---

## ⚡ Quick Check

After installation, run:
```bash
cd backend
npm list pg pg-hstore
```

You should see:
```
apnaghar-plots-backend@1.0.0
├── pg@x.x.x
└── pg-hstore@x.x.x
```

---

**Ready to deploy!** 🚀

