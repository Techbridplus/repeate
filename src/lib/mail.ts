import { Resend } from "resend";
import Email from "../../emails/VerificationEmail";
const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  try{
      await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      react: Email({ url: resetLink }),
    });
    console.log("Email sent successfully");
  }catch(err){
    console.log("Error in sending email : ",err);
  }
  
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  console.log("Email : ",email);
  try{
      await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Confirm your email",
      react: Email({ url: confirmLink }),
    });
  }catch(err){
    console.log("Error in sending email : ",err);
  }
  
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};
