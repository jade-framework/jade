const crypto = require('crypto');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-2',
  apiVersion: 'latest',
});

const { promisify } = require('util');

const asyncPut = promisify(documentClient.put.bind(documentClient));
const asyncUpdate = promisify(documentClient.update.bind(documentClient));

const appsTableName = 'JadeProjects';
const versionsTableName = 'JadeProjectsVersions';

// const documentClient = new AWS.DynamoDB.DocumentClient({
//   region: 'eu-west-2',
//   apiVersion: 'latest',
// });

// const params = {
//   TableName: 'JadeProjects',
//   FilterExpression: 'projectName = :name',
//   ExpressionAttributeValues: { ':name': 'My Jade Project' },
// };

// documentClient.scan(params, function (err, data) {
//   if (err) console.log(err);
//   else console.log(data);
// });

const updateDynamo = async (webhook, initialData) => {
  console.log('Updating Dynamo...');
  // const uniqueId = crypto.randomBytes(16).toString('hex');
  // initialData.projectId = `${parseName(initialData.projectName)}-${uniqueId}`;
  // initialData.commitUrl = webhook.head_commit.url;
  // const versionsItem = versionsItemToPut(initialData);
  // const promise1 = putDynamoItem(versionsTableName, versionsItem);
  // const promise2 = updateAppsTable(initialData);

  const {
    projectId,
    gitUrl,
    bucketName,
    cloudFrontOriginId,
    cloudFrontOriginDomain,
    cloudFrontDomainName,
    publicIp,
    versionId,
    commitUrl,
    projectName,
  } = initialData;

  const item = {
    projectId,
    gitUrl,
    bucketName,
    cloudFrontOriginId,
    cloudFrontOriginDomain,
    cloudFrontDomainName,
    publicIp,
    versionId,
    commitUrl,
    projectName,
  };

  try {
    await asyncPut({
      TableName: versionsTableName,
      Item: item,
    });
    await asyncUpdate({
      TableName: appsTableName,
      Key: { projectName, projectId },
      UpdateExpression: 'SET activeVersion = :v',
      ExpressionAttributeValues: {
        ':v': versionId,
      },
    });
    // , builds = list_append(builds, :build)
    // ':build': [item],

    console.log('DynamoDB table updated.');
  } catch (err) {
    console.log(err);
  }
};

const parseName = (name) => {
  name = name
    .replace(/\s+/gi, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '');
  if (name.length === 0) name = 'jade-framework';
  return name;
};

const initialData = {
  projectName: 'My New Jade Project',
  gitExists: true,
  gitUrl: 'https://github.com/jade-framework/gatsby-default',
  bucketName: 'mynewjadeproject-c0610b65d97305df9f05e039295980bb',
  bucketNames: [
    'mynewjadeproject-c0610b65d97305df9f05e039295980bb-prod',
    'mynewjadeproject-c0610b65d97305df9f05e039295980bb-builds',
    'mynewjadeproject-c0610b65d97305df9f05e039295980bb-lambda',
    'mynewjadeproject-c0610b65d97305df9f05e039295980bb-stage',
  ],
  lambdaNames: 'jadeInvalidateCloudFrontFile',
  cloudFrontOriginId: 'S3-mynewjadeproject-c0610b65d97305df9f05e039295980bb',
  cloudFrontOriginDomain:
    'mynewjadeproject-c0610b65d97305df9f05e039295980bb-prod.s3.amazonaws.com',
  createdOn: '2020-08-14T16:32:15.961Z',
  projectId: 'mynewjadeproject-c0610b65d97305df9f05e039295980bb',
  gitFolder: 'gatsby-default',
};

