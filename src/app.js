const express = require('express');
const descriptionRoutes = require('./routes/descriptionRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const testcasesRoutes = require('./routes/testcasesRoutes');
require('dotenv').config();
const cors = require('cors');


const app = express();
app.use(cors({ origin: 'https://forntend-weightagesplit-1.onrender.com' }));



app.use(express.json());

app.use('/api/descriptions', descriptionRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/testcases', testcasesRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
