const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

let tasks = [
    { id: 1, title: 'Faire les courses', completed: false },
    { id: 2, title: 'Promener le chien', completed: true },
    { id: 3, title: 'Appeler maman', completed: false },
  ];
  
var jsonParser = bodyParser.json()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// Afficher la liste des tâches
app.get('/', (req, res) => {
    res.render('index', { tasks });
  });
  
  // Ajouter une nouvelle tâche (endpoint API)
  app.post('/api/tasks',jsonParser, (req, res) => {
    console.log("POST /tasks")
    console.log(`Received body: ${JSON.stringify(req.body)}`)
    const task = {
      id: tasks.length + 1,
      title: req.body.title,
      completed: false,
    };
    tasks.push(task);
    res.json(task);
  });
  
  // Marquer une tâche comme terminée (endpoint API)
  app.put('/api/tasks/:id', (req, res) => {
    console.log("PUT /tasks")
    const id = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === id);
  
    if (task) {
      task.completed = !task.completed;
      res.json(task);
    } else {
      res.status(404).send('Tâche non trouvée');
    }
  });
  
  // Supprimer une tâche (endpoint API)
  app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);
  
    if (index !== -1) {
      tasks.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).send('Tâche non trouvée');
    }
  });
  
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
