<!-- TODO -->
<!--
  - add support for 7TV and BTTV
  - test what happens when mod removes a message or clears chat
  - theme support? (black vs white text color)
-->

<template>
  <aside>
    <p v-for="(message, x) in messagesToDisplay" :key="x">
      <span v-if="message.tags.badgesList" class="badges">
        <span v-for="badge in message.tags.badgesList" :key="badge" class="badge" :class="badge+'-badge'"></span>
      </span>
      <span class="chatter-name" :style="'color: '+ message.tags.color +';'">{{ message.source.nick }}</span>
      {{ message.parameters }}
    </p>
  </aside>
</template>

<style scoped>
aside {
  width: 400px;
  padding: 15px;
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
  overflow-x: hidden;
}
p {
  margin: 0;
}
.badges {
  display: inline-block;
  height: 16px;
}
.badge {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 3px;
  top: 3px;
  background-repeat: no-repeat;
  background-size: cover;
}
.badge:last-child {
  margin-right: 5px;
}
.chatter-name {
  position: relative;
  font-weight: 900;
  padding-right: 5px;
  font-size: 17px;
  top: 1px;
}
</style>

<script>
import { ref } from 'vue';

export default {
  name: 'ChatWidget',
  setup(context,props) {
    const childRef = ref(null)
    return {childRef} 
  },
  data() {
    return {
      messageLimit: 15,
      messagesToDisplay: []
    }
  },
  methods: {
    newMessage: function(message) {
      // parse badges
      if (message.tags.badges) {
        message.tags.badgesList = []
        for (let key in message.tags.badges) {
          let keyName = '';
          // some keys need to be reworded to fit icon names and class names
          // tried just leaving the ones that didn't need changed blank, and just rewriting 'key' for artist-badge
          // but didn't work
          switch (key) {
            case 'moderator':
              keyName = 'moderator';
              break;
            case 'broadcaster':
              keyName = 'broadcaster';
              break;
            case 'turbo':
              keyName = 'turbo';
              break;
            case 'verified':
              keyName = 'verified';
              break;
            case 'vip':
              keyName = 'vip';
              break;
            case 'no_audio':
              keyName = 'no_audio';
              break;
            case 'no_video':
              keyName = 'no_video';
              break;
            case 'premium':
              keyName = 'prime';
              break;
            case 'artist-badge':
              keyName = 'artist'
              break;
            default:
              break;
          }
          message.tags.badgesList.push(keyName)
        }
      }
      if (this.messagesToDisplay.length == this.messageLimit) this.messagesToDisplay.shift();
      this.messagesToDisplay.push(message);
    }
  },
  destroyed: function() {

  }
}
</script>
