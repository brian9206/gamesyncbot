FROM node:10

ADD package.json /app
ADD yarn.lock /app
ADD src /app/src

RUN useradd -s /bin/bash -d /app user && \
    chown -R user:user /app

USER user
RUN cd /app && \
    yarn install && \
    yarn build && \
    rm -rf node_modules src && \
    yarn install --prod

ENV NODE_ENV production

WORKDIR /app
CMD ["yarn", "start"]
