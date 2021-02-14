const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const cors = require('cors');

const mongoose = require('mongoose');
const projectRoute = require('./routes/projects-routes');
const difficultiesRoute = require('./routes/difficulties-routes');
const instrumentsRoute = require('./routes/instruments-routes');
const typeRoute = require('./routes/types-routes');
const usersRoute = require('./routes/users-routes');
const path = require('path');
const app = express();

const roleRoute = require('./routes/roles-routes');
const tabsRoute = require('./routes/tabs-routes');
const tutorialsRoute = require('./routes/tutorials-routes');
require('dotenv').config();

app.use(bodyParser.json());

app.use(cors('*'));
app.use(
  '/api/tweektabs/uploads/images',
  express.static(path.join('uploads', 'images'))
);
app.use(express.static(path.join('public')));

app.use('/api/tweektabs/projects', projectRoute); // => /api/places/...
//app.use('/api/tweektabs/courses', courseRoute); // => /api/places/...
app.use('/api/tweektabs/users', usersRoute); // => /api/users/...
app.use('/api/tweektabs/difficulties', difficultiesRoute);
app.use('/api/tweektabs/instruments', instrumentsRoute);
app.use('/api/tweektabs/types', typeRoute);
app.use('/api/tweektabs/roles', roleRoute);
app.use('/api/tweektabs/tabs', tabsRoute);
app.use('/api/tweektabs/tutorials', tutorialsRoute);
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
/*app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});
*/
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred.' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9wgqh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
