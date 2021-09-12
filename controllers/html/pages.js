const router = require('express').Router();
const { User } = require('../../models/User');
const { Chat } = require('../../models/Chat');
const { Message } = require('../../models/Message');
const { withAuth } = require('../../utils/withAuth');

router.get('/', (req, res) => {
  res.render('homepage');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.get('/welcome', withAuth, async (req, res) => {
  const data = await Chat.findAll({
    raw: true,
    attributes: ['chat_name'],
    include: [
      {
        model: User,
        where: {
          id: req.session.user_id
        }
      }
    ]
  });

  console.log('daata', data);
  const userChats = data.map(chat => {
    Object.keys(chat).map(key => {
      const newKey = key.replace(/\./g, '_');
      chat[newKey] = chat[key];
    });
    return chat;
  });
  console.log('userChats', userChats);
  const options = { userChats, session: req.session };
  res.render('welcome', options);
});

router.get('/chat/:id', withAuth, async (req, res) => {
  if (!req.params.id) {
    res.redirect('/welcome');
  }

  const allMessages = await Message.findAll({
    raw: true,
    where: {
      chat_id: req.params.id
    }
  });

  res.render('chat', { allMessages });
});

router.get('*', (req, res) => {
  res.redirect('/welcome');
});

module.exports = router;
