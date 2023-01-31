<template>
  <main>
    <form>
      <div v-for="(preference, index) in preferences" :key="index">
        <label :for="preference">{{  preference.name }}</label>
        <input :type="preference.type" :value="preference.value" :name="preference" v-model="preference.value">
      </div>
      
    </form>
  </main>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useUserPreferencesStore } from '../stores/userPreferences'

export default {
  name: 'UserPreferencesView',
  setup() {
    const store = useUserPreferencesStore();

    const { preferences } = storeToRefs(store);

    return { preferences }
  }
}
</script>