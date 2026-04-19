const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

dbConnect();

app.use(cors());
app.use(express.json());

// Serve images
app.use("/images", express.static(path.join(__dirname, "..", "src", "images")));

// Routes theo đúng yêu cầu đề bài
app.use("/user", UserRouter);
app.use("/photosOfUser", PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(3002, () => {
  console.log("server listening on port 3002");
});
