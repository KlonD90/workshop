FROM node:10-jessie

RUN mkdir -p /srv/workshop
WORKDIR /srv/workshop/

ADD package.json package-lock.json /srv/workshop/

RUN npm ci

ADD ./ /srv/workshop

EXPOSE 3000

CMD ["node", "workshop.js"]
