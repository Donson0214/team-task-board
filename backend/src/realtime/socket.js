let io = null;

function initSocket(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join workspace room
    socket.on("join-workspace", (workspaceId) => {
      socket.join(`workspace_${workspaceId}`);
      console.log(`User joined workspace room ${workspaceId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });
}

function emitToWorkspace(workspaceId, event, data) {
  if (!io) return;
  io.to(`workspace_${workspaceId}`).emit(event, data);
}

module.exports = { initSocket, emitToWorkspace };
