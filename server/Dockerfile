# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
# We need the entities and other compiled assets as well
# In this specific project, dist should contain everything needed.
EXPOSE 5000
CMD ["npm", "start"]
