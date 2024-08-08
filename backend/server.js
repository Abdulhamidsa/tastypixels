const express = require("express");
require("module-alias/register");
require("dotenv").config({ path: "./.env.local" });
const bodyParser = require("body-parser");
const corsConfig = require("@/middlewares/corsConfig");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const recipeRoutes = require("@/routes/recipeRoutes");
const authRoutes = require("@/routes/authRoutes");
const userRoutes = require("@/routes/userRoutes");
const updateLikeDislikeRoutes = require("@/routes/updateLikeDislikeRoutes");
const commentRoutes = require("@/routes/commentRoutes");
const addCommentRoutes = require("@/routes/addCommentRoutes");
const deleteCommentRoutes = require("@/routes/deleteCommentRoutes");
const uploadRoutes = require("@/routes/uploadRoutes");
const deletePostRoutes = require("@/routes/deletePostRoutes");
const editPostRoutes = require("@/routes/editPostRoutes");
const userValidationRoutes = require("@/routes/userValidationRoutes");
const app = express();
const port = 8000;

app.use(cookieParser());
app.use(corsConfig);

// app.use(
//   session({
//     name: "sessionId",
//     secret: process.env.SESSION_SECRET || "yourSecretKey",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//     cookie: {
//       httpOnly: true,
//       secure: "production",
//       sameSite: "None",
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

app.use(bodyParser.json());
app.use("/recipes", recipeRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api", updateLikeDislikeRoutes);
app.use("/api", commentRoutes);
app.use("/api", addCommentRoutes);
app.use("/api", deleteCommentRoutes);
app.use("/api", uploadRoutes);
app.use("/api", deletePostRoutes);
app.use("/api", editPostRoutes);
app.use("/api/validation", userValidationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
