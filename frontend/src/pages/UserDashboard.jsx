import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  FiGrid, 
  FiShoppingBag, 
  FiUser, 
  FiHeart, 
  FiBell, 
  FiCreditCard, 
  FiCompass, 
  FiHelpCircle, 
  FiSettings 
} from 'react-icons/fi';

const sidebarLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/dashboard/bookings', label: 'My Bookings', icon: FiShoppingBag },
  { path: '/dashboard/profile', label: 'My Profile', icon: FiUser },
  { path: '/dashboard/wishlist', label: 'Wishlist', icon: FiHeart },
  { path: '/dashboard/notifications', label: 'Notifications', icon: FiBell },
  { path: '/dashboard/payments', label: 'Payments', icon: FiCreditCard },
  { path: '/dashboard/history', label: 'Travel History', icon: FiCompass },
  { path: '/dashboard/support', label: 'Support', icon: FiHelpCircle },
  { path: '/dashboard/settings', label: 'Settings', icon: FiSettings }
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <Outlet />
    </DashboardLayout>
  );
}
