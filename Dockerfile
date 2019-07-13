FROM node:10-jessie

RUN apt-get update && apt-get install -f -y postgresql-client

RUN mkdir -p /srv/workshop
WORKDIR /srv/workshop/

ADD package.json package-lock.json /srv/workshop/

RUN npm ci

ADD ./ /srv/workshop

EXPOSE 3000

CMD ["./run.sh"]
