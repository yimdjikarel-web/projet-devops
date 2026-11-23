
# Utiliser Node.js 22 comme environnement de base
FROM node:22-alpine

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier le fichier qui décrit les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code de notre application
COPY server.js ./

# Indiquer que l'application utilise le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

