const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Models.
require('./models');
/*require('./models/survey-model');*/

// Establish connection to MongoDB.
require('./config/db');
/*mongoose.connect(configKeys.mongoURI, {
    useMongoClient: true
});*/

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

// Pass app to the authRoutes.
require('./routes/boardRoutes')(app);
/*require('./routes/surveyRoutes')(app);*/

// Serve static assets in production environment.
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets.
    // Like main.js and main.css.
    // This will return a certain file from client/build folder.
    app.use(express.static('client/build'));

    // Express will serve up the index.html if it
    // doesen't recognize the route.
    // This request handler will send index.html back. To any unknown
    // request path.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
}

app.listen(PORT);
console.log(`Server is running at localhost:${PORT}`);
