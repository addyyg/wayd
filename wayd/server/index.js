const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const client = require('twilio')(
    process.env.TWILIO_ACCOUT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

const app = express();
initializeApp({ credential: applicationDefault() });
app.disable('x-powered-by');
app.use(express.json({ limit: '4kb' }));
const messageRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});

app.post('/api/messages', messageRateLimit, async (req, res) => {
    res.header('Content-Type', 'application/json');
    const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
    const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';

    if (!token) return res.status(401).json({ success: false });
    if (!body || body.length > 320) return res.status(400).json({ success: false });
    if (!process.env.TWILIO_PHONE_NUMBER || !process.env.SMS_RECIPIENT_NUMBER) {
      return res.status(503).json({ success: false });
    }

    try {
      await getAuth().verifyIdToken(token);
      await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.SMS_RECIPIENT_NUMBER,
        body
      });
      res.json({ success: true });
    } catch (err) {
      console.error('Message delivery failed:', err.message);
      res.status(401).json({ success: false });
    }
  });

app.listen(3001, '127.0.0.1', () =>
  console.log('Express server is running on localhost:3001')
);
