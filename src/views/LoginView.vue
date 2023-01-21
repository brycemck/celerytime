<template>
  <main>
    <a :href="grant_url">
      <button>Login to Twitch</button>
    </a>
  </main>
</template>

<script>
const base_url = 'https://id.twitch.tv/oauth2/authorize'
const client_id = import.meta.env.VITE_TWITCH_CLIENT_ID
const redirect_uri = 'http://localhost:5173/login?response=true'
const scope = 'chat%3Aread+chat%3Aedit'

export default {
  name: 'Login',
  data() {
    return {
      grant_url: `${base_url}?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
    }
  },
  created: function() {
    if (this.$cookies.get('access_token')) {
      this.$router.push('/')
    }
    if (this.$route.query.response) {
      let hash = new URLSearchParams(document.location.hash.slice(1));
      this.$cookies.set('access_token', hash.get('access_token'))
      this.$router.push('/')
    }
  }
}
</script>