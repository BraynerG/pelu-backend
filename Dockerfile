FROM node:18-slim

# Instalar Chromium y dependencias de sistema necesarias para Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurar variables para que Puppeteer use el Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# Instalar dependencias limpias
RUN npm ci

COPY . .

# Generar el cliente de Prisma para PostgreSQL
RUN npx prisma generate

# Compilar la aplicación NestJS
RUN npm run build

EXPOSE 3000

# Iniciar en producción
CMD ["npm", "run", "start:prod"]
