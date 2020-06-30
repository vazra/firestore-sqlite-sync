# Notes

- Parcel performs no type checking (yet). "You can use `tsc --noEmit` to have typescript check your files". From reading the issue this is apparently coming to Parcel v2 (which as it stands is currently in Alpha).
- `yarn build` will ensure paths are relative. Without specifying `--public-url ./` paths are absolute by default.
- For both `yarn build` and `yarn dev`, I have specified a `build/prod` and `build/dev` folder to keep things tidy. Without specifying `--out-dir`, both tasks would have compiled un-minified and minified code into a folder called dist.
- targets were not available in Parcel2 docs, got it from https://github.com/parcel-bundler/parcel/blob/c9748bcb7778062b626bb30445a2e7c1478a5a5b/packages/core/test-utils/src/utils.js#L183
- In Parcel2, --out-file is removed, instead path should instead be be specified in package.json "Default"

- When `sideEffects: false` is specified in the package.json, Parcel can skip processing some assets entirely (e.g. not transpiling the lodash function that weren't imported) or not include them in the output bundle at all (e.g. because that asset merely does reexporting).
