# Estágio 1: Build - Usa Node.js para compilar os arquivos do React
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Final - Usa Nginx para servir os arquivos estáticos compilados
FROM nginx:1.21-alpine
# Copia os arquivos da pasta build do estágio anterior para a pasta do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copia nossa própria configuração (vamos criar a seguir)
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]