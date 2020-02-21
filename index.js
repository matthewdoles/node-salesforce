const chalk = require('chalk');
const auth = require('./auth');
const services = require('./services');

const execute = async () => {
  // Login
  const conn = await auth.login(true);

  // Query
  console.log(chalk.bold.red('Execute Query...'));
  const record = await services.selectRecordById(
    conn,
    'Account',
    process.env.SF_ACCOUNT_RECORD_ID,
    'Id, Name'
  );
  console.log(chalk.cyan('Current Account Name:'), record.Name);
  const newAccountName = 'Updated Account #' + Math.floor(Math.random() * 1000);
  console.log(chalk.cyan('Change Account Name To:'), newAccountName);

  // Update
  await services.updateRecordById(conn, 'Account', [{
    Id: record.Id,
    Name: newAccountName
  }]);

  // Verify
  console.log(chalk.bold.red('Execute Query...'));
  const updatedRecord = await services.selectRecordById(
    conn,
    'Account',
    record.Id,
    'Id, Name'
  );
  console.log(chalk.cyan('Updated Account Name:'), updatedRecord.Name);

  // services.retrieveMultipleRecordsById(conn, 'Account', updatedRecord.Id);
  // services.createRecord(conn, 'Account', { BillingStreet: 'My Account #1' });

  // Logout
  await auth.logout(conn);
};

execute();
