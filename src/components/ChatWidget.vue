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
        // save original message
        let originalMessage = message.parameters;
        // reset message string in message object so we can add on what we need
        message.parameters = '';
        let thisMessage = '';
        let messageOffset = 0;

        for (const emote in message.tags.emotes) {
          thisMessage = ''
          message.tags.emotes[emote].forEach(thisEmote => { // for each instance of one emote
            // convert to ints so we can + 1 later
            thisEmote.startPosition = parseInt(thisEmote.startPosition);
            thisEmote.endPosition = parseInt(thisEmote.endPosition) + 1;

            const emoteText = originalMessage.substring(thisEmote.startPosition, thisEmote.endPosition);
            const emoteImg = `<img src='https://static-cdn.jtvnw.net/emoticons/v2/${emote}/default/light/1.0' class='chat-emote' alt='${emoteText}' />`;
            const stringBeforeEmote = originalMessage.substring(messageOffset, thisEmote.startPosition);

            console.log(`emoteText: ${emoteText}`)
            console.log(`emoteImg: ${emoteImg}`)
            console.log(`stringBeforeEmote: ${stringBeforeEmote}`)

            thisMessage += stringBeforeEmote + emoteImg
            console.log(`message in construction: ${thisMessage}`)
            messageOffset = thisEmote.endPosition
            console.log(`messageOffset: ${messageOffset}`)
          })
          message.parameters += thisMessage;
          // console.log(message.parameters);
        }
        // emotes are done, append the rest of the string after the last emote string
        message.parameters += originalMessage.substring(messageOffset, originalMessage.length)
        console.log(`final message: ${message.parameters}`)
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
