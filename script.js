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
  const filterQty = parseInt(document.getElementById("filterQty").value) || 1;
  const pump = document.getElementById("pump").value;
  const connection = document.getElementById("connection").value;
  const trenchingType = document.getElementById("trenchingType").value;
  const trenchDistance =
    parseFloat(document.getElementById("trenchDistance").value) || 0;
  const panelUpgrade = document.getElementById("panelUpgrade").value || 0;

  const modelPrices = {
    s: { system: 9999, install: 6750, ship: 645, pad: 2750, mobility: 500 },
    standard: {
      system: 17499,
      install: 7450,
      ship: 1095,
      pad: 3250,
      mobility: 500,
    },
    x: { system: 29999, install: 8750, ship: 1550, pad: 4550, mobility: 1000 },
  };

  const tankPrices = { 500: 770.9, 1550: 1430.35, 3000: 2428.9 };
  const tankPads = { 500: 1850, 1550: 2250, 3000: 2550 };
  const cityDelivery = {
    Austin: 999,
    "Corpus Christi": 858,
    Dallas: 577.5,
    Houston: 200,
    "San Antonio": 660,
  };
  const filterPrices = { s: 350, standard: 500, x: 700 };
  const pumpPrices = { dab: 1900, mini: 800, "": 0 };
  const trenchRates = { dirt: 54.5, rock: 59.5, limestone: 61.5, "": 0 };

  let taxable = 0;

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
    const tankCost = tankPrices[tank] || 0;
    subtotal += tankCost;
    taxable += tankCost;
    if (tankPad) subtotal += tankPads[tank] || 0;
    if (city && cityDelivery[city]) subtotal += cityDelivery[city];
  }

  if (sensor === "normal") {
    // Normal sensor is not taxable and has no cost
  }

  if (filter) {
    const filterCost = (filterPrices[filter] || 0) * filterQty;
    subtotal += filterCost;
    taxable += filterCost;
  }

  if (pump) {
    subtotal += pumpPrices[pump] || 0;
    taxable += pumpPrices[pump] || 0;
  }

  if (connection === "t-valve") subtotal += 75;

  subtotal += trenchRates[trenchingType] * trenchDistance;

  if (panelUpgrade === "panel") subtotal += 8000;
  if (panelUpgrade === "subpanel") subtotal += 3000;

  subtotal += 500; // Admin fee

  const taxRate = 0.0825;
  const tax = taxable * taxRate;
  const total = subtotal + tax;

  const totalDisplay = document.getElementById("total");
  if (totalDisplay) {
    totalDisplay.textContent = total.toFixed(2);
  } else {
    console.warn("Missing #total element to display result.");
  }

  return total;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const date = new Date().toLocaleDateString("en-US");
  const total = document.getElementById("total").textContent;

  const logo = new Image();
  logo.src =
    "https://raw.githubusercontent.com/KhalidMas23/Aquaria-Calculator/8dc0a0fc0875cb830a78b1b9d2eee37c5048348a/AQ_LOGOPACK_RGB-04.png";

  logo.onload = function () {
    doc.addImage(logo, "PNG", 150, 10, 40, 15);

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Aquaria", 20, 15);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("600 Congress Ave, Austin, TX 78701", 20, 21);
    doc.text(`Quote Generated: ${date}`, 20, 27);

    let y = 40;

    const addSectionHeader = (title) => {
      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.text(title, 20, y);
      y += 5;
      doc.setDrawColor(180);
      doc.line(20, y, 190, y);
      y += 5;
    };

    const addLine = (label, value) => {
      doc.setFont(undefined, "normal");
      doc.text(`${label}: ${value}`, 25, y);
      y += 7;
    };

    // Product Section
    addSectionHeader("Main Product");
    const model = document.getElementById("model").value;
    const modelText = model
      ? document.querySelector(`#model option[value='${model}']`).textContent
      : "None";
    addLine("Hydropack Model", modelText);

    // Additional Filters
    addSectionHeader("Additional Filters");
    const filter = document.getElementById("filter").value;
    const filterQty = parseInt(document.getElementById("filterQty").value) || 1;
    const filterText = filter
      ? document.querySelector(`#filter option[value='${filter}']`).textContent
      : "None";
    addLine("Extra Filter(s)", `${filterText} x${filterQty}`);

    // Shipping and Handling
    addSectionHeader("Shipping/Handling");
    const city = document.getElementById("city").value;
    addLine("Nearest City", city);

    // Additional Services
    addSectionHeader("Additional Services");
    doc.setFont(undefined, "bold");
    doc.text("Component", 25, y);
    doc.text("Qty", 90, y);
    doc.text("Description", 110, y);
    y += 7;
    doc.setFont(undefined, "normal");

    const addService = (component, qty, description) => {
      doc.text(component, 25, y);
      doc.text(String(qty), 90, y);
      doc.text(description, 110, y);
      y += 7;
    };

    if (document.getElementById("unitPad").checked) {
      addService("Unit Concrete Pad", 1, "Concrete base for main system");
    }
    if (document.getElementById("tankPad").checked) {
      addService("Tank Concrete Pad", 1, "Concrete base for tank support");
    }
    const trenchType = document.getElementById("trenchingType").value;
    const trenchDistance = document.getElementById("trenchDistance").value;
    if (trenchType && trenchDistance > 0) {
      addService(
        `Trenching (${trenchType})`,
        `${trenchDistance} ft`,
        "Underground piping trench"
      );
    }
    const connection = document.getElementById("connection").value;
    if (connection === "t-valve") {
      addService("Connection Type", 1, "Manual 2-way T-valve install");
    }
   
    const panelUpgrade = document.getElementById("panelUpgrade").value;
    if (panelUpgrade === "panel") {
      addService("Panel Upgrade", 1, "Electrical panel enhancement");
    } else if (panelUpgrade === "subpanel") {
      addService("Subpanel Upgrade", 1, "Electrical subpanel support");
    }

    // Admin Fee Section
    addSectionHeader("Admin & Processing Fee");

    // Tax Section
    addSectionHeader("8.25% Sales Tax");

    // Total
    doc.setFont(undefined, "bold");
    doc.setFontSize(14);
    doc.text(`Total: $${total}`, 20, y);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(
      "Thank you for your interest in Aquaria. This quote is valid for 30 days.",
      20,
      285
    );

    doc.save("Hydropack_Quote.pdf");
  };
}
