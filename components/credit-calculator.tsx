"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Download, Table, Loader2, CreditCard, Calendar, Percent, X, FileText, Info } from 'lucide-react';

const CreditCalculator = () => {
  // Estados
  const [creditAmount, setCreditAmount] = useState(400000);
  const [years, setYears] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);
  
  // Resultados
  const [results, setResults] = useState({
    monthlyPayment: 0,
    advanceAmount: 0,
    totalInterest: 0
  });

  // Constantes
  const interestRate = 6.9 / 100 / 12;

  // Opciones de plazo
  const yearOptions = [4, 6, 8, 10, 12, 16, 20];

  // Calcular anticipo FIJO según tu tabla
  const calculateAdvance = (amount: number) => {
    if (amount >= 10000 && amount <= 30000) return 800;
    if (amount >= 40000 && amount <= 60000) return 900;
    if (amount >= 70000 && amount <= 90000) return 1000;
    if (amount >= 100000 && amount <= 120000) return 1100;
    if (amount >= 130000 && amount <= 150000) return 1200;
    if (amount >= 160000 && amount <= 180000) return 1250;
    if (amount >= 190000 && amount <= 200000) return 1300;
    if (amount >= 210000 && amount <= 240000) return 1350;
    if (amount >= 250000 && amount <= 280000) return 1400;
    if (amount >= 290000 && amount <= 320000) return 1450;
    if (amount >= 330000 && amount <= 360000) return 1500;
    if (amount >= 370000 && amount <= 400000) return 1500;
    if (amount >= 410000 && amount <= 440000) return 2000;
    if (amount >= 450000 && amount <= 470000) return 2500;
    if (amount >= 480000 && amount <= 500000) return 3000;
    if (amount >= 600000) return amount * 0.005; // 0.5% del monto
    return 0;
  };

  // Calcular préstamo
  const calculateLoan = () => {
    const advanceAmount = calculateAdvance(creditAmount);
    const netAmount = creditAmount - advanceAmount;
    const months = years * 12;
    
    const monthlyPayment = (netAmount * interestRate * Math.pow(1 + interestRate, months)) / 
                           (Math.pow(1 + interestRate, months) - 1);
    
    const totalInterest = (monthlyPayment * months) - netAmount;

    setResults({
      monthlyPayment,
      advanceAmount,
      totalInterest
    });
  };

  // Calcular al cambiar valores
  useEffect(() => {
    calculateLoan();
  }, [creditAmount, years]);

  // Manejar cálculo con animación
  const handleCalculate = () => {
    setIsLoading(true);
    setShowResults(false);
    
    setTimeout(() => {
      calculateLoan();
      setIsLoading(false);
      setShowResults(true);
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
    }, 1200);
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Generar tabla de amortización
  const generateAmortizationTable = () => {
    const advanceAmount = results.advanceAmount;
    const netAmount = creditAmount - advanceAmount;
    const months = years * 12;
    const monthlyPayment = results.monthlyPayment;
    let balance = netAmount;
    const monthlyRate = interestRate;
    
    const rows = [];
    
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;

      // Mostrar primeros 12 meses y luego cada año
      if (month <= 12 || month % 12 === 0 || month === months) {
        rows.push({
          month,
          payment: monthlyPayment,
          interest,
          principal,
          balance: Math.max(balance, 0)
        });
      }
    }
    
    return rows;
  };

  // Manejar descarga PDF
  const handleDownloadPDF = () => {
    alert('✅ Se está generando tu PDF...\n\nEn una implementación real, el PDF se descargaría automáticamente.');
  };

  return (
    <div id="calculadora" className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"> {/* ID AGREGADO AQUÍ */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simula tu crédito personalizado
          </h1>
          <p className="text-gray-600 text-lg">
            Ajusta los parámetros y calcula tu préstamo ideal
          </p>
        </div>

        {/* Calculadora - Centrada y LIMPIA */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Personaliza tu crédito
              </h2>
            </div>

            {/* Monto del crédito - SIN INFO DE ANTICIPO */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-800">
                  Monto del crédito
                </label>
                <div className="text-2xl md:text-3xl font-bold text-green-600">
                  {formatCurrency(creditAmount)}
                </div>
              </div>
              
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
              />
              
              <div className="flex justify-between text-sm text-gray-500 mt-3">
                <span>$10K</span>
                <span>$1M</span>
              </div>
            </div>

            {/* Plazo */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-gray-600" />
                <label className="text-lg font-semibold text-gray-800">
                  Plazo (años)
                </label>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    onClick={() => setYears(year)}
                    className={`py-3 px-2 rounded-lg transition-all ${
                      years === year
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {year} años
                  </button>
                ))}
              </div>
            </div>

            {/* Botón calcular */}
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculando tu crédito...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Calcular crédito personalizado
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Animación de carga */}
        {isLoading && (
          <div className="max-w-md mx-auto text-center mb-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Generando tu simulación personalizada...</p>
            <p className="text-gray-500 text-sm mt-2">Estamos calculando las mejores opciones para ti</p>
          </div>
        )}

        {/* Resultados - Aparece después de calcular */}
        {showResults && (
          <div 
            id="results-section"
            className="animate-fadeInUp"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Resultados de tu crédito
              </h2>
              <p className="text-gray-600">
                Resumen de tu préstamo personalizado
              </p>
            </div>

            {/* Tarjetas de resultados en HORIZONTAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Monto solicitado */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Monto solicitado</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(creditAmount)}
                </div>
                <div className="text-gray-500 text-sm">
                  Plazo: <span className="font-semibold">{years} años</span>
                </div>
              </div>

              {/* Mensualidad */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Mensualidad</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(results.monthlyPayment)}
                </div>
                <div className="text-gray-500 text-sm">
                  Pago mensual fijo
                </div>
              </div>

              {/* Anticipo */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Percent className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Anticipo</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(results.advanceAmount)}
                </div>
                <div className="text-gray-500 text-sm">
                  Monto fijo según tabla
                </div>
              </div>
            </div>

            {/* Interés total - Tarjeta grande */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 md:p-8 mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interés total</h3>
                  <p className="text-green-100">Costo total del crédito a lo largo del plazo</p>
                </div>
                <div className="text-4xl md:text-5xl font-bold mt-4 md:mt-0">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button 
                onClick={() => setShowAmortizationModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <Table className="w-5 h-5" />
                Ver tabla de amortización
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <FileText className="w-5 h-5" />
                Descargar PDF
              </button>
            </div>

            {/* Nota informativa */}
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <p className="text-gray-700 text-sm text-center">
                <strong>Nota:</strong> La tasa de interés es fija del 6.9% anual. 
                El anticipo cubre gastos administrativos y se descuenta del monto total. 
                Esta simulación es informativa y puede variar según condiciones finales.
              </p>
            </div>
          </div>
        )}

        {/* Modal de tabla de amortización - CORREGIDO */}
        {showAmortizationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden animate-scaleIn">
              {/* Header del modal */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Table className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Tabla de amortización</h2>
                </div>
                <button 
                  onClick={() => setShowAmortizationModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-8 overflow-auto max-h-[calc(85vh-80px)]">
                {/* Encabezado limpio */}
                <div className="mb-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Detalle de pagos mensuales
                  </h3>
                  <div className="inline-flex items-center gap-4 bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-gray-700">
                      <span className="font-semibold">Crédito:</span> {formatCurrency(creditAmount)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-700">
                      <span className="font-semibold">Plazo:</span> {years} años
                    </span>
                  </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                          Mes
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                          Pago mensual
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                          Interés
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                          Capital
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                          Saldo restante
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {generateAmortizationTable().map((row, index) => (
                        <tr 
                          key={row.month} 
                          className={`hover:bg-green-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {row.month}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-red-600">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-green-600">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Resumen */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Resumen total</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 font-semibold mb-2">Total pagado</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(creditAmount + results.totalInterest)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 font-semibold mb-2">Interés total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(results.totalInterest)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 font-semibold mb-2">Monto del crédito</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(creditAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cuadro de información CORREGIDO - SOLO TEXTO NECESARIO */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">
                        Esta tabla muestra los pagos mensuales estimados basados en una tasa de interés fija del 6.9% anual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer del modal - CORREGIDO */}
              <div className="sticky bottom-0 bg-green-50 p-4 border-t border-green-200 flex justify-between items-center">
                <div className="text-sm text-gray-700 font-medium">
                  Total de pagos: <span className="text-green-600">{years * 12} meses</span>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Exportar a PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estilos CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        /* Estilo del slider en VERDE */
        .slider-green {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #10b981, #059669);
        }
        
        .slider-green::-webkit-slider-thumb {
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
        
        .slider-green::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
        
        .slider-green::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: white;
          border: 3px solid #10b981;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CreditCalculator;