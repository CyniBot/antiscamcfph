const express = require('express');
const app = express();

// --- Config ---
const LENGTH = 1000;
const INTERVAL_MS = 500;
const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const URL = 'https://script.google.com/macros/s/AKfycbyl8Pzkch8mEKpdIWYU8Tp6TlGc5X0xih5isHb5lM_z6f7o8qyFxkTs_g2nzzcrz0io/exec';

// --- State ---
let successCount = 0;
let totalCount = 0;

// --- Helper ---
const randomStr = (len) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

// --- Sender ---
const send = async () => {
  const value = randomStr(LENGTH);
  const body = `username=${value}&email=${value}%40g.com&password=${value}`;
  totalCount++;

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body
    });
    const json = await res.json();
    if (json.status === 'success') {
      successCount++;
      console.log(`[${new Date().toLocaleTimeString()}] SUCCESS (${successCount}/${totalCount}) | value: ${value}`);
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] FAILED | value: ${value} | response:`, json);
    }
  } catch (e) {
    console.error(`[${new Date().toLocaleTimeString()}] ERROR:`, e.message);
  }
};

// --- Dashboard ---
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sender Dashboard</title>
      <meta http-equiv="refresh" content="3">
      <style>
        body { font-family: monospace; background: #111; color: #0f0; padding: 40px; }
        h1 { color: #fff; }
        .box { font-size: 48px; margin: 20px 0; }
        .label { color: #888; font-size: 14px; }
      </style>
    </head>
    <body>
      <h1>Sender Dashboard</h1>
      <div class="label">Successful Sends</div>
      <div class="box">${successCount}</div>
      <div class="label">Total Attempts</div>
      <div class="box" style="font-size:32px">${totalCount}</div>
      <div class="label">Last updated: ${new Date().toLocaleTimeString()}</div>
    </body>
    </html>
  `);
});

// --- Start ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
  send(); // send immediately
  setInterval(send, INTERVAL_MS);
});
