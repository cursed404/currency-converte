<template>
  <header class="app-header">
    <nav class="nav">
      <router-link class="nav-link" to="/">Главная</router-link>
      <router-link class="nav-link" to="/convert">Конвертация</router-link>
      <div class="currency-selector">
        <label for="base-currency">Основная валюта:</label>
        <select
          id="base-currency"
          v-model="selectedCurrency"
          @change="changeBaseCurrency"
        >
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <button @click="toggleDarkMode" class="dark-mode-toggle">
        {{ darkMode ? 'Светлая тема' : 'Темная тема' }}
      </button>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useCurrencyStore } from '../../store/currencyStore';

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const currencyStore = useCurrencyStore();
    const selectedCurrency = ref(currencyStore.baseCurrency);
    const darkMode = ref(localStorage.getItem('darkMode') === 'true');

    const changeBaseCurrency = () => {
      currencyStore.setBaseCurrency(selectedCurrency.value);
    };

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem('darkMode', darkMode.value.toString());
      document.documentElement.classList.toggle('dark', darkMode.value);
    };

    onMounted(() => {
      if (darkMode.value) {
        document.documentElement.classList.add('dark');
      }
    });

    return { selectedCurrency, changeBaseCurrency, darkMode, toggleDarkMode };
  },
});
</script>

<style scoped>
.app-header {
  padding: 20px;
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-link {
  margin-right: 15px;
  text-decoration: none;
  font-weight: bold;
  color: var(--primary-text-color);
}
.currency-selector {
  margin-right: auto;
  margin-left: 20px;
}
.dark-mode-toggle {
  background-color: transparent;
  border: none;
  font-weight: bold;
  color: var(--primary-text-color);
  cursor: pointer;
}
</style>
