const express = require("express")
const server = express()
// const cors = require("cors")
const shortid = require("shortid")


server.use(express.json())
// server.use(cors())

let users = [
    {
        id: shortid.generate(),
        name: "Bruce Wayne",
        bio: "Billionaire Vigilante",
    },
]
server.post("/api/users", (req, res) => {
    const newUser = req.body;
    newUser.id = shortid.generate();
    
    if (!newUser.name || !newUser.bio){
        res.status(400).json({errorMessage: "Please provide name and bio for this user"})
    } else {
        users.push(newUser);
        res.status(201).json(newUser)
    }

    if (users.includes(newUser) === false){
        res.status(500).json({errorMessage: "Error saving to database"})
    }
})
server.get("/", (req, res) => {
    res.status(200).json("Success");
})
server.get("/api/users", (req, res) => {
    
 
    res.status(200).json(users);
})

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const find = users.find(f => f.id === id)

    if (find){
        res.status(200).json(find)
    } else if (!find){ 
        res.status(404).json({errorMessage: "The user with the specified ID does not exist"})
    } else {
        res.status(500).json({errorMessage: "The user information could not be retrieved"})
    }
})

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const find = users.find(f => f.id === id);
    const filterOut = users.filter(f => f.id !== id)

    if(find){
        users = filterOut
        res.status(200).json(find)
    } else if (users.length === 0){
        res.status(500).json({errorMessage: "The user could not be removed"})
    } else {
        res.status(400).json({errorMessage: "User with specified ID cannot be found"})
    }
})

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    let foundID = users.find(h => h.id === id);

    if(!foundID){
        res.status(404).json({errorMessage: "User does not exist"})
    } else if (!changes.name || !changes.bio){
        res.status(400).json({errorMessage: "Please provide name and bio for user"})
    } else if (foundID){
        Object.assign(foundID, changes);
        res.status(200).json(foundID)
    } else {
        res.status(500).json({errorMessage: "User could not be edited"})
    }
})

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);

