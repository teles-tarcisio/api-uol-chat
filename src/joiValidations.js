import Joi from 'joi';

const userNameSchema = Joi.object(
  {
    name: Joi.string().trim().min(3).max(14).alphanum().required()
  }
);

function checkUserName(user) {
  return userNameSchema.validate(user);
}


export { checkUserName };