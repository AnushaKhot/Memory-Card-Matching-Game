const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/memory-game", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define the schema for users and scores
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

// Get all users and scores
app.get("/api/scores", async (req, res) => {
  const scores = await User.find().sort({ score: 1 });
  res.json(scores);
});

// Add a new user and score
app.post("/api/scores", async (req, res) => {
  const { username, score } = req.body;
  const newUser = new User({ username, score });
  await newUser.save();
  res.json({ message: "Score added" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
