import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { getCurrentUser, logout } from '../utils/auth';

// لوگو پروژه - اگر لوگو نداشتی، این SVG ساده و زیبا رو استفاده کن
// import Logo from '../assets/logo.svg'; // مسیر لوگو رو درست کن یا SVG inline بذار

// اگر لوگو خارجی داری، از این استفاده کن:
const Logo = '/images/logos/sansbazi_logo.png';

export default function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-glass/90 backdrop-blur-md shadow-lg border-b border-glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* لوگو و عنوان */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
          >
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-modernBlue to-neonBlue p-1">
              {Logo ? (
                <img
                  src={Logo}
                  alt="لوگو سانس‌بازی"
                  className="w-full h-full object-contain rounded-xl bg-white/90"
                />
              ) : (
                // fallback زیبا اگر لوگو لود نشد
                <div className="w-full h-full rounded-xl bg-white/90 flex items-center justify-center text-2xl font-bold text-neonBlue">
                  س
                </div>
              )}
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-slate-800 group-hover:text-neonBlue transition-colors duration-300">
                سانس‌بازی
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">رزرو آنلاین سالن‌های ورزشی</p>
            </div>
          </Link>

          {/* دسکتاپ منو */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/list"
              className="text-slate-700 hover:text-neonBlue font-medium transition-all duration-200 hover:scale-105"
            >
              فهرست سالن‌ها
            </Link>

            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-slate-700 hover:text-neonBlue font-medium transition-all duration-200 hover:scale-105"
                >
                  <UserCircleIcon className="w-7 h-7 text-slate-600" />
                  <span>{user.name || user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-500 font-medium transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-neonBlue font-medium transition-all duration-200 hover:scale-105"
                >
                  ورود
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-modernGreen to-sportGreen text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-sportGreen hover:to-neonGreen transition-all duration-300 hover:scale-105 animate-glow"
                >
                  ثبت نام
                </Link>
              </div>
            )}
          </nav>

          {/* موبایل منو دکمه */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-glassDark transition-colors duration-200"
            aria-label="باز کردن منو"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-7 h-7 text-slate-700" />
            ) : (
              <Bars3Icon className="w-7 h-7 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* موبایل منو */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-glass/95 backdrop-blur-md border-t border-glass">
          <nav className="container mx-auto px-4 py-6 space-y-3">
            <Link
              to="/list"
              onClick={closeMobileMenu}
              className="block py-3 px-5 text-lg text-slate-700 hover:text-neonBlue font-medium rounded-xl hover:bg-white/50 transition-all"
            >
              فهرست سالن‌ها
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-3 px-5 text-lg text-slate-700 hover:text-neonBlue font-medium rounded-xl hover:bg-white/50 transition-all"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  پروفایل ({user.name || user.username})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 px-5 text-lg text-red-600 hover:text-red-500 font-medium rounded-xl hover:bg-red-50 transition-all"
                >
                  خروج از حساب
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block py-3 px-5 text-lg text-slate-700 hover:text-neonBlue font-medium rounded-xl hover:bg-white/50 transition-all"
                >
                  ورود به حساب
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="block text-center py-3.5 px-5 text-lg bg-gradient-to-r from-modernGreen to-sportGreen text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-sportGreen hover:to-neonGreen transition-all animate-glow"
                >
                  ثبت نام رایگان
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
