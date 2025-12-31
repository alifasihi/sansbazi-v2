import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import data from "../data/arenas.json";
import BookingForm from "../components/BookingForm";
import DailySlots from "../components/DailySlots";
import WeekDaysBar from "../components/WeekDaysBar";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { generateSlots, markBookedSlots } from "../utils/slots";
import { getReservationsForArenaDate } from "../utils/reservations";

export default function Booking() {
  const { id } = useParams();
  const arena = data.find((a) => a.id === id);

  if (!arena) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center p-8">
          <div className="text-8xl mb-8 opacity-20">🔍</div>
          <h2 className="text-3xl font-bold text-slate-700">سالن یافت نشد</h2>
        </div>
      </div>
    );
  }

  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [selectedDate, setSelectedDate] = useState(normalizedToday);
  const [selectedTime, setSelectedTime] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [futureOptions, setFutureOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalFutureOptions, setModalFutureOptions] = useState([]);
  const [modalBall, setModalBall] = useState(false);
  const [ballRental, setBallRental] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const slots = useMemo(() => generateSlots(90), []);

  const bookedForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateObj = selectedDate.toDate ? selectedDate.toDate() : selectedDate;
    const iso = dateObj.toISOString().slice(0, 10);
    const res = getReservationsForArenaDate(arena.id, iso);
    return res.map((r) => r.time);
  }, [selectedDate, arena.id, refreshKey]);

  const displayedSlots = useMemo(
    () => markBookedSlots(slots, bookedForSelectedDate),
    [slots, bookedForSelectedDate]
  );

  const computeFutureOptions = (baseDate, time) => {
    if (!baseDate || !time) return [];
    const base = baseDate.toDate ? baseDate.toDate() : baseDate;
    const options = [];
    const maxDate = new Date(2026, 2, 19);

    for (let w = 1; w <= 12; w++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 7 * w);
      if (d > maxDate) break;
      const iso = d.toISOString().slice(0, 10);
      const exists = getReservationsForArenaDate(arena.id, iso).some((r) => r.time === time);
      options.push({ date: d, iso, available: !exists, selected: false });
    }
    return options;
  };

  useEffect(() => {
    if (selectedTime && selectedDate) {
      setFutureOptions(computeFutureOptions(selectedDate, selectedTime));
    } else {
      setFutureOptions([]);
    }
  }, [selectedDate, selectedTime, refreshKey, arena.id]);

  const formatJalali = (d) => {
    const date = d.toDate ? d.toDate() : d;
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* هدر سالن */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-glass">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={arena.logo} alt={arena.name} className="w-32 h-32 rounded-3xl object-cover shadow-xl ring-4 ring-neonBlue/30" />
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-modernBlue to-neonBlue bg-clip-text text-transparent">
                رزرو {arena.name}
              </h1>
              <p className="text-xl text-slate-700 mt-4 flex items-center justify-center md:justify-start gap-3">
                <span className="w-3 h-3 bg-neonGreen rounded-full animate-pulse"></span>
                {arena.address} • {arena.city}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* انتخاب تاریخ */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-glass">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-neonBlue to-modernBlue bg-clip-text text-transparent">
                  انتخاب تاریخ
                </h3>
                <button
                  onClick={() => setShowCustomDate(!showCustomDate)}
                  className="flex items-center gap-3 px-6 py-3 bg-glass/70 hover:bg-glass rounded-2xl border border-glass transition-all hover:scale-105"
                >
                  <CalendarDaysIcon className="w-6 h-6 text-neonPurple" />
                  تاریخ دلخواه
                </button>
              </div>

              {showCustomDate && (
                <div className="mb-8 p-6 bg-glass/60 rounded-3xl border border-glass">
                  <div className="relative">
                    <CalendarDaysIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 text-neonBlue animate-pulse-slow z-10" />
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={selectedDate}
                      onChange={(d) => {
                        setSelectedDate(d);
                        setSelectedTime("");
                      }}
                      format="YYYY/MM/DD"
                      minDate={new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)}
                      maxDate={new Date(2026, 2, 19)}
                      calendarPosition="top-right"
                      inputClass="w-full pl-16 pr-6 py-5 text-xl font-bold text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer"
                      calendarClassName="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-glass mt-4"
                      headerClassName="bg-gradient-to-r from-modernBlue to-neonBlue text-white py-6 px-8 rounded-t-3xl text-xl font-bold"
                      dayClassName="hover:bg-neonBlue/20 hover:text-neonBlue rounded-2xl transition-all text-lg py-4"
                      selectedDayClassName="bg-gradient-to-r from-neonBlue to-modernBlue text-white font-bold shadow-lg animate-pulse"
                      todayClassName="text-neonBlue font-bold ring-4 ring-neonBlue/40 rounded-2xl"
                    />
                  </div>
                </div>
              )}

              <WeekDaysBar selectedDate={selectedDate} onSelect={setSelectedDate} />
            </div>

            {/* سانس‌ها */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-glass">
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-sportGreen to-neonGreen bg-clip-text text-transparent">
                سانس‌های موجود — {formatJalali(selectedDate)}
              </h3>
              <DailySlots
                slots={displayedSlots}
                selectedTime={selectedTime}
                onSelect={(time) => {
                  setSelectedTime(time);
                  const opts = computeFutureOptions(selectedDate, time);
                  setModalFutureOptions(opts);
                  setModalBall(ballRental);
                  setShowModal(true); // مودال باز می‌شه
                }}
              />
            </div>

            {/* رزرو هفتگی */}
            {selectedTime && futureOptions.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-glass">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-neonPurple to-modernGreen bg-clip-text text-transparent">
                    رزرو تکراری هفتگی
                  </h3>
                  <button
                    onClick={() => {
                      setModalFutureOptions([...futureOptions]);
                      setModalBall(ballRental);
                      setShowModal(true);
                    }}
                    className="px-6 py-3 bg-glass/70 hover:bg-glass rounded-2xl border border-glass transition-all hover:scale-105"
                  >
                    تنظیم پیشرفته
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {futureOptions.map((opt, i) => (
                    <label key={i} className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 ${opt.available ? 'bg-glass/60 border-glass hover:border-neonGreen' : 'bg-slate-100 border-slate-300 opacity-60'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          disabled={!opt.available}
                          checked={opt.selected}
                          onChange={(e) => {
                            const newOpts = [...futureOptions];
                            newOpts[i].selected = e.target.checked;
                            setFutureOptions(newOpts);
                          }}
                          className="w-6 h-6 text-neonGreen rounded-lg"
                        />
                        <span className="text-lg font-bold text-slate-800">{formatJalali(opt.date)}</span>
                      </div>
                      {!opt.available && <span className="px-5 py-2 bg-red-100 text-red-700 rounded-xl font-bold">رزرو شده</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* فرم رزرو */}
          <div className="lg:sticky lg:top-8">
            <BookingForm
              price={arena.pricePerSlot || arena.price || 0}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              futureDates={futureOptions.filter(f => f.selected).map(f => f.iso)}
              ballRental={ballRental}
              ballFee={(arena.pricePerSlot || arena.price || 0) * 0.1}
              onBooked={() => {
                setRefreshKey(k => k + 1);
                setSelectedTime("");
                setFutureOptions([]);
                setBallRental(false);
              }}
              arenaName={arena.name}
              arenaId={arena.id}
            />
          </div>
        </div>

        {/* مودال تنظیمات پیشرفته */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-glass max-w-lg w-full">
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neonPurple to-sportGreen bg-clip-text text-transparent">
                تنظیمات پیشرفته
              </h3>

              <div className="space-y-6">
                <label className="flex items-center gap-4 p-6 rounded-2xl bg-glass/60 hover:bg-glass border border-glass cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalBall}
                    onChange={(e) => setModalBall(e.target.checked)}
                    className="w-6 h-6 text-neonBlue rounded-lg"
                  />
                  <div>
                    <p className="text-xl font-bold text-slate-800">اجاره توپ ⚽</p>
                    <p className="text-slate-600">هزینه اضافی در هر سانس</p>
                  </div>
                </label>

                <div className="max-h-80 overflow-y-auto space-y-4">
                  {modalFutureOptions.map((opt, i) => (
                    <label key={i} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${opt.available ? 'bg-glass/60 border-glass hover:border-neonGreen' : 'bg-slate-100 border-slate-300 opacity-60'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          disabled={!opt.available}
                          checked={opt.selected}
                          onChange={(e) => {
                            const newOpts = [...modalFutureOptions];
                            newOpts[i].selected = e.target.checked;
                            setModalFutureOptions(newOpts);
                          }}
                          className="w-6 h-6 text-neonGreen"
                        />
                        <span className="text-lg font-semibold">{formatJalali(opt.date)}</span>
                      </div>
                      {!opt.available && <span className="text-red-600 font-bold">رزرو شده</span>}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setFutureOptions(modalFutureOptions);
                    setBallRental(modalBall);
                    setShowModal(false);
                  }}
                  className="flex-1 py-5 bg-gradient-to-r from-modernGreen to-neonGreen text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  اعمال
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 bg-glass/70 border border-glass text-slate-700 font-bold rounded-2xl hover:bg-glass transition-all"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
