import express from 'express';
const router = express.Router();

// Exemple de routes
router.get('/', (req, res) => {
  res.json({ message: 'Récupération de toutes les alertes' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Création d’une alerte' });
});

// Exportation par défaut
export default router;
