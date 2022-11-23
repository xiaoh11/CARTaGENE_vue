# Bravo Vue UI
User interface for BRAVO.
This Vue3 project uses multiple stand alone pages (apps) instead of a single page application as a 
transition step from the legacy design and implementation.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
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
## Development

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Testing
Automatically watch the js files and run the tests whenever one changes.
```r
fd '\.(js|Vue|vue)$' . | entr -c npm run test:unit
```
