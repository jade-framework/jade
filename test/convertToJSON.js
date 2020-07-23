const { createJSONFile } = require("../src/util/fileUtils");

const a = {
  ref: "refs/heads/master",
  before: "59d580ca0df5aa27d9e162b77163917cac0a332a",
  after: "8d615fffda6b4e28c6e54a09434b530a8538b67a",
  repository: {
    id: 265069338,
    node_id: "MDEwOlJlcG9zaXRvcnkyNjUwNjkzMzg=",
    name: "can-u-sing",
    full_name: "edmondtam1/can-u-sing",
    private: false,
    owner: {
      name: "edmondtam1",
      email: "edmondtam2@gmail.com",
      login: "edmondtam1",
      id: 11762093,
      node_id: "MDQ6VXNlcjExNzYyMDkz",
      avatar_url: "https://avatars1.githubusercontent.com/u/11762093?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/edmondtam1",
      html_url: "https://github.com/edmondtam1",
      followers_url: "https://api.github.com/users/edmondtam1/followers",
      following_url:
        "https://api.github.com/users/edmondtam1/following{/other_user}",
      gists_url: "https://api.github.com/users/edmondtam1/gists{/gist_id}",
      starred_url:
        "https://api.github.com/users/edmondtam1/starred{/owner}{/repo}",
      subscriptions_url:
        "https://api.github.com/users/edmondtam1/subscriptions",
      organizations_url: "https://api.github.com/users/edmondtam1/orgs",
      repos_url: "https://api.github.com/users/edmondtam1/repos",
      events_url: "https://api.github.com/users/edmondtam1/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/edmondtam1/received_events",
      type: "User",
      site_admin: false,
    },
    html_url: "https://github.com/edmondtam1/can-u-sing",
    description: "Collection of algorithm exercises",
    fork: false,
    url: "https://github.com/edmondtam1/can-u-sing",
    forks_url: "https://api.github.com/repos/edmondtam1/can-u-sing/forks",
    keys_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/keys{/key_id}",
    collaborators_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/collaborators{/collaborator}",
    teams_url: "https://api.github.com/repos/edmondtam1/can-u-sing/teams",
    hooks_url: "https://api.github.com/repos/edmondtam1/can-u-sing/hooks",
    issue_events_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/issues/events{/number}",
    events_url: "https://api.github.com/repos/edmondtam1/can-u-sing/events",
    assignees_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/assignees{/user}",
    branches_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/branches{/branch}",
    tags_url: "https://api.github.com/repos/edmondtam1/can-u-sing/tags",
    blobs_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/git/blobs{/sha}",
    git_tags_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/git/tags{/sha}",
    git_refs_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/git/refs{/sha}",
    trees_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/git/trees{/sha}",
    statuses_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/statuses/{sha}",
    languages_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/languages",
    stargazers_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/stargazers",
    contributors_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/contributors",
    subscribers_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/subscribers",
    subscription_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/subscription",
    commits_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/commits{/sha}",
    git_commits_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/git/commits{/sha}",
    comments_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/comments{/number}",
    issue_comment_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/issues/comments{/number}",
    contents_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/contents/{+path}",
    compare_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/compare/{base}...{head}",
    merges_url: "https://api.github.com/repos/edmondtam1/can-u-sing/merges",
    archive_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/{archive_format}{/ref}",
    downloads_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/downloads",
    issues_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/issues{/number}",
    pulls_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/pulls{/number}",
    milestones_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/milestones{/number}",
    notifications_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/notifications{?since,all,participating}",
    labels_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/labels{/name}",
    releases_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/releases{/id}",
    deployments_url:
      "https://api.github.com/repos/edmondtam1/can-u-sing/deployments",
    created_at: 1589838153,
    updated_at: "2020-07-23T20:34:53Z",
    pushed_at: 1595537758,
    git_url: "git://github.com/edmondtam1/can-u-sing.git",
    ssh_url: "git@github.com:edmondtam1/can-u-sing.git",
    clone_url: "https://github.com/edmondtam1/can-u-sing.git",
    svn_url: "https://github.com/edmondtam1/can-u-sing",
    homepage: null,
    size: 146,
    stargazers_count: 0,
    watchers_count: 0,
    language: "JavaScript",
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
    license: null,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "master",
    stargazers: 0,
    master_branch: "master",
  },
  pusher: { name: "edmondtam1", email: "edmondtam2@gmail.com" },
  sender: {
    login: "edmondtam1",
    id: 11762093,
    node_id: "MDQ6VXNlcjExNzYyMDkz",
    avatar_url: "https://avatars1.githubusercontent.com/u/11762093?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/edmondtam1",
    html_url: "https://github.com/edmondtam1",
    followers_url: "https://api.github.com/users/edmondtam1/followers",
    following_url:
      "https://api.github.com/users/edmondtam1/following{/other_user}",
    gists_url: "https://api.github.com/users/edmondtam1/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/edmondtam1/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/edmondtam1/subscriptions",
    organizations_url: "https://api.github.com/users/edmondtam1/orgs",
    repos_url: "https://api.github.com/users/edmondtam1/repos",
    events_url: "https://api.github.com/users/edmondtam1/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/edmondtam1/received_events",
    type: "User",
    site_admin: false,
  },
  created: false,
  deleted: false,
  forced: false,
  base_ref: null,
  compare:
    "https://github.com/edmondtam1/can-u-sing/compare/59d580ca0df5...8d615fffda6b",
  commits: [
    {
      id: "8d615fffda6b4e28c6e54a09434b530a8538b67a",
      tree_id: "28bf400306c72f927c92658c8f92b9da465bc209",
      distinct: true,
      message: "Test",
      timestamp: "2020-07-24T04:55:49+08:00",
      url:
        "https://github.com/edmondtam1/can-u-sing/commit/8d615fffda6b4e28c6e54a09434b530a8538b67a",
      author: [Object],
      committer: [Object],
      added: [],
      removed: [],
      modified: [Array],
    },
  ],
  head_commit: {
    id: "8d615fffda6b4e28c6e54a09434b530a8538b67a",
    tree_id: "28bf400306c72f927c92658c8f92b9da465bc209",
    distinct: true,
    message: "Test",
    timestamp: "2020-07-24T04:55:49+08:00",
    url:
      "https://github.com/edmondtam1/can-u-sing/commit/8d615fffda6b4e28c6e54a09434b530a8538b67a",
    author: {
      name: "edmondtam1",
      email: "edmondtam2@gmail.com",
      username: "edmondtam1",
    },
    committer: {
      name: "edmondtam1",
      email: "edmondtam2@gmail.com",
      username: "edmondtam1",
    },
    added: [],
    removed: [],
    modified: ["test_new_file.md"],
  },
};

createJSONFile("githubWebhook", process.cwd(), a);
