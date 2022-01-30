import Joi from 'joi';

const userNameSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(14).alphanum().required()
  }
);

function checkUserName(user) {
  return userNameSchema.validate(user);
}

const messageSchema = Joi.object(
  {
    from: Joi.string(),
    to: Joi.string().trim().required(),
    text: Joi.string().trim().required(),
    type: Joi.string().valid('private_message', 'message'),
    time: Joi.string()
  }
);

function checkMessage(message) {
  return messageSchema.validate(message);
}

export { checkUserName, checkMessage };