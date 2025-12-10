# PlayPartner Design Guidelines

## Design Approach
**Design System Foundation**: Material Design 3 with dark-mode-first adaptation  
**Aesthetic**: Clinical data management tool - prioritize clarity, hierarchy, and efficiency over playfulness

## Core Design Principles
1. **Information Density**: Dense but scannable layouts optimized for quick decision-making
2. **Privacy-First**: Sensitive data protected with blur/reveal patterns and visual indicators
3. **Status Clarity**: Instant visual understanding of partner status, risk, and admin conflicts
4. **Minimal Friction**: Every action (add partner, create assessment, filter) should feel effortless

---

## Typography System
- **Primary Font**: Inter (400, 500, 600, 700)
- **Monospace**: JetBrains Mono (for IDs, phone numbers)

**Hierarchy**:
- Page Titles: 2xl font-semibold
- Section Headers: lg font-medium
- Card Titles: base font-medium
- Body Text: sm font-normal
- Labels/Meta: xs font-medium uppercase tracking-wide text-gray-400

---

## Layout & Spacing
**Spacing Scale**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16**
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Card spacing: p-6 with gap-4 internally
- Page margins: px-6 to px-8, py-6

**Layout Structure**:
- Sidebar navigation: Fixed 240px width
- Main content: max-w-7xl with px-6
- Cards: Rounded-lg (8px), soft shadows
- Tight spacing throughout - prioritize density

---

## Component Library

### Navigation
- **Sidebar**: Fixed left, dark surface (bg-gray-900), 240px width
- Logo/app name at top, main nav items with icons, user profile at bottom
- Active state: bg-gray-800 with accent border-l-2

### Status System
**Status Chips**: Inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
- New Prospect: bg-blue-500/10 text-blue-400 border border-blue-500/20
- Ready for Vetting: bg-yellow-500/10 text-yellow-400 border border-yellow-500/20
- Vetted: bg-green-500/10 text-green-400 border border-green-500/20
- Active: bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
- On Pause: bg-gray-500/10 text-gray-400 border border-gray-500/20
- Do Not Engage: bg-red-500/10 text-red-400 border border-red-500/20 with lock icon

### Data Tables
- Striped rows with hover: hover:bg-gray-800/50
- Compact row height: py-3
- Column headers: Sticky, uppercase, xs, font-medium, text-gray-400
- Inline action icons: Hover-visible edit/delete icons

### Cards
- bg-gray-800 border border-gray-700 rounded-lg p-6
- Soft shadow: shadow-md
- Hover elevation: hover:shadow-lg transition

### Icons for Logistics
- Hosting: Home icon
- Car: Car icon  
- Discreet: Eye-off icon
- Phone: Phone icon
- Display as inline-flex gap-2 with text-gray-400

### Risk Indicators
- Risk items: border-l-4 border-red-500 bg-red-500/5 p-4
- Blacklisted badge: Inline with skull icon, bg-red-500/20 text-red-400

### Forms
- Input fields: bg-gray-900 border border-gray-700 rounded-md px-4 py-2.5 focus:border-accent focus:ring-1 focus:ring-accent
- Dropdowns: Same styling with chevron icon
- Multi-select: Tag-style pills with remove button
- Sensitive fields: Initially blurred with "Click to reveal" overlay

### Modals
- Backdrop: bg-black/80 backdrop-blur-sm
- Modal: max-w-2xl bg-gray-800 border border-gray-700 rounded-lg p-8
- Header: pb-4 border-b border-gray-700
- Actions: pt-6 flex justify-end gap-3

### Buttons
- Primary: bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md font-medium
- Secondary: bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-md
- Danger: bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md
- Ghost: hover:bg-gray-800 text-gray-300 px-3 py-2 rounded-md

---

## Dashboard Layout
**KPI Cards**: Grid grid-cols-4 gap-6 mb-8
- Each card: Large number (3xl font-bold), small label, trend indicator if applicable

**Lists** (Vetting Queue, Risk, Conflicts):
- Compact card grid: grid-cols-1 lg:grid-cols-2 gap-4
- Each item: Partner name, status chip, key info, quick action button

---

## Partner Detail Tabs
- Tab navigation: Horizontal border-b border-gray-700
- Active tab: border-b-2 border-accent text-accent
- Inactive tabs: text-gray-400 hover:text-gray-300

**Intimacy/Logistics Tabs**: Collapsed sections with expand/collapse icons, sensitive data blurred by default

---

## Accessibility
- Focus rings: focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-gray-900
- High contrast ratios: minimum 7:1 for text
- Large click targets: min 44px height for interactive elements
- Keyboard navigation: Visible focus states throughout

---

## Animations
**Minimal, purposeful only**:
- Transition durations: transition-colors duration-150
- Modal entry: Fade + scale from 95% to 100%
- NO decorative animations - focus on instant responsiveness

---

## Images
**No hero images required** - this is a data management tool, not a marketing site. Focus on clarity and function over visual storytelling.