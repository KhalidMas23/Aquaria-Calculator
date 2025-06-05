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
const taxRate = 0.0825; // Applies to physical goods only (can be split later)

function calculateTotal() {
  let total = 0;

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

  // Hydropack model
  if (model) {
    total += modelPrices[model].system + modelPrices[model].shipping;
    if (!unitOnly) total += modelPrices[model].install;
    if (!unitOnly && unitPad) total += modelPrices[model].pad;
    if (!unitOnly && mobility) total += modelPrices[model].mobility;
  }

  // Tank
  if (tank) {
    total += tankPrices[tank];
    if (city) total += deliveryFees[city];
    if (tankPad) total += tankPads[tank];
  }

  // Tank sensor
  if (sensor) total += tankSensorCost;

  // Filter
  if (filter) total += filterPrices[filter];

  // Pump
  if (pump) total += pumpPrices[pump];

  // Connection
  total += connectionCost;

  // Trenching
  if (trenchType && trenchDistance > 0) {
    total += trenchRates[trenchType] * trenchDistance;
  }

  // Admin fee
  total += adminFee;

  document.getElementById("total").textContent = total.toFixed(2);
  return total;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const selections = {
    "Nearest City": document.getElementById("city").value,
    "Hydropack Model": document.getElementById("model").selectedOptions[0]?.text,
    "Unit Pad": document.getElementById("unitPad").checked ? "Yes" : "No",
    "Mobility Assistance": document.getElementById("mobility").checked ? "Yes" : "No",
    "Unit Only": document.getElementById("unitOnly").checked ? "Yes" : "No",
    "Tank": document.getElementById("tank").selectedOptions[0]?.text,
    "Tank Pad": document.getElementById("tankPad").checked ? "Yes" : "No",
    "Tank Sensor": document.getElementById("sensor").selectedOptions[0]?.text,
    "Extra Filter": document.getElementById("filter").selectedOptions[0]?.text,
    "External Pump": document.getElementById("pump").selectedOptions[0]?.text,
    "Connection Type": document.getElementById("connection").selectedOptions[0]?.text,
    "Trenching Type": document.getElementById("trenchingType").selectedOptions[0]?.text,
    "Trenching Distance (ft)": document.getElementById("trenchDistance").value,
    "Total Quote": `$${document.getElementById("total").textContent}`
  };

  let y = 20;
  doc.setFontSize(14);
  doc.text("Hydropack System Quote", 20, y);
  y += 10;

  doc.setFontSize(11);
  for (let [label, value] of Object.entries(selections)) {
    doc.text(`${label}: ${value}`, 20, y);
    y += 8;
  }

  doc.save("Hydropack_Quote.pdf");
}
