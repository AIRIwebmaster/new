import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const cleanText = (v: any) =>
  typeof v === 'string' ? v.trim() : '';

const safeFileName = (name: string) =>
  name.replace(/[^\w.\-()\s]/g, '_');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const firstName = cleanText(body.first_name);
    const lastName = cleanText(body.last_name);

    const fullName =
      cleanText(body.full_name) ||
      `${firstName} ${lastName}`.trim() ||
      'Applicant';

    const role =
      cleanText(body.role) ||
      cleanText(body.engagement_type) ||
      'Volunteer';

    const email = cleanText(body.email);

    const cvName = cleanText(body.cv_name) || `${fullName} CV.pdf`;
    const cvData = cleanText(body.cv_data);
    const cvType = cleanText(body.cv_type) || 'application/pdf';

    if (!cvData) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'No CV uploaded, email not sent.',
      });
    }

    const subject = `${fullName} ${role} Application`;

    // TRANSPORTER GOES HERE
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // SEND EMAIL GOES AFTER TRANSPORTER
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: ['careers@airifoundation.org', 'webmaster@airifoundation.org'],
      replyTo: email || undefined,
      subject,
      text: `
A new AIRI Foundation application CV has been submitted.

Applicant: ${fullName}
Role: ${role}
Email: ${email || 'Not provided'}

The applicant's CV is attached.
      `.trim(),
      attachments: [
        {
          filename: safeFileName(cvName),
          content: Buffer.from(cvData, 'base64'),
          contentType: cvType,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'CV email sent successfully.',
    });
  } catch (error) {
    console.error('CV EMAIL ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'CV email could not be sent.',
      },
      { status: 200 }
    );
  }
}