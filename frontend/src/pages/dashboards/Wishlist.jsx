import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdFavorite, MdLocationOn, MdAccessTime, MdDeleteOutline, MdExplore } from 'react-icons/md';
import api from '../../utils/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/wishlist');
      setWishlist(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load your wishlist. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (packageId) => {
    try {
      // Optimistically remove it from UI
      setWishlist((prev) => prev.filter((p) => p._id !== packageId));
      await api.post('/users/wishlist', { packageId });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      // Revert if failed
      fetchWishlist();
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 w-3/4 bg-gray-200 mb-4 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 mb-6 rounded"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
          <MdFavorite className="text-red-500" /> My Wishlist
        </h1>
        <p className="text-gray-600">Packages you have saved for future travels.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-gray-200 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <MdFavorite className="text-5xl text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            Save your favorite packages so you don't lose them! Start exploring to find your next adventure.
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <MdExplore className="text-xl" /> Explore Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((pkg) => (
            <motion.div
              key={pkg._id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.coverImage || 'https://via.placeholder.com/400x300'}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(pkg._id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-red-50 text-red-500 rounded-full backdrop-blur-sm transition-colors"
                  title="Remove from wishlist"
                >
                  <MdDeleteOutline className="text-xl" />
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#0F172A] text-xs font-bold rounded-full">
                    {pkg.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#0F172A] mb-2 line-clamp-2">
                  {pkg.title}
                </h3>
                
                <div className="space-y-2 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-blue-500 text-lg" />
                    <span>{pkg.destination}, {pkg.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="text-blue-500 text-lg" />
                    <span>{pkg.duration?.days} Days / {pkg.duration?.nights} Nights</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-[#0F172A]">${pkg.price}</p>
                  </div>
                  <Link
                    to={`/packages/${pkg._id}`}
                    className="px-5 py-2 bg-[#0F172A] hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
