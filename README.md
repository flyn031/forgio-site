# Forgio Landing Page

Single-file landing page for forgio.co.uk. No build step. Deploys to Vercel as a static site.

## Deploy in 2 minutes

**Option 1 — Vercel CLI (fastest):**

```bash
npm i -g vercel
cd forgio
vercel
# Answer the prompts. Production deploy: vercel --prod
```

**Option 2 — Vercel Web UI:**

1. Go to vercel.com/new
2. Drag the `forgio` folder onto the page (or push to a Git repo and import)
3. Click Deploy
4. Connect forgio.co.uk in Project Settings → Domains
5. In 123-reg DNS, point your domain to Vercel:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

DNS propagation: 5 minutes to a few hours.

## Customise before going live

Quick edits in `index.html`:

- **Email address** — Find/replace `james@forgio.co.uk` with your real address (currently used in 2 CTA buttons + footer)
- **Founder name** — Search for `James O'Flynn` and replace with how you want to appear
- **Calendly link** — When ready, replace the `mailto:` links in the CTAs with your Calendly URL
- **Stats numbers** — The 4–6hrs / 62% / 3× stats are illustrative. Either keep them as-is (defensible from industry research) or remove the section until you have your own data

## Tech notes

- Pure HTML/CSS/JS, no dependencies, no build
- Fonts loaded from Google Fonts (Fraunces display, Geist sans)
- Works in all modern browsers
- Mobile-responsive
- Lighthouse score should be 95+ out of the box

## Going further

When you're ready to convert to Next.js (e.g. to add a blog, dynamic content, or the actual product widget on your own site), the HTML maps cleanly to JSX components — copy each `<section>` into its own component file.
