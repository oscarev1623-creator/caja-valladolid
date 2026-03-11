"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Download, Table, Loader2, CreditCard, Calendar, Percent, X, FileText, Info, Zap, Shield, Smartphone, Send } from 'lucide-react';
import Image from 'next/image';
import { ContactFormModal } from './contact-form-modal';

// Interfaz para las filas de la tabla de amortización
interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

const CreditCalculator = () => {
  // Estados
  const [creditAmount, setCreditAmount] = useState(50000);
  const [years, setYears] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  
  // Resultados
  const [results, setResults] = useState({
    monthlyPayment: 0,
    advanceAmount: 0,
    totalInterest: 0
  });

  // Tasa de interés 11% anual
  const interestRate = 11 / 100 / 12; // 11% anual -> mensual

  // Opciones de plazo
  const yearOptions = [4, 6, 8, 10, 12, 16, 20];

  // Calcular anticipo por rangos
  const calculateAdvance = (amount: number) => {
    if (amount >= 50000 && amount <= 200000) {
      return 2308.23;
    } else if (amount > 200000 && amount <= 1000000) {
      return 6811.52;
    } else if (amount > 1000000 && amount <= 5000000) {
      return 9960.47;
    } else {
      return 0;
    }
  };

  // Calcular préstamo
  const calculateLoan = () => {
    const advanceAmount = calculateAdvance(creditAmount);
    const netAmount = creditAmount - advanceAmount;
    const months = years * 12;
    
    // Evitar división por cero si netAmount es negativo o cero
    if (netAmount <= 0) {
      setResults({
        monthlyPayment: 0,
        advanceAmount,
        totalInterest: 0
      });
      return;
    }
    
    const monthlyPayment = (netAmount * interestRate * Math.pow(1 + interestRate, months)) / 
                           (Math.pow(1 + interestRate, months) - 1);
    
    const totalInterest = (monthlyPayment * months) - netAmount;

    setResults({
      monthlyPayment,
      advanceAmount,
      totalInterest
    });
  };

  // Obtener el rango actual para mostrar
  const getCurrentRange = (amount: number) => {
    if (amount >= 50000 && amount <= 200000) {
      return "Crédito de $50,000 a $200,000 MXN";
    } else if (amount > 200000 && amount <= 1000000) {
      return "Crédito de $200,001 a $1,000,000 MXN";
    } else if (amount > 1000000 && amount <= 5000000) {
      return "Crédito de $1,000,001 a $5,000,000 MXN";
    } else {
      return "Rango no válido";
    }
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Generar tabla de amortización - CORREGIDO CON TIPO EXPLÍCITO
  const generateAmortizationTable = (): AmortizationRow[] => {
    const advanceAmount = results.advanceAmount;
    const netAmount = creditAmount - advanceAmount;
    const months = years * 12;
    const monthlyPayment = results.monthlyPayment;
    let balance = netAmount;
    const monthlyRate = interestRate;
    
    const rows: AmortizationRow[] = [];
    
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;

      // Mostrar todos los meses
      rows.push({
        month,
        payment: monthlyPayment,
        interest,
        principal,
        balance: Math.max(balance, 0)
      });
    }
    
    return rows;
  };

  // Función mejorada para descargar PDF
  const handleDownloadPDF = () => {
    // Crear contenido HTML para el PDF
    const amortizationRows = generateAmortizationTable().slice(0, 12); // Primeros 12 meses para el PDF
    
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
            .total { font-weight: bold; background: #f3f4f6; }
            .summary { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .oxxo-badge { background: #fbbf24; color: #000; padding: 5px 10px; border-radius: 20px; display: inline-block; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Caja Popular San Bernardino de Siena Valladolid</h1>
          <h2>Simulación de Crédito - Tasa 11% Anual</h2>
          
          <div class="summary">
            <p><strong>Monto solicitado:</strong> ${formatCurrency(creditAmount)}</p>
            <p><strong>Rango de crédito:</strong> ${getCurrentRange(creditAmount)}</p>
            <p><strong>Plazo:</strong> ${years} años (${years * 12} meses)</p>
            <p><strong>Mensualidad:</strong> ${formatCurrency(results.monthlyPayment)}</p>
            <p><strong>Anticipo (cuota fija por rango):</strong> ${formatCurrency(results.advanceAmount)}</p>
            <p><strong>Interés total:</strong> ${formatCurrency(results.totalInterest)}</p>
            <p><strong>Total a pagar:</strong> ${formatCurrency(creditAmount + results.totalInterest)}</p>
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
          <p style="text-align: center; margin-top: 20px; color: #059669; font-weight: bold;">
            Paga tu anticipo en más de 20,000 OXXOs en todo México
          </p>
        </body>
      </html>
    `;
    
    // Abrir en nueva ventana para imprimir/guardar como PDF
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

  return (
    <div id="calculadora" className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simula tu crédito personalizado en <span className="text-green-600">Pesos Mexicanos</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Ajusta los parámetros y calcula tu préstamo ideal en MXN
          </p>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Personaliza tu crédito en MXN
              </h2>
            </div>

            {/* Monto del crédito */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Monto del crédito (MXN)
                </label>
                <div className="text-2xl md:text-3xl font-bold text-green-600">
                  {formatCurrency(creditAmount)}
                </div>
              </div>
              
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
              />
              
              <div className="flex justify-between text-sm text-gray-500 mt-3">
                <span>$50,000 MXN</span>
                <span>$5,000,000 MXN</span>
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
                  Calcular crédito en MXN
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

        {/* Resultados */}
        {showResults && (
          <div 
            id="results-section"
            className="animate-fadeInUp"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Resultados de tu crédito en MXN
              </h2>
              <p className="text-gray-600">
                Resumen de tu préstamo personalizado en pesos mexicanos
              </p>
            </div>

            {/* Tarjetas de resultados */}
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
                <div className="text-xs text-gray-400 mt-2">
                  {getCurrentRange(creditAmount)}
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
                  Pago mensual fijo en MXN
                </div>
              </div>

              {/* Anticipo - POR RANGOS */}
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
                  Cuota fija por rango de crédito
                </div>
              </div>
            </div>

            {/* Interés total */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 md:p-8 mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interés total</h3>
                  <p className="text-green-100">Costo total del crédito en MXN a lo largo del plazo (tasa 11% anual)</p>
                </div>
                <div className="text-4xl md:text-5xl font-bold mt-4 md:mt-0">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>
            </div>

            {/* Alianza OXXO */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 mb-10 border border-amber-200 shadow-md">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Logo OXXO */}
                <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-md">
                  <img 
                    src="/oxxo.png" 
                    alt="OXXO" 
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML += `
                        <div class="text-amber-600 font-bold text-2xl">OXXO</div>
                      `;
                    }}
                  />
                </div>
                
                {/* Texto informativo */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    Paga tu anticipo en más de 20,000 OXXOs
                  </h3>
                  
                  <p className="text-gray-700 mb-4">
                    Gracias a nuestra alianza estratégica con <strong>OXXO</strong>, ahora puedes realizar el pago de tu anticipo de forma 
                    <strong> rápida, segura y sin complicaciones</strong> en cualquier sucursal OXXO de todo México.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 p-1 rounded-full">
                        <Smartphone className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Genera tu línea de captura</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 p-1 rounded-full">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Pago seguro y protegido</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 p-1 rounded-full">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Confirmación inmediata</span>
                    </div>
                  </div>
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
            <div className="p-6 bg-green-50 rounded-xl border border-green-200 mb-10">
              <p className="text-gray-700 text-sm text-center">
                <strong>Nota:</strong> La tasa de interés es fija del <strong>11% anual</strong> en pesos mexicanos (MXN). 
                El anticipo corresponde a una <strong>cuota fija por rango de crédito</strong> que cubre gastos administrativos y de gestión. 
                <br /><br />
                <span className="font-semibold text-amber-600">✅ Paga tu anticipo en cualquier OXXO de México.</span>
                Esta simulación es informativa y puede variar según condiciones finales.
              </p>
            </div>

            {/* BOTÓN DE SOLICITAR CRÉDITO - AHORA USA EL MODAL PROFESIONAL */}
            <div className="text-center mb-12">
              <button
                onClick={() => setShowFormModal(true)}
                className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 mx-auto"
              >
                <Send className="w-6 h-6" />
                Solicitar crédito
              </button>
              <p className="text-gray-500 text-sm mt-4">
                ¿Listo para dar el siguiente paso? Solicita tu crédito con la simulación que acabas de realizar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DEL FORMULARIO PROFESIONAL */}
      <ContactFormModal 
        isOpen={showFormModal} 
        onClose={() => setShowFormModal(false)} 
      />

      {/* Modal de tabla de amortización */}
      {showAmortizationModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fadeIn"
          onClick={() => setShowAmortizationModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Table className="w-6 h-6" />
                  Tabla de Amortización
                </h3>
                <p className="text-green-100 mt-1">
                  {formatCurrency(creditAmount)} a {years} años • Tasa {interestRate * 12}% anual
                </p>
                <p className="text-green-100 text-sm mt-1">
                  Anticipo: {formatCurrency(results.advanceAmount)} ({getCurrentRange(creditAmount)})
                </p>
              </div>
              <button
                onClick={() => setShowAmortizationModal(false)}
                className="p-2 hover:bg-green-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo del modal - Tabla */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago mensual</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interés</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generateAmortizationTable().map((row: AmortizationRow) => (
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

            {/* Footer del modal */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <strong>Total de pagos:</strong> {years * 12} meses
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

      {/* Estilos CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        
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