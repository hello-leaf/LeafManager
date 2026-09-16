import express from "express";
import { tasksRouter } from "./tasksRouter.js";
import { usersRouter } from "./usersRouter.js";

const app = express();

app.use(express.json());

app.use("/tasks", tasksRouter);
app.use("/auth", usersRouter);

app.get("/", (_, res) => {
  return res.json({
    message: "Leaf Manager API"
  });
});

app.listen(3000, async () => {
  console.log(`Server is running on http://localhost:3000`);
});
