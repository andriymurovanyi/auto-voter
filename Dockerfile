FROM alpine:3.18.3 AS BUILD_IMAGE

RUN apk update && apk add nodejs yarn
WORKDIR /usr/src/app

COPY . .
RUN yarn install
RUN yarn build


FROM alpine:3.18.3
RUN apk add nodejs
WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]
