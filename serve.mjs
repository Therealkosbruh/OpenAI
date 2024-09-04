
import express from 'express';
import { main } from './function.mjs';
import {getGoogleLensData} from './serpApi.mjs'

const app = express();
const port = 80;

app.use(express.json());


app.post('/object-recognition', async (req, res) => {
  const url = req.query.url || req.body.url;
  if (!url) {
    res.status(400).send({ error: 'URL not provided' });
    return;
  }
  try {
    const result = await main(url);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/google-lens', async (req, res) => {
  const url = req.body.url || req.query.url;
  if (!url) {
    res.status(400).send({ error: 'URL не указан' });
    return;
  }
  try {
    const results = await getGoogleLensData(url);
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
