#!/usr/bin/env bash

# Script expected to be run from project root directory via npm run.
#   ./scripts/make_dist_tar.sh 0.12.0 prod
# or
#   npm run make_dist_tar
# or
#   npm run make_dist_tar_staging


# Positional args for version and stage
VERS="${1:-0.0.0}"
STAGE="${2:-prod}"

if [ "${STAGE}" != "prod" ] && [ "${STAGE}" != "staging" ]
then
  echo "STAGE needs to be 'prod' or 'staging'"
  exit 1
fi

tar -cjf bravo_vue_${VERS}_${STAGE}.tgz -C dist .
echo "created bravo_vue_${VERS}_${STAGE}.tgz"
