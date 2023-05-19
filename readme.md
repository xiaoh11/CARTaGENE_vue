# Bravo Vue UI
User interface for BRAVO.
This Vue3 project uses multiple stand alone pages (apps) instead of a single page application as a 
transition step from the legacy design and implementation.

## Development

### Setup 
Install dependencies
```
npm install
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Testing
Automatically watch the js files and run the tests whenever one changes.
```sh
fd '\.(js|Vue|vue)$' . | entr -c npm run test:unit
```

### Compiles and hot-reloads for development
Uses constants defined in `.env` file.
```sh
npm run serve
```

## Builds and distribution
There are two kinds of builds for this project, debug and production.
The debug builds are non-minified and used for hot reloads during local development.
The production builds are minified for deployment on the staging or production servers.

### Compiles and minifies for production
Production build configuration needs to be in a `.env.production` file.
This will override values in the .env file.
```sh
npm run build
```

### Compiles and minifies for staging
Staging build is a production build with different constants for oauth, sub-title, etc.
Configuration for this mode needs to be in a `.env.staging` file.
This will override values in the .env file.
```sh
npm run build_staging
```

### Create tarball for github release
To facilitate deployment systems, release gzipped tarfiles of the contents of `dist/` provided as github releases.
```sh
npm run make_tar
```
Create a tar dist using staging config.
```sh
npm run make_tar_staging
```

### Deploy dist/ to S3
In staging and production the UI is served out of an AWS cloud front distribution. 
The following is the script used to push to the backing bucket manually.
```sh
#!/usr/bin/env bash

PROFILE="yourprofile"
BUCKET_NAME="bucket-backing-ui-cdn"
S3BUCKET="s3://${BUCKET_NAME}"

# Push all files to bucket
aws --profile ${PROFILE} s3 cp --recursive dist/ ${S3BUCKET}
```
