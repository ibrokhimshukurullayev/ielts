import { Resend } from "resend";

let resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendVerificationCodeEmail(email, code) {
  const { error } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: `${code} is your IELTStation verification code`,
    html: `
      <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto;">
        <h2 style="color: #1e1b4b;">Verify your email</h2>
        <p style="color: #475569;">Enter this code to continue creating your IELTStation account:</p>
        <p style="font-size: 32px; font-weight: 800; letter-spacing: 0.1em; color: #4f46e5;">${code}</p>
        <p style="color: #94a3b8; font-size: 12px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
