import { destinations as dummyDestinations } from '../data/destinations';


const KEYS = {
  USERS: 'tg_admin_users',
  BOOKINGS: 'tg_admin_bookings',
  PACKAGES: 'tg_admin_packages',
  DESTINATIONS: 'tg_admin_destinations',
  REVIEWS: 'tg_admin_reviews',
  PAYMENTS: 'tg_admin_payments',
  BLOGS: 'tg_admin_blogs',
  NOTIFICATIONS: 'tg_admin_notifications',
  SETTINGS: 'tg_admin_settings'
};

// Seeding helper
function seed(key, defaultValue) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
}

// Generate payments from bookings or default dummy
const initialPayments = [
  { id: 'TXN001', bookingId: 'BK001', user: 'Sarah Johnson', amount: 4998, method: 'Credit Card', status: 'Success', date: '2024-06-15' },
  { id: 'TXN002', bookingId: 'BK002', user: 'Rahul Sharma', amount: 6598, method: 'PayPal', status: 'Success', date: '2024-07-20' },
  { id: 'TXN003', bookingId: 'BK003', user: 'Emily Chen', amount: 4797, method: 'Stripe', status: 'Pending', date: '2024-08-10' },
  { id: 'TXN004', bookingId: 'BK004', user: 'Michael Brown', amount: 7798, method: 'Credit Card', status: 'Failed', date: '2024-09-05' },
  { id: 'TXN005', bookingId: 'BK005', user: 'Sarah Johnson', amount: 5598, method: 'PayPal', status: 'Success', date: '2024-10-12' },
];

const initialNotifications = [
  { id: 1, type: 'booking', text: 'New booking #BK003 received from Emily Chen', date: '2 hours ago', read: false },
  { id: 2, type: 'user', text: 'New user registration: Michael Brown', date: '1 day ago', read: false },
  { id: 3, type: 'payment', text: 'Successful payment of $4,998 received from Sarah Johnson', date: '1 day ago', read: true },
  { id: 4, type: 'review', text: 'New 5-star review submitted by Rahul Sharma', date: '3 days ago', read: true }
];

const defaultSettings = {
  companyName: 'TravelGo Agency Ltd.',
  logoUrl: '',
  email: 'hello@travelgo.com',
  phone: '+91 12345 67890',
  address: '123 Travel Street, Bandra West, Mumbai 400050',
  socialFacebook: 'https://facebook.com/travelgo',
  socialInstagram: 'https://instagram.com/travelgo',
  socialTwitter: 'https://twitter.com/travelgo',
  enableEmailNotifications: true,
  enableMfa: false
};

// Initialize / Seed everything
export function initializeState() {
  seed(KEYS.USERS, []);
  seed(KEYS.BOOKINGS, []);
  seed(KEYS.PACKAGES, []);
  seed(KEYS.DESTINATIONS, dummyDestinations);
  seed(KEYS.REVIEWS, []);
  seed(KEYS.PAYMENTS, initialPayments);
  seed(KEYS.BLOGS, []);
  seed(KEYS.NOTIFICATIONS, initialNotifications);
  seed(KEYS.SETTINGS, defaultSettings);
}

// Utility to read
export function getItems(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Utility to write
export function saveItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
  // Dispatch a storage event so pages update instantly if needed
  window.dispatchEvent(new Event('storage'));
}

