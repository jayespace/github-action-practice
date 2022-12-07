FROM node:16.14.2
WORKDIR /app
COPY package.json .

# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ]; \
#     then npm install; \
#     else npm install -- only=production; \
#     fi

RUN npm install
COPY . ./
EXPOSE 8080
CMD ["npm", "start"]