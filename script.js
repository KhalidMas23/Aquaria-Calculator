function calculateTotal() {
  let total = 0;

  const modelPrices = { s: 4000, standard: 5500, x: 7500 };
  const tankPrices = { "500": 1000, "1550": 2000, "3000": 3000 };
  const sensorPrice = 300;
  const filterPrices = { s: 200, standard: 300, x: 400 };
  const pumpPrice = 1200;
  const trenchingRates = { dirt: 10, rock: 20, limestone: 30 }; // per foot

  const model = document.getElementById("model").value;
  const tank = document.getElementById("tank").value;
  const sensor = document.getElementById("sensor").value;
  const filter = document.getElementById("filter").value;
  const pump = document.getElementById("pump").value;
  const trenchingType = document.getElementById("trenchingType").value;
  const trenchDistance = parseFloat(document.getElementById("trenchDistance").value) || 0;

  if (model) total += modelPrices[model];
  if (tank) total += tankPrices[tank];
  if (sensor) total += sensorPrice;
  if (filter) total += filterPrices[filter];
  if (pump) total += pumpPrice;
  if (trenchingType && trenchDistance > 0) total += trenchingRates[trenchingType] * trenchDistance;

  document.getElementById("total").textContent = total.toFixed(2);
}
