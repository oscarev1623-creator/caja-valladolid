"use client";

import { useState, useEffect } from 'react';
import { Bitcoin, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export function CryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'tether'];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener precios');
        }
        
        const data = await response.json();
        setPrices(data);
        setError('');
      } catch (err) {
        console.error('Error fetching crypto prices:', err);
        setError('No se pudieron cargar los precios');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    // Actualizar cada 60 segundos
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price);
  };

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      bitcoin: '/crypto-logos/bitcoin.png',
      ethereum: '/crypto-logos/eth.png',
      binancecoin: '/crypto-logos/bnb.png',
      solana: '/crypto-logos/sol.png',
      tether: '/crypto-logos/usdt.png'
    };
    return icons[symbol] || '/crypto-logos/bitcoin.png';
  };

  const getCryptoName = (id: string) => {
    const names: Record<string, string> = {
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      binancecoin: 'BNB',
      solana: 'Solana',
      tether: 'USDT'
    };
    return names[id] || id;
  };

  if (loading && prices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <span className="text-gray-500">Cargando precios...</span>
        </div>
      </div>
    );
  }

  if (error && prices.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <p className="text-center text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Precios del mercado cripto
        </h3>
        <p className="text-xs text-gray-400">Actualizado cada 60 segundos</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {prices.map((crypto) => {
          const isPositive = crypto.price_change_percentage_24h > 0;
          const formattedPrice = formatPrice(crypto.current_price);
          
          return (
            <div
              key={crypto.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-2">
                  <Image
                    src={getCryptoIcon(crypto.id)}
                    alt={crypto.symbol}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{getCryptoName(crypto.id)}</p>
                  <p className="text-xs text-gray-500 uppercase">{crypto.symbol}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-xl font-bold text-gray-900">{formattedPrice}</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                  <span className="text-xs text-gray-400">24h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Datos proporcionados por CoinGecko · Precios en USD
        </p>
      </div>
    </div>
  );
}