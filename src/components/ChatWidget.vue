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
  margin: 3px 0;
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
  padding-right: 7px;
  font-size: 17px;
  top: 1px;
}
.chat-content {
  position: relative;
  top: -1px;
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
      // parse global emotes
      if (message.tags.emotes) {
        console.log(message.tags.emotes)

        // save original message
        const originalMessage = message.parameters;
        let newMessage = originalMessage;

        for (const emote in message.tags.emotes) { // for each different emote
          // get the first instance of this emote's start and end position, extract the text used to call the emote,
          // and replace every instance of that string with the url
          const emoteText = originalMessage.substring(message.tags.emotes[emote][0].startPosition, parseInt(message.tags.emotes[emote][0].endPosition)+1);
          const emoteImg = `<img src='https://static-cdn.jtvnw.net/emoticons/v2/${emote}/default/light/1.0' class='chat-emote' alt='${emoteText}' />`;
          
          newMessage = newMessage.replaceAll(emoteText, emoteImg);
        }

        // replace message content with new message in message object
        message.parameters = newMessage;
      }

      // limit messages that can be displayed at once, remove the first message in the array of messages if at the limit
      if (this.messagesToDisplay.length == this.messageLimit) this.messagesToDisplay.shift();
      this.messagesToDisplay.push(message);
    }
  },
  destroyed: function() {

  }
}
</script>
