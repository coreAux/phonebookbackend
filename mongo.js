const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// Function for listing the persons in the phonebook
// Only works if arguments are exactly 3
if (process.argv.length === 3) {
  const password = process.argv[2];

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const url = `mongodb+srv://fullstack:${password}@cluster0.kbbvk.mongodb.net/note-app?retryWrites=true&w=majority`;

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  Person.find({}).then((r) => {
    console.log("Phonebook:");
    r.forEach((p) => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
}

// Function for adding a person to the phonebook
// Only works if arguments are more than 3
if (process.argv.length > 3) {
  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];

  const url = `mongodb+srv://fullstack:${password}@cluster0.kbbvk.mongodb.net/note-app?retryWrites=true&w=majority`;

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((r) => {
    console.log(`Added ${name}, number ${number} to the Phonebook! ✅`);
    mongoose.connection.close();
    process.exit(1);
  });
}
