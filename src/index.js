const express = require('express');

const app = express();


app.use('/', (req, res) => {
  res.json('Hello from Vercel with Express!');
});

app.listen(3001, () => {
  console.log('Server is running on port 3000');
})