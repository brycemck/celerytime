# CELERYTIME CELERYTIME CELERYTIME CELERYTIME CELERYTIME CELERYTIME CELERYTIME

Some of this information eventually will be able to be gotten automatically, but for now we need the following variables thrown into a `.env.local` file at the root of the project:

```
# client ID for twitch developer application that you have to create at https://dev.twitch.tv/console
# when you create twitch developer application, set the callback url to [web server url]/login?response=true
VITE_TWITCH_CLIENT_ID=''

# user ID of the twitch user you want to subscribe to events about (not user, a number-string that was kinda hard to find without API usage good luck)
VITE_TWITCH_USER_ID=''

# lowercase name of channel to tell chat websocket to join
VITE_TWITCH_CHANNEL=''

# lowercase name of twitch username that made the developer application
VITE_TWITCH_NICK=''

# your bttv provider ID (if you want to support BTTV emotes)
VITE_BTTV_PROVIDER_ID=''

# your 7tv user ID (if you want to support 7TV emotes)
VITE_7TV_USER_ID=''
```

Also make sure to run `npm install` to get all necessary dependencies.

`npm run dev` runs the server.