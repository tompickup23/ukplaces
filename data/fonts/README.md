# Share-card fonts

Static-weight TrueType instances of the two faces the site self-hosts, used only by
the Satori share-card renderer (`src/lib/og.ts`). Satori cannot read the variable
woff2 files (their fvar table fails its parser), so these are the static TTFs that
fonts.googleapis.com serves for:

- Source Serif 4, weight 600: `SourceSerif4-SemiBold.ttf`
- Source Sans 3, weights 400 and 600: `SourceSans3-Regular.ttf`, `SourceSans3-SemiBold.ttf`

Both families are published by Adobe under the SIL Open Font Licence 1.1.
