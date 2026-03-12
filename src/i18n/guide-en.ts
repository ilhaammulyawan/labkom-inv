export const guideChaptersEn = [
  {
    title: "Chapter 1: Introduction",
    sections: [
      { title: "About SiiLaKu", content: "SiiLaKu (Computer Lab Inventory Information System) is a web application for managing all hardware and software assets in a computer lab. With SiiLaKu, recording detailed specifications of every PC, monitor, and other device becomes easy and organized." },
      { title: "Application Benefits", content: "• Neat and structured digital asset recording\n• QR Code for quick identification of each item\n• Monitoring condition and repair history\n• Automatic periodic maintenance scheduling\n• Item borrowing system with approval workflow\n• Software & license inventory\n• Complete reports (10 types) exportable to Excel & PDF\n• Real-time notifications for due items\n• Flexible category and room management\n• User profiles with avatar photos\n• Dark Mode for visual comfort\n• Customizable application settings\n• System activity history\n• Accessible from anywhere via browser" },
      { title: "User Role System", content: "The application has 2 user roles:\n\n👤 USER (Regular User)\n• View Dashboard & statistics\n• View Inventory list\n• Record & view Repairs\n• Scan & Print QR Code\n• Request item borrowing\n• Return borrowed items\n• View & export Reports\n• Receive overdue borrowing notifications\n• Read User Guide\n\n👑 ADMIN (Administrator)\nAll User features, plus:\n• Add, Edit & Delete Items\n• Upload item photos\n• Import data from Excel\n• Manage Categories & Rooms\n• Manage Maintenance Schedules\n• Approve/Reject borrowings\n• Hand over & receive returned items\n• Manage Software & Licenses\n• Manage Users & Roles\n• View Activity Log\n• Application Settings\n• Notifications: pending borrowings, returns, & overdue maintenance" },
    ],
  },
  {
    title: "Chapter 2: Getting Started",
    sections: [
      { title: "Login", content: "Enter your registered email and password. Click 'Login' to access the dashboard." },
      { title: "Registration", content: "Click 'Sign Up' on the login page. Fill in your full name, email, and password. Verify your email through the link sent to your inbox." },
      { title: "Forgot Password", content: "Click 'Forgot Password?' on the login page. Enter your email, then check your inbox for the password reset link." },
      { title: "Edit Profile", content: "Click your avatar/name in the top right header, select 'Edit Profile'. You can change your full name and upload a profile photo." },
      { title: "Dark Mode", content: "🌙 Click the sun/moon icon in the top right header to change the theme:\n• ☀️ Light — bright display (default)\n• 🌙 Dark — dark display, comfortable for eyes in low-light rooms\n• 🖥️ System — automatically follows your device settings\n\nTheme selection is saved automatically and applies to all pages." },
      { title: "Notifications", content: "🔔 Click the bell icon in the header to view active notifications:\n• Overdue maintenance (all users)\n• Late borrowings (owner & admin)\n• New borrowing requests (admin)\n• Returns awaiting confirmation (admin)\n\nClick a notification to go directly to the related item with automatic highlighting." },
    ],
  },
  {
    title: "Chapter 3: Dashboard",
    sections: [
      { title: "Reading Statistics", content: "📊 Access: All users\n\nThe dashboard displays an inventory summary including:\n• KPI cards: Total PCs, Monitors, Printers, and damaged items\n• Category composition chart\n• Item condition chart (Good, Light Damage, Heavy Damage)\n• Item distribution by room\n• Total inventory asset value" },
    ],
  },
  {
    title: "Chapter 4: Inventory Management",
    sections: [
      { title: "Viewing Item List", content: "📋 Access: All users\n\nOpen the 'Inventory' menu in the sidebar. Use the search and filter features by category/room/condition to find specific items." },
      { title: "Print Inventory List", content: "🖨️ Access: All users\n\nClick the 'Print' button on the Inventory page to print the currently displayed item table (based on active filters). The printout includes number, code, name, brand, category, room, condition, and status." },
      { title: "Adding Items", content: "➕ Access: Admin only\n\nClick 'Add Item' from the sidebar or Inventory page. Fill in the form:\n• Select category (PC, Monitor, Printer, etc.)\n• Inventory code is auto-generated\n• Fill in specifications based on item type\n• Select placement room\n• Upload item photo (optional)\n• Set condition and status" },
      { title: "Edit Item", content: "✏️ Access: Admin only\n\nOpen item details, then click 'Edit'. You can modify all information including specifications, condition, room, and photo." },
      { title: "Import from Excel", content: "📥 Access: Admin only\n\nTo import data in bulk:\n1. Open 'Import Excel' menu in sidebar\n2. Download the provided Excel template\n3. Fill data according to template format\n4. Upload Excel/CSV file\n5. System will validate the data\n6. Click 'Import' to save valid data\n\nMake sure Category and Room names are already registered in the system." },
      { title: "Viewing Item Details", content: "🔍 Access: All users\n\nClick an item name in the inventory list to view full details:\n• General information (code, brand, model, serial number)\n• Technical specifications (CPU, RAM, Storage, VGA, etc.)\n• Item photo (if uploaded)\n• Unique QR Code\n• Related repair history\n• Installed software" },
      { title: "Print Item Details", content: "🖨️ Access: All users\n\nOn the item detail page, click the 'Print' button at the top. The printout includes:\n• Item photo\n• Complete general information\n• Technical specifications\n• Repair history" },
    ],
  },
  {
    title: "Chapter 5: Categories & Rooms",
    sections: [
      { title: "Managing Categories", content: "🏷️ Access: Admin only\n\nOpen the 'Categories' menu in the sidebar. You can:\n• Add new categories with icons\n• Edit category names and icons\n• Delete categories (make sure no items are linked)" },
      { title: "Managing Rooms", content: "📍 Access: Admin only\n\nOpen the 'Rooms' menu in the sidebar. You can:\n• Add new rooms with locations\n• Edit room names and locations\n• Delete rooms (make sure no items are linked)" },
    ],
  },
  {
    title: "Chapter 6: QR Code",
    sections: [
      { title: "Printing QR Codes", content: "🖨️ Access: All users\n\nOpen the 'Print QR' menu in the sidebar. Select items to print QR labels, set label size (2×2, 3×3, or 4×4 cm), then click 'Print'. You can also print QR from the item detail page." },
      { title: "Scanning QR Codes", content: "📷 Access: All users\n\nOpen the 'Scan QR' menu in the sidebar, click 'Start Scan', then point the camera at the item's QR Code. You can also point your phone's camera directly at the QR Code — the browser will open the item detail page automatically." },
      { title: "Public Access via QR", content: "🌐 QR Codes can be accessed without login. The public page displays:\n• Item photo (if available)\n• General information (code, name, brand, model)\n• Condition & status\n• Complete technical specifications\n• Repair history\n\nDisplay is optimized for mobile devices." },
    ],
  },
  {
    title: "Chapter 7: Repair & Maintenance",
    sections: [
      { title: "Recording Damage", content: "🔧 Access: All users\n\nOpen the 'Maintenance' menu in the sidebar. Click 'Record Repair':\n• Select the damaged item\n• Fill in the problem description\n• Enter the damage date\n• Specify the assigned technician" },
      { title: "Update Repair Status", content: "📝 Access: Admin\n\nChange repair status:\n• Queue → item waiting to be repaired\n• In Progress → being handled by technician\n• Done → repair completed\n\nAlso fill in the action taken and repair cost." },
      { title: "Maintenance Schedule", content: "📅 Access: Admin (manage), All (view)\n\nOpen the 'Maintenance Schedule' menu in the sidebar.\n\nAdmin can:\n• Add periodic maintenance schedules per item\n• Choose frequency: Weekly, Monthly, Quarterly, Biannual, Yearly\n• Assign responsible technician\n• Mark 'Done' → next date is calculated automatically\n• Edit and delete schedules\n\nOverdue schedules will appear in notifications with an 'Urgent' badge." },
    ],
  },
  {
    title: "Chapter 8: Item Borrowing",
    sections: [
      { title: "Borrowing Flow", content: "🔄 Complete borrowing flow:\n\n1️⃣ User Request → fill borrowing form (select item, date, purpose)\n2️⃣ Admin Approve/Reject → admin reviews and decides\n3️⃣ Admin Hand Over → admin physically hands over the item\n4️⃣ User Return → user returns the item\n5️⃣ Admin Accept → admin confirms return, complete" },
      { title: "Requesting a Borrowing", content: "📝 Access: All users\n\nOpen the 'Borrowings' menu in the sidebar, click 'Request Borrowing':\n• Select item to borrow (active items only)\n• Fill in borrowing purpose\n• Set borrow date and return date\n• Add notes (optional)\n• Click 'Submit' → status becomes 'Pending Approval'" },
      { title: "Returning Items", content: "↩️ Access: User (borrowing owner)\n\nWhen done using the item:\n• Open the Borrowings page\n• Find your borrowing with 'Currently Borrowed' status\n• Click 'Return Item' button\n• Status changes to 'Waiting Return Confirmation'\n• Wait for admin to confirm the return" },
      { title: "Managing Borrowings (Admin)", content: "👑 Access: Admin only\n\nAdmin can:\n• Approve or reject borrowing requests\n• Hand over items to borrowers (after approval)\n• Mark returns for currently borrowed items\n• Accept item returns from users\n• Delete borrowing records\n\nFilter by status for easier management." },
      { title: "Late Borrowings", content: "⚠️ Items past the return date will be marked:\n• Borrowing card with red border\n• '(Late!)' label appears\n• Automatic notification on bell icon for admin and borrower" },
    ],
  },
  {
    title: "Chapter 9: Software & Licenses",
    sections: [
      { title: "Managing Software", content: "💿 Access: Admin (manage), All (view)\n\nOpen the 'Software' menu in the sidebar.\n\nAdmin can:\n• Add software per device\n• Fill in software name, version, license type, license key\n• Set license expiry date\n• Edit and delete software data\n\nSoftware with expired licenses will be specially marked." },
    ],
  },
  {
    title: "Chapter 10: Reports & Export",
    sections: [
      { title: "Report Types", content: "📄 Access: All users\n\n10 types of reports available, grouped as:\n\n📦 Inventory & Assets:\n• Lab Inventory Report — list of all items\n• Items by Room Report — item distribution by location\n• Items by Category Report — item distribution by type\n• Item Condition Report — good/damaged summary\n• Asset Value Report — total inventory value\n• PC Specification Report — computer technical details\n\n🔧 Maintenance & Repair:\n• Maintenance Schedule Report — periodic schedules & due dates\n• Repair History Report — all repair records\n\n📋 Borrowing:\n• Item Borrowing Report — borrowing history & status\n\n💿 Software:\n• Software & License Report — software data & validity" },
      { title: "Export to Excel", content: "📊 Click the 'Excel' button on the desired report type. An .xlsx file will be automatically downloaded with the latest data." },
      { title: "Export to PDF", content: "📑 Click the 'PDF' button on the desired report type. A .pdf file will be automatically downloaded with a clean table format, complete with letterhead based on settings." },
      { title: "Warning Badges", content: "🔴 Some reports display warning badges:\n• Maintenance Schedule: number of overdue schedules\n• Software & Licenses: number of expired licenses\n\nThese badges help you identify items needing immediate attention." },
    ],
  },
  {
    title: "Chapter 11: Activity Log",
    sections: [
      { title: "Viewing Activity Log", content: "📜 Access: Admin only\n\nOpen the 'Activity Log' menu in the sidebar. This page records all important system activities:\n• Adding, modifying, and deleting items\n• Repair status changes\n• Borrowing activities\n• Other activities\n\nEach log records: who, what was done, when, and change details." },
    ],
  },
  {
    title: "Chapter 12: Settings",
    sections: [
      { title: "Application Identity", content: "⚙️ Access: Admin only\n\nSet application name, subtitle, inventory code prefix, and upload a logo that will be displayed on the sidebar and login page." },
      { title: "Institution Information", content: "🏢 Access: Admin only\n\nFill in institution data: institution name, address, lab manager/person in charge, ID number, phone, and email. This data is used in PDF reports." },
      { title: "Other Settings", content: "🔒 Access: Admin only\n\n• Report Header: text that appears in export report headers\n• Public QR Code Access: allow/block item detail access without login via QR" },
    ],
  },
  {
    title: "Chapter 13: User Management",
    sections: [
      { title: "Viewing User List", content: "👥 Access: Admin only\n\nOpen the 'Users' menu in the sidebar to view all registered users and their roles." },
      { title: "Changing User Roles", content: "🔄 Access: Admin only\n\nOn the Users page, click the role dropdown to change:\n• User → Admin: grants full access\n• Admin → User: restricts to basic features\n\nNote: Admin cannot change their own role." },
      { title: "Deleting Users", content: "🗑️ Access: Admin only\n\nClick the delete button on the user you want to remove. A deletion confirmation will appear. Admin cannot delete themselves." },
    ],
  },
  {
    title: "Chapter 14: Troubleshooting",
    sections: [
      { title: "QR Code not readable", content: "• Make sure the QR Code is not damaged or folded\n• Ensure adequate lighting\n• Try scanning from 10-20 cm distance\n• Use your phone's built-in QR scanner app" },
      { title: "Forgot Password", content: "Click 'Forgot Password?' on the login page, enter your email, and follow the email reset instructions." },
      { title: "Data not showing", content: "• Check internet connection\n• Refresh the browser page\n• Clear browser cache\n• Contact admin if the problem persists" },
      { title: "Failed to upload photo/logo", content: "• Make sure file size does not exceed 2MB\n• Use PNG, JPG, or SVG format\n• Check internet connection" },
      { title: "Menu not showing", content: "Some menus are only available to Admins:\n• Add Item, Import Excel\n• Categories, Rooms, Users\n• Maintenance Schedule (manage)\n• Software (manage)\n• Activity Log\n• Settings\n\nContact Admin if you need access." },
      { title: "Notifications not showing", content: "Notifications only appear when there are:\n• Overdue maintenance schedules\n• Late borrowing returns\n• New borrowing requests (admin)\n• Returns awaiting confirmation (admin)\n\nIf the number badge doesn't appear, there are no active notifications." },
      { title: "Borrowing cannot be changed", content: "• Users can only change the status of their own borrowings\n• Users can only 'Return Item' when status is 'Currently Borrowed'\n• Other status changes can only be made by Admin" },
    ],
  },
];
