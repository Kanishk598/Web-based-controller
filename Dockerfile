# Copyright (c) 2018-present, GM Cruise LLC
#
# This source code is licensed under the Apache License, Version 2.0,
# found in the LICENSE file in the root directory of this source tree.
# You may not use this file except in compliance with the License.

# This is just for use in CI, as well as the base image for our proprietary version.
# This container is published at https://hub.docker.com/r/cruise/webviz-ci.

FROM node:10.22-slim

# Install some general dependencies for stuff below and for CircleCI;
# https://circleci.com/docs/2.0/custom-images/#required-tools-for-primary-containers
RUN apt-get update && apt-get install -yq gnupg libgconf-2-4 wget git ssh --no-install-recommends

# Install Google Chrome for Puppeteer.
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
RUN wget --no-check-certificate -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf --no-install-recommends
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV WEBVIZ_IN_DOCKER=true

# Bumped up from the default old_space size (512mb) as it was being exceeded during builds.
ENV NODE_OPTIONS="--max_old_space_size=4096"

WORKDIR /home/my_data
# ENTRYPOINT [ "/bin/bash" ]
# RUN npm install
CMD ["npm", "--node-options=--inspect", "run", "webviz-dev"]