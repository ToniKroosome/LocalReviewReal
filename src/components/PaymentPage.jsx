import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PromptPayQRModal from './PromptPayQRModal';

const PaymentPage = ({ onBack, onComplete }) => {
  const [credits, setCredits] = useState(10);
  const [method, setMethod] = useState('qr'); // 'qr', 'stripe', 'paypal'
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' });
  const [completed, setCompleted] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [promptPayId, setPromptPayId] = useState('0801234567');
  const [accountName, setAccountName] = useState('ร้านค้าเดโม');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <header className="bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/50 p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back</span>
          </button>
          <h2 className="text-xl font-bold text-gray-100 ml-2">Buy Credits</h2>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Credit Amount</label>
          <input
            type="number"
            value={credits}
            onChange={e => setCredits(Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input type="radio" value="qr" checked={method==='qr'} onChange={() => setMethod('qr')} />
              QR Code
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" value="stripe" checked={method==='stripe'} onChange={() => setMethod('stripe')} />
              Stripe
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" value="paypal" checked={method==='paypal'} onChange={() => setMethod('paypal')} />
              PayPal
            </label>
          </div>
        </div>

        {method === 'qr' && (
          <div className="space-y-2 text-sm text-gray-400">
            <p>PromptPay QR code will be generated for {credits} credits.</p>
            <div className="space-y-1 text-gray-300">
              <label className="block">PromptPay ID</label>
              <input
                type="text"
                value={promptPayId}
                onChange={e => setPromptPayId(e.target.value)}
                className="w-40 px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
              />
              <label className="block mt-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                className="w-60 px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
              />
            </div>
          </div>
        )}
        {method === 'stripe' && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Card Number"
              value={card.number}
              onChange={e => setCard({ ...card, number: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                value={card.exp}
                onChange={e => setCard({ ...card, exp: e.target.value })}
                className="flex-1 px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="CVC"
                value={card.cvc}
                onChange={e => setCard({ ...card, cvc: e.target.value })}
                className="w-20 px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Pay with Card
            </button>
          </div>
        )}
        {method === 'paypal' && (
          <div className="space-y-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Pay with PayPal
            </button>
          </div>
        )}

        <button
          onClick={() => {
            if (method === 'qr') {
              setShowQRModal(true);
            } else {
              setCompleted(true);
              if (onComplete) onComplete(credits);
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4"
        >
          Complete Payment
        </button>

        {method === 'qr' && (
          <PromptPayQRModal
            open={showQRModal}
            onClose={() => setShowQRModal(false)}
            promptPayId={promptPayId}
            accountName={accountName}
            amount={credits}
            onComplete={() => {
              setCompleted(true);
              if (onComplete) onComplete(credits);
            }}
          />
        )}

        {completed && <p className="text-green-400">Payment successful!</p>}
      </main>
    </div>
  );
};

export default PaymentPage;
