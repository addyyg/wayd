# wayd

The SMS API requires Firebase Application Default Credentials plus
`TWILIO_ACCOUT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, and
`SMS_RECIPIENT_NUMBER`. It accepts authenticated Firebase users and sends only
to the configured recipient.

Deploy `wayd/database.rules.json` with Firebase before relying on the database
access controls in production.
