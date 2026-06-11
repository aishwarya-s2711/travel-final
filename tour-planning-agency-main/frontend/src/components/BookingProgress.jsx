import React from 'react';
import { FiCheck, FiClock, FiCreditCard, FiFlag, FiX } from 'react-icons/fi';

const BookingProgress = ({ booking }) => {
  const steps = [
    { id: 'submitted', label: 'Submitted', status: 'completed', icon: FiCheck },
    { 
      id: 'review', 
      label: 'Under Review', 
      status: booking.status === 'Pending' ? 'current' : 'completed', 
      icon: FiClock 
    },
    { 
      id: 'approved', 
      label: 'Approved', 
      status: booking.status === 'Approved' || booking.status === 'Completed' || booking.paymentStatus === 'Paid' ? 'completed' 
              : booking.status === 'Denied' ? 'failed' : 'upcoming', 
      icon: FiCheck 
    },
    { 
      id: 'payment', 
      label: 'Payment Pending', 
      status: booking.paymentStatus === 'Paid' ? 'completed' 
              : booking.status === 'Approved' ? 'current' : 'upcoming', 
      icon: FiCreditCard 
    },
    { 
      id: 'confirmed', 
      label: 'Confirmed', 
      status: booking.status === 'Completed' || booking.paymentStatus === 'Paid' ? 'completed' : 'upcoming', 
      icon: FiFlag 
    }
  ];

  if (booking.status === 'Cancelled' || booking.status === 'Denied') {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 my-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <FiX size={16} />
        </div>
        <div>
          <h4 className="font-semibold text-rose-800">Booking {booking.status}</h4>
          <p className="text-sm text-rose-600">This booking request was {booking.status.toLowerCase()}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="relative flex justify-between items-center w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
        
        {steps.map((step, idx) => {
          const Icon = step.icon;
          let bgColor = 'bg-slate-100';
          let textColor = 'text-slate-400';
          let borderColor = 'border-slate-200';
          let barColor = 'bg-slate-100';

          if (step.status === 'completed') {
            bgColor = 'bg-emerald-500';
            textColor = 'text-white';
            borderColor = 'border-emerald-500';
            barColor = 'bg-emerald-500';
          } else if (step.status === 'current') {
            bgColor = 'bg-blue-500';
            textColor = 'text-white';
            borderColor = 'border-blue-500';
            barColor = 'bg-blue-500';
          } else if (step.status === 'failed') {
            bgColor = 'bg-rose-500';
            textColor = 'text-white';
            borderColor = 'border-rose-500';
          }

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {idx > 0 && (
                <div 
                  className={`absolute right-1/2 top-4 h-1 w-[calc(100%-2rem)] -translate-y-1/2 -z-10 ${step.status === 'completed' || step.status === 'current' ? 'bg-emerald-500' : 'bg-slate-100'}`}
                />
              )}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${bgColor} ${borderColor} ${textColor}`}>
                <Icon size={14} />
              </div>
              <span className={`mt-2 text-[10px] font-bold uppercase tracking-wide text-center w-20 ${step.status === 'completed' || step.status === 'current' ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgress;
