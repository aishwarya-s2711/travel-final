import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCheck, FiAlertCircle, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Payment() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      const bookings = res.data || [];
      const found = bookings.find(b => b._id === bookingId);
      
      if (!found) {
        toast.error('Booking not found');
        navigate('/dashboard');
        return;
      }

      if (found.status !== 'Approved') {
        toast.error('Booking not approved yet');
        navigate('/dashboard');
        return;
      }

      if (found.paymentStatus === 'Paid') {
        toast.info('Payment already completed');
        navigate('/dashboard');
        return;
      }

      setBooking(found);
    } catch (err) {
      toast.error('Failed to load booking');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'Card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill all card details');
        return;
      }
    }

    setProcessing(true);

    try {
      const res = await api.post('/bookings/payment', {
        bookingId: booking._id,
        paymentMethod,
        transactionId: 'TXN-' + Date.now()
      });

      toast.success('Payment successful! Your booking is confirmed.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment for your booking</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-6">
                <FiLock className="text-green-600" />
                <p className="text-sm text-gray-600">Secure Payment Gateway</p>
              </div>

              <form onSubmit={handlePayment}>
                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-4">Payment Method</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['Card', 'UPI', 'Bank Transfer', 'Cash'].map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === method
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm">{method}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'Card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder=""
                        maxLength="19"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder=""
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder=""
                          maxLength="5"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder=""
                          maxLength="3"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'UPI' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <input
                      type="text"
                      placeholder=""
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </motion.div>
                )}

                {paymentMethod === 'Bank Transfer' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                  >
                    <p className="text-sm text-blue-900 font-semibold mb-2">Bank Details:</p>
                    <p className="text-sm text-blue-800">Account: 1234567890</p>
                    <p className="text-sm text-blue-800">IFSC: TRAV0001234</p>
                    <p className="text-sm text-blue-800 mt-2">Transfer and share reference number</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard />
                      Pay ₹{booking.totalAmount?.toLocaleString()}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Package</span>
                  <span className="font-semibold text-gray-900">{booking.package?.title}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Travel Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Travelers</span>
                  <span className="font-semibold text-gray-900">{booking.persons} Person(s)</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-mono text-xs text-blue-600">{booking.bookingId}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {booking.packagePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Package Price</span>
                    <span className="text-gray-900">₹{booking.packagePrice?.toLocaleString()}</span>
                  </div>
                )}
                
                {booking.additionalCharges > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Additional Charges</span>
                    <span className="text-gray-900">₹{booking.additionalCharges?.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-blue-600">₹{booking.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <FiCheck className="text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">
                    Your booking is approved. Complete payment to confirm your trip.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
