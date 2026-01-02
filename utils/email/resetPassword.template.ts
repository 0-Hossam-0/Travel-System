import { EmailTemplate } from "./email.types";

export const getOTPTemplate = (otp: string): EmailTemplate => ({
  subject: "Your Verification Code",
  message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center;">
      <h2 style="color: #333;">Verification Code</h2>
      <p style="color: #666; font-size: 16px;">Please use the following code to complete your password reset:</p>
      <div style="margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: blue; background: #f4f4f4; padding: 10px 20px; border-radius: 4px; border: 1px dashed #ccc;">
          ${otp}
        </span>
      </div>
      <p style="color: #999; font-size: 12px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `,
});
