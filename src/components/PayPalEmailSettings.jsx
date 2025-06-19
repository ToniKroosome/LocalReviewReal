import React, { useState } from 'react';

const PayPalEmailSettings = ({ initialEmail = '', initialVerified = false, onEmailChange, onVerified }) => {
  const [email, setEmail] = useState(initialEmail);
  const [verified, setVerified] = useState(initialVerified);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');

  const handleSendVerification = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setVerificationSent(true);
  };

  const handleVerify = () => {
    if (enteredCode === verificationCode) {
      setVerified(true);
      setVerificationSent(false);
      setVerificationCode('');
      if (onVerified) onVerified(true);
    } else {
      alert('Verification code does not match');
    }
  };

  const handleEmailBlur = () => {
    if (onEmailChange) {
      onEmailChange(email);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 space-y-2 mt-6">
      <h3 className="text-lg font-bold text-gray-100">PayPal Payment Setup</h3>
      <label className="block text-sm font-medium text-gray-300">PayPal Email</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={handleEmailBlur}
        className="w-full px-3 py-2 rounded-md bg-gray-700 text-sm focus:outline-none"
      />
      {verified ? (
        <p className="text-green-400 text-sm">Verified</p>
      ) : (
        <>
          <button
            onClick={handleSendVerification}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            {verificationSent ? 'Resend Code' : 'Send Verification Code'}
          </button>
          {verificationSent && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-400">
                Verification code sent (simulation). Enter it below:
              </p>
              <p className="text-xs text-gray-400">Code: {verificationCode}</p>
              <input
                type="text"
                value={enteredCode}
                onChange={e => setEnteredCode(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-sm focus:outline-none"
              />
              <button
                onClick={handleVerify}
                className="mt-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Verify
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PayPalEmailSettings;
