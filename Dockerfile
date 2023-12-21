FROM node:18.16.0-alpine as base

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN yarn run build

# Start production image build
FROM node:18.16.0-alpine

WORKDIR /opt/shortlinks.service
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./dist ./dist

CMD ["node", "dist/index.js"]