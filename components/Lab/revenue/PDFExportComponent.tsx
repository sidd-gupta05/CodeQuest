// components/Lab/revenue/PDFExportComponent.tsx
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib-with-encrypt';
import Swal from 'sweetalert2';

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
  labNablCertificate: string,
  data: PDFExportData,
  setIsDownloading: (loading: boolean) => void
): Promise<void> => {
  setIsDownloading(true);

  try {
    // Show preparation alert
    await Swal.fire({
      title: 'Preparing Secure Report',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-700 mb-2 font-medium">Securing your financial data</p>
          <p class="text-gray-600 text-sm">Encrypting PDF with NABL certificate protection</p>
        </div>
      `,
      showConfirmButton: false,
      timer: 2000,
      background: '#f8fafc',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-xl border border-gray-200 shadow-2xl',
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // PDF creation code (same as before)...
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    pdf.setFont('helvetica', 'normal');

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

    pdf.setTextColor(200, 0, 0);
    pdf.text('CONFIDENTIAL - Lab Financial Data', pdfWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 15;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pdfWidth - 20, yPosition);
    yPosition += 20;

    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Financial Summary', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);

    const formatNumber = (num: number) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

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

    pdf.setTextColor(40, 40, 40);
    data.filteredData.forEach((dataItem) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;

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

    yPosition += 15;
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.text('Department Breakdown', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);

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

    const pdfBytes = pdf.output('arraybuffer');

    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
    });

    pdfDoc.encrypt({
      userPassword: labNablCertificate,
      ownerPassword: labNablCertificate + '_owner',
      permissions: {
        printing: 'lowResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false,
      },
    });

    const encryptedPdfBytes = await pdfDoc.save();

    const compatibleBytes = new Uint8Array(encryptedPdfBytes);

    const blob = new Blob([compatibleBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Secure_Sales_Report_${data.selectedYear}_${data.timeFilter}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    // await Swal.fire({
    //   title: 'Report Ready',
    //   html: `
    //     <div class="text-center">
    //       <div class="mb-4">
    //         <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
    //           <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    //           </svg>
    //         </div>
    //       </div>
    //       <p class="text-gray-700 mb-3 font-medium">Secure PDF Downloaded</p>
    //       <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
    //         <div class="flex items-center justify-center space-x-2 mb-1">
    //           <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
    //           </svg>
    //           <p class="text-sm font-medium text-amber-800">Password Protected</p>
    //         </div>
    //         <p class="text-xs text-amber-700">Use your NABL certificate to open the file</p>
    //       </div>
    //       <p class="text-gray-600 text-sm">File saved to your downloads</p>
    //     </div>
    //   `,
    //   confirmButtonText: 'Open File',
    //   showCancelButton: true,
    //   cancelButtonText: 'Close',
    //   confirmButtonColor: '#006A6A',
    //   cancelButtonColor: '#6b7280',
    //   background: '#f8fafc',
    //   color: '#1f2937',
    //   customClass: {
    //     popup: 'rounded-xl border border-gray-200 shadow-2xl',
    //     confirmButton: 'px-6 py-2.5 rounded-lg font-medium text-sm',
    //     cancelButton: 'px-6 py-2.5 rounded-lg font-medium text-sm',
    //   },
    // });
  } catch (error) {
    console.error('Error generating secure PDF:', error);
    await Swal.fire({
      title: 'Export Failed',
      html: `
        <div class="text-center">
          <div class="mb-3">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p class="text-gray-700 mb-2">Could not generate report</p>
          <p class="text-gray-600 text-sm">Please attempt the export again</p>
        </div>
      `,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#dc2626',
      background: '#f8fafc',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-xl border border-gray-200 shadow-2xl',
        confirmButton: 'px-6 py-2.5 rounded-lg font-medium text-sm',
      },
    });
  } finally {
    setIsDownloading(false);
  }
};
