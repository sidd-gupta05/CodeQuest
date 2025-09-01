
// }

// app/api/send-confirmation/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import QRCode from 'qrcode';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { bookingDetails } = await request.json();

    if (!bookingDetails?.bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate QR code data
    const qrData = JSON.stringify({
      bookingId: bookingDetails.bookingId,
      labId: bookingDetails.lab.id,
      labName: bookingDetails.lab.name,
      date: bookingDetails.date,
      time: bookingDetails.time,
      tests: bookingDetails.tests,
      addons: bookingDetails.addons,
      patient: bookingDetails.patient,
      timestamp: new Date().toISOString(),
    });

    // Generate QR code as base64 data URL
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#37AFA2',
        light: '#ffffff',
      },
      width: 200,
      type: 'image/png',
    });

    const testEmail = 'siddharthgupta2482005@gmail.com';
    const targetEmail = 'siddharth2482005@gmail.com';

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Lab Appointment Confirmation</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          color: #37AFA2;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          margin: 15px 0 10px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
        .booking-id {
          background: #37AFA2;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }
        .test-item {
          margin-left: 20px;
        }
        .qr-container {
          text-align: center;
          margin: 20px 0;
          padding: 10px;
          background: white;
          border-radius: 8px;
          display: inline-block;
          border: 1px solid #ddd;
        }
        .qr-label {
          font-size: 12px;
          color: #777;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">Your Lab Appointment is Confirmed!</div>

      <div class="card">
        <div class="section-title">Appointment Details</div>

        <p><strong>Booking ID:</strong> <span class="booking-id">${bookingDetails.bookingId}</span></p>
        <p><strong>Patient Name:</strong> ${bookingDetails.patient.firstName} ${bookingDetails.patient.lastName}</p>
        <p><strong>Lab Name:</strong> ${bookingDetails.lab.name}</p>
        <p><strong>Appointment Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Appointment Time:</strong> ${bookingDetails.time}</p>

        <div style="text-align: center; margin: 20px 0;">
          <div class="qr-container">
            <img src="${qrDataUrl}" alt="Booking QR Code" width="200" height="200" style="display: block; margin: 0 auto;" />
            <div class="qr-label">Scan for booking details</div>
          </div>
        </div>

        <div class="section-title">Tests Scheduled:</div>
        <ul>
          ${bookingDetails.tests
            .map(
              (test: string) => `
            <li class="test-item">${test}</li>
          `
            )
            .join('')}
        </ul>

        ${
          bookingDetails.addons?.length > 0
            ? `
          <div class="section-title">Additional Services:</div>
          <ul>
            ${bookingDetails.addons
              .map(
                (addon: string) => `
              <li class="test-item">${addon}</li>
            `
              )
              .join('')}
          </ul>
        `
            : ''
        }
      </div>

      <p>You can track your report using the QR code above or by visiting:</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/Trackreport?bookingId=${bookingDetails.bookingId}"
           style="color: #37AFA2; text-decoration: underline;">
          Track My Report
        </a>
      </p>

      <div class="footer">
        <p>If you have any questions, please contact our support team at support@labsphere.com</p>
        <p>© ${new Date().getFullYear()} LabSphere. All rights reserved.</p>
        <p style="color: #999; font-size: 11px;">
          [This is a test email. In production, this would be sent to ${targetEmail}]
        </p>
      </div>
    </body>
    </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'LabSphere <onboarding@resend.dev>',
      to: testEmail,
      subject: `Lab Appointment Confirmation - ${bookingDetails.bookingId}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test confirmation sent to ${testEmail}`,
      data,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
