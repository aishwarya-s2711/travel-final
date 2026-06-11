import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdPayment, MdCheckCircle, MdWarning, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my');
      const allBookings = Array.isArray(response.data) ? response.data : (response.data?.bookings || []);
      
      // Sort so pending payments might be at top, or just by newest
      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setPayments(allBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load your payment history.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'completed' || s === 'paid') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
          <MdCheckCircle /> PAID
        </span>
      );
    }
    if (s === 'failed') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
          <MdWarning /> FAILED
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
        <MdWarning /> PENDING
      </span>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(n => (
        <div key={n} className="bg-white p-6 rounded-2xl border border-gray-200 animate-pulse flex justify-between">
          <div className="space-y-3 w-1/2">
            <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3 w-1/4 text-right">
            <div className="h-5 w-1/2 bg-gray-200 rounded ml-auto"></div>
            <div className="h-8 w-24 bg-gray-200 rounded ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
            <MdPayment className="text-blue-600" /> Payment History
          </h1>
          <p className="text-gray-600">Track your past transactions and pending payments.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-gray-200 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <MdPayment className="text-5xl text-blue-300" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] mb-3">No Payment History</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            You don't have any payments on record yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
            <div className="col-span-5">Package / Description</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-3 text-right">Amount / Action</div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {payments.map((payment) => {
              const isPending = payment.paymentStatus?.toLowerCase() !== 'paid' && payment.paymentStatus?.toLowerCase() !== 'completed';
              return (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="md:col-span-5">
                    <h4 className="font-bold text-[#0F172A]">{payment.packageName}</h4>
                    <p className="text-xs text-gray-500 mt-1">Booking ID: {payment.bookingId}</p>
                  </div>
                  
                  <div className="md:col-span-2 text-sm text-gray-600">
                    {formatDate(payment.createdAt)}
                  </div>
                  
                  <div className="md:col-span-2 flex md:justify-center">
                    {getPaymentBadge(payment.paymentStatus)}
                  </div>
                  
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                    <span className="font-bold text-[#0F172A] text-lg">${payment.totalAmount}</span>
                    {isPending ? (
                      <Link
                        to={`/payment/${payment._id}`}
                        className="px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-1"
                      >
                        Pay Now <MdArrowForward />
                      </Link>
                    ) : (
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200 transition">
                        Receipt
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
