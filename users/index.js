const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');

app.use(cors({"origin": "*"}))

app.use(express.json())
app.use('/api', require('./routes/api/users'))

// Listen
app.listen(PORT)