## Requirements

Need to create server environment variables file (DO NOT COMMIT TO GIT)
`./server/.env` containing at least

```bash
# server/.env
API_KEY=<key>
API_SECRET=<secret>
```

## To Run

Run server

```bash
cd server && npm start
```

Run client

```bash
cd client && npm start
# close window that is opened
```

Make available using `ngrok`

```bash
ngrok http 5000
# open browser with https url provided
```
