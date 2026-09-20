FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "server.js"]
