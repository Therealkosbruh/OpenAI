import express from 'express';
import { main } from './function.mjs';

const app = express();
const port = 3002;

app.use(express.json());

app.post('/object-recognition', async (req, res) => {
const url = req.query.url || req.body.url;
  if (!url) {
    res.status(400).send({ error: 'URL not provided' });
    return;
  }
  try {
    const result = await main(url);
    res.json({ result: result })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});