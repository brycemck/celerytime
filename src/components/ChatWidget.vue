<template>
    <aside>
        <p v-for="(message, x) in messages" :key="x">
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
export default {
    name: 'ChatWidget',
    data() {
        return {
            messageLimit: 15
        }
    },
    props: [ 'messages' ],
    destroyed: function() {

    }
}
</script>
