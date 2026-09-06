import { jsPDF } from 'jspdf';
import { BookingItem } from '../types';

export const generateNomadTicketPDF = (booking: BookingItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Background tint
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 0, 210, 297, 'F');

  // Header Banner - Pine Green
  doc.setFillColor(21, 128, 61); // #15803d
  doc.rect(0, 0, 210, 45, 'F');

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('THE HIMACHAL NOMAD', 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Boutique Mountain Journeys & Ground-Level Creator Guides | Manali, Himachal Pradesh', 15, 28);
  doc.text('Official Digital Boarding Pass & Traveler Guarantee Voucher', 15, 35);

  // Booking Reference Card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 52, 180, 50, 3, 3, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, 52, 180, 50, 3, 3, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.title, 22, 63);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Booking Ref: ${booking.bookingRef}`, 22, 71);
  doc.text(`Travel Date: ${booking.travelDate}`, 22, 78);
  doc.text(`Traveler: ${booking.primaryTraveler} (${booking.passengers} Person${booking.passengers > 1 ? 's' : ''})`, 22, 85);
  doc.text(`Contact: ${booking.contactEmail} | ${booking.contactPhone}`, 22, 92);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text(`STATUS: ${booking.status.toUpperCase()}`, 130, 68);
  
  if (booking.paidAmount < (booking.totalAmount || booking.paidAmount)) {
    doc.setTextColor(217, 119, 6);
    doc.text(`PAID ADVANCE (50%): INR ${booking.paidAmount.toLocaleString('en-IN')}`, 130, 74);
    doc.setTextColor(220, 38, 38);
    doc.text(`DUE ON ARRIVAL: INR ${(booking.totalAmount - booking.paidAmount).toLocaleString('en-IN')}`, 130, 80);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Total: INR ${booking.totalAmount.toLocaleString('en-IN')} | Via ${booking.paymentMethod}`, 130, 86);
    doc.text(`Issued: ${booking.paymentDate}`, 130, 92);
  } else {
    doc.setTextColor(217, 119, 6);
    doc.text(`PAID IN FULL: INR ${booking.paidAmount.toLocaleString('en-IN')}`, 130, 75);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Via ${booking.paymentMethod}`, 130, 83);
    doc.text(`Issued: ${booking.paymentDate}`, 130, 91);
  }

  // Customization breakdown if package
  let yPos = 110;
  if (booking.customizationDetails && (booking.customizationDetails.upgrades.length > 0 || booking.customizationDetails.addOns.length > 0)) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, yPos, 180, 38, 3, 3, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(15, yPos, 180, 38, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Custom Package Upgrades & Add-ons:', 22, yPos + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    let subY = yPos + 15;
    if (booking.customizationDetails.upgrades.length > 0) {
      doc.text(`• Lodging: ${booking.customizationDetails.upgrades.join(', ')}`, 22, subY);
      subY += 6;
    }
    if (booking.customizationDetails.addOns.length > 0) {
      doc.text(`• Experiences: ${booking.customizationDetails.addOns.join(', ')}`, 22, subY);
      subY += 6;
    }
    yPos += 45;
  } else if (booking.customDaySchedule && booking.customDaySchedule.length > 0) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, yPos, 180, 42, 3, 3, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(15, yPos, 180, 42, 3, 3, 'S');

    doc.setTextColor(20, 83, 45);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text("Monu's Tailored Custom Day-by-Day Schedule:", 22, yPos + 8);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    let schY = yPos + 14;
    booking.customDaySchedule.slice(0, 4).forEach((day) => {
      doc.text(`• Day ${day.dayNumber} (${day.title}): ${day.plan.substring(0, 60)}... [Stay: ${day.stay}]`, 22, schY);
      schY += 6;
    });
    yPos += 48;
  }

  // Creator's Field Guide Section
  doc.setFillColor(240, 253, 244); // Light Pine tint
  doc.roundedRect(15, yPos, 180, 75, 3, 3, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(15, yPos, 180, 75, 3, 3, 'S');

  doc.setTextColor(20, 83, 45);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("MONU'S GROUND-LEVEL FIELD GUIDE & ESSENTIALS", 22, yPos + 10);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const tips = [
    '1. High Altitude Preparation: In Spiti/Rohtang (>3,000m), drink 3-4 liters of water daily. Avoid alcohol on Day 1.',
    '2. What to Pack: Thermal base layer, windproof down jacket, sunglasses (UV index is extreme), power bank (batteries drain fast in cold).',
    '3. Cash & Connectivity: Kaza and Spiti have limited ATMs and UPI connectivity. Keep INR 4,000-6,000 in cash. BSNL / Jio work best.',
    '4. Local Pahadi Phrases: "Julley / Joolay" = Hello & Thank You in Spiti; "Pardaan" = Brother/Friend in Kullu/Manali.',
    '5. Respect Nature & Monasteries: Always walk clockwise around Chortens/Mani stones. Do not leave plastic behind.'
  ];

  let tipY = yPos + 18;
  tips.forEach((tip) => {
    doc.text(tip, 22, tipY);
    tipY += 10;
  });

  // Creator Weather Security Guarantee Clause
  const refundY = yPos + 82;
  doc.setFillColor(254, 243, 199); // Golden Hour tint
  doc.roundedRect(15, refundY, 180, 32, 3, 3, 'F');
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(15, refundY, 180, 32, 3, 3, 'S');

  doc.setTextColor(180, 83, 9);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CREATOR WEATHER SECURITY & FLEXIBILITY GUARANTEE', 22, refundY + 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 53, 15);
  doc.text('• Road Closure Protection: If Kunzum/Rohtang passes or Atal Tunnel are shut by administration, 100% trip credit is issued valid for 1 year.', 22, refundY + 15);
  doc.text('• Flexible Rescheduling: Modify dates up to 7 days before departure at zero fee.', 22, refundY + 21);
  doc.text('• 24/7 Creator Direct WhatsApp Helpline: +91 96532 40540 (Monu & Manali Team)', 22, refundY + 27);

  // Footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('The Himachal Nomad • Authentic Himalayan Expeditions & Mountain Hospitality • himachalnomad.com', 15, 290);

  // Download PDF file
  doc.save(`HimachalNomad-Pass-${booking.bookingRef}.pdf`);
};
