# Real-Time Setup & Troubleshooting

## 🔧 Critical Setup Steps

### 1. Enable Real-Time in Supabase Dashboard

**This is REQUIRED for notifications to work!**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Database** → **Replication**
4. Find the `orders` table
5. Click to enable **Realtime**
6. Ensure these events are enabled:
   - ✅ **INSERT** (for new orders)
   - ✅ **UPDATE** (for status changes)
   - ✅ **DELETE** (optional)

### 2. Check RLS Policies

Make sure your Row Level Security policies allow reading from the `orders` table:

```sql
-- Check if this policy exists
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- If needed, ensure public read access (already in setup_v3.sql)
CREATE POLICY "Allow public read access to orders" 
ON orders FOR SELECT USING (true);
```

---

## 🧪 Testing Real-Time

### Test 1: Check Console Logs

1. Open Staff Dashboard: `http://localhost:8000/staff.html`
2. Open Browser Console (F12)
3. Look for these messages:
   ```
   ✅ Supabase client initialized
   Subscription status: SUBSCRIBED
   ✅ Real-time subscription active
   ```

### Test 2: Create Test Order

**Option A: Via Customer Page**
1. Open: `http://localhost:8000/customer.html?table=1&lang=en`
2. Add items to cart
3. Click "Checkout"
4. Watch Staff Dashboard for notification

**Option B: Via Supabase Dashboard**
1. Go to Supabase Dashboard → Table Editor
2. Select `orders` table
3. Click "Insert row"
4. Fill in:
   ```json
   {
     "table_id": "uuid-of-table-1",
     "items": [{"name": "Test Item", "quantity": 1, "price": 50}],
     "total": 50.00,
     "status": "pending"
   }
   ```
5. Click "Save"
6. Watch Staff Dashboard for notification

### Test 3: Check WebSocket Connection

In Browser Console, run:
```javascript
// Check if subscription is active
console.log('Channel:', realtimeChannel);

// Manual test
supabaseClient.getClient()
  .channel('test-channel')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    console.log('TEST: Received change!', payload);
  })
  .subscribe();
```

---

## 🐛 Troubleshooting

### Issue 1: No Notifications Appearing

**Symptoms:**
- No pop-up notification
- No sound
- Orders don't auto-refresh

**Solutions:**

1. **Check Supabase Real-Time is Enabled**
   ```
   Dashboard → Database → Replication → orders table → Enable
   ```

2. **Check Browser Console for Errors**
   - Look for WebSocket errors
   - Look for "Subscription status: SUBSCRIBED"
   - If you see "CHANNEL_ERROR", real-time is not enabled

3. **Check Network Tab**
   - Look for WebSocket connection (wss://)
   - Should show "101 Switching Protocols"
   - Connection should stay open

4. **Verify Supabase Credentials**
   - Check `.env` file has correct URL and anon key
   - Or check `supabase-client.js` has correct hardcoded values

### Issue 2: "Subscription status: CHANNEL_ERROR"

**Cause:** Real-time not enabled in Supabase

**Solution:**
1. Go to Supabase Dashboard
2. Database → Replication
3. Enable real-time for `orders` table
4. Wait 30 seconds for changes to propagate
5. Refresh staff dashboard

### Issue 3: Notifications Show But No Sound

**Cause:** Browser autoplay policy

**Solution:**
1. Click anywhere on the page first (user interaction required)
2. Check browser sound settings
3. Ensure site is not muted
4. Try in different browser

### Issue 4: "Failed to load orders"

**Cause:** Database connection issue or RLS policy blocking

**Solution:**
1. Check Supabase credentials are correct
2. Verify RLS policies allow SELECT on orders table
3. Check browser console for specific error message

---

## 📊 Debugging Commands

### Check if Real-Time is Working

Open Browser Console on Staff Dashboard:

```javascript
// 1. Check subscription status
console.log('Channel:', realtimeChannel);

// 2. Test manual subscription
const testChannel = supabaseClient.getClient()
  .channel('debug-channel')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    console.log('🎉 REAL-TIME WORKING!', payload);
  })
  .subscribe((status) => {
    console.log('Test subscription status:', status);
  });

// 3. After 5 seconds, check status
setTimeout(() => {
  console.log('Final status:', testChannel.state);
}, 5000);
```

**Expected Output:**
```
Test subscription status: SUBSCRIBED
Final status: joined
```

**If you see:**
```
Test subscription status: CHANNEL_ERROR
```
→ Real-time is NOT enabled in Supabase!

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] Supabase real-time enabled for `orders` table
- [ ] RLS policies allow reading orders
- [ ] Supabase credentials are correct
- [ ] Browser console shows "Subscription status: SUBSCRIBED"
- [ ] No WebSocket errors in Network tab
- [ ] Staff dashboard is open and loaded

---

## 🎯 Quick Test Script

Run this in Browser Console on Staff Dashboard:

```javascript
// Quick real-time test
(async () => {
  console.log('🧪 Testing Real-Time...');
  
  // 1. Check client
  const client = supabaseClient.getClient();
  console.log('✓ Client:', client ? 'OK' : 'FAIL');
  
  // 2. Create test subscription
  const testSub = client
    .channel('quick-test')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'orders'
    }, (payload) => {
      console.log('✅ REAL-TIME WORKS!', payload);
      alert('Real-time is working! Payload: ' + JSON.stringify(payload));
    })
    .subscribe((status) => {
      console.log('Status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Subscription successful!');
        console.log('Now create a test order in Supabase Dashboard...');
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Real-time NOT enabled in Supabase!');
        console.log('Go to: Dashboard → Database → Replication → Enable orders table');
      }
    });
})();
```

---

## 📝 Common Mistakes

1. **Forgetting to enable real-time in Supabase** ← Most common!
2. Not waiting for subscription to connect
3. RLS policies blocking access
4. Wrong table name in subscription
5. Browser blocking WebSocket connections (firewall/proxy)

---

## 🚀 After Fixing

Once real-time is working, you should see:

1. **In Console:**
   ```
   Subscription status: SUBSCRIBED
   ✅ Real-time subscription active
   ```

2. **When Order Created:**
   ```
   Real-time update: {eventType: 'INSERT', new: {...}, old: null}
   ```

3. **On Screen:**
   - 🔔 Notification pop-up
   - 🔊 Sound plays
   - Orders list refreshes automatically

---

## 💡 Pro Tips

- Keep browser console open while testing
- Test with two browser windows (customer + staff)
- Check Supabase logs for real-time connection issues
- Real-time has a ~100ms delay (normal)
- Multiple staff dashboards will all receive notifications

---

**If you still have issues after following this guide, check the browser console and share the error messages!**
