// // app/emails/booking-confirmation.tsx
// export const generateBookingConfirmationEmail = (
//   bookingDetails: any,
//   qrDataUrl: string
// ) => {
//   // Extract just the base64 data from the data URL
//   const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');

//   return `
//   <!DOCTYPE html>
//   <html>
//   <head>
//     <meta charset="UTF-8">
//     <title>Lab Appointment Confirmation</title>
//     <style>
//       body {
//         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         line-height: 1.6;
//         color: #2d3748;
//         max-width: 650px;
//         margin: 0 auto;
//         padding: 25px;
//         background-color: #f7fafc;
//       }
//       .container {
//         background: white;
//         border-radius: 12px;
//         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
//         overflow: hidden;
//       }
//       .header {
//         background: linear-gradient(135deg, #37AFA2 0%, #2C9C91 100%);
//         color: white;
//         padding: 25px 30px;
//         text-align: center;
//       }
//       .header h1 {
//         margin: 0;
//         font-size: 26px;
//         font-weight: 600;
//       }
//       .content {
//         padding: 30px;
//       }
//       .card {
//         background: #f8f9fa;
//         padding: 20px;
//         border-radius: 8px;
//         margin-bottom: 25px;
//         border-left: 4px solid #37AFA2;
//       }
//       .section-title {
//         font-size: 18px;
//         margin: 18px 0 12px 0;
//         font-weight: 600;
//         color: #2d3748;
//       }
//       .footer {
//         margin-top: 35px;
//         font-size: 13px;
//         color: #718096;
//         text-align: center;
//         padding: 20px;
//         border-top: 1px solid #e2e8f0;
//       }
//       .booking-id {
//         background: #37AFA2;
//         color: white;
//         padding: 6px 12px;
//         border-radius: 6px;
//         font-size: 14px;
//         font-weight: 500;
//         display: inline-block;
//         margin-bottom: 15px;
//       }
//       .test-item {
//         margin-left: 20px;
//         margin-bottom: 6px;
//       }
//       .qr-container {
//         text-align: center;
//         margin: 25px 0;
//         padding: 15px;
//         background: white;
//         border-radius: 10px;
//         display: inline-block;
//         border: 1px solid #e2e8f0;
//         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//       }
//       .qr-label {
//         font-size: 13px;
//         color: #718096;
//         margin-top: 8px;
//       }
//       .info-row {
//         margin-bottom: 10px;
//         display: flex;
//       }
//       .info-label {
//         font-weight: 600;
//         min-width: 140px;
//       }
//       .track-link {
//         display: inline-block;
//         background: #37AFA2;
//         color: white;
//         padding: 10px 20px;
//         border-radius: 6px;
//         text-decoration: none;
//         font-weight: 500;
//         margin-top: 10px;
//       }
//       .track-link:hover {
//         background: #2C9C91;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <div class="header">
//         <h1>Your Lab Appointment is Confirmed!</h1>
//       </div>

//       <div class="content">
//         <div class="card">
//           <div class="section-title">Appointment Details</div>

//           <p><span class="booking-id">${bookingDetails.bookingId}</span></p>

//           <div class="info-row">
//             <span class="info-label">Patient Name:</span>
//             <span>${bookingDetails.patient.firstName} ${bookingDetails.patient.lastName}</span>
//           </div>

//           <div class="info-row">
//             <span class="info-label">Lab Name:</span>
//             <span>${bookingDetails.lab.name}</span>
//           </div>

//           <div class="info-row">
//             <span class="info-label">Appointment Date:</span>
//             <span>${bookingDetails.date}</span>
//           </div>

//           <div class="info-row">
//             <span class="info-label">Appointment Time:</span>
//             <span>${bookingDetails.time}</span>
//           </div>

//           <div style="text-align: center; margin: 25px 0;">
//             <div class="qr-container">
//               <img src="data:image/png;base64,${qrBase64}" alt="Booking QR Code" width="200" height="200" style="display: block; margin: 0 auto;" />
//               <div class="qr-label">Scan for booking details</div>
//             </div>
//           </div>

//           <div class="section-title">Tests Scheduled:</div>
//           <ul>
//             ${bookingDetails.tests
//               .map(
//                 (test: string) => `
//               <li class="test-item">${test}</li>
//             `
//               )
//               .join('')}
//           </ul>

//           ${
//             bookingDetails.addons?.length > 0
//               ? `
//             <div class="section-title">Additional Services:</div>
//             <ul>
//               ${bookingDetails.addons
//                 .map(
//                   (addon: string) => `
//                 <li class="test-item">${addon}</li>
//               `
//                 )
//                 .join('')}
//             </ul>
//           `
//               : ''
//           }
//         </div>

//         <p>You can track your report using the QR code above or by visiting:</p>
//         <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://labsphere.com'}/Trackreport?bookingId=${bookingDetails.bookingId}" class="track-link">
//           Track My Report
//         </a>
//       </div>

//       <div class="footer">
//         <p>If you have any questions, please contact our support team at support@labsphere.com</p>
//         <p>© ${new Date().getFullYear()} LabSphere. All rights reserved.</p>
//       </div>
//     </div>
//   </body>
//   </html>
//   `;
// };
