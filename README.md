# Lab4_naqviku - Socket.IO Live Chat

A real-time browser chat application created from the official Socket.IO chat tutorial. It uses Node.js, Express, and Socket.IO and is configured for deployment as a Render Web Service.

## Features

- Real-time messages across browser tabs and devices
- Display-name entry
- Join and leave notices
- Online-user count
- Typing indicator
- Responsive interface
- Render-compatible dynamic port binding
- Health-check endpoint at `/health`

## Run locally

1. Install Node.js 18 or newer.
2. Open a terminal in this project folder.
3. Run:

```bash
npm install
npm start
```

4. Open `http://localhost:3000` in two browser tabs and send messages between them.

## Create the public GitHub repository

### Easiest method: GitHub website

1. Sign in at GitHub and create a new public repository named `Lab4_naqviku`.
2. Do not add a README, `.gitignore`, or licence during repository creation because those files are already included here.
3. In this project folder, run the following commands, replacing `YOUR-USERNAME`:

```bash
git init
git add .
git commit -m "Complete Socket.IO chat tutorial"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Lab4_naqviku.git
git push -u origin main
```

Your repository link will be:

```text
https://github.com/YOUR-USERNAME/Lab4_naqviku
```

## Deploy on Render

1. Sign in to Render and select **New > Web Service**.
2. Connect GitHub and select the public `Lab4_naqviku` repository.
3. Use these settings:

| Setting | Value |
| --- | --- |
| Language | Node |
| Branch | main |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Instance Type | Free |

4. Select **Create Web Service**.
5. When deployment finishes, open the assigned `https://...onrender.com` URL.
6. Test the live app in two browser tabs.

## Submission

Paste the two final links into the provided Word document:

- Public GitHub repository
- Live Render deployment

Then upload the document and add the same two links in the assignment comment section.
"# Lab4_naqviku" 
