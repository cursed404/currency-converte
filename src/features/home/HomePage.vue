<template>
  <div class="home-page">
    <h1>Курсы валют по отношению к {{ baseCurrency }}</h1>
    <div v-if="loading" class="loader">Загрузка данных...</div>
    <ul v-else-if="hasRates">
      <li v-for="(rate, currency) in rates" :key="currency">
        1 {{ currency }} = {{ rate }} {{ baseCurrency }}
      </li>
    </ul>
    <div v-else>Нет данных для отображения.</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useCurrencyStore } from '../../store/currencyStore';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const currencyStore = useCurrencyStore();
    onMounted(() => {
      currencyStore.fetchRates();
    });

    const baseCurrency = computed(() => currencyStore.baseCurrency);
    const rates = computed(() => currencyStore.rates || {});
    const loading = computed(() => currencyStore.loading);
    const error = computed(() => currencyStore.error);
    const hasRates = computed(() => Object.keys(rates.value).length > 0);

    return { baseCurrency, rates, loading, error, hasRates };
  },
});
</script>

<style scoped>
.home-page {
  padding: 20px;
}
.loader {
  font-style: italic;
}
.error {
  color: red;
}
</style>
