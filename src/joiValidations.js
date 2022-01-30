import Joi from 'joi';

const userNameSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(14).alphanum().required()
  }
);

const messageSchema = Joi.object(
  {
    from: Joi.string(),
    to: Joi.string().trim().required(),
    text: Joi.string().trim().required(),
    type: Joi.string().valid('private_message', 'message'),
    time: Joi.string()
  }
);

const limitMessagesSchema = Joi.object(
  {
    limit: Joi.number().min(0)
  }
);

function checkUserName(user) {
  return userNameSchema.validate(user);
}

function checkMessage(message) {
  return messageSchema.validate(message);
}

function checkLimitedMessages(limit) {
  return limitMessagesSchema.validate(limit);
}

export { checkUserName, checkMessage, checkLimitedMessages };