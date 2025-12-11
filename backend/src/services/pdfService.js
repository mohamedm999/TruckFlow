import PDFDocument from 'pdfkit';

/**
 * Generate PDF for a trip
 * @param {Object} trip - Trip object with populated truck and driver
 * @param {Object} fuelRecords - Fuel records for the trip
 * @returns {PDFDocument} PDF document stream
 */
export const generateTripPDF = (trip, fuelRecords = []) => {
  const doc = new PDFDocument({ margin: 50 });

  // Header
  doc.fontSize(20).text('Trip Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Trip ID: ${trip.tripId}`, { align: 'center' });
  doc.moveDown(2);

  // Trip Details
  doc.fontSize(14).text('Trip Information', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10);
  doc.text(`Status: ${trip.status}`);
  doc.text(`Truck: ${trip.truckId?.registrationNumber || 'N/A'} - ${trip.truckId?.brand || ''} ${trip.truckId?.model || ''}`);
  if (trip.trailerId) {
    doc.text(`Trailer: ${trip.trailerId?.registrationNumber || 'N/A'} - ${trip.trailerId?.type || ''}`);
  }
  doc.text(`Chauffeur: ${trip.chauffeurId?.firstName || ''} ${trip.chauffeurId?.lastName || ''}`);
  doc.moveDown();

  // Route
  doc.fontSize(14).text('Route', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10);
  doc.text(`From: ${trip.origin}`);
  doc.text(`To: ${trip.destination}`);
  doc.moveDown();

  // Schedule
  doc.fontSize(14).text('Schedule', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10);
  if (trip.plannedDeparture) {
    doc.text(`Planned Departure: ${new Date(trip.plannedDeparture).toLocaleString()}`);
  }
  if (trip.actualDeparture) {
    doc.text(`Actual Departure: ${new Date(trip.actualDeparture).toLocaleString()}`);
  }
  if (trip.actualArrival) {
    doc.text(`Actual Arrival: ${new Date(trip.actualArrival).toLocaleString()}`);
  }
  doc.moveDown();

  // Mileage
  doc.fontSize(14).text('Mileage', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10);
  if (trip.mileageStart) {
    doc.text(`Start: ${trip.mileageStart} km`);
  }
  if (trip.mileageEnd) {
    doc.text(`End: ${trip.mileageEnd} km`);
    if (trip.mileageStart) {
      doc.text(`Distance: ${trip.mileageEnd - trip.mileageStart} km`);
    }
  }
  doc.moveDown();

  // Fuel Records
  if (fuelRecords.length > 0) {
    doc.fontSize(14).text('Fuel Records', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    fuelRecords.forEach((record, index) => {
      doc.text(`${index + 1}. ${new Date(record.date).toLocaleDateString()} - ${record.liters}L @ ${record.pricePerLiter}€/L = ${record.totalCost}€`);
      doc.text(`   Odometer: ${record.odometer} km`);
    });
    
    const totalFuel = fuelRecords.reduce((sum, r) => sum + r.liters, 0);
    const totalCost = fuelRecords.reduce((sum, r) => sum + r.totalCost, 0);
    doc.moveDown();
    doc.text(`Total Fuel: ${totalFuel.toFixed(2)}L`);
    doc.text(`Total Cost: ${totalCost.toFixed(2)}€`);
    doc.moveDown();
  }

  // Notes
  if (trip.notes) {
    doc.fontSize(14).text('Notes', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(trip.notes);
  }

  // Footer
  doc.moveDown(2);
  doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });

  return doc;
};
