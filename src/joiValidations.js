import Joi from 'joi';

const userNameSchema = Joi.string().trim().min(1).max(14).alphanum().required();

async function checkUserName(targetName) {
  try {
    return await userNameSchema.validateAsync(targetName);
  } catch (error) {
    console.log('nome inválido', error.details);
  }
}



export { checkUserName };