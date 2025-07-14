import { useContext } from "react"; 
import { AuthContext } from '../../provider/AuthProvider';

import DonorHome from "./DonorDashboard/DonorHome";
import AdminDashboardHome from "./AdminDashboard/AdminDashboardHome";
import VolunteerDashboardHome from "./VolunteerDashboard/VolunteerDashboardHome";  // Import volunteer dashboard

const RoleBasedDashboard = () => {
  const { user } = useContext(AuthContext);

  // Assuming your user object has a 'role' property (e.g. "admin", "donor", "volunteer")
  const userRole = user?.role || "donor"; // default to donor if no user or no role

  if (userRole === "admin") return <AdminDashboardHome />;
  if (userRole === "volunteer") return <VolunteerDashboardHome />;

  // Default to donor dashboard
  return <DonorHome />;
};

export default RoleBasedDashboard;
