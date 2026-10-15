# Sentiro

Personal and family safety app. Two functions carry equal weight: knowing when
someone leaves and arrives, and a distress button that alerts the circle while
the phone sounds a siren.

Decisions live in Google Drive, folder `Sentiro`, file
`03_SENTIRO_DECISIONS_LOCKED.md`. `INDEX.md` in that folder says which document
is current.

## Run it on a phone

```bash
cd sentiro
npm install
npx expo start
```

Scan the QR code with Expo Go. No Google Maps API key is needed for this:
Expo Go supplies its own, and on iOS the map is Apple Maps.

A key of our own is required only for a store binary. The Maps SDKs themselves
bill at no cost; a Google Cloud billing account still has to exist.

## What is built

| Screen | State |
| --- | --- |
| היום | Arrival and departure feed, grouped by part of day. Example data. |
| אני | Mark "left" and "arrived" by hand, and start a 15 minute walk-with-me. |
| מעגל | Real map, member pins, the two saved places as geofence circles, battery per member. |
| SOS | Hold two seconds anywhere on the app's bottom pill. Local siren, circle acknowledgements, stop code. |

The circle alert cannot be recalled once sent. The code stops the siren only.

## Not built yet

No backend. `src/data.js` holds example data, and the acknowledgements in the
siren overlay are simulated on a timer. Next: the Supabase schema and the real
fan-out, per the architecture in `01_SENTIRO_SYSTEM_DESIGN_MVA.md`.

## Checks

```bash
npx eslint .                      # clean
npx expo export --platform ios    # bundles, 643 modules
```

`npx expo install` and `npx expo lint` cannot reach Expo's API from the cloud
session that wrote this, so dependency versions were taken from
`node_modules/expo/bundledNativeModules.json` and ESLint was configured by hand
in `eslint.config.js`. Both are the versions Expo SDK 57 expects.

## The siren file

`assets/siren.wav` is generated, not recorded. Regenerate with:

```bash
node tools/make-siren.js
```
