"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Send } from 'lucide-react';

interface CreditCalculatorSimpleProps {
  initialMonto?: number;
  initialPlazo?: number;
  leadId: string;
  token: string;
  onClose?: () => void;
}

const CreditCalculatorSimple = ({ 
  initialMonto = 50000, 
  initialPlazo = 8,
  leadId,
  token,
  onClose 
}: CreditCalculatorSimpleProps) => {
  const [creditAmount, setCreditAmount] = useState(initialMonto);
  const [years, setYears] = useState(initialPlazo);
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const interestRate = 11 / 100 / 12;
  const yearOptions = [4, 6, 8, 10, 12, 16, 20];

  // Calcular préstamo (sin anticipo)
  const calculateLoan = () => {
    const netAmount = creditAmount;
    const months = years * 12;
    
    if (netAmount <= 0) {
      setMonthlyPayment(0);
      return;
    }
    
    const payment = (netAmount * interestRate * Math.pow(1 + interestRate, months)) / 
                    (Math.pow(1 + interestRate, months) - 1);
    setMonthlyPayment(payment);
  };

  useEffect(() => {
    calculateLoan();
  }, [creditAmount, years]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
          plazo: years * 12,
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
              min="50000"
              max="5000000"
              step="50000"
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
              Plazo (años)
            </label>
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

          {/* Resultado */}
          <div className="bg-green-50 rounded-xl p-6 mb-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Tu mensualidad sería</p>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(monthlyPayment)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Plazo: {years} años ({years * 12} meses)
            </p>
          </div>

          {/* Botón */}
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