const QRCode = {
  toDataURL(text, opts = {}, cb) {
    const size = opts.width || 256;
    const url = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(text)}`;
    if (cb) cb(null, url);
    return Promise.resolve(url);
  }
};
export default QRCode;
