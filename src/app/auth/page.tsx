'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttonClick/mainButton';
import { InputText } from '@/components/input/text/mainInputText';
import { OtpModal } from '@/app/auth/component/OTP/otpModal';
import { handleLoginRequest } from '@/app/auth/request/handler/handlerReq';
import { handleVerifyOtp } from '@/app/auth/verify/handler/handlerVerify';
import { useErrorAlert } from '@/hooks/useErrorAlert';
import { USER_ROLES, checkAuth } from '@/global/globalAuth';

import Loading from '@/components/loading/mainLoading';

function ErrorAlertWrapper() {
  useErrorAlert();
  return null;
}

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [mousePosition] = useState({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await handleLoginRequest(email);
    if (result.success) {
      setVerifiedEmail(email);
      setShowOtpModal(true);
    }
    setLoading(false);
  };

  const handleOtpVerify = async (otp: string) => {
    setVerifyLoading(true);
    const result = await handleVerifyOtp(verifiedEmail, otp);
    setVerifyLoading(false);

    if (result.success) {
      setShowOtpModal(false);
      setShowLoginSuccess(true);

      setTimeout(() => {
        router.push('/main/carChecked');
      }, 2000);
    }
  };


  return (
    <>
      <Suspense fallback={null}>
        <ErrorAlertWrapper />
      </Suspense>
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 animate-fade-in">
        {/* Medical Theme Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-200/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-orange-200/20 rounded-full blur-[80px] animate-bounce duration-[5000ms]" />

        {/* Main Card */}
        <div className="w-full max-w-md relative z-10 px-4 animate-slide-up-card">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] animate-fade-in delay-200">

            {/* Header Section */}
            <div className="text-center mb-10 animate-slide-up-card delay-300">
              <div className="relative inline-block mb-6 group animate-scale-in delay-100">
                <div className="absolute inset-0 bg-red-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-500 text-white">
                  <span className="material-symbols-outlined text-6xl drop-shadow-sm"
                    style={{
                      fontVariationSettings: "'wght' 700",
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      transition: 'all 0.3s ease'
                    }}>
                    ambulance
                  </span>
                </div>
              </div>

              <h1 className="text-3xl text-gray-700 font-bold mb-2 animate-fade-in delay-400">
                ER Ready Check
              </h1>
              <p className="text-gray-600 text-sm font-bold animate-fade-in delay-500">
                ตรวจสอบความพร้อมรถพยาบาล โรงพยาบาลบางเลน
              </p>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up-card delay-600">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 ml-4">
                  กรุณาระบุ อีเมลที่สมัครใช้งาน
                </label>
                <InputText
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  maxWidth={400}
                  icon="mail"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="pastel"
                  size="md"
                  loading={loading}
                  disabled={loading}
                  className="w-[200px] sm:w-auto sm:min-w-[200px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl"
                  icon="login"
                >
                  เข้าสู่ระบบ
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center animate-fade-in delay-700">
              <p className="text-xs text-slate-400 font-bold">
                ระบบจัดทำโดย ทีมสารสนเทศโรงพยาบาลบางเลน
              </p>
            </div>
          </div>
        </div>

        <OtpModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={verifiedEmail}
          onVerify={handleOtpVerify}
          loading={verifyLoading}
        />


        {showLoginSuccess && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <Loading message="กำลังเข้าสู่ระบบ" delay={2000} fullScreen={false} />
          </div>
        )}
      </div>
    </>
  );
}