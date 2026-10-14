'use strict';

module.exports = {
  up: queryInterface => queryInterface.sequelize.query(`
    UPDATE web."Web_content"
    SET
      login_entity_name = COALESCE(login_entity_name, 'SEGUNDA ESPECIALIDAD FCS'),
      login_welcome_title = COALESCE(login_welcome_title, 'Bienvenido!'),
      login_welcome_description = COALESCE(login_welcome_description, 'Inicie en su cuenta y explore las funcionalidades del software de gestion de SEGUNDA ESPECIALIDAD FCS'),
      login_form_title = COALESCE(login_form_title, 'Iniciar Sesion'),
      login_form_description = COALESCE(login_form_description, 'Por favor Ingrese Usuario y Contraseña')
  `),
  down: () => Promise.resolve()
};
