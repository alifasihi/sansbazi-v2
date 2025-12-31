import React, { useState, useEffect } from 'react';
import { addReservation } from '../utils/reservations';
import { formatPrice } from '../utils/format';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

export default function BookingForm({
  price = 0,
  selectedDate,
  selectedTime,
  futureDates = [],
  ballRental = false,
  ballFee = 0,
  onBooked,
  arenaName = "سالن ورزشی",
  arenaId,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setName(user.name || user.username || '');
      setPhone(user.phone || '');
    }
  }, []);

  const sessionsCount = 1 + futureDates.length;
  const baseTotal = price * sessionsCount;
  const ballTotal = ballRental ? ballFee * sessionsCount : 0;
  const grandTotal = baseTotal + ballTotal;

  const isReady = selectedDate && selectedTime && name.trim() && phone.trim();

  const formatJalaliShort = (d) => {
    if (!d) return '—';
    const date = d.toDate ? d.toDate() : d;
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    if (!isReady) {
      alert('لطفاً تمام اطلاعات را تکمیل کنید');
      return;
    }

    try {
      const currentArenaId = arenaId || window.location.pathname.split('/').pop();
      const mainIso = selectedDate.toDate
        ? selectedDate.toDate().toISOString().slice(0, 10)
        : selectedDate.toISOString().slice(0, 10);

      const datesToBook = [mainIso, ...futureDates].filter(Boolean);

      datesToBook.forEach((dt) => {
        addReservation({
          arenaId: currentArenaId,
          date: dt,
          time: selectedTime,
          status: 'confirmed',
          name,
          phone,
          extraBall: ballRental,
          extraFee: ballRental ? ballFee : 0,
          userId: user.id,
          pricePaid: price + (ballRental ? ballFee : 0),
        });
      });

      alert(`رزرو ${datesToBook.length} سانس با موفقیت ثبت شد!\nمبلغ کل: ${formatPrice(grandTotal)}`);

      if (onBooked) onBooked();
    } catch (err) {
      alert('خطا در ثبت رزرو');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-glass sticky top-8">
      <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-modernGreen to-neonGreen bg-clip-text text-transparent">
        خلاصه رزرو
      </h3>

      <div className="space-y-6 mb-10">
        <div className="bg-glass/60 rounded-2xl p-6 border border-glass">
          <p className="text-sm text-slate-600 mb-2">سالن</p>
          <p className="text-2xl font-bold text-slate-800">{arenaName}</p>
        </div>

        <div className="bg-glass/60 rounded-2xl p-6 border border-glass">
          <p className="text-sm text-slate-600 mb-2">تاریخ</p>
          <p className="text-xl font-bold text-slate-800">{formatJalaliShort(selectedDate)}</p>
        </div>

        <div className="bg-glass/60 rounded-2xl p-6 border border-glass">
          <p className="text-sm text-slate-600 mb-2">سانس</p>
          <p className="text-2xl font-bold text-neonBlue">{selectedTime || '—'}</p>
        </div>

        {futureDates.length > 0 && (
          <div className="bg-glass/60 rounded-2xl p-6 border border-glass">
            <p className="text-lg font-bold text-slate-800 mb-3">رزرو هفتگی ({futureDates.length} هفته)</p>
          </div>
        )}

        {ballRental && (
          <div className="text-center text-2xl font-bold text-sportGreen">⚽ اجاره توپ فعال</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">نام</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-6 py-5 text-lg rounded-2xl bg-glass/60 border border-glass focus:border-neonBlue focus:ring-4 focus:ring-neonBlue/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">شماره تماس</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-6 py-5 text-lg rounded-2xl bg-glass/60 border border-glass focus:border-neonBlue focus:ring-4 focus:ring-neonBlue/30 transition-all"
          />
        </div>
      </div>

      <div className="bg-glass/70 rounded-3xl p-8 mb-10 border border-glass">
        <div className="space-y-6">
          <div className="flex justify-between text-xl">
            <span className="text-slate-700">هزینه سالن ({sessionsCount} سانس)</span>
            <span className="font-bold text-slate-800">{formatPrice(baseTotal)}</span>
          </div>

          {ballRental && (
            <div className="flex justify-between text-xl">
              <span className="text-slate-700">اجاره توپ</span>
              <span className="font-bold text-sportGreen">{formatPrice(ballTotal)}</span>
            </div>
          )}

          <div className="pt-6 border-t-2 border-glass flex justify-between items-center">
            <span className="text-2xl font-extrabold text-slate-800">مبلغ نهایی:</span>
            <span className="text-4xl font-extrabold bg-gradient-to-r from-modernGreen to-neonGreen bg-clip-text text-transparent">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isReady}
        className={`
          w-full py-6 rounded-3xl font-bold text-2xl shadow-2xl transition-all duration-300
          ${isReady
            ? 'bg-gradient-to-r from-modernGreen to-neonGreen text-white hover:from-neonGreen hover:to-sportGreen hover:scale-105 hover:shadow-3xl'
            : 'bg-glass/50 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        {isReady ? 'ثبت نهایی رزرو' : 'لطفاً سانس را انتخاب کنید'}
      </button>
    </div>
  );
}
