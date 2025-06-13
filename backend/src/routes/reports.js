import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Liste des rapports' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Création d’un rapport' });
});

export default router;