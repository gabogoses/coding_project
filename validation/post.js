const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Le message doit comporter entre 10 et 300 caractères';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Le champ texte est requis';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
