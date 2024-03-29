# To Do: Update Dockerfile for app folder change

FROM amazon/aws-lambda-nodejs:18 AS builder

WORKDIR /var/task

COPY ./package*.json ./
COPY ./utils ./utils

RUN npm install --omit=dev
RUN npm install sharp


FROM amazon/aws-lambda-nodejs:18 AS runner

WORKDIR /var/task

COPY --from=builder /var/task/package.json ./package.json
COPY --from=builder /var/task/node_modules ./node_modules

COPY ./ ./ 


ENV NODE_ENV=production
RUN npm run build --prefix app
CMD ["lambda.handler"]