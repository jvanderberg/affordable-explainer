# Oak Park Housing Affordability Explainer

**[Read the live interactive explainer →](https://jvanderberg.github.io/affordable-explainer/)**

A scroll-driven visual story about how Oak Park, Illinois, creates affordable housing—and why building more homes is part of protecting affordability.

The explainer follows three connected ideas:

- New housing begins expensive, then becomes ordinary housing as it ages.
- New construction helps immediately by making room for successive household moves, eventually opening older, lower-cost homes.
- Targeted subsidy and market-rate supply do different jobs: subsidy protects people the market cannot reach, while supply expands housing choices at scale.

Interactive chapters visualize Oak Park's construction slowdown in the 1980s and 1990s, the household moves created by one new apartment, and the local record: 1,751 new multifamily homes alongside a net increase of 1,350 homes counted as affordable.

## Data and research

The analysis draws on:

- U.S. Census Bureau American Community Survey table B25034
- Illinois Housing Development Authority AHPAA affordability lists
- Village of Oak Park, *Strategic Vision for Housing*
- Published research on new housing, household moves, nearby rents, and filtering

Method notes and direct source links appear throughout the explainer. Census year-built figures describe the housing stock still standing and do not count demolished homes.

## Development

The site is built with Next.js and React and exported as a static site. Node.js 22.13 or newer is required.

```bash
npm install
npm run dev
```

Run `npm test` to perform the production build and rendered-content check. Run `npm run build:pages` to create the static export in `out/`.

## Publishing

Pushes to `main` automatically build and deploy the site through GitHub Pages using [the Pages workflow](.github/workflows/pages.yml).
