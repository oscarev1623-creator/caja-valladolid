const ANNUAL_RATE = 0.069
const MONTHLY_RATE = ANNUAL_RATE / 12

const CRYPTO_ANNUAL_RATE = 0.04
const CRYPTO_MONTHLY_RATE = CRYPTO_ANNUAL_RATE / 12

function calculateAdvanceFee(amount: number): number {
  // Small credits (below 20,000): 10% advance fee
  if (amount < 20000) {
    return amount * 0.1
  }
  // High credits (20,000 and above): 5% advance fee
  return amount * 0.05
}

export function calculateCreditDetails(amount: number, termYears: number) {
  const numberOfMonths = termYears * 12
  const advanceFee = calculateAdvanceFee(amount)
  const netAmount = amount - advanceFee // Amount after deducting advance

  const monthlyPayment = netAmount * (MONTHLY_RATE / (1 - Math.pow(1 + MONTHLY_RATE, -numberOfMonths)))
  const totalPayment = monthlyPayment * numberOfMonths

  const schedule = []
  let balance = netAmount
  for (let i = 1; i <= numberOfMonths; i++) {
    const interest = balance * MONTHLY_RATE
    const principal = monthlyPayment - interest
    balance -= principal
    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance),
    })
  }

  return {
    monthlyPayment,
    totalPayment,
    advanceFee, // Return advanceFee instead of downPayment
    netAmount,
    schedule,
  }
}

export function calculateCryptoDetails(amountMXN: number, termYears: number, cryptoPrice: number) {
  const numberOfMonths = termYears * 12

  const advanceFee = calculateAdvanceFee(amountMXN)
  const netAmountMXN = amountMXN - advanceFee
  const netAmountCrypto = netAmountMXN / cryptoPrice
  const advanceFeeCrypto = advanceFee / cryptoPrice

  const monthlyPaymentCrypto =
    netAmountCrypto * (CRYPTO_MONTHLY_RATE / (1 - Math.pow(1 + CRYPTO_MONTHLY_RATE, -numberOfMonths)))
  const totalPaymentCrypto = monthlyPaymentCrypto * numberOfMonths
  const monthlyPaymentMXN = monthlyPaymentCrypto * cryptoPrice
  const totalPaymentMXN = totalPaymentCrypto * cryptoPrice

  const schedule = []
  let balance = netAmountCrypto
  for (let i = 1; i <= numberOfMonths; i++) {
    const interest = balance * CRYPTO_MONTHLY_RATE
    const principal = monthlyPaymentCrypto - interest
    balance -= principal
    schedule.push({
      month: i,
      paymentCrypto: monthlyPaymentCrypto,
      paymentMXN: monthlyPaymentCrypto * cryptoPrice,
      principal,
      interest,
      balance: Math.max(0, balance),
    })
  }

  return {
    netAmountCrypto,
    netAmountMXN,
    advanceFeeMXN: advanceFee,
    advanceFeeCrypto,
    monthlyPaymentCrypto,
    totalPaymentCrypto,
    monthlyPaymentMXN,
    totalPaymentMXN,
    schedule,
  }
}

export function formatMXN(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatCrypto(value: number, symbol: string): string {
  return `${value.toFixed(6)} ${symbol}`
}

export function getAdvanceFeePercentage(amount: number): string {
  if (amount < 20000) return "10%"
  return "5%"
}
