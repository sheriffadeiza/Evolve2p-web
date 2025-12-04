// utils/countryCurrencyService.ts

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string; // Country code (US, NG, etc.)
  flags: {
    png: string;
    svg: string;
  };
  currencies: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  country: string;
  countryCode: string;
  flag: string;
}

class CountryCurrencyService {
  private countries: Country[] = [];
  private currencies: CurrencyOption[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2,flags,currencies,idd"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.countries = await response.json();
      this.processCurrencies();
      this.isInitialized = true;
      
      console.log(`✅ Loaded ${this.countries.length} countries and ${this.currencies.length} currencies`);
    } catch (error) {
      console.error('❌ Error fetching countries data:', error);
      // Fallback to common currencies if API fails
      this.setFallbackCurrencies();
      this.isInitialized = true;
    }
  }

  private processCurrencies(): void {
    const currencyMap = new Map<string, CurrencyOption>();

    this.countries.forEach(country => {
      if (!country.currencies) return;

      Object.entries(country.currencies).forEach(([code, currency]) => {
        const key = code.toUpperCase();
        if (!currencyMap.has(key)) {
          currencyMap.set(key, {
            code: key,
            name: currency.name,
            symbol: currency.symbol,
            country: country.name.common,
            countryCode: country.cca2,
            flag: country.flags.png
          });
        }
      });
    });

    this.currencies = Array.from(currencyMap.values())
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  private setFallbackCurrencies(): void {
    this.currencies = [
      {
        code: 'USD',
        name: 'United States Dollar',
        symbol: '$',
        country: 'United States',
        countryCode: 'US',
        flag: 'https://flagcdn.com/w320/us.png'
      },
      {
        code: 'NGN',
        name: 'Nigerian Naira',
        symbol: '₦',
        country: 'Nigeria',
        countryCode: 'NG',
        flag: 'https://flagcdn.com/w320/ng.png'
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        country: 'European Union',
        countryCode: 'EU',
        flag: 'https://flagcdn.com/w320/eu.png'
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        country: 'United Kingdom',
        countryCode: 'GB',
        flag: 'https://flagcdn.com/w320/gb.png'
      },
      {
        code: 'BTC',
        name: 'Bitcoin',
        symbol: '₿',
        country: 'Crypto',
        countryCode: 'CR',
        flag: '/path/to/btc-icon.png' // You'll need to add this
      },
      {
        code: 'ETH',
        name: 'Ethereum',
        symbol: 'Ξ',
        country: 'Crypto',
        countryCode: 'CR',
        flag: '/path/to/eth-icon.png' // You'll need to add this
      }
    ];
  }

  getAllCurrencies(): CurrencyOption[] {
    return this.currencies;
  }

  getCurrencyByCode(code: string): CurrencyOption | undefined {
    return this.currencies.find(currency => 
      currency.code.toLowerCase() === code.toLowerCase()
    );
  }

  searchCurrencies(searchTerm: string): CurrencyOption[] {
    const term = searchTerm.toLowerCase();
    return this.currencies.filter(currency =>
      currency.code.toLowerCase().includes(term) ||
      currency.name.toLowerCase().includes(term) ||
      currency.country.toLowerCase().includes(term)
    );
  }

  getAllCountries(): Country[] {
    return this.countries;
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countries.find(country => 
      country.cca2.toLowerCase() === code.toLowerCase()
    );
  }

  getCurrenciesByCountry(countryCode: string): CurrencyOption[] {
    const country = this.getCountryByCode(countryCode);
    if (!country || !country.currencies) return [];

    return Object.entries(country.currencies).map(([code, currency]) => ({
      code: code.toUpperCase(),
      name: currency.name,
      symbol: currency.symbol,
      country: country.name.common,
      countryCode: country.cca2,
      flag: country.flags.png
    }));
  }
}

// Create singleton instance
export const countryCurrencyService = new CountryCurrencyService();

// Initialize on import
countryCurrencyService.initialize();