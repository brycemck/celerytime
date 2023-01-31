import { defineStore } from 'pinia';

export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    preferences: {
      addBetterTTVSupport: {
        name: 'Add BetterTTV Support',
        type: 'checkbox',
        value: false
      },
      add7tvSupport: {
        name: 'Add 7TV Support',
        type: 'checkbox',
        value: false
      }
    }
  }),
  actions: {
  },
});