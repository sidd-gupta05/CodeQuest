// // components/Lab/revenue/PDFExportComponent.tsx
// import jsPDF from 'jspdf';

// interface PDFExportData {
//   computations: {
//     totalRevenue: number;
//     totalNetProfit: number;
//     totalEmployeeCosts: number;
//     totalOperatingCosts: number;
//     totalEquipmentCosts: number;
//     totalInventoryCosts: number;
//     totalAppointments: number;
//   };
//   filteredData: any[];
//   employee: any[];
//   selectedYear: number;
//   timeFilter: 'monthly' | 'yearly';
// }

// export const exportToPDF = async (
//   password: string,
//   labNablCertificate: string,
//   data: PDFExportData,
//   setIsDownloading: (loading: boolean) => void
// ): Promise<void> => {
//   setIsDownloading(true);

//   try {
//     // Validate password against the actual NABL certificate
//     if (
//       password.trim().toLowerCase() !== labNablCertificate.trim().toLowerCase()
//     ) {
//       alert('Invalid NABL certificate number. Please try again.');
//       setIsDownloading(false);
//       return;
//     }

//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     let yPosition = 20;

//     // try {
//     //   // This may not work in all jsPDF versions - it's limited
//     //   if (pdf.setEncryption) {
//     //     pdf.setEncryption({
//     //       userPassword: password,
//     //       ownerPassword: 'labsphere_secure',
//     //       permissions: {
//     //         printing: 'highResolution',
//     //         modifying: false,
//     //         copying: false,
//     //         annotating: false,
//     //         fillingForms: false,
//     //         contentAccessibility: false,
//     //         documentAssembly: false
//     //       }
//     //     });
//     //   }
//     // } catch (encryptionError) {
//     //   console.warn('PDF encryption not supported:', encryptionError);
//     //   // Continue without encryption
//     // }

//     // Use standard font
//     pdf.setFont('helvetica', 'normal');

//     // Header
//     pdf.setFontSize(20);
//     pdf.setTextColor(40, 40, 40);
//     pdf.text('Secure Sales Report', pdfWidth / 2, yPosition, {
//       align: 'center',
//     });
//     yPosition += 10;

//     pdf.setFontSize(12);
//     pdf.setTextColor(100, 100, 100);
//     pdf.text(`Year: ${data.selectedYear}`, 20, yPosition);
//     pdf.text(
//       `View: ${data.timeFilter === 'monthly' ? 'Monthly' : 'Yearly'}`,
//       pdfWidth - 20,
//       yPosition,
//       { align: 'right' }
//     );
//     yPosition += 8;

//     pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
//     yPosition += 8;

//     // Security notice
//     pdf.setTextColor(200, 0, 0);
//     pdf.text('CONFIDENTIAL - Lab Financial Data', pdfWidth / 2, yPosition, {
//       align: 'center',
//     });
//     yPosition += 15;

//     pdf.setDrawColor(200, 200, 200);
//     pdf.line(20, yPosition, pdfWidth - 20, yPosition);
//     yPosition += 20;

//     // Financial Summary
//     pdf.setFontSize(16);
//     pdf.setTextColor(40, 40, 40);
//     pdf.text('Financial Summary', 20, yPosition);
//     yPosition += 15;

//     pdf.setFontSize(12);
//     pdf.setTextColor(40, 40, 40);

//     // Custom number formatting without special characters
//     const formatNumber = (num: number) => {
//       return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     };

//     // Use "Rs." instead of ₹ symbol
//     const metrics = [
//       `Total Revenue: Rs. ${formatNumber(data.computations.totalRevenue || 0)}`,
//       `Total Net Profit: Rs. ${formatNumber(data.computations.totalNetProfit || 0)}`,
//       `Total Appointments: ${formatNumber(data.computations.totalAppointments || 0)}`,
//       `Profit Margin: ${Math.round(((data.computations.totalNetProfit || 0) / (data.computations.totalRevenue || 1)) * 100)}%`,
//     ];

