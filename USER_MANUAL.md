# User Manual

> **Version:** 1.0.0
> **Last Updated:** December 2025
> **Audience:** Administrators & Standard Users

Welcome to **PlayPartner**. This guide helps you navigate and use the application features.

**Note:** Features marked with `[Admin Only]` are restricted to users with administrative privileges.

## 1. Authentication

### Logging In

1.  Navigate to the login page.
2.  **Password Login**: Enter your email and password.
3.  **Magic Link**:
    - Select "Magic Link" tab.
    - Enter email and click "Send".
    - Check your email (or server logs in Dev) for the link.

### Resetting Password

- If your account is flagged for a reset (e.g., new admin), you will be forced to change your password upon login.
- New passwords must be at least 8 characters long.

## 2. Roles & Permissions

The application has two distinct user roles:

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

> **Note:** Viewers have **Read-Only** access to all data but cannot modify records or export sensitive lists.

## 2. Overview (Dashboard)

The Overview page provides a high-level summary of your partner management activities:

### First Run Experience

If you have no partners, you will see a "Getting Started" banner. Click "Create Your First Partner" to begin.

- **KPI Cards**: Total Active Partners, Vetted Partners, etc.
- **Recent Activity**: List of recently modified profiles.
- **Status Distribution**: Breakdown of partners by status.

## 3. Managing Partners

### Creating a Partner

1.  Click the "**Create Partner**" button in the Sidebar or Overview page.
2.  Fill in the **Quick Add** form (Name is required).
3.  Click "Create Partner".

### Partner Details

Click on any partner card to view their full profile.

- **Overview**: Basic stats and tags.
- **Status Workflow**: Change status (e.g., "New Prospect" -> "Vetted") using the Timeline UI.
- **Intimacy**: (Sensitive) Record private details/kinks.
- **Logistics**: (Sensitive) Record address/phone.
  - _Note_: Sensitive fields are blurred by default. Click to reveal.
- **Media**: Upload/Manage photos.

## 4. Assessments `[Admin Only]`

Only Admin users can rate, assess, and export partner data.

1.  Navigate to **Assessments** or the "Assessments" tab on a Partner profile.
2.  Click "**+ New Assessment**".
3.  Select Rating (1-5 stars) and Status.
4.  Add Notes.
5.  Save.

**Exporting**: You can export all assessments to CSV from the Assessments page.

## 5. Settings & Tags

### Tag Management `[Admin Only]`

- **Create/Delete Tags**: Restricted to Admins.
- **Apply Tags**: All users can apply existing tags to partners.
- Categories: Vibe, Logistics, Risk, Admin.

### Theme

- Toggle between Light/Dark mode using the sun/moon icon in the header.
- _Default is Dark Mode._
