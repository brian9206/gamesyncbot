FROM node:10

ADD src /app/src
ADD package.json /app
ADD yarn.lock /app
ADD .babelrc /app

RUN useradd -s /bin/bash -d /app user && \
    chown -R user:user /app

USER user
RUN cd /app && \
    yarn install && \
    yarn build && \
    rm -rf node_modules src .babelrc && \
    yarn install --prod

ENV NODE_ENV production

WORKDIR /app
CMD ["yarn", "start"]