const webhook = {
  ref: 'refs/heads/master',
  before: '9afc33355b20171022975c8d3a1fa9f2be45db1f',
  after: '0f7f1ab4ce046f0b38526a30cca56da536328df9',
  repository: {
    id: 286340343,
    node_id: 'MDEwOlJlcG9zaXRvcnkyODYzNDAzNDM=',
    name: 'gatsby-default',
    full_name: 'jade-framework/gatsby-default',
    private: false,
    owner: {
      name: 'jade-framework',
      email: null,
      login: 'jade-framework',
      id: 68447912,
      node_id: 'MDEyOk9yZ2FuaXphdGlvbjY4NDQ3OTEy',
      avatar_url: 'https://avatars0.githubusercontent.com/u/68447912?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/jade-framework',
      html_url: 'https://github.com/jade-framework',
      followers_url: 'https://api.github.com/users/jade-framework/followers',
      following_url:
        'https://api.github.com/users/jade-framework/following{/other_user}',
      gists_url: 'https://api.github.com/users/jade-framework/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/jade-framework/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/jade-framework/subscriptions',
      organizations_url: 'https://api.github.com/users/jade-framework/orgs',
      repos_url: 'https://api.github.com/users/jade-framework/repos',
      events_url:
        'https://api.github.com/users/jade-framework/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/jade-framework/received_events',
      type: 'Organization',
      site_admin: false,
    },
    html_url: 'https://github.com/jade-framework/gatsby-default',
    description: null,
    fork: false,
    url: 'https://github.com/jade-framework/gatsby-default',
    forks_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/forks',
    keys_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/keys{/key_id}',
    collaborators_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/collaborators{/collaborator}',
    teams_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/teams',
    hooks_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/hooks',
    issue_events_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/issues/events{/number}',
    events_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/events',
    assignees_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/assignees{/user}',
    branches_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/branches{/branch}',
    tags_url: 'https://api.github.com/repos/jade-framework/gatsby-default/tags',
    blobs_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/git/blobs{/sha}',
    git_tags_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/git/tags{/sha}',
    git_refs_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/git/refs{/sha}',
    trees_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/git/trees{/sha}',
    statuses_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/statuses/{sha}',
    languages_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/languages',
    stargazers_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/stargazers',
    contributors_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/contributors',
    subscribers_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/subscribers',
    subscription_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/subscription',
    commits_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/commits{/sha}',
    git_commits_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/git/commits{/sha}',
    comments_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/comments{/number}',
    issue_comment_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/issues/comments{/number}',
    contents_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/contents/{+path}',
    compare_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/compare/{base}...{head}',
    merges_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/merges',
    archive_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/{archive_format}{/ref}',
    downloads_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/downloads',
    issues_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/issues{/number}',
    pulls_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/pulls{/number}',
    milestones_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/milestones{/number}',
    notifications_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/notifications{?since,all,participating}',
    labels_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/labels{/name}',
    releases_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/releases{/id}',
    deployments_url:
      'https://api.github.com/repos/jade-framework/gatsby-default/deployments',
    created_at: 1597019290,
    updated_at: '2020-08-14T16:56:55Z',
    pushed_at: 1597426605,
    git_url: 'git://github.com/jade-framework/gatsby-default.git',
    ssh_url: 'git@github.com:jade-framework/gatsby-default.git',
    clone_url: 'https://github.com/jade-framework/gatsby-default.git',
    svn_url: 'https://github.com/jade-framework/gatsby-default',
    homepage: null,
    size: 427,
    stargazers_count: 0,
    watchers_count: 0,
    language: 'CSS',
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: {
      key: '0bsd',
      name: 'BSD Zero Clause License',
      spdx_id: '0BSD',
      url: 'https://api.github.com/licenses/0bsd',
      node_id: 'MDc6TGljZW5zZTM1',
    },
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: 'master',
    stargazers: 0,
    master_branch: 'master',
    organization: 'jade-framework',
  },
  pusher: { name: 'edmondtam1', email: 'edmondtam2@gmail.com' },
  organization: {
    login: 'jade-framework',
    id: 68447912,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjY4NDQ3OTEy',
    url: 'https://api.github.com/orgs/jade-framework',
    repos_url: 'https://api.github.com/orgs/jade-framework/repos',
    events_url: 'https://api.github.com/orgs/jade-framework/events',
    hooks_url: 'https://api.github.com/orgs/jade-framework/hooks',
    issues_url: 'https://api.github.com/orgs/jade-framework/issues',
    members_url: 'https://api.github.com/orgs/jade-framework/members{/member}',
    public_members_url:
      'https://api.github.com/orgs/jade-framework/public_members{/member}',
    avatar_url: 'https://avatars0.githubusercontent.com/u/68447912?v=4',
    description: '',
  },
  sender: {
    login: 'edmondtam1',
    id: 11762093,
    node_id: 'MDQ6VXNlcjExNzYyMDkz',
    avatar_url: 'https://avatars1.githubusercontent.com/u/11762093?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/edmondtam1',
    html_url: 'https://github.com/edmondtam1',
    followers_url: 'https://api.github.com/users/edmondtam1/followers',
    following_url:
      'https://api.github.com/users/edmondtam1/following{/other_user}',
    gists_url: 'https://api.github.com/users/edmondtam1/gists{/gist_id}',
    starred_url:
      'https://api.github.com/users/edmondtam1/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/edmondtam1/subscriptions',
    organizations_url: 'https://api.github.com/users/edmondtam1/orgs',
    repos_url: 'https://api.github.com/users/edmondtam1/repos',
    events_url: 'https://api.github.com/users/edmondtam1/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/edmondtam1/received_events',
    type: 'User',
    site_admin: false,
  },
  created: false,
  deleted: false,
  forced: false,
  base_ref: null,
  compare:
    'https://github.com/jade-framework/gatsby-default/compare/9afc33355b20...0f7f1ab4ce04',
  commits: [
    {
      id: '0f7f1ab4ce046f0b38526a30cca56da536328df9',
      tree_id: '92e108a09cd0cf0784bd36d34044cd427208f3b9',
      distinct: true,
      message: 'Update index.js',
      timestamp: '2020-08-15T01:36:45+08:00',
      url:
        'https://github.com/jade-framework/gatsby-default/commit/0f7f1ab4ce046f0b38526a30cca56da536328df9',
      author: [Object],
      committer: [Object],
      added: [],
      removed: [],
      modified: [Array],
    },
  ],
  head_commit: {
    id: '0f7f1ab4ce046f0b38526a30cca56da536328df9',
    tree_id: '92e108a09cd0cf0784bd36d34044cd427208f3b9',
    distinct: true,
    message: 'Update index.js',
    timestamp: '2020-08-15T01:36:45+08:00',
    url:
      'https://github.com/jade-framework/gatsby-default/commit/0f7f1ab4ce046f0b38526a30cca56da536328df9',
    author: {
      name: 'Edmond Tam',
      email: 'edmondtam2@gmail.com',
      username: 'edmondtam1',
    },
    committer: {
      name: 'GitHub',
      email: 'noreply@github.com',
      username: 'web-flow',
    },
    added: [],
    removed: [],
    modified: ['src/pages/index.js'],
  },
};

const date = 'thisIsADate';
initialData.versionId = date;
initialData.projectId = `${parseName(initialData.projectName)}-${date}`;
initialData.commitUrl = webhook.head_commit.url;

updateDynamo(webhook, initialData);
