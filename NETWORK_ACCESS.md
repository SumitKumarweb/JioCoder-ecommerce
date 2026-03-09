# Network Access Guide

## Problem
When running the Next.js dev server, it's only accessible from the same machine by default. To access the application from other devices on your network (like another laptop), you need to configure the server to listen on all network interfaces.

## Solution

### 1. Updated Package.json Scripts

The `package.json` has been updated with network-friendly scripts:

- **`npm run dev`** - Runs on `0.0.0.0` (accessible from network)
- **`npm run dev:local`** - Runs on `localhost` only (local access)
- **`npm run start`** - Production server on `0.0.0.0` (network accessible)
- **`npm run start:local`** - Production server on `localhost` only

### 2. Finding Your IP Address

To access from another device, you need your computer's local IP address:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

### 3. Accessing from Another Device

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Find your computer's IP address (see above)

3. On the other device, open a browser and navigate to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

### 4. Firewall Configuration

If you can't access from another device, you may need to allow the port through your firewall:

**Windows:**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `3000`
6. Allow the connection
7. Apply to all profiles

**Mac:**
1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Add Node.js or allow incoming connections on port 3000

### 5. Environment Variables (Optional)

If you need to specify a custom API URL (for example, if your frontend and backend are on different servers), you can set:

```env
NEXT_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:3000
NEXT_PUBLIC_SITE_URL=http://YOUR_IP_ADDRESS:3000
```

Create a `.env.local` file in the root directory with these variables.

### 6. Troubleshooting

**Issue: "Connection refused" or "Can't reach this page"**
- Make sure the dev server is running with `npm run dev` (not `dev:local`)
- Check that both devices are on the same network
- Verify your firewall allows port 3000
- Try accessing via IP address, not hostname

**Issue: API calls fail from other device**
- API routes use relative paths (`/api/products`), so they should work automatically
- If using absolute URLs, ensure `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors

**Issue: MongoDB connection fails**
- MongoDB connection is server-side only, so this shouldn't affect client access
- If you're running MongoDB locally, ensure it's also accessible from the network if needed

### 7. Security Note

⚠️ **Warning**: Running on `0.0.0.0` makes your dev server accessible to anyone on your local network. Only use this in trusted networks (home/office). For production, use proper hosting with security measures.

## Quick Start

```bash
# Start dev server (network accessible)
npm run dev

# Find your IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from other device
# http://YOUR_IP:3000
```

