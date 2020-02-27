const chalk = require('chalk');
const jsforce = require('../index');

const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

const execute = async () => {
  // Login
  const conn = await auth.login({ username, password });

  // Query
  console.log(chalk.bold.red('Execute Query...'));
  const record = await query.findOne(
    conn,
    'Account',
    process.env.SF_ACCOUNT_RECORD_ID,
    'Id, Name'
  );
  console.log(chalk.cyan('Current Account Name:'), record.Name);
  const newAccountName = 'Updated Account #' + Math.floor(Math.random() * 1000);
  console.log(chalk.cyan('Change Account Name To:'), newAccountName);

  // Update
  await services.updateMultipleRecords(
    conn,
    'Account',
    [
      {
        Id: record.Id,
        Name: newAccountName
      }
    ],
    { allOrNone: true, allowRecursive: true }
  );

  // Verify
  console.log(chalk.bold.red('Execute Query...'));
  const updatedRecord = await query.findOne(
    conn,
    'Account',
    record.Id,
    'Id, Name'
  );
  console.log(chalk.cyan('Updated Account Name:'), updatedRecord.Name);

  // Logout
  await auth.logout(conn);
};

const testCreateDelete = async () => {
  const conn = await auth.login({ username, password });
  const createResult = await services.createRecord(
    conn,
    'Account',
    {
      Name: 'My Account #1'
    },
    (err, res) => {
      console.log(err, res);
    }
  );
  console.log(createResult);
  const deleteResult = await services.deleteRecord(
    conn,
    'Account',
    createResult.id,
    (err, res) => {
      console.log(err, res);
    }
  );
  console.log(deleteResult);
  await auth.logout(conn);
};

const testRetrieve = async () => {
  const conn = await auth.login({ username, password });
  const record = await services.retrieveRecords(
    conn,
    'Account',
    process.env.SF_ACCOUNT_RECORD_ID,
    (err, rec) => {
      console.log(err, rec);
    }
  );
  console.log(record);
  await auth.logout(conn);
};

const testUpdate = async () => {
  const conn = await auth.login({ username, password });
  const result = await services.updateRecord(
    conn,
    'Account',
    {
      Id: process.env.SF_ACCOUNT_RECORD_ID,
      Name: 'Test Account Name'
    },
    (err, res) => {
      console.log(err, res);
    }
  );
  console.log(result);
  await auth.logout(conn);
};

const testQueryAndUpdate = async () => {
  const conn = await auth.login({ username, password });
  const result = await services.queryAndUpdateRecords(
    conn,
    'Contact',
    {
      Name: { $like: 'Ama%' }
    },
    {
      Phone: 1234567890
    },
    (err, res) => {
      console.log(err, res);
    }
  );
  console.log(result);
  await auth.logout(conn);
};

const testQueryAndUpdateWithFunction = async () => {
  const conn = await auth.login({ username, password });
  const result = await services.queryAndUpdateRecords(
    conn,
    'Contact',
    {
      Name: { $like: 'Ama%' }
    },
    rec => {
      console.log(rec);
      return { HomePhone: rec.Phone, Id: rec.Id };
    },
    (err, res) => {
      console.log(err, res);
    }
  );
  console.log(result);
  await auth.logout(conn);
};

const testQueryAndDelete = async () => {
  const conn = await auth.login({ username, password });

  const createResult = await services.createRecord(conn, 'Account', {
    Name: 'My Account #1'
  });
  console.log(createResult);

  const result = await services.queryAndDeleteRecords(
    conn,
    'Account',
    {
      Name: 'My Account #1'
    },
    (err, res) => {
      console.log(err, res);
    }
  );
  console.log(result);
  await auth.logout(conn);
};

const testSoqlQuery = async () => {
  const conn = await auth.login({ username, password });
  const records = await query.soqlQuery(
    conn,
    'Contact',
    {
      conditions: {
        Name: { $like: 'A%' }
      },
      fields: '*, Account.*',
      options: {
        limit: 5
      }
    },
    (err, recs) => {
      console.log(err, recs);
    }
  );
  console.log(records.length);
  await auth.logout(conn);
};

const testFindOne = async () => {
  const conn = await auth.login({ username, password });
  const record = await query.findOne(
    conn,
    'Account',
    {
      conditions: { Name: { $like: 'S%' } },
      fields: ['Id', 'Name']
    },
    (err, rec) => {
      console.log(err, rec);
    }
  );
  console.log(record);
  await auth.logout(conn);
};

const testSoslSearch = async () => {
  const conn = await auth.login({ username, password });
  const records = await query.soslSearch(
    conn,
    'FIND {Ab*} IN ALL FIELDS RETURNING Account(Id, Name), Lead(Id, Name)',
    (err, recs) => {
      console.log(err, recs);
    }
  );
  console.log(records.length);
  await auth.logout(conn);
};

const testDescribeObject = async () => {
  const conn = await auth.login({ username, password });
  const meta = await describe.describeObject(conn, 'Account', (err, meta) => {
    console.log('Label : ' + meta.label);
    console.log('Num of Fields : ' + meta.fields.length);
  });
  await setTimeout(() => {
    const cached = conn.sobject('Account').describe$();
    console.log('Label : ' + cached.label);
    console.log('Num of Fields : ' + cached.fields.length);
  }, 5000);
  await auth.logout(conn);
};

const testDescribeGlobal = async () => {
  const conn = await auth.login({ username, password });
  const meta = await describe.describeGlobal(conn, (err, meta) => {
    console.log(meta.sobjects.length);
  });
  await auth.logout(conn);
};

const testIdentity = async () => {
  const conn = await auth.login({ username, password });
  const response = await describe.identity(conn, (err, res) => {
    console.log('user ID: ' + res.user_id);
    console.log('organization ID: ' + res.organization_id);
    console.log('username: ' + res.username);
    console.log('display name: ' + res.display_name);
  });
  await auth.logout(conn);
};

const recent = async () => {
  const conn = await auth.login({ username, password });
  const results = await history.recent(conn, 'Case', (err, res) => {
    console.log(res);
  });
  await auth.logout(conn);
};

const recentlyUpdated = async () => {
  const conn = await auth.login({ username, password });
  const results = await history.recentlyUpdated(
    conn,
    'Contact',
    '2020-02-20',
    '2020-02-26',
    (err, res) => {
      console.log('Latest date covered: ' + res.latestDateCovered);
      console.log('Updated records : ' + res.ids.length);
    }
  );
  await auth.logout(conn);
};

const recentlyDeleted = async () => {
  const conn = await jsforce.login({ username, password });
  const results = await jsforce.recentlyDeleted(
    conn,
    'Contact',
    '2020-02-20',
    '2020-02-26',
    (err, res) => {
      console.log('Ealiest date available: ' + res.earliestDateAvailable);
      console.log('Latest date covered: ' + res.latestDateCovered);
      console.log('Deleted records : ' + res.deletedRecords.length);
    }
  );
  await jsforce.logout(conn);
};

recentlyDeleted();