# KolayMiles Integration Guide for Kolay Apps

This comprehensive guide provides step-by-step instructions for integrating KolayMiles into other Kolay applications, enabling cross-platform miles earning, referral systems, and unified user experiences.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Integration Components](#integration-components)
   - [1. User Authentication & Sync](#1-user-authentication--sync)
   - [2. Miles Earning System](#2-miles-earning-system)
   - [3. Admin Dashboard Settings](#3-admin-dashboard-settings)
   - [4. User Settings Integration](#4-user-settings-integration)
   - [5. Footer Branding](#5-footer-branding)
4. [API Reference](#api-reference)
5. [Code Examples](#code-examples)
6. [Testing & Deployment](#testing--deployment)

---

## Overview

KolayMiles integration allows Kolay apps to:
- **Unify User Accounts**: Sync users across platforms using Supabase Auth
- **Enable Miles Rewards**: Award miles for sales, referrals, and user actions
- **Referral System**: Implement ambassador program with 10% revenue sharing
- **Admin Control**: Manage profit sharing and settlement settings
- **User Activation**: Let users enable KolayMiles as an optional add-on
- **Brand Presence**: Display KolayMiles branding in app footer

---

## Prerequisites

### Required Access
1. **KolayMiles Partner Account**: Contact KolayMiles team to register your app as a partner
2. **API Credentials**: You'll receive:
   - Partner API Key
   - Partner ID
   - Base API URL

### Technical Requirements
- Supabase Auth integration (or compatible auth system)
- Admin dashboard access
- User settings page
- Footer component access

### Environment Variables
```env
KOLAYMILES_API_KEY=your_partner_api_key
KOLAYMILES_API_URL=https://kolaymiles.com/api/partner
KOLAYMILES_BASE_URL=https://kolaymiles.com
```

---

## Integration Components

### 1. User Authentication & Sync

#### Objective
Sync user accounts between your Kolay app and KolayMiles using Supabase Auth (or your existing auth system).

#### Implementation Steps

**Step 1.1: User Registration Sync**

When a user registers in your app, immediately sync to KolayMiles:

```typescript
// Example: After user registration in your app
async function syncUserToKolayMiles(userId: string, email: string, name: string, referralCode?: string) {
  const response = await fetch(`${process.env.KOLAYMILES_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KOLAYMILES_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_user_id: userId, // Your app's user ID
      email: email,
      full_name: name,
      metadata: {
        source_app: 'your-app-name',
        referral_code: referralCode, // If user registered with referral
        registration_date: new Date().toISOString(),
      },
    }),
  });

  if (!response.ok) {
    console.error('Failed to sync user to KolayMiles');
    return null;
  }

  return await response.json();
}
```

**Step 1.2: User Login Sync**

On user login, verify and sync user data:

```typescript
// Example: On user login
async function syncUserOnLogin(userId: string, userData: any) {
  // Check if user exists in KolayMiles
  const checkResponse = await fetch(
    `${process.env.KOLAYMILES_API_URL}/users?external_user_id=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.KOLAYMILES_API_KEY}`,
      },
    }
  );

  if (checkResponse.status === 404) {
    // User doesn't exist, create them
    return await syncUserToKolayMiles(userId, userData.email, userData.name);
  } else if (checkResponse.ok) {
    // User exists, update if needed
    const existingUser = await checkResponse.json();
    // Optionally update user data
    return existingUser;
  }
}
```

**Step 1.3: Periodic User Sync**

Set up a background job to sync user list periodically:

```typescript
// Example: Daily user sync job
async function syncAllUsers() {
  // Get all active users from your database
  const users = await getActiveUsers(); // Your function to get users

  for (const user of users) {
    try {
      await syncUserToKolayMiles(
        user.id,
        user.email,
        user.name,
        user.referral_code
      );
    } catch (error) {
      console.error(`Failed to sync user ${user.id}:`, error);
    }
  }
}

// Run daily at 2 AM
scheduleJob('0 2 * * *', syncAllUsers);
```

#### API Endpoint Reference
- **POST** `/api/partner/users` - Create or update user
- **GET** `/api/partner/users?external_user_id={id}` - Get user info

---

### 2. Miles Earning System

#### Objective
Enable users to earn KolayMiles for sales, referrals, and purchases in your app.

#### Earning Rules

1. **Referral Revenue Sharing (10%)**
   - Users with 10+ referrals become Ambassadors
   - Ambassadors earn 10% of revenue from users they referred
   - Tracked via referral links and referral codes

2. **Personal Sales (5-15%)**
   - Regular users earn 5-15% based on their tier/activity
   - Percentage determined by:
     - User tier level
     - Purchase history
     - Account age
     - Total lifetime value

#### Implementation Steps

**Step 2.1: Track Referrals During Registration**

```typescript
// Example: Registration with referral tracking
async function registerUserWithReferral(
  email: string,
  name: string,
  password: string,
  referralCode?: string
) {
  // 1. Create user in your app
  const user = await createUser(email, name, password);

  // 2. If referral code provided, track it
  if (referralCode) {
    await trackReferral(user.id, referralCode);
  }

  // 3. Sync to KolayMiles
  await syncUserToKolayMiles(user.id, email, name, referralCode);

  return user;
}

async function trackReferral(userId: string, referralCode: string) {
  // Get referrer from KolayMiles
  const referrerResponse = await fetch(
    `${process.env.KOLAYMILES_API_URL}/referrals/validate?code=${referralCode}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.KOLAYMILES_API_KEY}`,
      },
    }
  );

  if (referrerResponse.ok) {
    const referrer = await referrerResponse.json();
    // Store referral relationship in your database
    await storeReferralRelationship(userId, referrer.user_id);
  }
}
```

**Step 2.2: Award Miles for Sales**

```typescript
// Example: Award miles when user makes a purchase
async function awardMilesForPurchase(
  userId: string,
  orderId: string,
  purchaseAmount: number,
  orderType: 'personal' | 'referral'
) {
  // Determine earning percentage
  let earningPercentage = 0.05; // Default 5%

  if (orderType === 'referral') {
    // Check if user is ambassador (10+ referrals)
    const userStats = await getUserReferralStats(userId);
    if (userStats.totalReferrals >= 10) {
      earningPercentage = 0.10; // 10% for ambassadors
    } else {
      earningPercentage = 0.05; // 5% for regular referrals
    }
  } else {
    // Personal purchase - determine based on tier
    const userTier = await getUserTier(userId);
    earningPercentage = getEarningPercentageByTier(userTier); // 5-15%
  }

  // Calculate miles (1 mile per 1 TRY, or your conversion rate)
  const milesToAward = Math.floor(purchaseAmount * earningPercentage);

  // Award miles via KolayMiles API
  const response = await fetch(`${process.env.KOLAYMILES_API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KOLAYMILES_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_user_id: userId,
      type: 'earn',
      amount: milesToAward,
      description: `Purchase reward - Order #${orderId} (${orderType})`,
      external_transaction_id: `order_${orderId}`,
      metadata: {
        order_id: orderId,
        purchase_amount: purchaseAmount,
        earning_percentage: earningPercentage,
        order_type: orderType,
      },
    }),
  });

  if (!response.ok) {
    console.error('Failed to award miles');
    return null;
  }

  return await response.json();
}

