# Production build for PACESETTERS

# Backend Dockerfile
# (Save as backend/Dockerfile)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]

---
# Frontend Dockerfile
# (Save as frontend/Dockerfile)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

---
# Docker Compose
# (Save as docker-compose.yml in root)
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: ./backend/.env
    volumes:
      - ./backend/prisma/dev.db:/app/prisma/dev.db
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file: ./frontend/.env.local
    depends_on:
      - backend
