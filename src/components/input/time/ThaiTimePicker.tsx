'use client';

import { useState, useRef, useEffect } from 'react';

interface ThaiTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  inModal?: boolean;
}

export default function ThaiTimePicker({ 
  value, 
  onChange, 
  label, 
  required = false,
  error,
  inModal = false 
}: ThaiTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHour(h || '00');
      setMinute(m || '00');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleHourChange = (h: string) => {
    setHour(h);
    onChange(`${h}:${minute}`);
  };

  const handleMinuteChange = (m: string) => {
    setMinute(m);
    onChange(`${hour}:${m}`);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border ${error ? 'border-red-400' : 'border-gray-300'} rounded-lg font-bold text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 flex items-center justify-between hover:border-gray-400 transition-colors`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-500 text-lg">schedule</span>
          <span>{value || 'เลือกเวลา'}</span>
        </div>
        <span className="material-symbols-outlined text-gray-400">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {isOpen && (
        <div className={`absolute ${inModal ? 'z-[60]' : 'z-50'} mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg`}>
          <div className="p-4">
            <div className="flex gap-4 items-center justify-center">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-600 mb-2 text-center">
                  ชั่วโมง
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHourChange(h)}
                      className={`w-full px-3 py-2 text-sm font-bold text-center hover:bg-blue-50 transition-colors ${
                        hour === h ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-2xl font-bold text-gray-400">:</div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-600 mb-2 text-center">
                  นาที
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMinuteChange(m)}
                      className={`w-full px-3 py-2 text-sm font-bold text-center hover:bg-blue-50 transition-colors ${
                        minute === m ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(`${hour}:${minute}`);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
