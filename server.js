require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT;
const userRouter = require('./router/userRouter');

const app = express()
app.use(express.json());
app.use('/api/v1', userRouter);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost: ${PORT}`);
});