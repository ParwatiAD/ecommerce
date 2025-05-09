const SECRET_KEY="YourSuperSecretKey";


const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/api', routes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const user = require('./routes/user');

dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api', user);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.error(err));
