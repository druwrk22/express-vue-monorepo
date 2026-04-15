const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('latihan', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Book = sequelize.define('Book', {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING }
});

sequelize.sync();

app.get('/books', async (req, res) => res.json(await Book.findAll()));

app.post('/books', async (req, res) => res.json(await Book.create(req.body)));

app.put('/books/:id', async (req, res) => {
    await Book.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Updated" });
});

app.delete('/books/:id', async (req, res) => {
    await Book.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log('Server running on port 3000'));