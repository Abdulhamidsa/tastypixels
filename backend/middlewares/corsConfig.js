const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "https://tastypixels.vercel.app", "https://tastypixels.up.railway.app", "https://api.norpus.com", "https://tastypixels-vnvi-git-improvments-abdulhamidsas-projects.vercel.app"];

const corsOptionsDelegate = function (req, callback) {
  const origin = req.header("Origin");
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, {
      origin: true,
      credentials: true,
      optionsSuccessStatus: 200,
    });
  } else {
    console.warn("Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  }
};

module.exports = cors(corsOptionsDelegate);
