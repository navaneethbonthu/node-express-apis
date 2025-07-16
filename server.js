const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

console.log(process.env);
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log(conn);
    console.log("connection create successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("some error occured");
  });

const app = require("./app");
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server stared");
});
