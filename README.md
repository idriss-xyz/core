# IDRISS
This is the open-source repository for IDRISS apps.

## Interfaces
* <a href="https://idriss.xyz" target="_blank">IDRISS landing page</a>
* <a href="https://idriss.xyz/twitch-extension" target="_blank">Twitch Extension</a>
* <a href="https://idriss.xyz/extension" target="_blank">IDRISS Extension</a>

* <a href="https://idriss.xyz/vault" target="_blank">Vault</a>

## Install dependecies
In the root, run

```bash
pnpm install
```

to install dependencies for all apps in this monorepo.

### Build (extension)
To compile the extension, run

```bash
pnpm extension:prod
```
Results will appear in buildResults directory: ./buildResults/firefox and ./buildResults/chromium


### Build (Landing page / IDRISS App / Vault)

To compile and run the landing page and IDRISS App locally, run these commands in separate terminals:

```bash
pnpm main-landing:dev
```

```bash
pnpm creator-api:dev
```

The landing page is running on port `3000`, the api on port `4000`.

Remember to configure API keys in `apps/creator-api/.env.development` for the `creator-api` backend and in `/apps/main-landing/.env.development` for the `creator` app.


### Socials / Resources
* <a href="https://x.com/idriss_xyz" target="_blank">X (Twitter)</a>
* <a href="https://farcaster.xyz/idriss_" target="_blank">Farcaster</a>
* <a href="https://www.idriss.xyz/discord" target="_blank">Discord</a>
* <a href="https://docs.idriss.xyz/" target="_blank">Docs</a>
* <a href="https://docs.idriss.xyz/resources/brand" target="_blank">Brand</a>

### License

This project is licensed under [GPLv3](https://github.com/idriss-xyz/core/blob/master/LICENSE).
