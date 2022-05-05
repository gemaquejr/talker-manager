const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

app.get('/talker', async (_req, res) => {
  const data = await fs.readFile('./talker.json', 'utf8');
  if (data.length === 0) {
    return res.status(200).json(JSON.parse(data));
  }
  res.status(200).json(JSON.parse(data));
  });

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
