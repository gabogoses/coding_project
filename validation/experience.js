const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Le titre du poste est requis';
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = 'Le champ société est requis';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'La date est requise';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
