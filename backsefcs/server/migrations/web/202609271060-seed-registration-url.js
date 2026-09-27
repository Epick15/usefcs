'use strict';

const currentRegistrationUrl = 'https://forms.gle/nmCRL66m2EfQrPY8A';

module.exports = {
  up: queryInterface => queryInterface.bulkUpdate(
    {tableName: 'Web_admission', schema: 'web'},
    {registration_url: currentRegistrationUrl, updated_at: new Date()},
    {registration_url: null}
  ),
  down: queryInterface => queryInterface.bulkUpdate(
    {tableName: 'Web_admission', schema: 'web'},
    {registration_url: null, updated_at: new Date()},
    {registration_url: currentRegistrationUrl}
  )
};
