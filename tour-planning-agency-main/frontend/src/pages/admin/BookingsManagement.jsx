import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiEye, FiUser, FiMail, FiPhone, FiCalendar, FiBriefcase, FiDollarSign } from 'react-icons/fi';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [paymentModal, setPaymentModal] = useState(null);
  const [packagePrice, setPackagePrice] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all');
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, withPayment = false) => {
    try {
      const payload = { status };
      if (withPayment && status === 'Approved') {
        payload.packagePrice = packagePrice;
        payload.additionalCharges = additionalCharges;
      }
      await api.put(`/bookings/${id}/status`, payload);
      toast.success(`Booking status successfully updated to ${status}`);
      fetchBookings();
      setPaymentModal(null);
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking(prev => ({ ...prev, status }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleApproveWithPayment = (booking) => {
    setPaymentModal(booking);
    setPackagePrice(booking.totalAmount || 0);
    setAdditionalCharges(0);
  };

  const handleUpdateTripStatus = async (id, tripStatus) => {
    try {
      await api.put(`/bookings/${id}/trip-status`, { tripStatus });
      toast.success(`Trip status updated to ${tripStatus}`);
      fetchBookings();
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking(prev => ({ ...prev, tripStatus }));
      }
    } catch (err) {
      toast.error('Failed to update trip status');
    }
  };

  const handleOpenDetails = async (booking) => {
    setSelectedBooking(booking);
    if (booking.user && booking.user._id) {
      setHistoryLoading(true);
      try {
        const res = await api.get(`/users/${booking.user._id}/bookings`);
        // Filter out current booking from history to avoid redundancy
        setCustomerHistory(res.data.filter(b => b._id !== booking._id));
      } catch (err) {
        console.error('Failed to load customer booking history', err);
        setCustomerHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    } else {
      setCustomerHistory([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review, filter, approve, and reject tour bookings.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafaf8] text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100/80">
                <th className="px-6 py-4 font-bold">Customer Details</th>
                <th className="px-6 py-4 font-bold">Tour Package</th>
                <th className="px-6 py-4 font-bold">Value</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <FiBriefcase size={20} />
                      </div>
                      <p className="text-sm font-semibold text-slate-400">No bookings found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs flex-shrink-0">
                          {b.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{b.user?.name || 'Unknown User'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{b.user?.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{b.package?.title || 'Unknown Tour'}</p>
                      {b.travelDate && <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><FiCalendar size={10}/> {new Date(b.travelDate).toLocaleDateString()}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-[#7C3AED]">${b.totalAmount?.toLocaleString() || 0}</p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{b.persons} Pax</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border ${
                        b.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        b.status === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                        b.status === 'Denied' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                        'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        {b.status === 'Approved' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {b.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenDetails(b)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Customer Details & History">
                          <FiEye size={16} />
                        </button>
                        {b.status === 'Pending' && (
                          <>
                            <button onClick={() => handleApproveWithPayment(b)} className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve & Set Payment">
                              <FiCheck size={16} />
                            </button>
                            <button onClick={() => handleUpdateStatus(b._id, 'Denied')} className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors" title="Deny">
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                        {b.status === 'Approved' && (
                          <button onClick={() => handleUpdateStatus(b._id, 'Cancelled')} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Cancel Booking">
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & History Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-55">
              <h2 className="font-bold text-slate-900 text-lg">Customer Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Customer Profile Section */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiUser size={13} /> Customer Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{selectedBooking.user?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FiMail className="flex-shrink-0 text-slate-400" size={14} />
                    <span className="truncate">{selectedBooking.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FiPhone className="flex-shrink-0 text-slate-400" size={14} />
                    <span>{selectedBooking.user?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiBriefcase size={13} /> Current Booking Info
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-slate-100 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Booking ID</p>
                    <p className="font-mono text-sm text-slate-900 font-semibold mt-0.5">{selectedBooking.bookingId || selectedBooking._id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Tour Package</p>
                    <p className="text-sm text-slate-900 font-semibold mt-0.5">{selectedBooking.package?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Travel Date</p>
                    <p className="text-sm text-slate-900 font-semibold mt-0.5 flex items-center gap-1.5 mt-0.5">
                      <FiCalendar size={13} className="text-slate-400" />
                      {selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Amount</p>
                    <p className="text-sm font-bold text-blue-600 mt-0.5">${selectedBooking.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Travelers</p>
                    <p className="text-sm text-slate-900 font-semibold mt-0.5">{selectedBooking.persons} {selectedBooking.persons > 1 ? 'persons' : 'person'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Booking Status</p>
                    <span className={`inline-block mt-0.5 badge px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                      selectedBooking.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                      selectedBooking.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      selectedBooking.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
                {selectedBooking.specialReq && (
                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Special Instructions</p>
                    <p className="text-xs text-slate-700 mt-1 italic">"{selectedBooking.specialReq}"</p>
                  </div>
                )}
              </div>

              {/* Customer Booking History Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiDollarSign size={13} /> Booking History
                </h3>
                {historyLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                ) : customerHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2 bg-slate-50 rounded-xl">No other bookings found for this customer.</p>
                ) : (
                  <div className="border border-slate-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                          <th className="px-4 py-2 font-semibold">Tour</th>
                          <th className="px-4 py-2 font-semibold">Date</th>
                          <th className="px-4 py-2 font-semibold">Amount</th>
                          <th className="px-4 py-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {customerHistory.map(h => (
                          <tr key={h._id}>
                            <td className="px-4 py-2 text-slate-800 font-semibold">{h.package?.title || 'Unknown Tour'}</td>
                            <td className="px-4 py-2 text-slate-600">{new Date(h.travelDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-slate-900 font-bold">${h.totalAmount?.toLocaleString()}</td>
                            <td className="px-4 py-2">
                              <span className={`badge px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                h.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                h.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>{h.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
              <div className="flex items-center gap-2">
                {selectedBooking.paymentStatus === 'Paid' && (
                  <select
                    value={selectedBooking.tripStatus || 'Scheduled'}
                    onChange={(e) => handleUpdateTripStatus(selectedBooking._id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Arriving">Arriving</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}
              </div>
              <div className="flex items-center gap-2">
              {selectedBooking.status === 'Pending' && (
                <>
                  <button onClick={() => handleApproveWithPayment(selectedBooking)} className="btn btn-primary bg-emerald-600 text-white text-xs hover:bg-emerald-700 flex items-center gap-1">
                    <FiCheck size={14} /> Approve & Set Payment
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedBooking._id, 'Denied')} className="btn bg-rose-600 text-white text-xs hover:bg-rose-700 flex items-center gap-1" title="Deny Booking">
                    <FiX size={14} /> Deny Booking
                  </button>
                </>
              )}
              <button onClick={() => setSelectedBooking(null)} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Amount Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">Set Payment Amount</h2>
              <button onClick={() => setPaymentModal(null)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Approve booking for <span className="font-semibold text-slate-900">{paymentModal.user?.name}</span> - {paymentModal.package?.title}
              </p>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Package Price (₹)</label>
                <input
                  type="number"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter package price"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Charges (₹)</label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter additional charges"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₹{(packagePrice + additionalCharges).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleUpdateStatus(paymentModal._id, 'Approved', true)}
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Approve & Send Payment
                </button>
                <button
                  onClick={() => setPaymentModal(null)}
                  className="px-6 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
