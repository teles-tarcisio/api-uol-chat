import Joi from 'joi';

const userNameSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(16).alphanum().required()
  }
);

const messageSchema = Joi.object(
  {
    from: Joi.string().required(),
    to: Joi.string().trim().required(),
    text: Joi.string().trim().required(),
    type: Joi.string().valid('private_message', 'message'),
    time: Joi.string()
  }
);

const limitMessagesSchema = Joi.object(
  {
    limit: Joi.number().min(1)
  }
);

function checkUserName(user) {
  return userNameSchema.validate(user);
}

function checkMessage(message) {
  return messageSchema.validate(message);
}

export {
  checkUserName,
  checkMessage,
};
