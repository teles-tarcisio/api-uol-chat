import Joi from 'joi';

const userNameSchema = Joi.string().trim().min(3).max(14).alphanum().required();

function checkUserName(targetName) {
  try {
    return userNameSchema.validate(targetName);
  } catch (error) {
    console.log('nome inválido ->', error.details[0].type);    
  }
}


export { checkUserName };