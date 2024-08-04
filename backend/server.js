const express = require("express");
require("module-alias/register");
require("dotenv").config({ path: "./.env.local" });
const bodyParser = require("body-parser");
const cors = require("@/middlewares/cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const recipeRoutes = require("@/routes/recipeRoutes");
const authRoutes = require("@/routes/authRoutes");
const userRoutes = require("@/routes/userRoutes");
const updateLikeDislikeRoutes = require("@/routes/updateLikeDislikeRoutes");
const commentRoutes = require("@/routes/commentRoutes");
const addCommentRoutes = require("@/routes/addCommentRoutes");
const app = express();
const port = 8000;

app.use(cookieParser());
app.use(cors);

app.use(
  session({
    name: "sessionId",
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://aboood:UNBFqjTpLgeUMQkl@cluster0.bn3dcrh.mongodb.net/tastypixels" }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(bodyParser.json());
app.use("/recipes", recipeRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api", updateLikeDislikeRoutes);
app.use("/api", commentRoutes);
app.use("/api", addCommentRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
