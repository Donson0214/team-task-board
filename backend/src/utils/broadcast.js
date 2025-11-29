let ioRef = null;

/**
 * Initialize socket reference on server startup.
 */
function setSocketIO(ioInstance) {
  ioRef = ioInstance;
}

/**
 * Emit event to all board members.
 */
function broadcastToBoard(boardId, event, data) {
  if (!ioRef) return;
  ioRef.to(boardId).emit(event, data);
}

module.exports = {
  setSocketIO,
  broadcastToBoard,
};
