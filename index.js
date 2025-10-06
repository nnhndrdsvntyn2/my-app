const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import your script
const cc1 = require('./scripts/cc1');

// Define endpoint /cc1
app.get('/cc1', async (req, res) => {
    try {
        const result = await cc1(); // runs your server-side script
        res.send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
