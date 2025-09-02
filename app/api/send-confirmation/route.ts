// // /api/send-confirmation/route.ts

// import { NextResponse } from 'next/server';
// import { Resend } from 'resend';
// import QRCode from 'qrcode';
// import { generateBookingConfirmationEmail } from '@/app/emails/booking-confirmation';

// const resend = new Resend(process.env.RESEND_API_KEY);

// const generateBookingId = (details: any): string => {
//   const { patientDetails, lab, tests, addons } = details;

//   try {
//     const timestamp = Date.now().toString(36).slice(-6).toUpperCase();
//     const firstNameInitial = patientDetails?.firstName?.charAt(0) || 'P';
//     const lastNameInitial = patientDetails?.lastName?.charAt(0) || 'X';
//     const patientInitials =
//       `${firstNameInitial}${lastNameInitial}`.toUpperCase();
//     const labCode = lab?.id
//       ?.toString()
//       .padStart(3, '0')
//       .slice(-3)
//       .toUpperCase();

//     const selectedTests = tests || [];
//     const testCode =
//       selectedTests.length > 0
//         ? selectedTests
//             .map((t: string) => t.charAt(0))
//             .join('')
//             .slice(0, 3)
//             .toUpperCase()
//         : 'GEN';

//     const selectedAddons = addons || [];
//     const servicesHash = [...selectedTests, ...selectedAddons]
//       .join('')
//       .split('')
//       .reduce((acc, char) => acc + char.charCodeAt(0), 0)
//       .toString(16)
//       .slice(-4)
//       .toUpperCase();

//     return `BK-${timestamp}-${patientInitials}-${labCode}-${testCode}-${servicesHash}`;
//   } catch (error) {
//     console.error('Fallback booking ID generated due to error:', error);
//     return `BK-${Date.now().toString(36).toUpperCase()}`;
//   }
// };

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { bookingDetails, userEmail } = body;

//     if (!bookingDetails || !userEmail) {
//       return NextResponse.json(
//         { error: 'Missing booking details or user email' },
//         { status: 400 }
//       );
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(userEmail)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     const bookingId = generateBookingId({
//       patientDetails: bookingDetails.patient,
//       lab: bookingDetails.lab,
//       tests: bookingDetails.tests,
//       addons: bookingDetails.addons,
//     });

//     const completeBookingDetails = {
//       ...bookingDetails,
//       bookingId,
//     };

//     const qrData = JSON.stringify({
//       bookingId: bookingId,
//       labId: completeBookingDetails.lab?.id,
//       labName: completeBookingDetails.lab?.name,
//       date: completeBookingDetails.date,
//       time: completeBookingDetails.time,
//       patientName: `${completeBookingDetails.patient?.firstName} ${completeBookingDetails.patient?.lastName}`,
//       timestamp: new Date().toISOString(),
//     });

//     // Generate QR code as data URL
//     const qrDataUrl = await QRCode.toDataURL(qrData, {
//       errorCorrectionLevel: 'H',
//       margin: 1,
//       color: { dark: '#37AFA2', light: '#ffffff' },
//       width: 200,
//       type: 'image/png',
//     });

//     const emailHtml = generateBookingConfirmationEmail(
//       completeBookingDetails,
//       qrDataUrl
//     );

//     const fromEmail = process.env.RESEND_VERIFIED_DOMAIN
//       ? `LabSphere <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`
//       : 'LabSphere <onboarding@resend.dev>'; // Use this only for testing

//     const { data, error } = await resend.emails.send({
//       from: fromEmail,
//       to: userEmail,
//       subject: `Lab Appointment Confirmation - ${bookingId}`,
//       html: emailHtml,
//     });

//     if (error) {
//       console.error('Resend API Error:', error);
//       return NextResponse.json(
//         { error: 'Failed to send confirmation email. Please try again later.' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Confirmation sent to ${userEmail}`,
//       bookingId: bookingId,
//       data,
//     });
//   } catch (error) {
//     console.error('Internal Server Error:', error);
//     return NextResponse.json(
//       { error: 'An unexpected error occurred.' },
//       { status: 500 }
//     );
//   }
// }
