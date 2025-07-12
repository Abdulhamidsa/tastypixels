const express = require("express");
require("module-alias/register");
require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const corsConfig = require("@/middlewares/corsConfig");
const cookieParser = require("cookie-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
const port = process.env.SERVER_PORT || 3000;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for tastypixels",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cookieParser());
app.use(corsConfig);
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
