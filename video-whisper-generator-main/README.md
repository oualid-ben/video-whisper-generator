
# VideoGen Pro - Générateur de Vidéos Personnalisées

Un SaaS complet pour générer automatiquement des vidéos personnalisées pour des prospects à partir d'un fichier CSV.

## 🎯 Fonctionnalités

### Frontend (React + TypeScript + Tailwind)
- ✅ Interface multi-étapes progressive
- ✅ Upload de vidéos avec prévisualisation
- ✅ Import CSV avec mapping intelligent des colonnes
- ✅ Suivi en temps réel des générations
- ✅ Landing pages personnalisées pour chaque prospect
- ✅ Dashboard administrateur
- ✅ Téléchargement des vidéos générées

### Backend (À implémenter)
Le backend Node.js devra inclure les composants suivants :

#### 1. API REST (Express.js)
```javascript
// Structure des endpoints principaux
POST /api/upload/video     // Upload des vidéos
POST /api/upload/csv       // Upload du fichier CSV  
POST /api/generate         // Lancer la génération
GET  /api/jobs             // Statut des générations
GET  /api/jobs/:id         // Détails d'une génération
GET  /api/videos/:id       // Télécharger une vidéo
GET  /api/landing/:id      // Données pour landing page
```

#### 2. Service de Génération Vidéo
```javascript
const VideoGenerator = {
  // Capture d'écran du site web
  async captureWebsite(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1920, height: 1080 });
    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
  },

  // Fusion vidéo avec ffmpeg
  async mergeVideos(mainVideo, backgroundImage, outputPath) {
    const command = ffmpeg()
      .input(backgroundImage)
      .input(mainVideo)
      .complexFilter([
        // Redimensionner le fond
        '[0:v]scale=1920:1080[bg]',
        // Redimensionner la vidéo bulle
        '[1:v]scale=480:270[bubble]',
        // Superposer en bas à gauche
        '[bg][bubble]overlay=50:750'
      ])
      .output(outputPath);
    
    return new Promise((resolve, reject) => {
      command.on('end', resolve).on('error', reject).run();
    });
  },

  // Concaténation avec vidéo secondaire
  async concatenateVideos(video1, video2, output) {
    const command = ffmpeg()
      .input(video1)
      .input(video2)
      .on('end', () => console.log('Concaténation terminée'))
      .mergeToFile(output, './temp/');
    
    return command;
  }
};
```

#### 3. Queue de Traitement (Bull/Redis)
```javascript
const videoQueue = new Queue('video generation', {
  redis: { port: 6379, host: '127.0.0.1' }
});

videoQueue.process(async (job) => {
  const { prospectData, videoFiles } = job.data;
  
  // 1. Capture du site web
  const screenshot = await VideoGenerator.captureWebsite(prospectData.websiteUrl);
  
  // 2. Génération de la vidéo principale
  const mainVideoPath = await VideoGenerator.mergeVideos(
    videoFiles.main,
    screenshot,
    `./output/${job.id}-main.mp4`
  );
  
  // 3. Concaténation si vidéo secondaire
  let finalVideoPath = mainVideoPath;
  if (videoFiles.secondary) {
    finalVideoPath = await VideoGenerator.concatenateVideos(
      mainVideoPath,
      videoFiles.secondary,
      `./output/${job.id}-final.mp4`
    );
  }
  
  return { videoPath: finalVideoPath };
});
```

#### 4. Modèles de Données (MongoDB/Mongoose)
```javascript
const JobSchema = new mongoose.Schema({
  id: String,
  prospect: {
    firstName: String,
    lastName: String,
    company: String,
    websiteUrl: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  },
  progress: { type: Number, default: 0 },
  videoUrl: String,
  landingPageUrl: String,
  error: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
```

#### 5. Configuration Docker
```dockerfile
FROM node:18-alpine

# Installation des dépendances système
RUN apk add --no-cache \
    chromium \
    ffmpeg \
    python3 \
    make \
    g++

# Variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3001

CMD ["npm", "start"]
```

#### 6. Variables d'Environnement
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/videogen
REDIS_URL=redis://localhost:6379
UPLOAD_DIR=./uploads
OUTPUT_DIR=./output
MAX_FILE_SIZE=100MB
CONCURRENT_JOBS=5
```

## 🚀 Installation et Démarrage

### Frontend (déjà configuré)
```bash
npm install
npm run dev
```

### Backend (à implémenter)
```bash
cd backend
npm install
npm run dev
```

### Services requis
```bash
# MongoDB
docker run -d -p 27017:27017 --name videogen-mongo mongo

# Redis
docker run -d -p 6379:6379 --name videogen-redis redis

# Ou avec docker-compose
docker-compose up -d
```

## 📋 TODO Backend

1. **Setup Express.js + TypeScript**
   - Configuration de base
   - Middleware (cors, helmet, rate-limiting)
   - Gestion des erreurs
   
2. **Upload et Stockage**
   - Multer pour les uploads
   - Validation des fichiers
   - Stockage cloud (AWS S3 / Google Cloud)
   
3. **Traitement Vidéo**
   - Integration Puppeteer pour screenshots
   - Pipeline ffmpeg pour fusion/concaténation
   - Gestion des formats et codecs
   
4. **Queue et Jobs**
   - Bull Queue avec Redis
   - Retry logic et error handling
   - Progress tracking en temps réel
   
5. **Base de Données**
   - Modèles Mongoose
   - Migrations et seeds
   - Indexation pour performance
   
6. **API WebSocket**
   - Socket.io pour updates temps réel
   - Notifications de progression
   - Gestion des déconnexions
   
7. **Monitoring et Logs**
   - Winston pour logging
   - Prometheus metrics
   - Health checks

## 🎨 Design System

- **Couleurs primaires** : Dégradé violet/bleu (#8B5CF6 → #3B82F6)
- **Couleurs de statut** : 
  - Succès : #10B981
  - Erreur : #EF4444
  - En cours : #3B82F6
  - En attente : #6B7280
- **Typographie** : Inter (system fonts)
- **Animations** : Transitions fluides, micro-interactions

Le frontend est entièrement fonctionnel avec des données simulées. Il suffit maintenant d'implémenter le backend pour avoir un SaaS complet !
