import React, { useEffect, useState } from 'react';
import * as promptpay from 'promptpay-qr';
import QRCode from 'qrcode';

export default function PromptPayQRModal({ open, onClose, promptPayId, amount, onComplete }) {
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    if (open && promptPayId) {
      const payload = promptpay.generate(promptPayId, { amount });
      QRCode.toDataURL(payload, { width: 256 }, (err, url) => {
        if (!err) setQrImage(url);
      });
    }
  }, [open, promptPayId, amount]);

  if (!open) return null;

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2 text-center">โปรดสแกน QR Code เพื่อชำระเงิน</h2>
        <p className="text-xs text-gray-500 text-center mb-4">
          บางช่วงการอัปเดตยอดเข้าระบบอาจใช้ระยะเวลา 5 นาที
        </p>
        <div className="flex flex-col items-center mb-4">
          <div className="mb-2 font-bold text-blue-600">PromptPay</div>
          {qrImage && (
            <img
              src={qrImage}
              alt="PromptPay QR"
              className="w-48 h-48 bg-gray-100 rounded-lg"
            />
          )}
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>บัญชี</span>
          <span>{promptPayId}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-blue-600 font-semibold">ยอดชำระ</span>
          <span className="text-blue-700 font-bold">฿{amount.toFixed(2)}</span>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition"
          onClick={() => {
            if (onComplete) onComplete();
            onClose();
          }}
        >
          ตรวจสอบการชำระเงิน
        </button>
      </div>
    </div>
  );
}
