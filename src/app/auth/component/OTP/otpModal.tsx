'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/modal/mainModal';
import { Button } from '@/components/buttonClick/mainButton';

import CidInput from '@/components/input/cid/mainInputCID';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => void;
  loading?: boolean;
}

export const OtpModal = ({ isOpen, onClose, email, onVerify, loading = false }: OtpModalProps) => {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (isOpen) {
      setOtp('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ยืนยัน OTP"
      contentClassName="!bg-white/80 !backdrop-blur-xl !border !border-white/50"
      icon={
        <span className="material-symbols-outlined text-5xl text-blue-400"
          style={{
            fontVariationSettings: "'wght' 700",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            transition: 'all 0.3s ease'
          }}>
          lock
        </span>
      }
    >
      <div className="space-y-6">
        <p className="text-center text-gray-600 text-sm font-bold">
          กรุณากรอกรหัส OTP 6 หลักที่ส่งไปยัง line หมอพร้อม หรือ email ที่คุณลงทะเบียน<br />
          <span className="font-bold text-gray-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center py-6 sm:py-0 scale-130 sm:scale-100">
            <CidInput
              value={otp}
              onChange={setOtp}
              pattern={[1, 1, 1, 1, 1, 1]}
              size="lg"
              disabled={loading}
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="pastel"
              customWidth={200}
              loading={loading}
              disabled={loading || otp.length !== 6}
              className="rounded-2xl text-white"
              icon="check_circle"
            >
              ยืนยัน
            </Button>
          </div>

          <p className="text-center text-red-400 text-xs font-bold">
            รหัส OTP มีอายุ 2 นาที ทุกครั้งที่ทำการขอ
          </p>
        </form>
      </div>
    </Modal>
  );
};
