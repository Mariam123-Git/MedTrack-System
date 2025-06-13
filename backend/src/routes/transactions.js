
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Transactions récupérées' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Nouvelle transaction enregistrée' });
});

export default router;

