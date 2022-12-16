# Setup Instructions

- Clone the Repository
- In the `backend` folder create a `.env` file with the following content structure:

```env
DB_URL=
PORT=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_EC2_RUNNER_IMAGE_ID=
AWS_EC2_RUNNER_INSTANCE_TYPE=
AWS_EC2_RUNNER_SSH_KEY_PAIR_NAME=
AWS_EC2_RUNNER_SECURITY_GROUP_ID=
PROJECT_SOCKET_BROADCAST_SECRET=
REPO_GITHUB_CLONE_PATH
```

- To make the EC2 SSH Work, create a ssh-key.js file and add the contents in the following format:

```javascript
const sshKey = `-----BEGIN RSA PRIVATE KEY-----

<SSH Key Contents>

-----END RSA PRIVATE KEY-----`;

module.exports = sshKey;
```

- In the `app-runner` folder create a `.env` file with the following content structure:

```env
MAIN_BACKEND_URL=
PROJECT_SOCKET_BROADCAST_SECRET= # Should be the same as backend repo
```
