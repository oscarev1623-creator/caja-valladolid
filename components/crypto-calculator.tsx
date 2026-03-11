"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Bitcoin, DollarSign, Percent, Download, Zap, Shield, TrendingDown, MessageSquare, UserCheck, Loader2, Send } from 'lucide-react';
import Image from "next/image";
import { CryptoContactFormModal } from "./crypto-contact-form-modal";

const CryptoCreditCalculator = () => {
  // Estados
  const [creditAmount, setCreditAmount] = useState(10000);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [years, setYears] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // ESTADO PARA EL MODAL
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  
  // Resultados
  const [results, setResults] = useState({
    monthlyPayment: 0,
    advanceAmount: 0,
    totalInterest: 0,
    netAmount: 0
  });

  // Constantes
  const interestRate = 5.4 / 100 / 12; // 5.4% anual -> mensual

  // Opciones de plazo
  const yearOptions = [6, 12, 18, 24, 36, 48];

  // Criptomonedas disponibles para crédito - CON LOGOS - ORDEN PERSONALIZADO
  const cryptocurrencies = [
    { 
      id: 'BTC', 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      color: 'from-orange-500 to-yellow-500',
      icon: '/crypto-logos/bitcoin.png',
      stablecoin: false,
      description: 'Valor variable'
    },
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      symbol: 'ETH', 
      color: 'from-purple-500 to-blue-500',
      icon: '/crypto-logos/eth.png',
      stablecoin: false,
      description: 'Valor variable'
    },
    { 
      id: 'BNB', 
      name: 'Binance Coin', 
      symbol: 'BNB', 
      color: 'from-yellow-500 to-orange-500',
      icon: '/crypto-logos/bnb.png',
      stablecoin: false,
      description: 'Valor variable'
    },
    { 
      id: 'SOL', 
      name: 'Solana', 
      symbol: 'SOL', 
      color: 'from-pink-500 to-purple-500',
      icon: '/crypto-logos/sol.png',
      stablecoin: false,
      description: 'Valor variable'
    },
    { 
      id: 'USDT', 
      name: 'Tether', 
      symbol: 'USDT', 
      color: 'from-green-500 to-emerald-600',
      icon: '/crypto-logos/usdt.png',
      stablecoin: true,
      description: 'Estable 1:1 con USD'
    }
  ];

  // Calcular anticipo al 10% del monto
  const calculateAdvance = (amount: number) => {
    return amount * 0.10;
  };

  // Convertir a criptomoneda seleccionada (simulado)
  const convertToCrypto = (amountUSD: number, crypto: string) => {
    const rates: Record<string, number> = {
      'USDT': 1,
      'BTC': 0.000025,
      'ETH': 0.0005,
      'BNB': 0.002,
      'SOL': 0.04
    };
    
    return amountUSD * (rates[crypto] || 1);
  };

  // Calcular préstamo
  const calculateLoan = () => {
    const advanceAmount = calculateAdvance(creditAmount);
    const netAmount = creditAmount - advanceAmount;
    const months = years;
    
    const monthlyPayment = (netAmount * interestRate * Math.pow(1 + interestRate, months)) / 
                           (Math.pow(1 + interestRate, months) - 1);
    
    const totalInterest = (monthlyPayment * months) - netAmount;

    setResults({
      monthlyPayment,
      advanceAmount,
      totalInterest,
      netAmount
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
        document.getElementById('crypto-credit-results')?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 100);
    }, 1200);
  };

  // FUNCIÓN PARA ABRIR EL FORMULARIO
  const handleOpenForm = () => {
    setIsLeadFormOpen(true);
  };

  // Formatear moneda en USDT
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + " USDT";
  };

  // Formatear en criptomoneda seleccionada
  const formatCrypto = (amountUSD: number) => {
    const cryptoAmount = convertToCrypto(amountUSD, selectedCrypto);
    const crypto = cryptocurrencies.find(c => c.id === selectedCrypto);
    
    if (selectedCrypto === 'USDT') {
      return formatCurrency(amountUSD);
    }
    
    return `${cryptoAmount.toFixed(6)} ${crypto?.symbol}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header CON LOGO DE BITCOIN */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl">
              <div className="relative w-12 h-12">
                <Image
                  src="/crypto-logos/bitcoin.png"
                  alt="Bitcoin"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="48px"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Créditos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Criptomonedas</span>
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Obtén financiamiento en cripto con tasas competitivas del 5.4% anual
              </p>
            </div>
          </div>
          
          {/* Badge destacado */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
            <div className="relative w-5 h-5">
              <Image
                src="/crypto-logos/bitcoin.png"
                alt="Crypto"
                fill
                className="object-contain"
              />
            </div>
            <span>Financiamiento Digital Seguro</span>
          </div>
        </div>

        {/* Sección de seguridad y confianza */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Proceso 100% Seguro</h3>
                <p className="text-sm text-gray-600">
                  Evaluación personalizada con asesor especializado
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5.4%</div>
              <div className="text-sm text-gray-600">Tasa anual fija</div>
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Configura tu crédito en cripto
              </h2>
            </div>

            {/* Monto del crédito */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <label className="text-lg font-semibold text-gray-800">
                    Monto del crédito (USDT)
                  </label>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">
                  {formatCurrency(creditAmount)}
                </div>
              </div>
              
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
              />
              
              <div className="flex justify-between text-sm text-gray-500 mt-3">
                <span>1,000 USDT</span>
                <span>1,000,000 USDT</span>
              </div>
            </div>

            {/* Selección de criptomoneda CON LOGOS */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Bitcoin className="w-5 h-5 text-gray-600" />
                <label className="text-lg font-semibold text-gray-800">
                  Recibir crédito en
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {cryptocurrencies.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto.id)}
                    className={`p-4 rounded-xl transition-all border-2 flex flex-col items-center justify-center min-h-[120px] ${
                      selectedCrypto === crypto.id
                        ? `border-green-500 bg-gradient-to-r ${crypto.color} text-white shadow-md`
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full ${
                      selectedCrypto === crypto.id 
                        ? 'bg-white/20' 
                        : 'bg-white'
                    } p-3 mb-3 flex items-center justify-center shadow-sm`}>
                      <div className="relative w-10 h-10">
                        <Image
                          src={crypto.icon}
                          alt={`${crypto.name} logo`}
                          fill
                          className="object-contain"
                          sizes="40px"
                        />
                      </div>
                    </div>
                    
                    <div className="font-semibold text-base">{crypto.symbol}</div>
                    <div className="text-xs opacity-80 mt-1 text-center">{crypto.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Plazo del crédito */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-gray-600" />
                <label className="text-lg font-semibold text-gray-800">
                  Plazo del crédito (meses)
                </label>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {yearOptions.map((months) => (
                  <button
                    key={months}
                    onClick={() => setYears(months)}
                    className={`py-3 px-2 rounded-lg transition-all ${
                      years === months
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {months} meses
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
                  Calcular crédito en cripto
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
            id="crypto-credit-results"
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

            {/* Tarjetas de resultados */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {/* Monto solicitado */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Monto solicitado</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCrypto(creditAmount)}
                </div>
                <div className="text-gray-500 text-sm">
                  Plazo: {years} meses
                </div>
              </div>

              {/* Mensualidad */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Mensualidad</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCrypto(results.monthlyPayment)}
                </div>
                <div className="text-gray-500 text-sm">
                  Pago mensual fijo
                </div>
              </div>

              {/* Anticipo - 10% */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Percent className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Anticipo</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCrypto(results.advanceAmount)}
                </div>
                <div className="text-gray-500 text-sm">
                  10% del monto total
                </div>
              </div>

              {/* Interés total */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Interés total</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCrypto(results.totalInterest)}
                </div>
                <div className="text-gray-500 text-sm">
                  Tasa 5.4% anual
                </div>
              </div>
            </div>

            {/* Resumen adicional */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 md:p-8 mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Monto neto a recibir</h3>
                  <p className="text-green-100">Después de descontar el anticipo del 10%</p>
                </div>
                <div className="text-4xl md:text-5xl font-bold mt-4 md:mt-0">
                  {formatCrypto(results.netAmount)}
                </div>
              </div>
            </div>

            {/* SOLO BOTÓN DE SOLICITAR CRÉDITO */}
            <div className="text-center mb-12">
              <button
                onClick={handleOpenForm}
                className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 mx-auto"
              >
                <Send className="w-6 h-6" />
                Solicitar crédito
              </button>
              <p className="text-gray-500 text-sm mt-4">
                ¿Listo para dar el siguiente paso? Solicita tu crédito con la simulación que acabas de realizar.
              </p>
            </div>

            {/* Llamada a la acción */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">¿Listo para comenzar?</h4>
              </div>
              <p className="text-gray-700 mb-4 max-w-2xl mx-auto">
                Completa la etapa 1 con nuestro asesor y te guiaremos paso a paso 
                en el proceso formal de tu crédito en criptomonedas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Sin consulta a buró de crédito
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Asesor personal asignado
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Respuesta en menos de 24 horas
                </div>
              </div>
            </div>

            {/* Información del anticipo */}
            <div className="p-6 bg-green-50 rounded-xl border border-green-200 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Sobre el anticipo del 10%</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    El anticipo es un pago inicial del 10% del monto solicitado que:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                      <span>Asegura tu solicitud y reserva el monto del crédito elegido</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                      <span>Cubre costos de apertura y trámites legales asociados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                      <span>Se descuenta del total del crédito, no es un cargo adicional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comparativa de tasas CON LOGOS */}
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Comparativa de tasas de interés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 p-2">
                      <Bitcoin className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Créditos en Cripto</h4>
                    <p className="text-sm text-gray-600">Nuestra plataforma</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">5.4%</div>
                    <div className="text-sm text-gray-500">tasa anual fija</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Créditos Bancarios</h4>
                    <p className="text-sm text-gray-600">Tradicionales</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-1">12-25%</div>
                    <div className="text-sm text-gray-500">tasa anual variable</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Percent className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Tarjetas de Crédito</h4>
                    <p className="text-sm text-gray-600">Promedio mercado</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-1">30-45%</div>
                    <div className="text-sm text-gray-500">tasa anual</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  <span className="font-semibold text-green-600">Ahorras hasta 80%</span> en intereses con créditos en criptomonedas
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* MODAL DE PRE-EVALUACIÓN - AHORA CON LAS PROPS CORRECTAS */}
      <CryptoContactFormModal 
        isOpen={isLeadFormOpen} 
        onClose={() => setIsLeadFormOpen(false)}
        selectedCrypto={selectedCrypto}
        plazo={years}
        monto={creditAmount}
      />

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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
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

export default CryptoCreditCalculator;