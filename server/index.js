const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Models.
require('./models');

// Establish connection to MongoDB.
require('./config/db');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

// Pass app to the authRoutes.
require('./routes/boardRoutes')(app);
/*require('./routes/surveyRoutes')(app);*/

console.log(' *** process.env.NODE_ENV', process.env.NODE_ENV);

// Serve static assets in production environment.
if (process.env.NODE_ENV === 'production') {
    console.log(' *** server runs in production environment');
    // Express will serve up production assets.
    // Like main.js and main.css.
    // This will return a certain file from client/build folder.
    app.use(express.static('../client/build'));

    // Express will serve up the index.html if it
    // doesn't recognize the route.
    // This request handler will send index.html back. To any unknown
    // request path.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
    });

    // app.use(express.static(path.join(__dirname, '../client/build/index.html')));
}

app.listen(PORT);
console.log(`Server is running at localhost:${PORT}`);
