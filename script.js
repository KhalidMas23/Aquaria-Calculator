function calculateTotal() {
  let subtotal = 0;

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
  const connection = document.getElementById("connection").value;
  const trenchingType = document.getElementById("trenchingType").value;
  const trenchDistance = parseFloat(document.getElementById("trenchDistance").value) || 0;
  const panelUpgrade = document.getElementById("panelUpgrade").value;

  const modelPrices = {
    s: { system: 9999, install: 6750, ship: 645, pad: 2750, mobility: 500 },
    standard: { system: 17499, install: 7450, ship: 1095, pad: 3250, mobility: 500 },
    x: { system: 29999, install: 8750, ship: 1550, pad: 4550, mobility: 1000 },
  };

  const tankPrices = {
    500: 770.9,
    1550: 1430.35,
    3000: 2428.9,
  };

  const tankPads = {
    500: 1850,
    1550: 2250,
    3000: 2550,
  };

  const cityDelivery = {
    "Austin": 999,
    "Corpus Christi": 858,
    "Dallas": 577.5,
    "Houston": 200,
    "San Antonio": 660,
  };

  const filterPrices = {
    s: 350,
    standard: 500,
    x: 700,
  };

  const pumpPrices = {
    dab: 1900,
    mini: 800,
    "": 0,
  };

  const trenchRates = {
    dirt: 54.5,
    rock: 59.5,
    limestone: 61.5,
    "": 0,
  };

  if (model) {
    subtotal += modelPrices[model].system;
    if (!unitOnly) {
      subtotal += modelPrices[model].install;
    }
    subtotal += modelPrices[model].ship;
    if (unitPad) subtotal += modelPrices[model].pad;
    if (mobility) subtotal += modelPrices[model].mobility;
  }

  if (tank) {
    subtotal += tankPrices[tank];
    if (tankPad) subtotal += tankPads[tank];
    subtotal += cityDelivery[city] || 0;
  }

  if (sensor === "normal") subtotal += 0;

  if (filter) subtotal += filterPrices[filter] || 0;

  subtotal += pumpPrices[pump] || 0;

  if (connection === "t-valve") subtotal += 75;

  subtotal += trenchRates[trenchingType] * trenchDistance;

  if (panelUpgrade === "panel") subtotal += 8000;

  subtotal += 500; // Admin fee

  const taxRate = 0.0825;
  const taxableItems = [
    modelPrices[model]?.system || 0,
    pumpPrices[pump] || 0,
    tankPrices[tank] || 0,
    filterPrices[filter] || 0,
    sensor === "normal" ? 0 : 0,
  ];

  const tax = taxableItems.reduce((sum, val) => sum + val, 0) * taxRate;

  const total = subtotal + tax;
  document.getElementById("total").textContent = total.toFixed(2);
  return total;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const date = new Date().toLocaleDateString("en-US");
  const total = document.getElementById("total").textContent;

  const logo = new Image();
  logo.src = "https://raw.githubusercontent.com/KhalidMas23/Aquaria-Calculator/8dc0a0fc0875cb830a78b1b9d2eee37c5048348a/AQ_LOGOPACK_RGB-04.png";

  logo.onload = function () {
    doc.addImage(logo, "PNG", 150, 10, 40, 15);

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Aquaria", 20, 15);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text("600 Congress Ave, Austin, TX 78701", 20, 21);
    doc.text(`Quote Generated: ${date}`, 20, 27);

    let y = 40;
    const addLine = (label, value) => {
      doc.setFont(undefined, 'normal');
      doc.text(`${label}: ${value}`, 25, y);
      y += 7;
    };

    const addSectionHeader = (title) => {
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.text(title, 20, y);
      y += 5;
      doc.setDrawColor(180);
      doc.line(20, y, 190, y);
      y += 5;
    };

    addSectionHeader("Product");
    addLine("Hydropack Model", document.getElementById("model").selectedOptions[0]?.text || "");
    addLine("Unit Only", document.getElementById("unitOnly").checked ? "Yes" : "No");
    addLine("Concrete Pad (unit)", document.getElementById("unitPad").checked ? "Yes" : "No");
    addLine("Mobility Assistance", document.getElementById("mobility").checked ? "Yes" : "No");

    addSectionHeader("Add-ons");
    addLine("Panel Upgrade", document.getElementById("panelUpgrade").value === "panel" ? "Yes" : "No");

    addSectionHeader("Additional Filters");
    addLine("Filter", document.getElementById("filter").selectedOptions[0]?.text || "");
    addLine("Pump", document.getElementById("pump").selectedOptions[0]?.text || "");
    addLine("Tank Sensor", document.getElementById("sensor").selectedOptions[0]?.text || "");

    addSectionHeader("Shipping / Handling");
    addLine("Tank", document.getElementById("tank").selectedOptions[0]?.text || "");https://github.com/KhalidMas23/Aquaria-Calculator/blob/main/script.js
    addLine("Delivery City", document.getElementById("city").selectedOptions[0]?.text || "");
    addLine("Connection Type", document.getElementById("connection").selectedOptions[0]?.text || "");

    addSectionHeader("Additional Services");
    addLine("Tank Concrete Pad", document.getElementById("tankPad").checked ? "Yes" : "No");
    addLine("Trenching Type", document.getElementById("trenchingType").selectedOptions[0]?.text || "");
    addLine("Trenching Distance (ft)", document.getElementById("trenchDistance").value);

    addSectionHeader("Admin & Processing Fee");

    addSectionHeader("Sales Tax");
    const salesTax = calculateTotal() - (calculateTotal() / (1 + 0.0825));
    addLine("8.25% Tax (included in total)", `$${salesTax.toFixed(2)}`);

    addSectionHeader("Total");
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(`Total Estimate: $${total}`, 20, y);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text("Thank you for your interest in Aquaria. This quote is valid for 30 days.", 20, 285);

    doc.save("Hydropack_Quote.pdf");
  };
}

