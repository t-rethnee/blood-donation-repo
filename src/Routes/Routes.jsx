import React from 'react';
import { createBrowserRouter } from "react-router-dom";

import Root from '../pages/Root/Root';
import Errorpage from '../pages/Errorpage';
import Home from '../pages/Home/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';
import Profile from '../pages/Profile';

// Donor Dashboard Pages
import DonorHome from '../pages/Dashboard/DonorDashboard/DonorHome';
import CreateDonationRequest from '../pages/Dashboard/DonorDashboard/CreateDonationRequest';
import MyDonationRequests from '../pages/Dashboard/DonorDashboard/MyDonationRequest';

// Admin Dashboard Pages
import AdminDashboardHome from '../pages/Dashboard/AdminDashboard/AdminDashboardHome';
import ManageUsers from '../pages/Dashboard/AdminDashboard/ManageUsers';
import AllDonationRequests from '../pages/Dashboard/AdminDashboard/AllDonationRequests';
import BlogManagement from '../pages/Dashboard/AdminDashboard/BlogManagement';
import AddBlog from '../pages/Dashboard/AdminDashboard/AddBlog';
import EditBlog from '../pages/Dashboard/AdminDashboard/EditBlog';

import DonationRequestDetails from '../pages/DonationRequestDetails';
import DonationRequest from '../components/DonationRequest';
import Search from '../components/Search';

import PrivateRoute from '../provider/PrivateRoute';
import AdminRoute from '../provider/AdminRoute';
import VolunteerRoute from '../provider/VolunteerRoute';  // Import your VolunteerRoute component

import BlogList from '../components/BlogList';
import BlogDetail from '../pages/BlogDetails';

import RoleBasedDashboard from '../pages/Dashboard/RoleBasedDashboard';  // Import RoleBasedDashboard
import EditDonationRequest from '../pages/Dashboard/DonorDashboard/EditDonationRequest';
import FundingPage from '../pages/Funding/FundingPage';
import VolunteerContentManagement from '../pages/Dashboard/VolunteerDashboard/VolunteerContentManagement';
import VolunteerEditBlog from '../pages/Dashboard/VolunteerDashboard/VolunteerEditBlog';
import VolunteerAddBlog from '../pages/Dashboard/VolunteerDashboard/VolunteerAddBlog';
import VolunteerBloodDonationRequests from '../pages/Dashboard/VolunteerDashboard/VolunteerBloodDonationRequests';
import VolunteerProfile from '../pages/Dashboard/VolunteerDashboard/VolunteerProfile';
import AdminProfile from '../pages/Dashboard/AdminDashboard/AdminProfile';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "donation-requests", element: <DonationRequest /> },
      { path: "search", element: <Search /> },
      { path: "blogs", element: <BlogList /> },               // Show all published blogs
      { path: "blogs/:id", element: <BlogDetail /> },
      {
  path: '/funding',
  element: (
    <PrivateRoute>
      <FundingPage></FundingPage>
    </PrivateRoute>
  )
}

    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Index route uses RoleBasedDashboard to pick admin/donor/volunteer home page dynamically
      { index: true, element: <RoleBasedDashboard /> },

      { path: "profile", element: <Profile /> },

      // Donor routes
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "donation-requests/:id", element: <DonationRequestDetails /> },
      {
  path: "edit-donation-request/:id",
  element: (
  
      <EditDonationRequest></EditDonationRequest>
    
  ),
},


      // Admin dashboard routes under /dashboard/admin
      {
        path: "admin",
        element: <AdminRoute><AdminDashboardHome /></AdminRoute>,
      },
      {
        path:"admin/profile",
        element:<AdminRoute><AdminProfile></AdminProfile></AdminRoute>
      },
      {
        path: "admin/users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "admin/donation-requests",
        element: <AdminRoute><AllDonationRequests /></AdminRoute>,
      },
      {
        path: "admin/content-management",
        element: <AdminRoute><BlogManagement /></AdminRoute>,
      },
      {
        path: "admin/content-management/add-blog",
        element: <AdminRoute><AddBlog /></AdminRoute>,
      },
      {
        path: "admin/blogs/edit-blog/:id",
        element: <AdminRoute><EditBlog /></AdminRoute>,
      },

      // Volunteer routes
      {
  path: "profile",
  element: (
    <VolunteerRoute>
      <VolunteerProfile></VolunteerProfile>
    </VolunteerRoute>
  ),
},
      {
        path: "all-blood-donation-request",
        element: (
          <VolunteerRoute>
            <VolunteerBloodDonationRequests></VolunteerBloodDonationRequests>  {/* Use the same component but VolunteerRoute limits permissions */}
          </VolunteerRoute>
        ),
      },
      {
        path: "content-management",
        element: (
          <VolunteerRoute>
           <VolunteerContentManagement></VolunteerContentManagement>  {/* VolunteerRoute will restrict delete/publish actions */}
          </VolunteerRoute>
        ),
      },
      
    {
  path: "volunteer/blogs/edit-blog/:id",
  element: (
    <VolunteerRoute>
      <VolunteerEditBlog></VolunteerEditBlog>
    </VolunteerRoute>
  ),
},
{
  path: "volunteer/blogs/add-blog",
  element: (
    <VolunteerRoute>
      <VolunteerAddBlog></VolunteerAddBlog>
    </VolunteerRoute>
  ),
},

    ]
  }
]);
