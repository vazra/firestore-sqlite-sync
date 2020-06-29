# Notes

- Parcel performs no type checking (yet). "You can use `tsc --noEmit` to have typescript check your files". From reading the issue this is apparently coming to Parcel v2 (which as it stands is currently in Alpha).
- `yarn build` will ensure paths are relative. Without specifying `--public-url ./` paths are absolute by default.
- For both `yarn build` and `yarn dev`, I have specified a `build/prod` and `build/dev` folder to keep things tidy. Without specifying `--out-dir`, both tasks would have compiled un-minified and minified code into a folder called dist.