//     metrics.forEach((metric) => {
//       if (yPosition > 250) {
//         pdf.addPage();
//         yPosition = 20;
//       }
//       pdf.text(metric, 25, yPosition);
//       yPosition += 8;
//     });

//     yPosition += 10;

//     // Cost Breakdown
//     if (yPosition > 230) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFontSize(16);
//     pdf.text('Cost Breakdown', 20, yPosition);
//     yPosition += 15;

//     pdf.setFontSize(12);
//     const totalCosts =
//       (data.computations.totalEmployeeCosts || 0) +
//       (data.computations.totalOperatingCosts || 0) +
//       (data.computations.totalEquipmentCosts || 0) +
//       (data.computations.totalInventoryCosts || 0);

//     const costs = [
//       `Employee Costs: Rs. ${formatNumber(data.computations.totalEmployeeCosts || 0)}`,
//       `Operating Costs: Rs. ${formatNumber(data.computations.totalOperatingCosts || 0)}`,
//       `Equipment Costs: Rs. ${formatNumber(data.computations.totalEquipmentCosts || 0)}`,
//       `Inventory Costs: Rs. ${formatNumber(data.computations.totalInventoryCosts || 0)}`,
//       `Total Costs: Rs. ${formatNumber(totalCosts)}`,
//     ];

//     costs.forEach((cost) => {
//       if (yPosition > 250) {
//         pdf.addPage();
//         yPosition = 20;
//       }
//       pdf.text(cost, 25, yPosition);
//       yPosition += 8;
//     });

//     yPosition += 15;

//     // Monthly/Yearly Data Table
//     if (yPosition > 220) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFontSize(16);
//     pdf.text(
//       data.timeFilter === 'monthly'
//         ? 'Monthly Financial Details'
//         : 'Annual Summary',
//       20,
//       yPosition
//     );
//     yPosition += 15;

//     // Table Headers
//     pdf.setFontSize(10);
//     pdf.setFillColor(240, 240, 240);
//     pdf.rect(20, yPosition, pdfWidth - 40, 8, 'F');
//     pdf.setTextColor(80, 80, 80);

//     const headers =
//       data.timeFilter === 'monthly'
//         ? ['Month', 'Revenue', 'Net Profit', 'Appointments', 'Employee Costs']
//         : ['Period', 'Revenue', 'Net Profit', 'Appointments', 'Employee Costs'];

//     const colWidths =
//       data.timeFilter === 'monthly'
//         ? [25, 30, 30, 25, 35]
//         : [30, 35, 35, 25, 40];
//     let xPosition = 22;

//     headers.forEach((header, index) => {
//       pdf.text(header, xPosition, yPosition + 6);
//       xPosition += colWidths[index];
//     });

//     yPosition += 12;

//     // Table Rows
//     pdf.setTextColor(40, 40, 40);
//     data.filteredData.forEach((dataItem) => {
//       if (yPosition > 270) {
//         pdf.addPage();
//         yPosition = 20;

//         // Add headers again on new page
//         pdf.setFillColor(240, 240, 240);
//         pdf.rect(20, yPosition, pdfWidth - 40, 8, 'F');
//         pdf.setTextColor(80, 80, 80);

//         xPosition = 22;
//         headers.forEach((header, index) => {
//           pdf.text(header, xPosition, yPosition + 6);
//           xPosition += colWidths[index];
//         });

//         yPosition += 12;
//         pdf.setTextColor(40, 40, 40);
//       }

//       xPosition = 22;
//       pdf.text(dataItem.month, xPosition, yPosition + 6);
//       xPosition += colWidths[0];
//       pdf.text(
//         `Rs. ${formatNumber(dataItem.revenue)}`,
//         xPosition,
//         yPosition + 6
//       );
//       xPosition += colWidths[1];
//       pdf.text(
//         `Rs. ${formatNumber(dataItem.netProfit)}`,
//         xPosition,
//         yPosition + 6
//       );
//       xPosition += colWidths[2];
//       pdf.text(dataItem.appointmentCount.toString(), xPosition, yPosition + 6);
//       xPosition += colWidths[3];
//       pdf.text(
//         `Rs. ${formatNumber(dataItem.employeeCosts)}`,
//         xPosition,
//         yPosition + 6
//       );

