import { defineStore } from 'pinia';
import axios from 'axios';

interface Rates {
  [currency: string]: number;
}

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    baseCurrency: localStorage.getItem('baseCurrency') || 'RUB',
    rates: {} as Rates,
    error: '',
    loading: false,
  }),
  actions: {
    async fetchRates() {
      this.loading = true;
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_API_KEY;

        const params: any = { access_key: apiKey };
        const response = await axios.get(`${apiUrl}/live`, { params });
        console.log('API response:', response.data);
        if (response.data.success === false) {
          this.error = response.data.error?.info || 'Ошибка получения данных';
          this.rates = {};
        } else {
          const quotes = response.data.quotes || {};

          if (this.baseCurrency === response.data.source) {
            this.rates = this.transformQuotes(quotes);
          } else {
            const usdToBase = quotes[`USD${this.baseCurrency}`];
            if (!usdToBase) {
              throw new Error(`Нет курса для USD${this.baseCurrency}`);
            }
            const computedRates: Rates = {};
            for (const key in quotes) {
              const targetCurrency = key.replace('USD', '');
              computedRates[targetCurrency] = +(
                quotes[key] / usdToBase
              ).toFixed(4);
            }
            this.rates = computedRates;
          }
          this.error = '';
        }
      } catch (error: any) {
        this.error = error.message;
        this.rates = {};
        console.error('Fetch rates error:', error);
      } finally {
        this.loading = false;
      }
    },
    transformQuotes(quotes: { [key: string]: number }): Rates {
      const rates: Rates = {};
      for (const key in quotes) {
        const targetCurrency = key.replace('USD', '');
        rates[targetCurrency] = +quotes[key].toFixed(4);
      }
      return rates;
    },
    setBaseCurrency(currency: string) {
      this.baseCurrency = currency;
      localStorage.setItem('baseCurrency', currency);
      this.fetchRates();
    },
    convert(value: number, from: string, to: string): number {
      const rateFrom = this.rates[from];
      const rateTo = this.rates[to];
      if (!rateFrom || !rateTo) return 0;
      return +((value * rateTo) / rateFrom).toFixed(2);
    },
  },
});
