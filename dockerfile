# Usa una imagen de Node.js para construir la aplicación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación con Vite
RUN npm run build

# Usa un servidor web ligero para servir la aplicación estáticamente
FROM nginx:alpine

# Copia los archivos generados en la carpeta `dist` al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Ejecuta Nginx
CMD ["nginx", "-g", "daemon off;"]
