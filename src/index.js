const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const talkersFile = 'src/talker.json';
const app = express();

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  DELETE: 204,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
};

const crypto = require('crypto');

const {
  tokenVer,
  emailVer,
  senhaVer,
  nameVer,
  ageVar,
  talkVer,
  rateVer,
  watchedVer,
} = require('../middleware/middleware');

app.use(bodyParser.json());

const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_STATUS.OK).send();
});

app.get('/talker', (request, response) => {
  fs.readFile(talkersFile, (err, data) => {
  if (err) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);

    return response.status(HTTP_STATUS.OK).json(JSON.parse(data.toString()));
  });
});

app.get('/talker/search', tokenVer, (request, response) => {
  const { q } = request.query;
  fs.readFile(talkersFile, (err, data) => {
    if (err) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);

    const talkers = JSON.parse(data.toString()).filter((talk) =>
      talk.name.toLowerCase().includes(q.toLowerCase()));

    return response.status(HTTP_STATUS.OK).json(talkers);
  });
});

app.get('/talker/:id', (request, response) => {
  fs.readFile(talkersFile, (err, data) => {
    if (err) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);

    const { id } = request.params;
    const talkers = JSON.parse(data.toString());
    const talker = talkers.find((talk) => talk.id === +id);
    if (!talker) {
      return response
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Pessoa palestrante não encontrada' });
    }
    return response.status(HTTP_STATUS.OK).json(talker);
  });
});

app.post(
  '/talker',
  tokenVer,
  nameVer,
  ageVar,
  talkVer,
  rateVer,
  watchedVer,
  (request, response) => {
    fs.readFile(talkersFile, (err, data) => {
      if (err) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);

      const { name, age, talk } = request.body;
      const talkers = JSON.parse(data.toString());
      const talker = { id: talkers.length + 1, name, age, talk };
      talkers.push(talker);

      fs.writeFile(talkersFile, JSON.stringify(talkers), (err2) => {
        if (err2) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err2);
        return response.status(HTTP_STATUS.CREATED).json(talker);
      });
    });
  },
);

app.put(
  '/talker/:id',
  tokenVer,
  nameVer,
  ageVar,
  talkVer,
  rateVer,
  watchedVer,
  (request, response) => {
    fs.readFile(talkersFile, (err, data) => {
      if (err) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);
      const { name, age, talk } = request.body;
      const talkers = JSON.parse(data.toString()).filter((t) => t.id !== +request.params.id);
      const talker = {
        id: talkers.length + 1,
        name,
        age,
        talk,
      };
      talkers.push(talker);
      fs.writeFile('src/talker.json', JSON.stringify(talkers), (error) => {
        if (error) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);
      });
      return response.status(HTTP_STATUS.OK).json(talker);
    });
  },
);

app.delete('/talker/:id', tokenVer, (request, response) => {
  fs.readFile(talkersFile, (err, data) => {
    if (err) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);
    const talkers = JSON.parse(data.toString()).filter((t) => t.id !== +request.params.id);

    fs.writeFile('src/talker.json', JSON.stringify(talkers), (error) => {
      if (error) return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err);
    });
    return response.status(HTTP_STATUS.DELETE).json();
  });
});

app.listen(PORT, () => {
console.log(`Listening to port ${PORT}`);
});

app.post('/login', emailVer, senhaVer, (request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  return response.status(HTTP_STATUS.OK).json({ token });
});
