const { login, updateRecord, updateMultipleRecords } = require('../index');

test('Should update record (w/ callback)', async () => {
  const conn = await login({
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD
  });
  updateRecord(
    conn,
    'Account',
    {
      Id: process.env.SF_ACCOUNT_RECORD_ID,
      Name: 'Test Account Name'
    },
    (err, res) => {
      expect(res).toBeTruthy();
      expect(err).toBeFalsy();
    }
  );
});

test('Should update record (w/out callback)', async () => {
  const conn = await login({
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD
  });
  const updateResult = await updateRecord(conn, 'Account', {
    Id: process.env.SF_ACCOUNT_RECORD_ID,
    Name: 'Test Account Name'
  });
  expect(updateResult).toBeTruthy();
});

test('Should update multiple records (w/ callback)', async () => {
  const conn = await login({
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD
  });
  updateMultipleRecords(
    conn,
    'Account',
    [
      {
        Id: process.env.SF_ACCOUNT_RECORD_ID,
        Name: 'Test Account Name'
      }
    ],
    {},
    (err, res) => {
      expect(res).toBeTruthy();
      expect(err).toBeFalsy();
    }
  );
});

test('Should update multiple records (w/out callback)', async () => {
  const conn = await login({
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD
  });
  const updateResult = await updateMultipleRecords(
    conn,
    'Account',
    [
      {
        Id: process.env.SF_ACCOUNT_RECORD_ID,
        Name: 'Test Account Name'
      }
    ],
    {}
  );
  expect(updateResult).toBeTruthy();
});