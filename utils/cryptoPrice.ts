export interface CryptoPriceResponse {
  [cryptoId: string]: {
    [currency: string]: number;
  };
}

export class CryptoPriceService {
  private static readonly API_BASE = 'https://api.coingecko.com/api/v3';
  private static readonly CRYPTO_MAP: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin'
  };

  private static readonly CURRENCY_SYMBOLS: { [key: string]: string } = {
    // Major fiats
    'usd': '$',
    'eur': '€',
    'gbp': '£',
    'jpy': '¥',
    'cad': 'CA$',
    'aud': 'A$',
    'cny': '¥',
    'inr': '₹',
    'brl': 'R$',
    'ngn': '₦',
    'kes': 'KSh',
    'ghs': 'GH₵',
    'zar': 'R',
    'egp': 'E£',
    'mxn': 'MX$',
    'chf': 'CHF',
    'sek': 'kr',
    'nok': 'kr',
    'dkk': 'kr',
    'rub': '₽',
    'try': '₺',
    'krw': '₩',
    'sgd': 'S$',
    'hkd': 'HK$',
    'nzd': 'NZ$',
    // Cryptos
    'btc': '₿',
    'eth': 'Ξ'
  };

  private static readonly CURRENCY_NAMES: { [key: string]: string } = {
    'usd': 'US Dollar',
    'eur': 'Euro',
    'gbp': 'British Pound',
    'jpy': 'Japanese Yen',
    'cad': 'Canadian Dollar',
    'aud': 'Australian Dollar',
    'cny': 'Chinese Yuan',
    'inr': 'Indian Rupee',
    'brl': 'Brazilian Real',
    'ngn': 'Nigerian Naira',
    'kes': 'Kenyan Shilling',
    'ghs': 'Ghanaian Cedi',
    'zar': 'South African Rand',
    'egp': 'Egyptian Pound',
    'mxn': 'Mexican Peso',
    'chf': 'Swiss Franc',
    'sek': 'Swedish Krona',
    'nok': 'Norwegian Krone',
    'dkk': 'Danish Krone',
    'rub': 'Russian Ruble',
    'try': 'Turkish Lira',
    'krw': 'South Korean Won',
    'sgd': 'Singapore Dollar',
    'hkd': 'Hong Kong Dollar',
    'nzd': 'New Zealand Dollar',
    'btc': 'Bitcoin',
    'eth': 'Ethereum'
  };

  /**
   * Get current price for a single cryptocurrency
   */
  static async getCryptoPrice(cryptoId: string, currency: string = 'usd'): Promise<number | null> {
    try {
      const normalizedCurrency = this.normalizeCurrencyForAPI(currency);
      const normalizedCryptoId = this.getCryptoId(cryptoId);

      const response = await fetch(
        `${this.API_BASE}/simple/price?ids=${normalizedCryptoId}&vs_currencies=${normalizedCurrency}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch crypto price: ${response.status}`);
      }
      
      const data: CryptoPriceResponse = await response.json();
      return data[normalizedCryptoId]?.[normalizedCurrency] || null;
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return null;
    }
  }

  /**
   * Get prices for multiple cryptocurrencies at once
   */
  static async getMultipleCryptoPrices(cryptoIds: string[], vsCurrencies?: string[]): Promise<CryptoPriceResponse> {
    try {
      const normalizedCryptoIds = cryptoIds.map(id => this.getCryptoId(id)).join(',');
      const currencies = vsCurrencies && vsCurrencies.length > 0 
        ? vsCurrencies.map(curr => this.normalizeCurrencyForAPI(curr)).join(',')
        : 'usd';

      const response = await fetch(
        `${this.API_BASE}/simple/price?ids=${normalizedCryptoIds}&vs_currencies=${currencies}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch crypto prices: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return {};
    }
  }

  /**
   * Get USD to NGN exchange rate
   */
  static async getUSDToNGNRate(): Promise<number | null> {
    try {
      // Using CoinGecko to get USD to NGN rate
      const response = await fetch(
        `${this.API_BASE}/simple/price?ids=usd-coin&vs_currencies=ngn`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch USD to NGN rate: ${response.status}`);
      }
      
      const data = await response.json();
      return data['usd-coin']?.ngn || null;
    } catch (error) {
      console.error('Error fetching USD to NGN rate:', error);
      return null;
    }
  }

  /**
   * Convert cryptocurrency symbol to CoinGecko API ID
   */
  static getCryptoId(coinSymbol: string): string {
    return this.CRYPTO_MAP[coinSymbol.toUpperCase()] || coinSymbol.toLowerCase();
  }

  /**
   * Get all supported cryptocurrency symbols
   */
  static getSupportedCryptos(): string[] {
    return Object.keys(this.CRYPTO_MAP);
  }

  /**
   * Calculate price with margin for buy/sell offers
   */
  static calculatePriceWithMargin(marketPrice: number, margin: number, isBuy: boolean): number {
    if (!marketPrice || marketPrice <= 0) return 0;
    
    const marginMultiplier = margin / 100;
    
    if (isBuy) {
      // For buy offers: price is higher (you pay more)
      return marketPrice * (1 + marginMultiplier);
    } else {
      // For sell offers: price is lower (you receive less)
      return Math.max(0, marketPrice * (1 - marginMultiplier));
    }
  }

  /**
   * Format currency amount with proper symbols and decimal places
   */
  static formatCurrency(amount: number, currency: string = 'usd'): string {
    if (!amount || isNaN(amount)) return 'N/A';
    
    const normalizedCurrency = currency.toLowerCase();
    const symbol = this.CURRENCY_SYMBOLS[normalizedCurrency] || currency.toUpperCase();
    
    // Handle crypto currencies (more decimal places)
    if (this.isCryptoCurrency(normalizedCurrency)) {
      if (amount < 0.01) {
        return `${symbol}${amount.toFixed(8)}`;
      } else if (amount < 1) {
        return `${symbol}${amount.toFixed(6)}`;
      } else {
        return `${symbol}${amount.toFixed(4)}`;
      }
    }
    
    // Handle fiat currencies
    try {
      // For very large amounts, use compact notation
      if (amount >= 1000000) {
        return `${symbol}${(amount / 1000000).toFixed(2)}M`;
      } else if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(2)}K`;
      }
      
      // Standard formatting for normal amounts
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: normalizedCurrency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      // Fallback for unsupported currencies in Intl
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  }

  /**
   * Format amount without currency symbol (just number formatting)
   */
  static formatAmount(amount: number | null, currency: string = 'usd'): string {
    if (!amount || isNaN(amount)) return '0.00';
    
    const normalizedCurrency = currency.toLowerCase();
    
    if (this.isCryptoCurrency(normalizedCurrency)) {
      if (amount < 0.01) {
        return amount.toFixed(8);
      } else if (amount < 1) {
        return amount.toFixed(6);
      } else {
        return amount.toFixed(4);
      }
    }
    
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * Get currency symbol for a given currency code
   */
  static getCurrencySymbol(currency: string): string {
    return this.CURRENCY_SYMBOLS[currency.toLowerCase()] || currency.toUpperCase();
  }

  /**
   * Get full currency name for a given currency code
   */
  static getCurrencyName(currency: string): string {
    return this.CURRENCY_NAMES[currency.toLowerCase()] || currency.toUpperCase();
  }

  /**
   * Check if a currency code is a cryptocurrency
   */
  static isCryptoCurrency(currency: string): boolean {
    const cryptoCurrencies = ['btc', 'eth', 'usdt', 'usdc', 'bnb', 'xrp', 'ada', 'sol', 'dot', 'doge'];
    return cryptoCurrencies.includes(currency.toLowerCase());
  }

  /**
   * Check if a currency code is a fiat currency
   */
  static isFiatCurrency(currency: string): boolean {
    return !this.isCryptoCurrency(currency);
  }

  /**
   * Get all supported currency codes
   */
  static getSupportedCurrencies(): string[] {
    return Object.keys(this.CURRENCY_SYMBOLS);
  }

  /**
   * Get popular currencies for quick selection
   */
  static getPopularCurrencies(): string[] {
    return ['usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'ngn', 'btc', 'eth'];
  }

  /**
   * Normalize currency for API calls (handle crypto currencies)
   */
  static normalizeCurrencyForAPI(currency: string): string {
    // CoinGecko can't price crypto in crypto, so use USD as base
    if (this.isCryptoCurrency(currency)) {
      return 'usd';
    }
    return currency.toLowerCase();
  }

  /**
   * Calculate how much crypto you get for a fiat amount
   */
  static calculateCryptoAmount(fiatAmount: number, pricePerCrypto: number): number {
    if (!fiatAmount || !pricePerCrypto || pricePerCrypto <= 0) return 0;
    return fiatAmount / pricePerCrypto;
  }

  /**
   * Calculate how much fiat you get for a crypto amount
   */
  static calculateFiatAmount(cryptoAmount: number, pricePerCrypto: number): number {
    if (!cryptoAmount || !pricePerCrypto || pricePerCrypto <= 0) return 0;
    return cryptoAmount * pricePerCrypto;
  }

  /**
   * Validate if an amount is within min/max limits
   */
  static validateAmount(amount: number, minLimit: number, maxLimit: number): { isValid: boolean; message: string } {
    if (amount < minLimit) {
      return {
        isValid: false,
        message: `Amount must be at least ${this.formatCurrency(minLimit, 'usd')}`
      };
    }
    
    if (amount > maxLimit) {
      return {
        isValid: false,
        message: `Amount must not exceed ${this.formatCurrency(maxLimit, 'usd')}`
      };
    }
    
    return { isValid: true, message: '' };
  }

  /**
   * Calculate processing fee
   */
  static calculateProcessingFee(amount: number, feePercent: number = 0.5): number {
    return amount * (feePercent / 100);
  }

  /**
   * Calculate total amount including fee
   */
  static calculateTotalWithFee(amount: number, feePercent: number = 0.5): number {
    const fee = this.calculateProcessingFee(amount, feePercent);
    return amount + fee;
  }
}

export default CryptoPriceService;