FROM alpine:3.18.3 AS BUILD_IMAGE

RUN apk update && apk add nodejs yarn
WORKDIR /usr/src/app

COPY . .
RUN yarn install
RUN yarn build

FROM alpine:3.18.3
RUN apk add nodejs
WORKDIR /usr/src/app

# Install dependencies for Chrome
RUN apk add --no-cache \
  curl \
  g++ \
  gcc \
  gnupg \
  libc-dev \
  libstdc++ \
  linux-headers \
  make \
  nss \
  chromium \
  chromium-chromedriver

# Set up puppeteer ENV
ENV \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set up chrome ENV
ENV \
  CHROME_BIN=/usr/bin/chromium-browser \
  CHROME_PATH=/usr/lib/chromium/

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]
