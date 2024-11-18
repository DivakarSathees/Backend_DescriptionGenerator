const express = require('express');
const descriptionRoutes = require('./routes/descriptionRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const testcasesRoutes = require('./routes/testcasesRoutes');
const downloadRotes = require('./routes/downloadRoutes');
const path = require('path');
const archiver = require("archiver");
const fs = require("fs");

require('dotenv').config();
const cors = require('cors');


const app = express();
app.use(cors({ origin: ['https://forntend-weightagesplit-1.onrender.com', 'http://localhost:4200'] }));



app.use(express.json());

app.use('/api/descriptions', descriptionRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/testcases', testcasesRoutes);
app.use('/api/download', downloadRotes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
