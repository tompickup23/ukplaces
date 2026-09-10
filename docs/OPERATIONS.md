# Operations

## Production monitoring

`.github/workflows/production-monitor.yml` runs the production check every Monday and can be run manually. It requests the configured public site over HTTPS and verifies the home page, the Burnley place and constituency routes, the sitemap, and robots file. It also runs the production dependency audit. Until the GitHub repository and Pages deployment in the release checklist exist, the workflow is present but cannot run there.

For a local deployment check, start the built site and point the command at the local server:

```sh
UKPLACES_MONITOR_URL=http://127.0.0.1:4321 npm run check:production
```

## Weekly source refresh

The weekly refresh automation works from the sibling source repositories named in the build scripts. It only regenerates the local registry, signals, and constituency data from those source files; it must leave unconfirmed fields as `null` and never infer a value, date, URL, or coverage record.

When a source snapshot changes, run these commands in order:

```sh
npm run build:registry
npm run build:signals
npm run build:place-constituencies
npm run build:constituencies
npm run test:registry
npm run test:signals
npm run test:constituencies
npm run test:source-onboarding
npm run lint
npm run build
npm run check:text-size
npm run check:contrast
npm run check:sitemap
npm run check:parity
npm run audit:prod
```

Review the generated JSON diff before committing. The refresh routine must not push, deploy, alter DNS, or modify a source repository.
