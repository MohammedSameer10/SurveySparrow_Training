// server.js
import express from "express";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5,         // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many requests, please slow down!",
  },
});

app.use(limiter);

app.get("/api/contact/:id", (req, res) => {
  res.json({ id: req.params.id, status: "success" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
