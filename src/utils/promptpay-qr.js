export function generate(id, opts = {}) {
  const amount = opts.amount;
  let digits = String(id).replace(/[^0-9]/g, '');
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = '66' + digits.slice(1);
  }
  const idType = digits.length >= 13 ? '02' : '01';
  const merchant = '0016A000000677010111' +
    (idType === '01'
      ? '01130066' + digits
      : '0213' + digits);
  let payload = '000201010211';
  payload += '29' + String(merchant.length).padStart(2, '0') + merchant;
  payload += '5303764';
  if (amount != null) {
    const strAmt = parseFloat(amount).toFixed(2);
    payload += '54' + String(strAmt.length).padStart(2, '0') + strAmt;
  }
  payload += '5802TH';
  const checksumPayload = payload + '6304';
  const crc = crc16(checksumPayload);
  return checksumPayload + crc;
}

function crc16(input) {
  let crc = 0xFFFF;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
