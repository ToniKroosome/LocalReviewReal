import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import StripeCheckout from 'react-stripe-checkout';

const PaymentPage = ({ onBack, onComplete }) => {
  const [credits, setCredits] = useState(10);
  const [method, setMethod] = useState('stripe'); // 'stripe', 'paypal'
  const [completed, setCompleted] = useState(false);

  const handleStripeToken = token => {
    setCompleted(true);
    if (onComplete) onComplete(credits);
  };

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
                <input type="radio" value="stripe" checked={method==='stripe'} onChange={() => setMethod('stripe')} />
                Stripe
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" value="paypal" checked={method==='paypal'} onChange={() => setMethod('paypal')} />
                PayPal
              </label>
            </div>
          </div>
          {method === 'stripe' && (
            <div className="space-y-2">
              <StripeCheckout
                stripeKey="pk_test_placeholder"
                name="Demo Credits"
                amount={credits * 100}
                token={handleStripeToken}
              >
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Pay with Card
                </button>
              </StripeCheckout>
            </div>
          )}
        {method === 'paypal' && (
          <div className="space-y-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Pay with PayPal
            </button>
          </div>
        )}



        {completed && <p className="text-green-400">Payment successful!</p>}
      </main>
    </div>
  );
};

export default PaymentPage;
