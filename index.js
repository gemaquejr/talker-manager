const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const {
  ageRequired, nameRequired, talkRequired, rateValidate, watchedAtValidate, tokenValidate,
} = require('./middlewares/index');

const app = express();
app.use(bodyParser.json());

// Ajuda do Pedro de Carvalho na Mentoria
async function readTalkers() {
  const data = await fs.readFile('./talker.json', 'utf8');
  return JSON.parse(data);
}

async function writeTalkers(setData) {
  const data = await fs.writeFile('./talker.json', setData);
  return JSON.stringify(data, null, 2);
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

  app.post('/login', (req, res) => {
    // regex consultada em: https://github.com/balajiadmane/JQuery-Validate-Email/blob/master/index.html
    const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const { email, password } = req.body;
    if (email === undefined) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (!regex.test(email)) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (password === undefined) {
      return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    res.status(200).json({ token: crypto.randomBytes(8).toString('hex') });
  });

  // Ajuda do monitor Rafael Carvalho

  app.post(
    '/talker',
    tokenValidate,
    nameRequired,
    ageRequired,
    talkRequired,
    rateValidate,
    watchedAtValidate,
    async (req, res) => {
    const { name, age, talk } = req.body;
    const data = await readTalkers();
    console.log(data);
    const addTalker = { id: data.length + 1, name, age, talk };
    const newTalker = JSON.stringify([...data, addTalker]);
    await writeTalkers(newTalker);
    res.status(201).json(addTalker);
  },
);

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
