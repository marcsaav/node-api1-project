const express = require('express')
const shortid = require('shortid')


const server = express()

server.use(express.json())

let users = [
    {
        id: shortid.generate(),
        name: 'Marcos Saavedra',
        bio: 'Lambda Student'
    }
]

const User = {
    createNew(user) {
        const newUser = {
            id: shortid.generate(),
            name: user.name,
            bio: user.bio
        }
        users.push(newUser)
        return newUser
    },
    getAll() {
        return users
    },
    getUserById(id) {
        const user = users.find((u) => u.id === id)
        return user
    },
    delete(id) {
        const userToDelete = users.find((u) => u.id === id)
        if(userToDelete) {
            users = users.filter((u) => u.id !== id)
        }
        return userToDelete
    },
    update(id, changes) {
        const userToUpdate = users.find((u) => u.id === id)
        const updatedUser = {id, ...changes}

        if(updatedUser) {
            users = users.map((u) => {
                if(u.id === id) {
                    return updatedUser
                } else {
                    return u
                }
            })
        } else {
            return null
        }
        return updatedUser
    }
}

// endpoints

server.post('/api/users', (req, res) => {
    const user = req.body

    if(!user.name || !user.bio) {
        res
            .status(400)
            .json({
                message: 'User name and bio required!'
            })
    } else if(user.name && user.bio) {
        const newUser = User.createNew(user)

        res
            .status(201)
            .json(newUser)
    } else {
        res
            .status(500)
            .json({
                message: 'There was an error saving the user to the database.'
            })
    }
})

server.get('/api/users', (req, res) => {
    const allUsers = User.getAll()

    if(allUsers) {
        res
            .status(200)
            .json(allUsers)
    } else {
        res
            .status(500)
            .json({
                message: 'Users information could not be retrieved.'
            })
    }
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    const user = User.getUserById(id)

    if(!user) {
        res
            .status(404)
            .json({
                message: 'User with the specified id does not exist.'
            })
    } else {
        res
            .status(200)
            .json(user)
    }
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id
    const deletedUser = User.delete(id)

    if(deletedUser) {
        res
            .status(200)
            .json(deletedUser)
    } else {
        res
            .status(404)
            .json({
                message: 'User with specified id does not exist.'
            })
    }
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id
    const changes = req.body

    const updatedUser = User.update(id, changes)

    if(updatedUser) {
        res
            .status(200)
            .json(updatedUser)
    } else {
        res
            .status(404)
            .json({
                message: 'User with specified id does not exist.'
            })
    }
})



// catch-all

server.use('*', (req, res) => {
    res
        .status(404)
        .json({
            message: 'Not Found'
        })
})

// start server

server.listen(3000, () => {
    console.log('listening on port 3000')
})