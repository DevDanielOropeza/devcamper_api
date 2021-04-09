const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");

//Loading ENV variables
dotenv.config({ path: "./config/config.env" });
//Connect to database
connectDB();
//Routes files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
// Upload Files
const fileupload = require("express-fileupload");
// Cookie parser
const cookieParser = require("cookie-parser");

const morgan = require("morgan");
const app = express();
//Body parser
app.use(express.json());
// File upload
app.use(fileupload());
// Cookie parser
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
//Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

//Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  //Error Handler
  app.use(errorHandler);
}
const PORT = process.env.PORT || 4000;
//Initializing Server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
