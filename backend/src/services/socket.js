import { Server } from 'socket.io';

export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Ajuste selon tes besoins de sécurité
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket :', socket.id);

    socket.on('disconnect', () => {
      console.log('Déconnexion WebSocket :', socket.id);
    });

    // Exemple d'événement personnalisé
    socket.on('alert', (data) => {
      console.log('Alerte reçue :', data);
      // Tu peux émettre à tous :
      io.emit('newAlert', data);
    });
  });
}
