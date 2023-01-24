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
      <span class="chatter-name" :style="'color: '+ message.tags.color +';'">{{ message.tags['display-name'] }}</span>
      <span class="chat-content" v-html="message.parameters"></span>
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
    const ChatWidgetRef = ref(null)
    return {ChatWidgetRef} 
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
      if (message.tags.emotes) {
        console.log(message.tags.emotes)
        let thisMessage = message.parameters;
        for (const emote in message.tags.emotes) {
          message.tags.emotes[emote].forEach(thisEmote => {
            console.log(thisEmote)
            // console.log(`BEFORE: ${thisMessage}`)
            let toReplace = thisMessage.substring(thisEmote.startPosition, thisEmote.endPosition+1);
            let emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emote}/default/light/1.0`;
            console.log(`replace: '${toReplace}' (${thisEmote.startPosition}, ${thisEmote.endPosition+1}) with ${emoteUrl}`)
            // console.log(`but this works? ${message.parameters.substring(0, 3)}`)
            thisMessage = message.parameters.replace(toReplace, emoteUrl);
            // console.log(`AFTER: ${thisMessage}`)
          })
          // message.parameters = thisMessage;
          // console.log(`END LOOP: ${message.parameters}`)
        }
      }
      if (this.messagesToDisplay.length == this.messageLimit) this.messagesToDisplay.shift();
      this.messagesToDisplay.push(message);
      // console.log(message);
    }
  },
  destroyed: function() {

  }
}
</script>
