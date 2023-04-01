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
