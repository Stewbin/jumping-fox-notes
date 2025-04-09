const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./UserSchema');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoString = process.env.MONGO_URI;
mongoose.connect(mongoString, {
    dbName: 'lab', 
});

const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database Connected'));

// Signup Endpoint
app.post('/createUser', async (req, res) => {
    console.log(`SERVER: CREATE USER REQ BODY: ${req.body.username} ${req.body.firstName} ${req.body.lastName}`);
    const { firstName, lastName, username, password } = req.body;

    try {
        const userExists = await User.exists({ username }); // Check if username already exists
        if (userExists) {
            console.log("Username already exists");
            return res.status(400).send("Username already exists");
        }

        const user = new User({ firstName, lastName, username, password });  // Create a new user
        await user.save();

        console.log(`User created! ${user}`);
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Login Endpoint
app.get('/getUser', async (req, res) => {
    console.log(`SERVER: GET USER REQ BODY: ${req.query}`);
    const { username, password } = req.query;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`); // Start the server
});