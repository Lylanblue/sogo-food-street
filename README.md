# Sogo Food Street: From Apprentice to Owner

Browser-based 2D top-down Phaser MVP.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Open from phone on the same Wi-Fi

```bash
npm run dev:host
```

Then open:

```text
http://YOUR_COMPUTER_LAN_IP:5173
```

Example:

```text
http://192.168.1.23:5173
```

Your phone and computer must be on the same Wi-Fi, and Windows Firewall may need to allow Node.js.

## Make a public link for WeChat

The game is a static frontend, so it can be deployed to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static web host.

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```

After deployment, copy the generated HTTPS URL and send it in WeChat.

## Deploy to GitHub Pages

This project includes `.github/workflows/deploy.yml`, so GitHub can build and publish the game automatically.

1. Create a GitHub repository, for example:

```text
sogo-food-street
```

2. Upload or push this project to the repository's `main` branch.

3. Open the repository on GitHub:

```text
Settings -> Pages -> Build and deployment -> Source
```

Choose:

```text
GitHub Actions
```

4. Wait for the workflow named `Deploy to GitHub Pages` to finish.

5. Your game link will look like:

```text
https://YOUR_GITHUB_USERNAME.github.io/REPOSITORY_NAME/
```

For example:

```text
https://xiaolongsu777.github.io/sogo-food-street/
```
