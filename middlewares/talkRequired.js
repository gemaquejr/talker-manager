const talkRequired = (req, res, next) => {
    const { talk } = req.body;
    // Ajuda do monitor Rafael Carvalho
    if (talk === undefined || talk.rate === undefined || talk.watchedAt === undefined) {
        return res.status(400).json({ message:
            'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
        });
      }
      next();
};
module.exports = talkRequired;