//       yPosition += 8;
//     });

//     // Employee Summary
//     yPosition += 15;
//     if (yPosition > 240) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFontSize(16);
//     pdf.text('Employee Summary', 20, yPosition);
//     yPosition += 15;

//     pdf.setFontSize(12);
//     pdf.text(`Total Employees: ${data.employee.length}`, 25, yPosition);
//     yPosition += 8;

//     const totalMonthlySalary = data.employee.reduce(
//       (sum, emp) => sum + emp.monthlySalary,
//       0
//     );
//     pdf.text(
//       `Total Monthly Salary: Rs. ${formatNumber(totalMonthlySalary)}`,
//       25,
//       yPosition
//     );
//     yPosition += 8;
//     pdf.text(
//       `Total Annual Salary: Rs. ${formatNumber(totalMonthlySalary * 12)}`,
//       25,
//       yPosition
//     );

//     // Department Breakdown
//     yPosition += 15;
//     if (yPosition > 220) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFontSize(16);
//     pdf.text('Department Breakdown', 20, yPosition);
//     yPosition += 15;

//     pdf.setFontSize(12);

//     // Group employees by department
//     const departmentBreakdown = data.employee.reduce(
//       (acc, emp) => {
//         if (!acc[emp.department]) {
//           acc[emp.department] = { totalSalary: 0, count: 0 };
//         }
//         acc[emp.department].totalSalary += emp.monthlySalary;
//         acc[emp.department].count += 1;
//         return acc;
//       },
//       {} as { [key: string]: { totalSalary: number; count: number } }
//     );

//     Object.entries(departmentBreakdown).forEach(([dept, deptData]) => {
//       const typedDeptData = deptData as { totalSalary: number; count: number };
//       if (yPosition > 270) {
//         pdf.addPage();
//         yPosition = 20;
//       }
//       pdf.text(
//         `${dept}: ${typedDeptData.count} employees, Rs. ${formatNumber(typedDeptData.totalSalary)}/month`,
//         25,
//         yPosition
//       );
//       yPosition += 8;
//     });

//     // Security Footer
//     yPosition += 15;
//     if (yPosition > 250) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFontSize(10);
//     pdf.setTextColor(150, 0, 0);
//     pdf.text('SECURITY NOTICE:', 20, yPosition);
//     yPosition += 6;
//     pdf.setTextColor(100, 100, 100);
//     pdf.text(
//       'This document contains confidential lab financial data.',
//       20,
//       yPosition
//     );
//     yPosition += 5;
//     pdf.text('Protected by NABL certificate authentication.', 20, yPosition);
//     yPosition += 5;
//     pdf.text(
//       'Unauthorized access or distribution is prohibited.',
//       20,
//       yPosition
//     );

//     pdf.save(`Secure_Sales_Report_${data.selectedYear}_${data.timeFilter}.pdf`);
//   } catch (error) {
//     console.error('Error generating secure PDF:', error);
//     alert('Failed to generate secure PDF report. Please try again.');
//   } finally {
//     setIsDownloading(false);
//   }
// };

// components/Lab/revenue/PDFExportComponent.tsx
import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib-with-encrypt';

interface PDFExportData {
  computations: {
    totalRevenue: number;
    totalNetProfit: number;
    totalEmployeeCosts: number;
    totalOperatingCosts: number;
    totalEquipmentCosts: number;
    totalInventoryCosts: number;
    totalAppointments: number;
  };
  filteredData: any[];
  employee: any[];
  selectedYear: number;
  timeFilter: 'monthly' | 'yearly';
}

