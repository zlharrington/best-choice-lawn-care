# Best Choice Lawn Care

Website source for Best Choice Lawn Care in Hermiston, Oregon.

## Staging

Intended staging host: `bestchoice.harringtonwebtest.com`

The staging build is intentionally set to `noindex` until the client's production domain is connected.

## Deployment

This repository is configured for Cloudflare Workers Static Assets via `wrangler.jsonc`.

```bash
npx wrangler deploy
```

Static site files live in `public/`.

## Handoff

The repository is structured so it can be transferred to the client's GitHub account or organization at launch without changing the site architecture.
