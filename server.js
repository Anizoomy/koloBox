require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT;
const cors = require('cors');
const userRouter = require('./router/userRouter');
const setupSwagger = require('./swagger/swagger');

const app = express()
app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use('/api/v1', userRouter);

app.get('/', (req, res) => {
  res.send('Welcome to KoloBox API!!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost: ${PORT}`);
});