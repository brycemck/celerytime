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
      messagesToDisplay: [],
      bttvEmotes: null,
      sevenTvEmotes: [],
      sevenTvEmoteSets: null
    }
  },
  created: function() {
    // BTTV fetch
    this.getBTTVEmotes(import.meta.env.VITE_BTTV_PROVIDER_ID);
    // 7TV fetch
    this.getSevenTvEmoteSets(import.meta.env.VITE_7TV_USER_ID);
  },
  methods: {
    getBTTVEmotes: function(providerId) {
      this.bttvEmotes = fetch(`https://api.betterttv.net/3/cached/users/twitch/${providerId}`)
        .then((response) => response.json())
        .then((data) => {
          return data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getSevenTvEmoteSets: function(userId) {
      const that = this;
      this.sevenTvEmoteSets = fetch(`https://7tv.io/v3/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          let emoteSets = []

          data.emote_sets.forEach(emoteSet => {
            emoteSets.push(emoteSet)
          })

          that.sevenTvEmoteSets = emoteSets;
          that.getSevenTvEmotes();
          return data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getSevenTvEmotes: function() {
      const that = this;
      this.sevenTvEmoteSets.forEach(emoteSet => {
        const emoteSetFetch = fetch(`https://7tv.io/v3/emote-sets/${emoteSet.id}`)
          .then((response) => response.json())
          .then((data) => {
            return data
          })
          .catch((error) => {
            console.error(error)
          })
        
        emoteSetFetch.then((result) => {
          let emotes = []
          result.emotes.forEach(emote => {
            emotes.push(emote);
          })
          // console.log(emotes)
          that.sevenTvEmotes.push(emotes)
          // console.log(result)
        })
      })
    },
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
      
      // BTTV checks
      this.bttvEmotes.then((result) => {
        const originalMessage = message.parameters;
        let newMessage = originalMessage;
        let emotesArray = [];

        result.channelEmotes.forEach(emote => {
          emotesArray.push(emote)
        });
        result.sharedEmotes.forEach(emote => {
          emotesArray.push(emote)
        });
        emotesArray.forEach(emote => {
          newMessage = newMessage.replaceAll(emote.code, `<img src='https://cdn.betterttv.net/emote/${emote.id}/1x' class='chat-emote' alt='${emote.code}' />`);
        });

        if (newMessage === originalMessage) return;
        
        console.log('contained BTTV emote!')
        message.parameters = newMessage;
        // console.log(emotesArray)
      });

      // 7TV checks
      this.sevenTvEmotes[0].forEach(emote => {
        const originalMessage = message.parameters;
        let newMessage = originalMessage;

        newMessage = newMessage.replaceAll(emote.data.name, `<img src='https:${emote.data.host.url}/1x' class='chat-emote' alt='${emote.data.name}' />`)
        message.parameters = newMessage;
      });


      // limit messages that can be displayed at once, remove the first message in the array of messages if at the limit
      if (this.messagesToDisplay.length == this.messageLimit) this.messagesToDisplay.shift();
      this.messagesToDisplay.push(message);
    }
  },
  destroyed: function() {

  }
}
</script>
