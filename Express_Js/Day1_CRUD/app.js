const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
let players = [
  { id: 1, name: "Lionel Messi", club: "Inter Miami", goals: 819 },
  { id: 2, name: "Cristiano Ronaldo", club: "Al Nassr", goals: 850 },
  { id: 3, name: "Kylian Mbappé", club: "PSG", goals: 250 },
  { id: 4, name: "Neymar", club: "PSG", goals: 250 },
  { id: 5, name: "Robert Lewandowski", club: "Barcelona", goals: 850 },
  { id: 6, name: "Virgil van Dijk", club: "Liverpool", goals: 250 },
  { id: 7, name: "Kevin De Bruyne", club: "Manchester City", goals: 250 },
  { id: 8, name: "Erling Haaland", club: "Manchester City", goals: 250 },
  { id: 9, name: "Sadio Mane", club: "Liverpool", goals: 250 },
  { id: 10, name: "Mohamed Salah", club: "Liverpool", goals: 250 },
  { id: 11, name: "Mohammedsameer S", club: "Barcelona", goals: 860 },
];
app.post("/players", (req, res) => {
  const { name, club, goals } = req.body;
  const newPlayer = {
    id: players.length ? players[players.length - 1].id + 1 : 1,
    name,
    club,
    goals
  };
  players.push(newPlayer);
  res.status(201).json(newPlayer);
});

app.get("/players", (req, res) => {
  res.json(players);
});

app.get("/players/:id", (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.json(player);
});

app.put("/players/:id", (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  const { name, club, goals } = req.body;
  if (name) player.name = name;
  if (club) player.club = club;
  if (goals !== undefined) player.goals = goals;
  res.json(player);
});


app.delete("/players/:id", (req, res) => {
  const index = players.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Player not found" });
  }
  const deletedPlayer = players.splice(index, 1);
  res.json(deletedPlayer[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
