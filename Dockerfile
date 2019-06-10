FROM node:10

ADD dist /app/dist
ADD package.json /app
ADD yarn.lock /app

RUN useradd -s /bin/bash -d /app user && \
    chown -R user:user /app
ENV NODE_ENV production

USER user
RUN cd /app && \
    yarn install

WORKDIR /app
CMD ["yarn", "start"]