function getEarningPercentageByTier(tier: string): number {
  const tierPercentages: Record<string, number> = {
    'explorer': 0.05,    // 5%
    'adventurer': 0.08,  // 8%
    'voyager': 0.10,     // 10%
    'champion': 0.12,    // 12%
    'legend': 0.15,      // 15%
  };
  return tierPercentages[tier] || 0.05;
}
```

**Step 2.3: Check Ambassador Status**

```typescript
// Example: Check if user is ambassador
async function checkAmbassadorStatus(userId: string): Promise<boolean> {
  const response = await fetch(
    `${process.env.KOLAYMILES_API_URL}/referrals/analytics?user_id=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.KOLAYMILES_API_KEY}`,
      },
    }
  );

  if (response.ok) {
    const analytics = await response.json();
    return analytics.totalReferrals >= 10;
  }

  return false;
}
```

**Step 2.4: Generate Referral Links**

```typescript
// Example: Generate referral link for user
async function generateReferralLink(userId: string): Promise<string> {
  // Get user's referral code from KolayMiles
  const response = await fetch(
    `${process.env.KOLAYMILES_API_URL}/referrals/code?user_id=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.KOLAYMILES_API_KEY}`,
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    const referralCode = data.referral_code;
    // Generate link to your app's registration with referral code
    return `${process.env.YOUR_APP_URL}/register?ref=${referralCode}`;
  }

  return null;
}
```

#### API Endpoint Reference
- **POST** `/api/partner/transactions` - Award or deduct miles
- **GET** `/api/referrals/analytics` - Get referral statistics
- **GET** `/api/referrals/code` - Get user's referral code

---

### 3. Admin Dashboard Settings

#### Objective
Create a KolayMiles settings section in your app's admin dashboard for managing profit sharing and settlements.

#### Implementation Steps

**Step 3.1: Create Admin Settings Component**

```typescript
// Example: Admin KolayMiles Settings Component
'use client';

