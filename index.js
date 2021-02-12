require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
app.use(morgan("tiny"));

morgan.token("type", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":type", {
    skip: function (req, res) {
      return req.method !== "POST";
    },
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mickey",
    number: "031-919198",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>This is the root page :)</h1>");
});

app.get("/info", (req, res) => {
  const entries = persons.length;
  const date = new Date();

  res.send(`
    <p>Phonebook has info for ${entries} people</p>
    <p>${date}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

const generateId = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name && !body.number) {
    return res.status(400).json({
      error: "Name and number missing",
    });
  } else if (!body.name) {
    return res.status(400).json({
      error: "Name missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "Number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT} 🚀`);
