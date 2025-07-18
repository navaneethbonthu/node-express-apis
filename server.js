const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("unCaughtException", (err) => {
  console.log(err);
  console.log("Un Caught Exception Occured :  Shutting down....");
  server.close(() => {
    process.exit(1);
  });
});

// console.log(process.env);
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log(conn);
    console.log("connection create successfully");
  });
// .catch((err) => {
//   console.log(err);
//   console.log("some error occured");
// });

const app = require("./app");
const port = process.env.port || 3000;

const server = app.listen(port, () => {
  console.log("server stared");
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("Un handled Rejection Occured :  Shutting down....");
  server.close(() => {
    process.exit(1);
  });
});
