# Documentation: SMM System – Admin, User, and Staff Panels

## 1. User Flow

### 1.1 Login & Payment

- A user logs in and completes a payment for the service.
- After payment, a new field should appear where the user can **log in to their Instagram account**.
- Once connected, all relevant statistics must be pulled directly from the user’s Instagram account (via Instagram Graph API / Insights).

---

### 1.2 Requirements Form

After Instagram login, the user sees a form where they can specify requirements. Fields include:

- **Niche (Target Audience)** – text
- **Location** – text
- **Comments** – text/number
- **DMs** – text/number
- **Max Following** – number only
- **Hashtags** – text
- **Account Targets** – text

⚠️ **Important:**

- These fields are visible to users but editable **only from the admin panel**.

---

### 1.3 User Dashboard

- After completing the form, the user is redirected to their **personal dashboard**.
- The design should match the **reference image** (visual design flexible, but functionality must remain one-to-one).
- All data shown on the dashboard must come directly from Instagram Insights.

#### Sections:

- **Growth Metrics (Green Zone)**
  - Pulled automatically from Instagram Insights.
- **Additional Targets (Red Zone)**
  - Filled in manually from the **staff panel**.
  - Once entered, this information should appear on the user’s dashboard.

---

## 2. Staff Panel (Working Panel)

### 2.1 Access & Profiles

- Staff accounts are created **only by the Admin/Owner** in the admin panel.
- Staff login with email/password provided by the owner.

---

### 2.2 User Management

- When a new user places an order, it appears in the **admin panel** as a “New User.”
- Admin can assign the user to a **staff member’s panel**.
- Staff panel should display **the same dashboard as the user**, but with **additional editable controls**.

---

### 2.3 Staff Dashboard Features

- **Red-text fields:** Show users who purchased services.
- On selecting a user, staff see a **mirror dashboard** (identical to the user’s view).
- Staff can edit the user’s panel fields.

#### Dashboard Differences:

- **User Dashboard** → Only shows _Currently Following From_.
- **Staff Dashboard** → Includes _Unfollowing_ and _Target History_ (hidden from the user).

---

## 3. Admin Panel

- Full control over user and staff accounts.
- Ability to create staff profiles, assign users, and manage services.
- Can update/edit requirement fields submitted by users.

---

## 4. Communication System

### 4.1 Live Chat / Support

- A **support chat option** must be available inside the user panel.
- All conversations should route directly to the **admin panel**.
- Messages must also be sent to the **user’s email** in real time.

### 4.2 Email Notifications

- On purchase → send a **thank-you/confirmation email**.
- On support interaction → send conversation copies to the user’s email.

---

## 5. Data Source for Statistics

- All growth and engagement metrics must be retrieved directly from **Instagram Insights (Meta Business Suite)** using the provided statistics table.

---