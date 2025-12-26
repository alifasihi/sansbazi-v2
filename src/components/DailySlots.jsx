import React from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function DailySlots({ slots = [], onSelect = () => {}, selectedTime }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {slots.map((slot, index) => (
        <div
          key={index}
          className={`
            p-6 rounded-3xl border-2 transition-all duration-400 transform hover:scale-105
            ${slot.status === 'free'
              ? 'bg-white/90 backdrop-blur-sm border-glass hover:border-neonBlue hover:shadow-2xl'
              : 'bg-slate-100/80 border-slate-300 opacity-70 cursor-not-allowed'
            }
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon className="w-6 h-6 text-slate-600" />
            <span className="text-xl font-bold text-slate-800">{slot.time}</span>
          </div>

          {slot.status === 'free' ? (
            <button
              onClick={() => onSelect(slot.time)}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300
                ${selectedTime === slot.time
                  ? 'bg-gradient-to-r from-neonBlue to-modernBlue text-white shadow-xl'
                  : 'bg-gradient-to-r from-green-50 to-sportGreen/20 text-modernGreen border border-modernGreen hover:from-sportGreen/30 hover:to-neonGreen/30'
                }
              `}
            >
              <CheckCircleIcon className="w-6 h-6 inline-block ml-2" />
              {selectedTime === slot.time ? 'انتخاب شده' : 'انتخاب سانس'}
            </button>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-100 text-red-700 font-bold">
                <XCircleIcon className="w-6 h-6" />
                رزرو شده
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
