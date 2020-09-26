var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("image", (userId, image) => {
    socket.broadcast.emit("image", userId, image);
  });

  // socket.on("audio", (userId, audio) => {
  //   socket.broadcast.emit("audio", userId, audio);
  // });

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnected", socket.id);
    console.log(`User ${socket.id} disconnected`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
