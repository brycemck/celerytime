import { defineStore } from 'pinia';
import { firebaseApp } from '../firebaseConfig.js'
import { getAuth, signInWithCustomToken } from 'firebase/auth';


export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      uid: '',
      twitchUserData: null,

    }
  },
  actions: {
    updateTwitchInfo(data) {
      this.twitchUserData = data;
      this.uid = this.twitchUserData.data[0].id;
    },
    generateToken() {
      return '😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹😹';
      // const firebaseAuth = getAuth(firebaseApp);

      // firebaseAuth.createCustomToken(this.uid)
      //   .then((customToken) => {
      //     return customToken
      //   })
      //   .catch((error) => {
      //     console.log('Error creating custom token:', error);
      //   });
    },
    login() {
      console.log(this.generateToken());
    }
  },
});