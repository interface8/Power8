import { jsPDF } from "jspdf";
import type { Appliance, SolarConfig, SolarResults } from "@/types/solar";

export function generateSolarPDF(
  appliances: Appliance[],
  config: SolarConfig,
  results: SolarResults,
): Uint8Array {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // --- Header / Branding ---
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Power8 Solar Consultation", pageWidth / 2, 18, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Your Personalized Solar System Report", pageWidth / 2, 28, { align: "center" });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-NG", { dateStyle: "long" })}`, pageWidth / 2, 35, { align: "center" });

  y = 50;
  doc.setTextColor(0, 0, 0);

  // --- System Configuration ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("System Configuration", 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const configRows = [
    ["Location", config.location || "Not specified"],
    ["Peak Sun Hours", `${config.peakSunHours} hours`],
    ["System Voltage", `${config.systemVoltage}V`],
    ["Battery Type", config.batteryType],
    ["Days of Autonomy", String(config.daysOfAutonomy)],
    ["Panel Rating", `${config.panelRating}W`],
    ["Battery Unit", `${config.batteryUnitAh}Ah`],
    ["Usage Profile", config.usageProfile],
    ["Electricity Rate", `₦${config.electricityRate}/kWh`],
  ];

  for (const [label, value] of configRows) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 16, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 70, y);
    y += 6;
  }

  y += 6;

  // --- Appliance Table ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Appliances", 14, y);
  y += 8;

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(14, y - 4, pageWidth - 28, 7, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Name", 16, y);
  doc.text("Watts", 80, y);
  doc.text("Hours", 105, y);
  doc.text("Qty", 130, y);
  doc.text("Surge", 150, y);
  doc.text("Daily Wh", 172, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  for (const a of appliances) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const dailyWh = a.watts * a.hoursPerDay * a.quantity;
    doc.text(a.name.substring(0, 25), 16, y);
    doc.text(String(a.watts), 80, y);
    doc.text(String(a.hoursPerDay), 105, y);
    doc.text(String(a.quantity), 130, y);
    doc.text(`${a.surgeMultiplier}×`, 150, y);
    doc.text(dailyWh.toLocaleString(), 172, y);
    y += 6;
  }

  y += 8;

  // --- Results ---
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Solar System Recommendation", 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const resultRows = [
    ["Total Daily Consumption", `${results.totalDailyWh.toLocaleString()} Wh`],
    ["Solar Panels", `${results.numberOfPanels} × ${config.panelRating}W (${results.solarPanelWatts.toLocaleString()}W total)`],
    ["Inverter Size", `${results.inverterSize.toLocaleString()} W`],
    ["Battery Bank", `${results.numberOfBatteries} × ${config.batteryUnitAh}Ah (${results.batteryCapacityAh} Ah total)`],
    ["Monthly Production", `${(results.monthlyProductionWh / 1000).toFixed(0)} kWh`],
    ["Annual Production", `${(results.annualProductionWh / 1000).toFixed(0)} kWh`],
    ["Annual Savings", `₦${results.annualSavingsNGN.toLocaleString()}`],
    ["Estimated System Cost", `₦${results.estimatedSystemCost.toLocaleString()}`],
  ];

  for (const [label, value] of resultRows) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 16, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 75, y);
    y += 7;
  }

  y += 8;

  // --- Tips ---
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tips", 14, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const tips = [
    "Fridges cycle on/off — assume 12-16h runtime, not 24h.",
    "Use pure sine wave inverters for sensitive electronics.",
    `${config.safetyFactor}× safety factor to prevent system overload.`,
    `${((config.efficiencyLoss - 1) * 100).toFixed(0)}% buffer for dust, heat & wire losses.`,
    "Consult a certified solar installer for exact specifications.",
  ];

  for (const tip of tips) {
    doc.text(`• ${tip}`, 16, y);
    y += 5;
  }

  // --- Footer ---
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("This report is for estimation purposes. Actual requirements may vary.", pageWidth / 2, y, { align: "center" });
  doc.text("© Power8 Solar Energy Solutions", pageWidth / 2, y + 5, { align: "center" });

  return new Uint8Array(doc.output("arraybuffer"));
}
