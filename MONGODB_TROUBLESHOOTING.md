# MongoDB Connection Troubleshooting Guide

## Common Error: 500 Internal Server Error on Signup

### Issue: "Failed to sign up" or Database connection errors

### Most Common Fix: MongoDB Atlas IP Whitelist

**MongoDB Atlas requires your IP address to be whitelisted to allow connections.**

#### Steps to Fix:

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Login with your MongoDB account

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Or go to: Security → Network Access

3. **Add Your IP Address**
   - Click "Add IP Address" button
   - Option 1: Click "Add Current IP Address" (recommended for development)
   - Option 2: Click "Allow Access from Anywhere" (0.0.0.0/0) - **Only for testing, not recommended for production**

4. **Wait for Changes to Apply**
   - Changes can take 1-2 minutes to propagate
   - You'll see a green checkmark when it's active

### Other Common Issues:

#### 1. Database User Permissions
- Make sure your database user (`bingostudypoint_db_user`) has read/write permissions
- Go to: Database Access → Edit User → Database User Privileges
- Should have: "Read and write to any database" or "Atlas admin"

#### 2. Connection String Format
Your connection string should be:
```
mongodb+srv://bingostudypoint_db_user:0p7Xrf9aMIQs8IdL@jiocoder.4abdsab.mongodb.net/jiocoder?retryWrites=true&w=majority
```

#### 3. Check Server Logs
- Check your terminal/console where `npm run dev` is running
- Look for error messages starting with `❌` or `MongoDB connection error:`
- The improved error handling will show specific error messages

#### 4. Test Connection Manually
You can test the connection by visiting:
- `http://localhost:3000/api/health`
- Should show: `"database": "connected"`

### Quick Test:

1. **Check if MongoDB is accessible:**
   ```bash
   # In your terminal, check the dev server logs
   # Look for: ✅ MongoDB connected to JioCoder
   ```

2. **Check browser console:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try signing up again
   - Check the response for detailed error messages

3. **Check terminal logs:**
   - Look for detailed error messages with `❌` prefix
   - These will tell you exactly what's wrong

### Still Having Issues?

Check the error response in your browser's Network tab. The improved error handling now shows:
- Specific error messages
- Error codes
- Development details (when in dev mode)

Common error messages you might see:
- `"Database connection failed"` → IP whitelist issue
- `"An account with this email already exists"` → User already registered
- `"Validation error"` → Form data issue
- `"MongoServerError"` → MongoDB server issue

### Need More Help?

Check your terminal logs for the full error stack trace. The error handling now logs:
- Error name
- Error message  
- Error code
- Full stack trace (in development mode)

