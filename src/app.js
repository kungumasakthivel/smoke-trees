const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

const routes = require('./routes/routes');
app.use('/', routes)

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    return res.send("API working");
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}, http://localhost:${PORT}`));