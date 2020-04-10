const express = require("express");

// const actionRouter = require("./routers/actions");
const projectRouter = require("./routers/projects");

const app = express();
app.use(express.json());

// app.use("/actions", actionRouter);
app.use("/projects", projectRouter);

app.get("/", (req, res) => {
   res.send("Welcome!");
});

const port = process.env.port || 5000;
try {
   app.listen(port);
   console.log("Server is listening on port:", port);
} catch (error) {
   console.log("Error starting server on port:", port);
}
