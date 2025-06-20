// Minimal PromptPay QR payload generator for Thai mobile numbers
export function generatePromptPayPayload(mobileNumber, amount) {
  let m = mobileNumber.replace(/[^0-9]/g, '');
  if (m.length === 10 && m.startsWith('0')) {
    m = '66' + m.substring(1);
  }
  let payload = `00020101021129370016A00000067701011101130066${m.length}${m}`;
  if (amount) {
    payload += `53037646304${Number(amount).toFixed(2).replace('.', '')}`;
  }
  payload += '6304';
  return payload;
}
