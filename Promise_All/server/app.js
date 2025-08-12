import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
const limiter = rateLimit({
  windowMs: 1000, 
  max: 5,        
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
