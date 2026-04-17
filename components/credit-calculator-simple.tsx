"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Send, Table, FileText, X } from 'lucide-react';

interface CreditCalculatorSimpleProps {
  initialMonto?: number;
  initialPlazo?: number;
  leadId: string;
  token: string;
  onClose?: () => void;
}

interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

const CreditCalculatorSimple = ({ 
  initialMonto = 50000, 
  initialPlazo = 12,
  leadId,
  token,
  onClose 
}: CreditCalculatorSimpleProps) => {
  const [creditAmount, setCreditAmount] = useState(initialMonto);
  // ✅ CORREGIDO: Convertir años a meses
  const [months, setMonths] = useState(initialPlazo * 12);
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);
  const [totalInterest, setTotalInterest] = useState(0);

  const interestRate = 11 / 100 / 12;
  const tasaAnual = 11;

  const plazoOptions = [
    { label: '6 meses', value: 6 },
    { label: '1 año', value: 12 },
    { label: '2 años', value: 24 },
    { label: '3 años', value: 36 },
    { label: '4 años', value: 48 },
    { label: '5 años', value: 60 }
  ];

  // Calcular préstamo (sin anticipo)
  const calculateLoan = () => {
    const netAmount = creditAmount;
    
    if (netAmount <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      return;
    }
    
    const payment = (netAmount * interestRate * Math.pow(1 + interestRate, months)) / 
                    (Math.pow(1 + interestRate, months) - 1);
    setMonthlyPayment(payment);
    
    const total = (payment * months) - netAmount;
    setTotalInterest(total);
  };

  useEffect(() => {
    calculateLoan();
  }, [creditAmount, months]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Generar tabla de amortización
  const generateAmortizationTable = (): AmortizationRow[] => {
    const netAmount = creditAmount;
    const monthlyPaymentValue = monthlyPayment;
    let balance = netAmount;
    const monthlyRate = interestRate;
    
    const rows: AmortizationRow[] = [];
    
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPaymentValue - interest;
      balance -= principal;

      rows.push({
        month,
        payment: monthlyPaymentValue,
        interest,
        principal,
        balance: Math.max(balance, 0)
      });
    }
    
    return rows;
  };

  // Descargar PDF
  const handleDownloadPDF = () => {
    const amortizationRows = generateAmortizationTable().slice(0, 12);
    
    let htmlContent = `
      <html>
        <head>
          <title>Simulación de Crédito - Caja Valladolid</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #059669; text-align: center; }
            h2 { color: #065f46; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #059669; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            .summary { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Caja Popular San Bernardino de Siena Valladolid</h1>
          <h2>Simulación de Crédito - Tasa ${tasaAnual}% Anual</h2>
          
          <div class="summary">
            <p><strong>Monto solicitado:</strong> ${formatCurrency(creditAmount)}</p>
            <p><strong>Plazo:</strong> ${months} meses</p>
            <p><strong>Mensualidad:</strong> ${formatCurrency(monthlyPayment)}</p>
            <p><strong>Interés total:</strong> ${formatCurrency(totalInterest)}</p>
            <p><strong>Total a pagar:</strong> ${formatCurrency(creditAmount + totalInterest)}</p>
          </div>
          
          <h3>Primeros 12 meses de amortización</h3>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Pago</th>
                <th>Interés</th>
                <th>Capital</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    amortizationRows.forEach(row => {
      htmlContent += `
        <tr>
          <td>${row.month}</td>
          <td>${formatCurrency(row.payment)}</td>
          <td>${formatCurrency(row.interest)}</td>
          <td>${formatCurrency(row.principal)}</td>
          <td>${formatCurrency(row.balance)}</td>
        </tr>
      `;
    });
    
    htmlContent += `
            </tbody>
          </table>
          <p style="text-align: center; margin-top: 30px; color: #666;">
            Esta simulación es informativa y puede variar según condiciones finales.
          </p>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert('Por favor, permite las ventanas emergentes para descargar el PDF');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}/update-from-calculator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          estimatedAmount: creditAmount,
          plazo: months,
          creditType: 'TRADITIONAL'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Solicitud actualizada correctamente');
        if (onClose) onClose();
        window.location.href = '/gracias';
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Completa tu solicitud
          </h1>
          <p className="text-gray-600">
            Ajusta los valores y confirma tu solicitud
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Monto */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto solicitado (MXN)
            </label>
            <input
              type="range"
              min="20000"
              max="5000000"
              step="5000"
              value={creditAmount}
              onChange={(e) => setCreditAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
            />
            <div className="text-center mt-4">
              <span className="text-3xl font-bold text-green-600">
                {formatCurrency(creditAmount)}
              </span>
            </div>
          </div>

          {/* Plazo */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plazo
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {plazoOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMonths(option.value)}
                  className={`py-3 px-2 rounded-lg transition-all ${
                    months === option.value
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-green-50 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Tu mensualidad sería</p>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(monthlyPayment)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Plazo: {months} meses • Tasa: {tasaAnual}% anual
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <button 
              onClick={() => setShowAmortizationModal(true)}
              className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
            >
              <Table className="w-4 h-4" />
              Ver tabla
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>

          {/* Botón confirmar */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Procesando...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Send className="w-5 h-5" />
                Confirmar solicitud
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Modal de tabla de amortización */}
      {showAmortizationModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
          onClick={() => setShowAmortizationModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Table className="w-6 h-6" />
                  Tabla de Amortización
                </h3>
                <p className="text-green-100 mt-1">
                  {formatCurrency(creditAmount)} a {months} meses • Tasa {tasaAnual}% anual
                </p>
              </div>
              <button
                onClick={() => setShowAmortizationModal(false)}
                className="p-2 hover:bg-green-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interés</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capital</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generateAmortizationTable().map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium">Mes {row.month}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-green-600">{formatCurrency(row.payment)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-orange-600">{formatCurrency(row.interest)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-blue-600">{formatCurrency(row.principal)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <strong>Total de pagos:</strong> {months} meses
              </div>
              <button
                onClick={() => setShowAmortizationModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #10b981, #059669);
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: white;
          border: 3px solid #10b981;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          transition: all 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
};

export default CreditCalculatorSimple;