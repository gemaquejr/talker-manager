const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// Ajuda do Pedro de Carvalho na Mentoria
async function readTalkers() {
  const data = await fs.readFile('./talker.json', 'utf8');
  return JSON.parse(data);
}

app.get('/talker', async (_req, res) => {
  const data = await readTalkers();
  if (data.length === 0) {
    return res.status(200).json(data);
  }
  res.status(200).json(data);
  });

  app.get('/talker/:id', async (req, res) => {
    const { id } = req.params;
    const data = await readTalkers();
    const datas = data.find((talker) => (talker.id === Number(id)));
    if (!datas) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(datas);
    });

  app.post('/login', (req, res) => 
    res.status(200).json({ token: crypto.randomBytes(8).toString('hex') }));

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
