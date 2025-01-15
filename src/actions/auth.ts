"use server"

import { prisma } from "@/lib/db";
import nodemailer from 'nodemailer'



export async function getAppUserId(clerkId: string) {
  try {
    console.log('Fetching userId for clerkId:', clerkId);
 

    const user = await prisma.user.findUnique({
        where: {
          clerkId: clerkId 
        },
      });
    console.log('User:', user);

    return user?.id ?? null;
  } catch (error) {
    console.error('Error fetching userId:', error);
    return null;
  }
}


// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function sendEmail(formData: FormData) {
//   const name = formData.get('name') as string
//   const email = formData.get('email') as string
//   const message = formData.get('message') as string

//   if (!name || !email || !message) {
//     return { error: 'All fields are required' }
//   }

//   try {
//     await resend.emails.send({
//       from: 'Contact Form <onboarding@resend.dev>',
//       to: 'shiva.khatri01@gmail.com',
//       subject: `New message from ${name}`,
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Message: ${message}
//       `,
//     })

//     return { success: true }
//   } catch (error) {
//     return { error: 'Failed to send email. Please try again.' }
//   }
// }


export const sendEmailAction = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: "shiva.khatri01@gmail.com",
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
};