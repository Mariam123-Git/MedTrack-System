FROM node:20

# Répertoire de travail dans le container
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Expose le port utilisé par ton serveur (par exemple 3000 ou 5000)
EXPOSE 3000

# Commande pour lancer ton serveur
CMD ["node", "src/server.js"]
