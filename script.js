// Pricing data
const modelPrices = {
  s: { system: 9999, install: 6750, shipping: 645, pad: 2750, mobility: 500 },
  standard: { system: 17499, install: 7450, shipping: 1095, pad: 3250, mobility: 500 },
  x: { system: 29999, install: 8750, shipping: 1550, pad: 4550, mobility: 1000 }
};

const tankPrices = {
  "500": 770.9,
  "1550": 1430.35,
  "3000": 2428.9
};

const tankPads = {
  "500": 1850,
  "1550": 2250,
  "3000": 2550
};

const deliveryFees = {
  "Austin": 999,
  "Corpus Christi": 858,
  "Dallas": 577.5,
  "Houston": 200,
  "San Antonio": 660
};

const filterPrices = {
  s: 350,
  standard: 500,
  x: 700
};

const pumpPrices = {
  dab: 1900,
  mini: 800
};

const trenchRates = {
  dirt: 54.5,
  rock: 59.5,
  limestone: 61.5
};

const connectionCost = 75;
const tankSensorCost = 0;
const adminFee = 500;
const taxRate = 0.0825;
const panelUpgradeCost = 8000;

function calculateTotal() {
  let subtotal = 0;
  let taxable = 0;

  const model = document.getElementById("model").value;
  const unitOnly = document.getElementById("unitOnly").checked;
  const unitPad = document.getElementById("unitPad").checked;
  const mobility = document.getElementById("mobility").checked;
  const tank = document.getElementById("tank").value;
  const tankPad = document.getElementById("tankPad").checked;
  const city = document.getElementById("city").value;
  const sensor = document.getElementById("sensor").value;
  const filter = document.getElementById("filter").value;
  const pump = document.getElementById("pump").value;
  const trenchType = document.getElementById("trenchingType").value;
  const trenchDistance = parseFloat(document.getElementById("trenchDistance").value) || 0;
  const panelUpgrade = document.getElementById("panelUpgrade")?.checked;

  // Hydropack model
  if (model) {
    subtotal += modelPrices[model].system + modelPrices[model].shipping;
    taxable += modelPrices[model].system + modelPrices[model].shipping;
    if (!unitOnly) subtotal += modelPrices[model].install;
    if (!unitOnly && unitPad) subtotal += modelPrices[model].pad;
    if (!unitOnly && mobility) subtotal += modelPrices[model].mobility;
  }

  // Panel upgrade
  if (panelUpgrade) subtotal += panelUpgradeCost;

  // Tank
  if (tank) {
    subtotal += tankPrices[tank];
    taxable += tankPrices[tank];
    if (city) subtotal += deliveryFees[city];
    if (tankPad) subtotal += tankPads[tank];
  }

  // Tank sensor
  if (sensor) taxable += tankSensorCost;
  if (sensor) subtotal += tankSensorCost;

  // Filter
  if (filter) {
    subtotal += filterPrices[filter];
    taxable += filterPrices[filter];
  }

  // Pump
  if (pump) {
    subtotal += pumpPrices[pump];
    taxable += pumpPrices[pump];
  }

  // Connection
  subtotal += connectionCost;

  // Trenching
  if (trenchType && trenchDistance > 0) {
    subtotal += trenchRates[trenchType] * trenchDistance;
  }

  // Admin fee
  subtotal += adminFee;

  const salesTax = taxable * taxRate;
  const total = subtotal + salesTax;

  document.getElementById("total").textContent = total.toFixed(2);
  return total;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const date = new Date().toLocaleDateString("en-US");
  const total = document.getElementById("total").textContent;

  doc.setFontSize(14);
  doc.text("Aquaria", 20, 15);
  doc.setFontSize(10);
  doc.text("600 Congress Ave, Austin, TX 78701", 20, 21);
  doc.text(`Quote Generated: ${date}`, 20, 27);

  let y = 40;
  const addLine = (label, value) => {
    doc.text(`${label}: ${value}`, 20, y);
    y += 8;
  };

  doc.setFontSize(12);
  doc.text("Product", 20, y);
  y += 6;
  addLine("Hydropack Model", document.getElementById("model").selectedOptions[0]?.text || "");
  addLine("Unit Only", document.getElementById("unitOnly").checked ? "Yes" : "No");
  addLine("Concrete Pad (unit)", document.getElementById("unitPad").checked ? "Yes" : "No");
  addLine("Mobility Assistance", document.getElementById("mobility").checked ? "Yes" : "No");
  addLine("Panel Upgrade", document.getElementById("panelUpgrade")?.checked ? "Yes" : "No");

  doc.text("Additional Filters", 20, y += 10);
  addLine("Filter", document.getElementById("filter").selectedOptions[0]?.text || "");
  addLine("Pump", document.getElementById("pump").selectedOptions[0]?.text || "");
  addLine("Tank Sensor", document.getElementById("sensor").selectedOptions[0]?.text || "");

  doc.text("Shipping / Handling", 20, y += 10);
  addLine("Tank", document.getElementById("tank").selectedOptions[0]?.text || "");
  addLine("Delivery City", document.getElementById("city").selectedOptions[0]?.text || "");
  addLine("Connection Type", document.getElementById("connection").selectedOptions[0]?.text || "");

  doc.text("Additional Services", 20, y += 10);
  addLine("Tank Concrete Pad", document.getElementById("tankPad").checked ? "Yes" : "No");
  addLine("Trenching Type", document.getElementById("trenchingType").selectedOptions[0]?.text || "");
  addLine("Trenching Distance (ft)", document.getElementById("trenchDistance").value);

  doc.text("Admin & Processing Fee", 20, y += 10);
  addLine("Flat Fee", "$500.00");

  doc.text("Sales Tax", 20, y += 10);
  const calculatedTax = (parseFloat(document.getElementById("total").textContent) - (calculateTotal() - (calculateTotal() * taxRate))).toFixed(2);
  addLine("8.25% Tax (included in total)", `$${calculatedTax}`);

  doc.setFontSize(14);
  doc.text(`Total Estimate: $${total}`, 20, y += 12);

  doc.setFontSize(10);
  doc.text("Thank you for your interest in Aquaria. This quote is valid for 30 days.", 20, 285);

  doc.save("Hydropack_Quote.pdf");
}
