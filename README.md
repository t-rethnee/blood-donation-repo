🔥 RedAid — Blood Donation Platform
A full-featured MERN Stack Blood Donation Web Application built for managing blood donations, donor registration, content publishing, and role-based access with three distinct user roles — Admin, Volunteer, and Donor.

🌟 Core Features
👥 Role Management
Admin 🌐:

Full access to all features

Can manage users, donation requests, and blogs

Can assign roles and block/unblock users

Volunteer 🤝:

Can manage and update blood donation requests

Has limited content management access (can’t publish/delete blogs)

Donor 🩸:

Can register, respond to requests, and manage their own profile

Can create and manage personal donation requests

💡 Make any user an admin by updating the role directly in the database.

🔐 Authentication
📝 Registration
Users register with:

email, name, password, confirm password

avatar (uploaded using imageBB)

blood group, district, upazila

By default:

Role: donor

Status: active

🔓 Login
Email/password-based login

Navigation between login and registration
👑 Admin Dashboard
🏠 Home: Stats on total users, donations, and funding.

👥 All Users:

View user list with avatar, name, email, role, status.

Actions: 🔒 Block/Unblock, 🤝 Make Volunteer, 🌐 Make Admin.

🩸 All Donation Requests:

Manage all requests.

Filter, paginate, update status, assign donors, delete/edit.

📝 Content Management:

Add blogs with title, thumbnail, and rich content.

View all blogs.

📢 Publish/Unpublish, 🗑️ Delete, ✏️ (optional) Edit.

🤝 Volunteer Dashboard
🏠 Home: Same dashboard stats as admin.

🩸 All Donation Requests:

View and update status of all requests.

❌ Cannot delete or assign donors.

📝 Content Management:

Can add blogs.

Can view all blogs.

❌ Cannot publish/unpublish or delete.


🩸 Donor Dashboard
🏠 Home:

Welcome message with name.

Shows 3 recent personal donation requests.

📋 My Requests:

Full list of own donation requests.

Filter by status, paginate.

Actions: ✅ Done, ❌ Cancel, ✏️ Edit, 🗑️ Delete, 🔍 View.

➕ Create Request:

Form to submit new blood donation request.

Auto-fills requester info.

👤 Profile:

View/update name, avatar, district, upazila, blood group.

Email is non-editable.

Editable on clicking Edit, saved via Save.

