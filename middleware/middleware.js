const tokenVer = (request, response, next) => {
  const token = request.headers.authorization;
  if (!token) return response.status(401).json({ message: 'Token não encontrado' });
  if (token.length !== 16) return response.status(401).json({ message: 'Token inválido' });
  next();
};
const emailVer = (request, response, next) => {
  const { email } = request.body;
  if (!email) return response.status(400).json({ message: 'O campo "email" é obrigatório' });
  const emailValidateRegex = new RegExp(/^[a-z0-9]+@[a-z0-9]+\.[a-z0-9]+$/);
  if (!emailValidateRegex.test(email)) {
    return response.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};
const senhaVer = (request, response, next) => {
  const { password } = request.body;
  if (!password) return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length <= 6) {
    return response.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};
const nameVer = (request, response, next) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return response.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};
const ageVar = (request, response, next) => {
  const { age } = request.body;
  if (!age) {
    return response.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return response.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};
const rateVer = (request, response, next) => {
  const { talk } = request.body;
  if (talk.rate === undefined) {
    return response.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(talk.rate)) {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (talk.rate < 1 || talk.rate > 5) {
    return response.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};
const talkVer = (request, response, next) => {
  const { talk } = request.body;
  if (!talk) return response.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};
const watchedVer = (request, response, next) => {
  const { talk } = request.body;
  if (!talk.watchedAt) {
    return response.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  const validDateRegex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/);
  if (!validDateRegex.test(talk.watchedAt)) {
    return response.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

module.exports = {
  tokenVer,
  emailVer,
  senhaVer,
  nameVer,
  ageVar,
  rateVer,
  talkVer,
  watchedVer,
};
