const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findIndexByID(id){
  return repositories.findIndex(repositorie => repositorie.id === id);
}

function validateRepositorieID(request, response, next){
  const { id } = request.params;

  if(findIndexByID(id) < 0){
    return response.status(400).json({ erro: "Repositorie not found!"});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", validateRepositorieID, (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = findIndexByID(id);

  const { likes } = repositories[repositorieIndex];

  const repositorie = { 
    id, 
    title, 
    url, 
    techs,
    likes
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie)
});

app.delete("/repositories/:id", validateRepositorieID, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = findIndexByID(id);

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositorieID, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = findIndexByID(id);

  repositories[repositorieIndex].likes++;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