export const exportToPDF = async (
  password: string,
  labNablCertificate: string,
  data: PDFExportData,
  setIsDownloading: (loading: boolean) => void
): Promise<void> => {
  setIsDownloading(true);

  try {
    // Validate password against the actual NABL certificate
    if (
      password.trim().toLowerCase() !== labNablCertificate.trim().toLowerCase()
    ) {
      alert('Invalid NABL certificate number. Please try again.');
      setIsDownloading(false);
      return;
    }

    // First create the PDF with jsPDF (existing functionality)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Use standard font
    pdf.setFont('helvetica', 'normal');

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Secure Sales Report', pdfWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Year: ${data.selectedYear}`, 20, yPosition);
    pdf.text(
      `View: ${data.timeFilter === 'monthly' ? 'Monthly' : 'Yearly'}`,
      pdfWidth - 20,
      yPosition,
      { align: 'right' }
    );
    yPosition += 8;

    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 8;

    // Security notice
    pdf.setTextColor(200, 0, 0);
    pdf.text('CONFIDENTIAL - Lab Financial Data', pdfWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 15;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pdfWidth - 20, yPosition);
    yPosition += 20;

    // Financial Summary
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Financial Summary', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);

    // Custom number formatting without special characters
    const formatNumber = (num: number) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Use "Rs." instead of ₹ symbol
    const metrics = [
      `Total Revenue: Rs. ${formatNumber(data.computations.totalRevenue || 0)}`,
      `Total Net Profit: Rs. ${formatNumber(data.computations.totalNetProfit || 0)}`,
      `Total Appointments: ${formatNumber(data.computations.totalAppointments || 0)}`,
      `Profit Margin: ${Math.round(((data.computations.totalNetProfit || 0) / (data.computations.totalRevenue || 1)) * 100)}%`,
    ];

    metrics.forEach((metric) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(metric, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Cost Breakdown
    if (yPosition > 230) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.text('Cost Breakdown', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    const totalCosts =
      (data.computations.totalEmployeeCosts || 0) +
      (data.computations.totalOperatingCosts || 0) +
      (data.computations.totalEquipmentCosts || 0) +
      (data.computations.totalInventoryCosts || 0);

    const costs = [
      `Employee Costs: Rs. ${formatNumber(data.computations.totalEmployeeCosts || 0)}`,
      `Operating Costs: Rs. ${formatNumber(data.computations.totalOperatingCosts || 0)}`,
      `Equipment Costs: Rs. ${formatNumber(data.computations.totalEquipmentCosts || 0)}`,
      `Inventory Costs: Rs. ${formatNumber(data.computations.totalInventoryCosts || 0)}`,
      `Total Costs: Rs. ${formatNumber(totalCosts)}`,
    ];

    costs.forEach((cost) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(cost, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 15;

    // Monthly/Yearly Data Table
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.text(
      data.timeFilter === 'monthly'
        ? 'Monthly Financial Details'
        : 'Annual Summary',
      20,
      yPosition
    );
    yPosition += 15;

    // Table Headers
    pdf.setFontSize(10);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, yPosition, pdfWidth - 40, 8, 'F');
    pdf.setTextColor(80, 80, 80);

    const headers =
      data.timeFilter === 'monthly'
        ? ['Month', 'Revenue', 'Net Profit', 'Appointments', 'Employee Costs']
        : ['Period', 'Revenue', 'Net Profit', 'Appointments', 'Employee Costs'];

    const colWidths =
      data.timeFilter === 'monthly'
        ? [25, 30, 30, 25, 35]
        : [30, 35, 35, 25, 40];
    let xPosition = 22;

    headers.forEach((header, index) => {
      pdf.text(header, xPosition, yPosition + 6);
      xPosition += colWidths[index];
    });

    yPosition += 12;

    // Table Rows
    pdf.setTextColor(40, 40, 40);
    data.filteredData.forEach((dataItem) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;

        // Add headers again on new page
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPosition, pdfWidth - 40, 8, 'F');
        pdf.setTextColor(80, 80, 80);

        xPosition = 22;
        headers.forEach((header, index) => {
          pdf.text(header, xPosition, yPosition + 6);
          xPosition += colWidths[index];
        });

        yPosition += 12;
        pdf.setTextColor(40, 40, 40);
      }

      xPosition = 22;
      pdf.text(dataItem.month, xPosition, yPosition + 6);
      xPosition += colWidths[0];
      pdf.text(
        `Rs. ${formatNumber(dataItem.revenue)}`,
        xPosition,
        yPosition + 6
      );
      xPosition += colWidths[1];
      pdf.text(
        `Rs. ${formatNumber(dataItem.netProfit)}`,
        xPosition,
        yPosition + 6
      );
      xPosition += colWidths[2];
      pdf.text(dataItem.appointmentCount.toString(), xPosition, yPosition + 6);
      xPosition += colWidths[3];
      pdf.text(
        `Rs. ${formatNumber(dataItem.employeeCosts)}`,
        xPosition,
        yPosition + 6
      );

      yPosition += 8;
    });

    // Employee Summary
    yPosition += 15;
    if (yPosition > 240) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.text('Employee Summary', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.text(`Total Employees: ${data.employee.length}`, 25, yPosition);
    yPosition += 8;

    const totalMonthlySalary = data.employee.reduce(
      (sum, emp) => sum + emp.monthlySalary,
      0
    );
    pdf.text(
      `Total Monthly Salary: Rs. ${formatNumber(totalMonthlySalary)}`,
      25,
      yPosition
    );
    yPosition += 8;
    pdf.text(
      `Total Annual Salary: Rs. ${formatNumber(totalMonthlySalary * 12)}`,
      25,
      yPosition
    );

    // Department Breakdown
    yPosition += 15;
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.text('Department Breakdown', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);

    // Group employees by department
    const departmentBreakdown = data.employee.reduce(
      (acc, emp) => {
        if (!acc[emp.department]) {
          acc[emp.department] = { totalSalary: 0, count: 0 };
        }
        acc[emp.department].totalSalary += emp.monthlySalary;
        acc[emp.department].count += 1;
        return acc;
      },
      {} as { [key: string]: { totalSalary: number; count: number } }
    );

    Object.entries(departmentBreakdown).forEach(([dept, deptData]) => {
      const typedDeptData = deptData as { totalSalary: number; count: number };
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(
        `${dept}: ${typedDeptData.count} employees, Rs. ${formatNumber(typedDeptData.totalSalary)}/month`,
        25,
        yPosition
      );
      yPosition += 8;
    });

    // Security Footer
    yPosition += 15;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(10);
    pdf.setTextColor(150, 0, 0);
    pdf.text('SECURITY NOTICE:', 20, yPosition);
    yPosition += 6;
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'This document contains confidential lab financial data.',
      20,
      yPosition
    );
    yPosition += 5;
    pdf.text('Protected by NABL certificate authentication.', 20, yPosition);
    yPosition += 5;
    pdf.text(
      'Unauthorized access or distribution is prohibited.',
      20,
      yPosition
    );

    // Convert jsPDF to bytes for encryption
    const pdfBytes = pdf.output('arraybuffer');
    
    // Load the PDF and encrypt it with pdf-lib-with-encrypt
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Encrypt the PDF with the NABL certificate as password
    const saveOptions: any = {
      useObjectStreams: false,
      addDefaultPage: false,
      userPassword: password,
      ownerPassword: 'labsphere_secure_' + Date.now(),
      permissions: {
        printing: 'lowResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false
      }
    };

    const encryptedPdfBytes = await pdfDoc.save(saveOptions);

    // Convert to regular Uint8Array for Blob compatibility
    const compatibleBytes = new Uint8Array(encryptedPdfBytes);

    // Create download
    const blob = new Blob([compatibleBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Secure_Sales_Report_${data.selectedYear}_${data.timeFilter}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating secure PDF:', error);
    alert('Failed to generate secure PDF report. Please try again.');
  } finally {
    setIsDownloading(false);
  }
};