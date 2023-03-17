FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ./app /app
EXPOSE 8888
CMD ["node","app.mjs"]
