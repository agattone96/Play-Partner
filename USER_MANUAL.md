# User Manual

> **Version:** 1.0.0
> **Last Updated:** December 2025
> **Audience:** Administrators & Standard Users

Welcome to **PlayPartner**. This comprehensive guide helps you navigate the features, manage partner relationships safely, and understand your data privacy responsibilities.

---

## Quick Start

**Step 1: Log in**
Use your email and password or a Magic Link to access the system.

**Step 2: Create First Partner**
Click "**Create Partner**" in the sidebar or "Get Started" on the Overview.

**Step 3: Add Details**
Open the partner profile to add Vibe tags, Logistics (address/phone), and Photos.

**Step 4: Assess**
(Admins Only) Add an assessment rating (1-5 stars) and vetted status.

---

## Table of Contents

1.  [Roles & Permissions](#1-roles--permissions)
2.  [Privacy, Security & Data Sensitivity](#2-privacy-security--data-sensitivity)
3.  [Authentication](#3-authentication)
4.  [Overview (Dashboard)](#4-overview-dashboard)
5.  [Managing Partners](#5-managing-partners)
6.  [Assessments](#6-assessments-admin-only)
7.  [Settings & Tags](#7-settings--tags)
8.  [Troubleshooting & FAQ](#8-troubleshooting--faq)
9.  [Glossary](#9-glossary)
10. [Safety & Ethics](#10-safety--ethics)

---

## 1. Roles & Permissions

The application has two distinct user roles with specific capabilities.

| Feature                    | Admin | Viewer (Standard) |
| :------------------------- | :---: | :---------------: |
| **View Partners**          |  ✅   |        ✅         |
| **View Overview**          |  ✅   |        ✅         |
| **Create Partners**        |  ✅   |        ❌         |
| **Edit Profile/Logistics** |  ✅   |        ❌         |
| **Delete Partners**        |  ✅   |        ❌         |
| **Create Assessments**     |  ✅   |        ❌         |
| **Export Data**            |  ✅   |        ❌         |
| **Manage Tags**            |  ✅   |        ❌         |

> **Note:** Viewers have **Read-Only** access. They cannot modify records, delete data, or export sensitive lists.

---

## 2. Privacy, Security & Data Sensitivity

### Sensitive Data Warnings

**PlayPartner** stores highly sensitive personal information.

- **Sensitive Fields**: Intimacy details (kinks, history), Logistics (home addresses, phone numbers), and Photos.
- **Visibility**: Intimacy and Logistics fields are **blurred by default**. You must click to reveal them. This prevents accidental exposure in public settings.
- **Access**: All authenticated users (Admin & Viewer) can **view** this data. Only Admins can edit it.

### Export & Retention

- **Who can export?**: Only **Admins** can export Assessment data to CSV.
- **Storage**: Exported files are downloaded to your local device. **Warning**: Once exported, this data is no longer protected by the application's security measures. Store these files in a secure, encrypted location.
- **Retention**: Data remains in the system until explicitly deleted by an Admin.

### Session & Access

- **Timeout**: Sessions are set to expire after **7 days** of inactivity to reduce frequent logins while maintaining security.
- **Multiple Devices**: You can be logged in on multiple devices simultaneously.
- **Logout**: Always click **Logout** when using a shared device.

### Content Safety

- **Media**: Admins can upload photos. Ensure you have **explicit consent** from the partner before uploading any identifiable or intimate images.
- **Responsibility**: Users are solely responsible for compliance with local laws regarding the storage of private data.

---

## 3. Authentication

### Logging In

1.  **Password Login**: Enter email and password.
    - _Error_: "Invalid credentials" appears if inputs are wrong.
2.  **Magic Link**:
    - Enter email -> Click "Send Magic Link".
    - Check email for a one-time login link.
    - **Dev Note**: In development, check server logs for the link.
    - _Validity_: Links expire in **15 minutes** and can only be used once.

### Password Rules

- **Length**: Minimum **8 characters**.
- **Complexity**: Recommended to use a mix of letters, numbers, and symbols.
- **Forced Reset**: If your account is flagged (e.g., new admin), you will be redirected to the "Reset Password" page immediately after login.

### Reset Flow

- If you forgot your password, use the **Magic Link** to log in, then go to **Settings** to set a new password.
- If the reset link/magic link is expired, simply request a new one.

---

## 4. Overview (Dashboard)

The **Overview** is your command center.

_[Placeholder: Image of Overview Page showing KPI cards and recent activity]_

### Key Performance Indicators (KPIs)

- **Total Partners**: Count of all non-retired partners.
- **Active Partners**: Partners with status "Active".
- **Vetted Partners**: Partners with status "Vetted" or higher.
- **Vetting Queue**: Partners marked "Ready for Vetting".

### First Run Experience

If the database is empty, a **"Getting Started"** banner appears at the top, guiding you to create your first partner. It disappears once a partner exists.

### Status Distribution

A visual breakdown of partners by their current status (e.g., 5 Active, 3 New Prospect). This gives a quick health check of your pipeline.

---

## 5. Managing Partners

### Creating a Partner `[Admin Only]`

1.  Click **Create Partner**.
2.  **Quick Add Form**: Enter the Name (required). Other fields (Status, City) are optional.
3.  _Error_: If Name is valid, the partner is created and you are taken to their detail page.

### Partner Details

Access the full profile by clicking a partner card.

_[Placeholder: Image of Partner Detail View with tabs]_

- **Overview Tab**: View Stats, Bio, and Tags.
  - **Status Timeline**: Move partners through stages (e.g., "New Prospect" -> "Contacted" -> "Vetted").
- **Intimacy Tab**: (Sensitive) Record kinks, orientation, and preferences.
  - _Note_: Avoid using full legal names of third parties in text notes.
- **Logistics Tab**: (Sensitive) Phone, Address, Hosting info.
  - _Click-to-Reveal_: Fields are blurred until clicked.
- **Media Tab**: Upload photos.
  - _Limits_: Standard image formats (JPG, PNG). Max file size ~5MB.

### Deleting a Partner `[Admin Only]`

- Located in the danger zone (bottom of Settings or Edit view).
- **Irreversible**: This permanently removes the partner, their logistics, intimacy data, and photos.

---

## 6. Assessments `[Admin Only]`

Admins use Assessments to rate and vetting partners.

_[Placeholder: Image of Assessment Form]_

### Creating an Assessment

1.  Navigate to the **Assessments** tab on a partner profile.
2.  Click **New Assessment**.
3.  **Rating**: 1-5 Stars (1 = Poor/Risky, 5 = Excellent/Safe).
4.  **Status**: Update the partner's status here if the assessment changes their standing.
5.  **Notes**: Add detailed vetting notes.

### Exporting Data

- Click **Export CSV** on the main Assessments list page.
- **Data Included**: Partner Name, Admin Name, Rating, Status, Date, Notes.
- **Security**: Handle this file with extreme care.

---

## 7. Settings & Tags

### Tag Management `[Admin Only]`

Go to the **Tags** page to manage the taxonomy.

- **Create/Delete**: Only Admins can create new tags or delete unused ones.
- **Applying Tags**: All users can apply existing tags to partners.

### Tag Categories

- **Vibe**: Personality traits (e.g., "Chill", "High Energy").
- **Logistics**: Availability/Location (e.g., "Weekends Only", "Downtown").
- **Risk**: Safety notes (e.g., "Verified", "Unknown History").
- **Admin**: Internal categorization.

### Theme

- Toggle **Light/Dark** mode in the header.
- Preference is saved successfully to your local browser storage.

---

## 8. Troubleshooting & FAQ

**Q: I can't log in.**

- Check credentials or use Magic Link.
- If you are a new admin, verify with the system owner that your account is seeded.

**Q: Images won't load.**

- Ensure the image URL is valid and publicly accessible. Broken links usually mean the source is down or private.

**Q: I accidentally deleted a partner.**

- Deletions are final. Restore from a database backup if available (requires technical support).

**Q: "Critical Security Failure" on startup?**

- (Admin) The `SESSION_SECRET` is too weak. See the Developer Guide/SOP to rotate secrets.

---

## 9. Glossary

- **Partner**: A distinct profile record of an individual.
- **Assessment**: A point-in-time review identifying safety/compatibility (Rating 1-5).
- **Status**: The current stage of the relationship (e.g., New Prospect, Vetted, Active, Retired).
- **Tag**: A label used for filtering and quick identification (e.g., "Hosting").
- **Magic Link**: A temporary, secure link sent via email to log in without a password.

---

## 10. Safety & Ethics

**PlayPartner** is a tool to assist with organization, but it does not replace human judgment.

- **Consent**: Always respect the privacy and consent of the individuals you document.
- **Security**: You are the guardian of this data. Do not share login credentials. Use a strong password.
- **Reality Check**: A "5-star" rating is a subjective assessment, not a guarantee of future safety. Always re-evaluate.