// Global actions
export const adminState = {
  // Init
  init: initializeState,

  // Bookings CRUD
  getBookings: () => getItems(KEYS.BOOKINGS),
  saveBookings: (items) => saveItems(KEYS.BOOKINGS, items),
  updateBookingStatus: (id, status) => {
    const list = getItems(KEYS.BOOKINGS);
    const updated = list.map(b => {
      if (b.id === id) {
        // Also update or add corresponding transaction if status changes to Confirmed
        if (status === 'Confirmed') {
          const payments = getItems(KEYS.PAYMENTS);
          const existing = payments.find(p => p.bookingId === id);
          if (!existing) {
            payments.unshift({
              id: 'TXN' + Math.floor(100 + Math.random() * 900),
              bookingId: id,
              user: b.user,
              amount: b.amount,
              method: 'Stripe',
              status: 'Success',
              date: new Date().toISOString().split('T')[0]
            });
            saveItems(KEYS.PAYMENTS, payments);
          } else {
            existing.status = 'Success';
            saveItems(KEYS.PAYMENTS, payments);
          }
        } else if (status === 'Cancelled' || status === 'Rejected') {
          const payments = getItems(KEYS.PAYMENTS);
          const existing = payments.find(p => p.bookingId === id);
          if (existing) {
            existing.status = 'Failed';
            saveItems(KEYS.PAYMENTS, payments);
          }
        }
        return { ...b, status };
      }
      return b;
    });
    saveItems(KEYS.BOOKINGS, updated);
    return updated;
  },

  // Packages CRUD
  getPackages: () => getItems(KEYS.PACKAGES),
  savePackages: (items) => saveItems(KEYS.PACKAGES, items),
  addPackage: (pkg) => {
    const list = getItems(KEYS.PACKAGES);
    const newPkg = { ...pkg, id: list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1 };
    list.unshift(newPkg);
    saveItems(KEYS.PACKAGES, list);
    return list;
  },
  editPackage: (pkg) => {
    const list = getItems(KEYS.PACKAGES);
    const updated = list.map(p => p.id === pkg.id ? pkg : p);
    saveItems(KEYS.PACKAGES, updated);
    return updated;
  },
  deletePackage: (id) => {
    const list = getItems(KEYS.PACKAGES);
    const filtered = list.filter(p => p.id !== id);
    saveItems(KEYS.PACKAGES, filtered);
    return filtered;
  },

  // Destinations CRUD
  getDestinations: () => getItems(KEYS.DESTINATIONS),
  saveDestinations: (items) => saveItems(KEYS.DESTINATIONS, items),
  addDestination: (dest) => {
    const list = getItems(KEYS.DESTINATIONS);
    const newDest = { ...dest, id: list.length > 0 ? Math.max(...list.map(d => d.id)) + 1 : 1 };
    list.unshift(newDest);
    saveItems(KEYS.DESTINATIONS, list);
    return list;
  },
  editDestination: (dest) => {
    const list = getItems(KEYS.DESTINATIONS);
    const updated = list.map(d => d.id === dest.id ? dest : d);
    saveItems(KEYS.DESTINATIONS, updated);
    return updated;
  },
  deleteDestination: (id) => {
    const list = getItems(KEYS.DESTINATIONS);
    const filtered = list.filter(d => d.id !== id);
    saveItems(KEYS.DESTINATIONS, filtered);
    return filtered;
  },

  // Users CRUD
  getUsers: () => getItems(KEYS.USERS),
  saveUsers: (items) => saveItems(KEYS.USERS, items),
  updateUserStatus: (id, status) => {
    const list = getItems(KEYS.USERS);
    const updated = list.map(u => u.id === id ? { ...u, status } : u);
    saveItems(KEYS.USERS, updated);
    return updated;
  },
  deleteUser: (id) => {
    const list = getItems(KEYS.USERS);
    const filtered = list.filter(u => u.id !== id);
    saveItems(KEYS.USERS, filtered);
    return filtered;
  },

  // Reviews CRUD
  getReviews: () => getItems(KEYS.REVIEWS),
  saveReviews: (items) => saveItems(KEYS.REVIEWS, items),
  updateReviewStatus: (id, approved) => {
    const list = getItems(KEYS.REVIEWS);
    const updated = list.map(r => r.id === id ? { ...r, status: approved ? 'Approved' : 'Rejected' } : r);
    saveItems(KEYS.REVIEWS, updated);
    return updated;
  },
  deleteReview: (id) => {
    const list = getItems(KEYS.REVIEWS);
    const filtered = list.filter(r => r.id !== id);
    saveItems(KEYS.REVIEWS, filtered);
    return filtered;
  },
  replyToReview: (id, reply) => {
    const list = getItems(KEYS.REVIEWS);
    const updated = list.map(r => r.id === id ? { ...r, reply } : r);
    saveItems(KEYS.REVIEWS, updated);
    return updated;
  },

  // Payments CRUD
  getPayments: () => getItems(KEYS.PAYMENTS),
  savePayments: (items) => saveItems(KEYS.PAYMENTS, items),

  // Blogs CRUD
  getBlogs: () => getItems(KEYS.BLOGS),
  saveBlogs: (items) => saveItems(KEYS.BLOGS, items),
  addBlog: (post) => {
    const list = getItems(KEYS.BLOGS);
    const newPost = { ...post, id: list.length > 0 ? Math.max(...list.map(b => b.id)) + 1 : 1, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) };
    list.unshift(newPost);
    saveItems(KEYS.BLOGS, list);
    return list;
  },
  editBlog: (post) => {
    const list = getItems(KEYS.BLOGS);
    const updated = list.map(b => b.id === post.id ? post : b);
    saveItems(KEYS.BLOGS, updated);
    return updated;
  },
  deleteBlog: (id) => {
    const list = getItems(KEYS.BLOGS);
    const filtered = list.filter(b => b.id !== id);
    saveItems(KEYS.BLOGS, filtered);
    return filtered;
  },

  // Notifications CRUD
  getNotifications: () => getItems(KEYS.NOTIFICATIONS),
  saveNotifications: (items) => saveItems(KEYS.NOTIFICATIONS, items),
  markAllNotificationsRead: () => {
    const list = getItems(KEYS.NOTIFICATIONS);
    const updated = list.map(n => ({ ...n, read: true }));
    saveItems(KEYS.NOTIFICATIONS, updated);
    return updated;
  },
  addNotification: (type, text) => {
    const list = getItems(KEYS.NOTIFICATIONS);
    const newNotif = { id: Date.now(), type, text, date: 'Just now', read: false };
    list.unshift(newNotif);
    saveItems(KEYS.NOTIFICATIONS, list);
    return list;
  },

  // Settings
  getSettings: () => {
    const settings = localStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : defaultSettings;
  },
  saveSettings: (settings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
  }
};

// Automatically seed data upon initial import
initializeState();
