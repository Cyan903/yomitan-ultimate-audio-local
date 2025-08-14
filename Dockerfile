FROM node:lts

# Install
WORKDIR /app
COPY package.json .
RUN npm i

# Build
COPY . .
RUN npm run build

# Run
CMD ["npm", "start"]