import { useState, useEffect } from 'react';

interface KolayMilesSettings {
  profitSharingEnabled: boolean;
  defaultEarningPercentage: number;
  ambassadorEarningPercentage: number;
  settlementFrequency: 'weekly' | 'monthly' | 'quarterly';
  minimumSettlementAmount: number;
  autoSettlement: boolean;
}

export function KolayMilesAdminSettings() {
  const [settings, setSettings] = useState<KolayMilesSettings>({
    profitSharingEnabled: true,
    defaultEarningPercentage: 0.10,
    ambassadorEarningPercentage: 0.10,
    settlementFrequency: 'monthly',
    minimumSettlementAmount: 1000,
    autoSettlement: true,
  });

  const [settlementHistory, setSettlementHistory] = useState([]);
  const [stats, setStats] = useState({
    totalMilesDistributed: 0,
    totalRevenueShared: 0,
    activeAmbassadors: 0,
    pendingSettlement: 0,
  });

  useEffect(() => {
    loadSettings();
    loadSettlementHistory();
    loadStats();
  }, []);

  async function loadSettings() {
    // Load from your backend
    const response = await fetch('/api/admin/kolaymiles/settings');
    if (response.ok) {
      const data = await response.json();
      setSettings(data);
    }
  }

  async function saveSettings() {
    const response = await fetch('/api/admin/kolaymiles/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      alert('Settings saved successfully');
    }
  }

  async function initiateSettlement() {
    const response = await fetch('/api/admin/kolaymiles/settlement', {
      method: 'POST',
    });

    if (response.ok) {
      alert('Settlement initiated');
      loadSettlementHistory();
    }
  }

  return (
    <div className="kolaymiles-admin-settings">
      <h2>KolayMiles Settings</h2>

      {/* Profit Sharing Settings */}
      <section>
        <h3>Profit Sharing Configuration</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.profitSharingEnabled}
            onChange={(e) =>
              setSettings({ ...settings, profitSharingEnabled: e.target.checked })
            }
          />
          Enable Profit Sharing
        </label>

        <div>
          <label>Default Earning Percentage (%):</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={settings.defaultEarningPercentage * 100}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultEarningPercentage: parseFloat(e.target.value) / 100,
              })
            }
          />
        </div>

        <div>
          <label>Ambassador Earning Percentage (%):</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={settings.ambassadorEarningPercentage * 100}
            onChange={(e) =>
              setSettings({
                ...settings,
                ambassadorEarningPercentage: parseFloat(e.target.value) / 100,
              })
            }
          />
        </div>
      </section>

      {/* Settlement Settings */}
      <section>
        <h3>Settlement Configuration</h3>
        <div>
          <label>Settlement Frequency:</label>
          <select
            value={settings.settlementFrequency}
            onChange={(e) =>
              setSettings({
                ...settings,
                settlementFrequency: e.target.value as any,
              })
            }
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        <div>
          <label>Minimum Settlement Amount (₺):</label>
          <input
            type="number"
            min="0"
            value={settings.minimumSettlementAmount}
            onChange={(e) =>
              setSettings({
                ...settings,
                minimumSettlementAmount: parseFloat(e.target.value),
              })
            }
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={settings.autoSettlement}
            onChange={(e) =>
              setSettings({ ...settings, autoSettlement: e.target.checked })
            }
          />
          Enable Auto Settlement
        </label>
      </section>

      {/* Statistics */}
      <section>
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div>
            <strong>Total Miles Distributed:</strong>
            <span>{stats.totalMilesDistributed.toLocaleString()}</span>
          </div>
          <div>
            <strong>Total Revenue Shared:</strong>
            <span>₺{stats.totalRevenueShared.toLocaleString()}</span>
          </div>
          <div>
            <strong>Active Ambassadors:</strong>
            <span>{stats.activeAmbassadors}</span>
          </div>
          <div>
            <strong>Pending Settlement:</strong>
            <span>₺{stats.pendingSettlement.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Settlement History */}
      <section>
        <h3>Settlement History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {settlementHistory.map((settlement) => (
              <tr key={settlement.id}>
                <td>{settlement.date}</td>
                <td>₺{settlement.amount}</td>
                <td>{settlement.status}</td>
                <td>
                  <button onClick={() => viewSettlement(settlement.id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={initiateSettlement}>Initiate Settlement</button>
      </section>

      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
}
```

**Step 3.2: Backend API for Settings**

```typescript
// Example: Backend API route for settings
// /api/admin/kolaymiles/settings

export async function GET(request: Request) {
  // Verify admin access
  const isAdmin = await verifyAdminAccess(request);
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Load settings from database
  const settings = await getKolayMilesSettings();
  return Response.json(settings);
}

export async function POST(request: Request) {
  // Verify admin access
  const isAdmin = await verifyAdminAccess(request);
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  const settings = await request.json();
  await saveKolayMilesSettings(settings);
  return Response.json({ success: true });
}
```

---

### 4. User Settings Integration

#### Objective
Add KolayMiles activation toggle in user settings, allowing users to enable/disable KolayMiles as an add-on feature.

#### Implementation Steps

**Step 4.1: User Settings Component**

```typescript
// Example: User Settings with KolayMiles Toggle
'use client';

import { useState, useEffect } from 'react';

export function UserSettings() {
  const [kolayMilesEnabled, setKolayMilesEnabled] = useState(false);
  const [milesBalance, setMilesBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKolayMilesStatus();
  }, []);

  async function loadKolayMilesStatus() {
    try {
      const response = await fetch('/api/user/kolaymiles/status');
      if (response.ok) {
        const data = await response.json();
        setKolayMilesEnabled(data.enabled);
        setMilesBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Failed to load KolayMiles status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleKolayMiles(enabled: boolean) {
    setLoading(true);
    try {
      const response = await fetch('/api/user/kolaymiles/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        setKolayMilesEnabled(enabled);
        if (enabled) {
          // Sync user to KolayMiles if enabling
          await syncUserToKolayMiles();
        }
      } else {
        alert('Failed to update KolayMiles settings');
      }
    } catch (error) {
      console.error('Failed to toggle KolayMiles:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="user-settings">
      <h2>Settings</h2>

      {/* KolayMiles Section */}
      <section className="kolaymiles-settings-section">
        <div className="setting-item">
          <div className="setting-info">
            <h3>KolayMiles</h3>
            <p>
              Enable KolayMiles to earn miles for purchases and referrals across
              all Kolay apps. {kolayMilesEnabled && `Current balance: ${milesBalance} miles`}
            </p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={kolayMilesEnabled}
                onChange={(e) => toggleKolayMiles(e.target.checked)}
                disabled={loading}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {kolayMilesEnabled && (
          <div className="kolaymiles-dashboard-link">
            <a
              href={`${process.env.NEXT_PUBLIC_KOLAYMILES_URL}/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open KolayMiles Dashboard →
            </a>
          </div>
        )}
      </section>

      {/* Other settings... */}
    </div>
  );
}
```

**Step 4.2: Backend API for Toggle**

```typescript
// Example: Backend API for KolayMiles toggle
// /api/user/kolaymiles/toggle

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { enabled } = await request.json();

  // Update user preference in your database
  await updateUserKolayMilesPreference(user.id, enabled);

  if (enabled) {
    // Sync user to KolayMiles
    await syncUserToKolayMiles(user.id, user.email, user.name);
  }

  return Response.json({ success: true, enabled });
}
```

---

### 5. Footer Branding

#### Objective
Add a KolayMiles link in the website footer with purple branding in the left corner at the bottom.

#### Implementation Steps

**Step 5.1: Footer Component with KolayMiles Link**

```tsx
// Example: Footer with KolayMiles branding
'use client';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Your existing footer content */}
        <div className="footer-links">
          {/* Other links... */}
        </div>

        {/* KolayMiles Branding - Left Corner */}
        <div className="kolaymiles-footer-brand">
          <a
            href={process.env.NEXT_PUBLIC_KOLAYMILES_URL || 'https://kolaymiles.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="kolaymiles-link"
            title="Earn miles across all Kolay apps"
          >
            <span className="kolaymiles-icon">✈️</span>
            <span className="kolaymiles-text">KolayMiles</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
```

**Step 5.2: CSS Styling for Footer Link**

```css
/* KolayMiles Footer Branding Styles */
.app-footer {
  position: relative;
  padding: 2rem;
  background: var(--footer-bg, #1a1a1a);
  color: var(--footer-text, #fff);
}

.kolaymiles-footer-brand {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 10;
}

.kolaymiles-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  /* Purple gradient - KolayMiles brand color */
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
  /* Shiny effect */
  position: relative;
  overflow: hidden;
}

.kolaymiles-link::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.kolaymiles-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
  background: linear-gradient(135deg, #9d6af7 0%, #8b5cf6 100%);
}

.kolaymiles-link:active {
  transform: translateY(0);
}

.kolaymiles-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.kolaymiles-text {
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .kolaymiles-footer-brand {
    position: static;
    margin-top: 1rem;
    text-align: center;
  }

  .kolaymiles-link {
    display: inline-flex;
  }
}
```

**Alternative: Using Tailwind CSS**

```tsx
// If using Tailwind CSS
<a
  href={process.env.NEXT_PUBLIC_KOLAYMILES_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-pulse"
>
  <span className="text-lg">✈️</span>
  <span>KolayMiles</span>
</a>
```

---

## API Reference

### Base URL
```
Production: https://kolaymiles.com/api/partner
Development: http://localhost:3000/api/partner
```

### Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer <your_api_key>
```

### Endpoints

#### User Management
- **POST** `/api/partner/users` - Create or update user
- **GET** `/api/partner/users?external_user_id={id}` - Get user info

#### Transactions
- **POST** `/api/partner/transactions` - Award or deduct miles
- **GET** `/api/partner/transactions?external_user_id={id}` - Get transaction history

#### Referrals
- **GET** `/api/referrals/analytics?user_id={id}` - Get referral statistics
- **GET** `/api/referrals/code?user_id={id}` - Get referral code
- **POST** `/api/referrals/validate` - Validate referral code

---

## Code Examples

### Complete Integration Example

```typescript
// Complete integration example
import { KolayMilesClient } from './kolaymiles-client';

class YourAppService {
  private kolayMiles: KolayMilesClient;

  constructor() {
    this.kolayMiles = new KolayMilesClient({
      apiKey: process.env.KOLAYMILES_API_KEY!,
      baseUrl: process.env.KOLAYMILES_API_URL!,
    });
  }

  // On user registration
  async registerUser(email: string, name: string, referralCode?: string) {
    // 1. Create user in your app
    const user = await this.createUser(email, name);

    // 2. Sync to KolayMiles
    await this.kolayMiles.syncUser(user.id, email, name, referralCode);

    // 3. Track referral if code provided
    if (referralCode) {
      await this.kolayMiles.trackReferral(user.id, referralCode);
    }

    return user;
  }

  // On purchase
  async processPurchase(userId: string, orderId: string, amount: number) {
    // 1. Process purchase in your app
    const order = await this.createOrder(userId, orderId, amount);

    // 2. Determine if this is a referral purchase
    const isReferral = await this.isReferralPurchase(userId);

    // 3. Award miles
    await this.kolayMiles.awardMiles(
      userId,
      amount,
      orderId,
      isReferral ? 'referral' : 'personal'
    );

    return order;
  }

  // Check ambassador status
  async isAmbassador(userId: string): Promise<boolean> {
    const stats = await this.kolayMiles.getReferralStats(userId);
    return stats.totalReferrals >= 10;
  }
}
```

---

## Testing & Deployment

### Testing Checklist

1. **User Sync**
   - [ ] New user registration syncs to KolayMiles
   - [ ] Existing user login syncs correctly
   - [ ] User data updates propagate

2. **Miles Earning**
   - [ ] Personal purchases award correct miles (5-15%)
   - [ ] Referral purchases award 10% for ambassadors
   - [ ] Regular referrals award 5%
   - [ ] Duplicate transactions are prevented

3. **Admin Dashboard**
   - [ ] Settings save correctly
   - [ ] Statistics display accurately
   - [ ] Settlement process works

4. **User Settings**
   - [ ] Toggle enables/disables KolayMiles
   - [ ] Balance displays correctly
   - [ ] Dashboard link works

5. **Footer Branding**
   - [ ] Link appears in left corner
   - [ ] Purple styling is correct
   - [ ] Shiny animation works
   - [ ] Link opens in new tab

### Deployment Steps

1. **Environment Setup**
   ```bash
   # Add to your .env
   KOLAYMILES_API_KEY=your_key
   KOLAYMILES_API_URL=https://kolaymiles.com/api/partner
   KOLAYMILES_BASE_URL=https://kolaymiles.com
   ```

2. **Database Migration**
   - Add `kolaymiles_enabled` column to users table
   - Add `referral_code` column to users table
   - Create settings table for admin configuration

3. **Deploy Components**
   - Deploy user sync functions
   - Deploy admin settings page
   - Deploy user settings component
   - Deploy footer with branding

4. **Monitor**
   - Set up error logging
   - Monitor API call success rates
   - Track miles distribution

---

## Support & Resources

- **Documentation**: https://docs.kolaymiles.com
- **API Reference**: https://api.kolaymiles.com/docs
- **Support Email**: partners@kolaymiles.com
- **Status Page**: https://status.kolaymiles.com

---

## Brand Guidelines

### KolayMiles Purple Color
- **Primary Purple**: `#8b5cf6` (RGB: 139, 92, 246)
- **Dark Purple**: `#7c3aed` (RGB: 124, 58, 237)
- **Light Purple**: `#a78bfa` (RGB: 167, 139, 250)

### Usage
- Use purple gradient for footer link
- Maintain shiny/shimmery effect
- Ensure sufficient contrast for accessibility

---

**Last Updated**: 2024
**Version**: 1.0.0

