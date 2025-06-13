# MedTrack Africa - Backend

Backend pour la plateforme MedTrack Africa, une solution de traçabilité des médicaments utilisant la blockchain Hedera, l'IA et l'IoT.

## 🚀 Fonctionnalités

### 🔐 Authentification & Autorisation
- Système d'authentification JWT
- Gestion des rôles (admin, pharmacien, médecin, patient, fabricant, distributeur)
- Middleware de sécurité avec Helmet et rate limiting

### 🏥 Gestion des Centres de Santé
- CRUD complet des centres de santé
- Géolocalisation et cartographie
- Gestion des certifications et conformité

### 💊 Gestion des Médicaments
- Catalogue complet des médicaments
- Gestion des lots avec traçabilité blockchain
- QR codes pour vérification

### 🔗 Blockchain Hedera
- Création de NFTs pour chaque lot de médicaments
- Traçabilité infalsifiable via Hedera Consensus Service
- Transferts sécurisés entre centres de santé

### 🤖 Intelligence Artificielle
- Prédiction des besoins en stocks
- Prévision de la demande
- Optimisation de la distribution
- Détection d'anomalies

### 🌐 IoT & Monitoring
- Intégration MQTT pour capteurs IoT
- Surveillance température/humidité en temps réel
- Alertes automatiques
- Mise à jour automatique des stocks

### 📊 Rapports & Analytics
- Tableaux de bord en temps réel
- Rapports de conformité
- Statistiques de consommation
- Alertes et notifications

## 🛠️ Technologies Utilisées

- **Node.js** + **Express.js** - Serveur web
- **PostgreSQL** + **Sequelize** - Base de données
- **Hedera Hashgraph** - Blockchain et NFTs
- **TensorFlow.js** - Intelligence artificielle
- **MQTT** - Communication IoT
- **Socket.IO** - Communication temps réel
- **Redis** - Cache et sessions
- **Winston** - Logging
- **JWT** - Authentification

## 📦 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

4. **Configuration de la base de données**
```bash
# Créer la base de données PostgreSQL
createdb medtrack_africa

# Exécuter les migrations
npm run migrate
```

5. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

## 🔧 Configuration

### Variables d'environnement

Copiez `.env.example` vers `.env` et configurez :

- **Base de données** : PostgreSQL
- **Hedera** : Compte et clés Hedera Hashgraph
- **MQTT** : Broker pour IoT
- **JWT** : Secret pour l'authentification
- **Redis** : Cache (optionnel)

### Hedera Hashgraph

1. Créer un compte sur [Hedera Portal](https://portal.hedera.com/)
2. Obtenir votre Account ID et Private Key
3. Configurer les variables HEDERA_* dans .env

### MQTT (IoT)

1. Installer un broker MQTT (ex: Mosquitto)
2. Configurer MQTT_BROKER_URL dans .env

## 📡 API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `GET /api/v1/auth/profile` - Profil utilisateur

### Médicaments
- `GET /api/v1/medicines` - Liste des médicaments
- `POST /api/v1/medicines` - Créer un médicament
- `GET /api/v1/medicines/:id` - Détails d'un médicament

### Lots (Batches)
- `GET /api/v1/batches` - Liste des lots
- `POST /api/v1/batches` - Créer un lot avec NFT
- `GET /api/v1/batches/:id/verify` - Vérifier un lot

### Stocks
- `GET /api/v1/stocks` - Stocks par centre
- `PUT /api/v1/stocks/:id` - Mettre à jour stock
- `GET /api/v1/stocks/predictions` - Prédictions IA

### IoT
- `GET /api/v1/iot/devices` - Appareils IoT
- `POST /api/v1/iot/devices` - Ajouter un appareil
- `GET /api/v1/iot/data/:deviceId` - Données capteur

### IA
- `POST /api/v1/ai/predict-stock` - Prédiction stocks
- `POST /api/v1/ai/forecast-demand` - Prévision demande
- `GET /api/v1/ai/optimize-distribution` - Optimisation

## 🔄 Architecture

```
src/
├── models/          # Modèles Sequelize
├── routes/          # Routes API
├── services/        # Services (Hedera, IA, MQTT)
├── middleware/      # Middlewares Express
├── utils/           # Utilitaires
├── database/        # Configuration DB
└── server.js        # Point d'entrée
```

## 🧪 Tests

```bash
npm test
```

## 📝 Logging

Les logs sont stockés dans le dossier `logs/` :
- `error.log` - Erreurs uniquement
- `combined.log` - Tous les logs

## 🚀 Déploiement

### Docker (Recommandé)

```bash
# Build de l'image
docker build -t medtrack-backend .

# Lancement avec docker-compose
docker-compose up -d
```

### Serveur traditionnel

1. Installer Node.js 18+
2. Installer PostgreSQL
3. Configurer les variables d'environnement
4. Lancer avec PM2 pour la production

## 🔒 Sécurité

- Authentification JWT
- Rate limiting
- Validation des données
- Chiffrement des mots de passe
- Headers de sécurité (Helmet)
- Protection CORS

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE

## 📞 Support

Pour toute question ou support :
- Email: support@medtrack-africa.com
- Documentation: [docs.medtrack-africa.com](https://docs.medtrack-africa.com)

---

**MedTrack Africa** - Révolutionner la santé en Afrique grâce à la technologie 🌍💊🔗