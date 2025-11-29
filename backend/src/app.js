const express = require("express");
const cors = require("cors");

const app = express();

const workspaceRouter = require("./modules/workspace/workspace.router");
const boardRouter = require("./modules/board/board.router");
const columnRouter = require("./modules/column/column.router");
const taskRouter = require("./modules/task/task.router");
const commentRouter = require("./modules/comment/comment.router");
const attachmentRouter = require("./modules/attachment/attachment.router");
const labelRouter = require("./modules/label/label.router");
const notificationRouter = require("./modules/notification/notification.router");
const deviceTokenRouter = require("./modules/deviceToken/deviceToken.router");
const auditRouter = require("./modules/audit/audit.router");

app.use(cors());
app.use(express.json());

// WORKSPACE ROUTES
app.use("/api/workspaces", workspaceRouter);

// BOARD ROUTES
app.use("/api/workspaces/:workspaceId/boards", boardRouter);

// COLUMN & TASK (must be here)
app.use("/api/workspaces/:workspaceId/boards/:boardId", columnRouter);
app.use("/api/workspaces/:workspaceId/boards/:boardId", taskRouter);
app.use("/api/workspaces/:workspaceId/boards/:boardId", commentRouter);
app.use("/api/workspaces/:workspaceId/boards/:boardId", attachmentRouter);

// MUST STAY AFTER COLUMN/TASK
app.use("/api", commentRouter);

// ❌ REMOVED THE BROKEN DUPLICATE ATTACHMENT ROUTE
// app.use("/api", attachmentRouter);  // <--- THIS WAS THE PROBLEM

app.use("/api", labelRouter);
app.use("/api", notificationRouter);
app.use("/api", deviceTokenRouter);
app.use("/api", auditRouter);

app.get("/", (req, res) => {
  res.send("TeamTaskBoard API is running...");
});

module.exports = app;
