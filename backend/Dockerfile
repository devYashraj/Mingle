FROM node:lts-slim
WORKDIR /backend
COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
copy . .
EXPOSE 3000
ENV PORT 3000
CMD ["node", "index.js"]