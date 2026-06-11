import { motion } from 'framer-motion';
import { FiCheckCircle, FiX } from 'react-icons/fi';

export default function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <FiX size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <FiCheckCircle className="text-emerald-500 w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Booking Request Submitted!
          </h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your booking request has been submitted successfully. Our team will review it shortly and generate a payment link once approved.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-[#0f172a] text-white font-semibold py-4 rounded-xl hover:bg-[#1e293b] transition-colors shadow-lg shadow-blue-900/20"
          >
            View My Bookings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
