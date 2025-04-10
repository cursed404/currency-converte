<template>
  <div class="convert-page">
    <h1>Конвертер валют</h1>
    <form class="convert-form">
      <div class="input-group">
        <select v-model="selectedCurrencyFrom">
          <option
            v-for="(rate, currencyCode) in availableCurrencies"
            :key="currencyCode"
            :value="currencyCode"
          >
            {{ currencyCode }} - {{ rate }}
          </option>
        </select>
        <input
          type="number"
          v-model.number="amountFrom"
          @input="updateAmountTo"
          placeholder="Введите сумму"
        />
      </div>
      <div class="input-group">
        <select v-model="selectedCurrencyTo">
          <option
            v-for="(rate, currencyCode) in availableCurrencies"
            :key="currencyCode"
            :value="currencyCode"
          >
            {{ currencyCode }} - {{ rate }}
          </option>
        </select>
        <input
          type="number"
          v-model.number="amountTo"
          @input="updateAmountFrom"
          placeholder="Результат"
        />
      </div>
      <div v-if="inputError" class="input-error">{{ inputError }}</div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useCurrencyStore } from '../../store/currencyStore';

export default defineComponent({
  name: 'ConvertPage',
  setup() {
    const currencyStore = useCurrencyStore();
    const amountFrom = ref(1);
    const amountTo = ref(1);
    const selectedCurrencyFrom = ref(currencyStore.baseCurrency);
    const selectedCurrencyTo = ref('USD');

    const availableCurrencies = computed(() => {
      const currencyCodes = Object.keys(currencyStore.rates);
      return currencyCodes.length
        ? currencyStore.rates
        : { RUB: 1, USD: 1, EUR: 1 };
    });

    const inputError = ref('');

    const updateAmountTo = () => {
      if (amountFrom.value < 0 || isNaN(amountFrom.value)) {
        inputError.value = 'Введите корректное число (>= 0)';
        return;
      } else {
        inputError.value = '';
      }
      amountTo.value = currencyStore.convert(
        amountFrom.value,
        selectedCurrencyFrom.value,
        selectedCurrencyTo.value
      );
    };

    const updateAmountFrom = () => {
      if (amountTo.value < 0 || isNaN(amountTo.value)) {
        inputError.value = 'Введите корректное число (>= 0)';
        return;
      } else {
        inputError.value = '';
      }
      amountFrom.value = currencyStore.convert(
        amountTo.value,
        selectedCurrencyTo.value,
        selectedCurrencyFrom.value
      );
    };

    watch([selectedCurrencyFrom, selectedCurrencyTo], () => {
      updateAmountTo();
    });

    return {
      amountFrom,
      amountTo,
      selectedCurrencyFrom,
      selectedCurrencyTo,
      availableCurrencies,
      updateAmountTo,
      updateAmountFrom,
      inputError,
    };
  },
});
</script>

<style scoped>
.convert-page {
  padding: 20px;
}
.convert-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
.input-group select,
.input-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.input-error {
  color: red;
}
</style>
