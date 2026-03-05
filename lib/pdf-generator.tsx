interface CreditData {
  amount: number
  termYears: number
  monthlyPayment: number
  totalPayment: number
  downPayment: number
  schedule: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }>
}

interface CryptoData {
  selectedCrypto: string
  loanAmountMXN: number
  termYears: number
  loanAmountCrypto: number
  monthlyPaymentCrypto: number
  totalPaymentCrypto: number
  monthlyPaymentMXN: number
  totalPaymentMXN: number
  cryptoPrice: number
  schedule: Array<{
    month: number
    paymentCrypto: number
    paymentMXN: number
    principal: number
    interest: number
    balance: number
  }>
}

const formatMXN = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value)

const formatCrypto = (value: number, symbol: string) => `${value.toFixed(6)} ${symbol}`

export function generatePDF(data: CreditData) {
  // Create a simple HTML document for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tabla de Amortización - Caja Valladolid</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0 0 10px 0;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .summary-item value {
          display: block;
          font-size: 20px;
          font-weight: bold;
          color: #2563eb;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px;
          text-align: right;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Caja Valladolid</h1>
        <p>Caja Popular San Bernardino de Siena Valladolid, S.C. de A.P. de R.L. de C.V.</p>
        <p>Registro: 29198</p>
        <h2 style="margin-top: 20px;">Tabla de Amortización</h2>
      </div>
      
      <div class="summary">
        <div class="summary-grid">
          <div class="summary-item">
            <label>Monto del Crédito</label>
            <value>${formatMXN(data.amount)}</value>
          </div>
          <div class="summary-item">
            <label>Plazo</label>
            <value>${data.termYears} años (${data.termYears * 12} meses)</value>
          </div>
          <div class="summary-item">
            <label>Tasa Anual</label>
            <value>6.9%</value>
          </div>
          <div class="summary-item">
            <label>Mensualidad</label>
            <value>${formatMXN(data.monthlyPayment)}</value>
          </div>
          <div class="summary-item">
            <label>Total a Pagar</label>
            <value>${formatMXN(data.totalPayment)}</value>
          </div>
          <div class="summary-item">
            <label>Anticipo</label>
            <value>${formatMXN(data.downPayment)}</value>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Pago</th>
            <th>Capital</th>
            <th>Interés</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${data.schedule
            .map(
              (row) => `
            <tr>
              <td>${row.month}</td>
              <td>${formatMXN(row.payment)}</td>
              <td>${formatMXN(row.principal)}</td>
              <td>${formatMXN(row.interest)}</td>
              <td>${formatMXN(row.balance)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Este documento es una simulación y no constituye una oferta vinculante.</p>
        <p>Para más información, visite nuestras oficinas o contacte con nosotros.</p>
        <p>www.cajavalladolid.com.mx</p>
      </div>
    </body>
    </html>
  `

  // Create a new window with the HTML content
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

export function generateCryptoPDF(data: CryptoData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Crédito Cripto - Caja Valladolid</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0 0 10px 0;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .warning {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .warning p {
          margin: 0;
          color: #92400e;
          font-weight: 600;
        }
        .summary {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .summary-item value {
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
        }
        .summary-item small {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 11px;
        }
        th, td {
          padding: 10px;
          text-align: right;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Caja Valladolid</h1>
        <p>Caja Popular San Bernardino de Siena Valladolid, S.C. de A.P. de R.L. de C.V.</p>
        <p>Registro: 29198</p>
        <h2 style="margin-top: 20px;">Crédito en Criptomonedas</h2>
      </div>
      
      <div class="warning">
        <p>⚠️ IMPORTANTE: Los pagos se calculan al precio actual de la criptomoneda. El precio puede variar durante el plazo del crédito.</p>
      </div>
      
      <div class="summary">
        <div class="summary-grid">
          <div class="summary-item">
            <label>Monto del Crédito</label>
            <value>${formatCrypto(data.loanAmountCrypto, data.selectedCrypto)}</value>
            <small>${formatMXN(data.loanAmountMXN)}</small>
          </div>
          <div class="summary-item">
            <label>Precio ${data.selectedCrypto}</label>
            <value>${formatMXN(data.cryptoPrice)}</value>
          </div>
          <div class="summary-item">
            <label>Plazo</label>
            <value>${data.termYears} años (${data.termYears * 12} meses)</value>
          </div>
          <div class="summary-item">
            <label>Tasa Anual</label>
            <value>6.9%</value>
          </div>
          <div class="summary-item">
            <label>Mensualidad</label>
            <value>${formatCrypto(data.monthlyPaymentCrypto, data.selectedCrypto)}</value>
            <small>${formatMXN(data.monthlyPaymentMXN)}</small>
          </div>
          <div class="summary-item">
            <label>Total a Pagar</label>
            <value>${formatCrypto(data.totalPaymentCrypto, data.selectedCrypto)}</value>
            <small>${formatMXN(data.totalPaymentMXN)}</small>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Pago (${data.selectedCrypto})</th>
            <th>Pago (MXN)</th>
            <th>Capital</th>
            <th>Interés</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${data.schedule
            .map(
              (row) => `
            <tr>
              <td>${row.month}</td>
              <td>${formatCrypto(row.paymentCrypto, data.selectedCrypto)}</td>
              <td>${formatMXN(row.paymentMXN)}</td>
              <td>${formatCrypto(row.principal, data.selectedCrypto)}</td>
              <td>${formatCrypto(row.interest, data.selectedCrypto)}</td>
              <td>${formatCrypto(row.balance, data.selectedCrypto)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Este documento es una simulación y no constituye una oferta vinculante.</p>
        <p>Los valores en pesos mexicanos son aproximados y basados en el precio actual de la criptomoneda.</p>
        <p>Para más información, visite nuestras oficinas o contacte con nosotros.</p>
        <p>www.cajavalladolid.com.mx</p>
      </div>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}
