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

$1
  const addons = Array.from(document.querySelectorAll('input[name="addon"]:checked')).map(input => input.value);

  if (model) {
    subtotal += modelPrices[model].system + modelPrices[model].shipping;
    taxable += modelPrices[model].system + modelPrices[model].shipping;
    if (!unitOnly) subtotal += modelPrices[model].install;
    if (!unitOnly && unitPad) subtotal += modelPrices[model].pad;
    if (!unitOnly && mobility) subtotal += modelPrices[model].mobility;
  }

  $1
  addons.forEach(addon => {
    if (addon === "panel") subtotal += panelUpgradeCost;
  });

  if (tank) {
    subtotal += tankPrices[tank];
    taxable += tankPrices[tank];
    if (city) subtotal += deliveryFees[city];
    if (tankPad) subtotal += tankPads[tank];
  }

  if (sensor) taxable += tankSensorCost;
  if (sensor) subtotal += tankSensorCost;

  if (filter) {
    subtotal += filterPrices[filter];
    taxable += filterPrices[filter];
  }

  if (pump) {
    subtotal += pumpPrices[pump];
    taxable += pumpPrices[pump];
  }

  subtotal += connectionCost;

  if (trenchType && trenchDistance > 0) {
    subtotal += trenchRates[trenchType] * trenchDistance;
  }

  subtotal += adminFee;

  const salesTax = taxable * taxRate;
  const total = subtotal + salesTax;

  document.getElementById("total").textContent = total.toFixed(2);
  return total;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const logoImg = new Image();
  logoImg.src = "https://raw.githubusercontent.com/KhalidMas23/Aquaria-Calculator/main/AQ_LOGOPACK_RGB-04.png"; // Replace with your actual logo URL

  logoImg.onload = function () {
    const date = new Date().toLocaleDateString("en-US");
    const total = document.getElementById("total").textContent;

    doc.addImage(logoImg, 'PNG', 150, 10, 40, 15);
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
      doc.text(label, 20, y);
      doc.text(value, 190, y, { align: 'right' });
      y += 7;
    };

    const addSectionHeader = (title) => {
      doc.setFillColor(230);
      doc.rect(20, y, 170, 8, 'F');
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(title, 25, y + 6);
      y += 12;
    };

    $1
    if (addons.length > 0) {
      addSectionHeader("Add-Ons");
      addons.forEach(a => addLine("Addon", a === "panel" ? "Panel Upgrade" : a));
    }

    addSectionHeader("Additional Filters");
    addLine("Filter", document.getElementById("filter").selectedOptions[0]?.text || "");
    addLine("Pump", document.getElementById("pump").selectedOptions[0]?.text || "");
    addLine("Tank Sensor", document.getElementById("sensor").selectedOptions[0]?.text || "");

    addSectionHeader("Shipping / Handling");
    addLine("Tank", document.getElementById("tank").selectedOptions[0]?.text || "");
    addLine("Delivery City", document.getElementById("city").selectedOptions[0]?.text || "");
    addLine("Connection Type", document.getElementById("connection").selectedOptions[0]?.text || "");

    addSectionHeader("Additional Services");
    addLine("Tank Concrete Pad", document.getElementById("tankPad").checked ? "Yes" : "No");
    addLine("Trenching Type", document.getElementById("trenchingType").selectedOptions[0]?.text || "");
    addLine("Trenching Distance (ft)", document.getElementById("trenchDistance").value);

    addSectionHeader("Admin & Processing Fee");
    addLine("Flat Fee", "$500.00");

    addSectionHeader("Sales Tax");
    const calculatedTax = (parseFloat(document.getElementById("total").textContent) - (calculateTotal() - (calculateTotal() * taxRate))).toFixed(2);
    addLine("8.25% Tax (included in total)", `$${calculatedTax}`);

    addSectionHeader("Total");
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text("Total Estimate:", 20, y);
    doc.text(`$${total}`, 190, y, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text("Thank you for your interest in Aquaria. This quote is valid for 30 days.", 20, 285);

    doc.save("Hydropack_Quote.pdf");
  };
  };
}
