const rooms = {};

function socketManager(io) {
  io.on("connection", (socket) => {
    console.log(`Jugador conectado: ${socket.id}`)

    socket.on("joinRoom", ({ roomId, nameId }) => {
      socket.join(roomId)

      if (!rooms[roomId]) {
        rooms[roomId] = { players: [], moves: {}, names: {} };
      }

      const room = rooms[roomId];

      if (room.players.length >= 2) {
        socket.emit("roomFull")
        return
      }

      room.players.push(socket.id);
      room.names[socket.id] = nameId;

      if (room.players.length === 2) {
        const [p1, p2] = room.players;
        io.to(roomId).emit("startGame", {
          players: [room.names[p1], room.names[p2]]
        });
      }
    });

    socket.on("playerMove", ({ roomId, move }) => {
      const room = rooms[roomId];
      if (!room) return;

      room.moves[socket.id] = move;

      if (Object.keys(room.moves).length === 2) {
        const [p1, p2] = room.players;
        const m1 = room.moves[p1];
        const m2 = room.moves[p2];

        const winnerIndex = getWinner(m1, m2);
        let winnerName = null;

        if (winnerIndex !== "Empate") {
          const winnerSocketId = winnerIndex === 0 ? p1 : p2;
          winnerName = room.names[winnerSocketId];
        }

        io.to(roomId).emit("roundResult", {
          moves: {
            [room.names[p1]]: m1,
            [room.names[p2]]: m2,
          },
          result: winnerIndex === "Empate" ? "Empate" : `${winnerName} gana la partida!`
        });

        room.moves = {};
      }
    });

    socket.on("restartGame", ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;

      room.moves = {};

      const [p1, p2] = room.players;
      if (p1 && p2) {
      const names = [room.names[p1], room.names[p2]];
      io.to(roomId).emit("startGame", { players: names });
  }
});

socket.on("leaveRoom", ({roomId}) =>{
  socket.leave(roomId);
  console.log(`Socket ${socket.id} ha abandonado la sala ${roomId}`);
  socket.to(roomId).emit("opponentLeft", {message: "Tu oponente ha abandonado la sala!"});
})

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        if (room.players.includes(socket.id)) {
          room.players = room.players.filter(p => p !== socket.id);
          delete room.moves[socket.id];
          delete room.names[socket.id];

          io.to(roomId).emit("playerDisconnected");

          if (room.players.length === 0) {
            delete rooms[roomId];
          }
        }
      }
    });
  });
}

function getWinner(move1, move2) {
  if (move1 === move2) return "Empate";

  const beats = {
    agua: ["fuego"],
    fuego: ["planta"],
    planta: ["agua"]
  };

  return beats[move1].includes(move2) ? 0 : 1;
}

module.exports = socketManager;
