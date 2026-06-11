import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiX, FiPrinter, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-slate-900">Payments & Financials</h1>
        <p className="text-xs text-slate-500 mt-1">Audit platform revenue, success rates, and print invoices.</p>
      </div>

      <div className="modern-card bg-white overflow-hidden shadow rounded-xl border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Transaction ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Tour Package</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold">Invoice No</th>
                <th className="px-6 py-3 text-center font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-sm">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                payments.map(p => {
                  const isBookingApproved = p.booking && (p.booking.status === 'Approved' || p.booking.status === 'Completed');
                  return (
                    <tr key={p._id} className="hover:bg-slate-55/50 transition-colors text-sm">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">{p.transactionId}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{p.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{p.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{p.booking?.package?.title || 'Unknown Tour'}</td>
                      <td className="px-6 py-4 font-bold text-slate-950">${p.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-600">
                          <FiCreditCard className="text-slate-400" size={14} />
                          {p.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.invoiceNumber ? (
                          <span className="font-mono text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                            {p.invoiceNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not generated</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isBookingApproved ? (
                          <button
                            onClick={() => setSelectedInvoice(p)}
                            className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs py-1 px-3 rounded-lg flex items-center gap-1 mx-auto transition-colors"
                          >
                            <FiPrinter size={13} /> View Invoice
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded italic cursor-not-allowed select-none" title="Invoices can only be generated for approved bookings">
                            Pending Approval
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">Official Invoice Details</h2>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 text-sm" id="printable-invoice">
              <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                <div>
                  <h3 className="font-bold text-xl text-primary">TravelGo</h3>
                  <p className="text-xs text-slate-400 mt-1">Official Booking Invoice</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Invoice Number</p>
                  <p className="font-mono text-base text-blue-600 font-bold mt-0.5">{selectedInvoice.invoiceNumber || 'INV-PENDING'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Billed To</p>
                  <p className="font-semibold text-slate-800 mt-1">{selectedInvoice.user?.name || 'Customer'}</p>
                  <p className="text-xs text-slate-500">{selectedInvoice.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Payment Details</p>
                  <p className="text-xs text-slate-800 mt-1"><span className="font-semibold">Method:</span> {selectedInvoice.method}</p>
                  <p className="text-xs text-slate-800"><span className="font-semibold">Txn ID:</span> {selectedInvoice.transactionId}</p>
                  <p className="text-xs text-slate-850"><span className="font-semibold">Date:</span> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-3">Item Description</p>
                <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900">{selectedInvoice.booking?.package?.title || 'Tour Package'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Booking ID: {selectedInvoice.booking?.bookingId || selectedInvoice.booking?._id}</p>
                  </div>
                  <div className="text-right font-bold text-slate-900">
                    ${selectedInvoice.amount?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 mt-4">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <FiCheckCircle size={14} className="text-emerald-500" /> Status Paid
                </span>
                <span className="text-lg font-bold text-blue-600">Total Billed: ${selectedInvoice.amount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => window.print()}
                className="btn btn-primary bg-blue-600 text-white text-xs hover:bg-blue-700 flex items-center gap-1.5"
              >
                <FiPrinter size={14} /> Print Invoice
              </button>
              <button onClick={() => setSelectedInvoice(null)} className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
