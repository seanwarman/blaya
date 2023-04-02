# Blaya

Generate a *track-list.js* file before starting the app.

```bash
$ touch track-list.js
$ chmod +x ls_s3.sh
$ ./ls_s3.sh track-list.js
```

This will create your tracklist file to serve to the FE. Note that the ls_s3.sh
script uses awscli to access s3 so you have to have it configured to work.

## Envs

Make a .env file and add:

```bash
BASIC_AUTH_USERS=username:password,username2:password2
PORT=3000
```

To add more users just keep adding to this variable.

# TODO

### Playlists
- play tracks in playlist (next button and onnext)
- ~~have playlist ui follow the data (set get)~~
- make mobile look good and usable
- ~~persist playlists in localStorage~~

## Features
- Back button should always play the previously played track.
- The playlists should show as tabs above the playlist name
- Multi select songs to set as offline
- Have a query param that allows linking to a particular track /?track=q334cX <-- this would be the track's id
