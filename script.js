function calculate() {
    const formula = document.getElementById("formula").value;
    const C0 = parseFloat(document.getElementById("initialCapital").value) || 0;
    const rate = parseFloat(document.getElementById("rate").value) / 100 || 0;
    const t = parseFloat(document.getElementById("time").value) || 0;
    const timeUnit = document.getElementById("timeUnit").value;
    const periodicContribution = parseFloat(document.getElementById("contribution")?.value) || 0;
    const finalCapital = parseFloat(document.getElementById("finalCapital")?.value) || 0;
  
    let timeInYears = t;
    if (timeUnit === "months") timeInYears = t / 12;
    if (timeUnit === "days") timeInYears = t / 365;
  
    let result = 0;
    let procedure = "";
  
    if (formula === "fixedRate") {
      result = C0 * Math.pow(1 + rate, timeInYears);
      procedure += `Fórmula: C(t) = C₀ * (1 + r)^t\n`;
      procedure += `C₀ = ${C0}, r = ${rate}, t = ${timeInYears}\n`;
      procedure += `Resultado: C(t) = ${result.toFixed(2)}\n`;
  
    } else if (formula === "noInitialCapital") {
      result = C0 * Math.exp(rate * timeInYears);
      procedure += `Fórmula: C(t) = C₀ * e^(r * t)\n`;
      procedure += `Resultado: C(t) = ${result.toFixed(2)}\n`;
  
    } else if (formula === "variableRate") {
      const rateFunction = prompt("Ingresa la función de r(t):");
      const r = math.parse(rateFunction).compile();
      const integral = trapezoidalIntegration((u) => r.evaluate({ t: u }), 0, timeInYears, 1000);
      result = C0 * Math.exp(integral);
      procedure += `Resultado: C(t) = ${result.toFixed(2)}\n`;
  
    } else if (formula === "periodicContribution") {
      result = C0 * Math.exp(rate * timeInYears) + periodicContribution * ((Math.exp(rate * timeInYears) - 1) / rate);
      procedure += `Resultado: C(t) = ${result.toFixed(2)}\n`;
  
    } else if (formula === "periodicVariableContribution") {
      const rateFunction = prompt("Ingresa la función de r(t):");
      const r = math.parse(rateFunction).compile();
      const integral1 = trapezoidalIntegration((u) => r.evaluate({ t: u }), 0, timeInYears, 1000);
      const integral2 = trapezoidalIntegration((s) => Math.exp(trapezoidalIntegration((u) => r.evaluate({ t: u }), s, timeInYears, 100)), 0, timeInYears, 100);
      result = C0 * Math.exp(integral1) + periodicContribution * integral2;
      procedure += `Resultado: C(t) = ${result.toFixed(2)}\n`;
  
    } else if (formula === "inverseRate") {
      result = Math.log(finalCapital / C0) / timeInYears;
      procedure += `Resultado: r = ${result.toFixed(4)}\n`;
    }
  
    document.getElementById("resultText").textContent = `El resultado es: ${result.toFixed(2)}`;
    document.getElementById("procedureText").textContent = procedure;
  }
  
  function trapezoidalIntegration(func, a, b, n) {
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 1; i < n; i++) {
      sum += func(a + i * h);
    }
    return (h / 2) * (func(a) + 2 * sum + func(b));
  }
  
  document.getElementById("calculate").addEventListener("click", calculate);
  