# Setup Instructions

- Clone the Repository
- In the `backend` folder create a `.env` file with the following content structure and populate the values suiting your AWS Project (You would need an EC2 Image pre-built with Node.js and Git Installed into a volume):

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

- To make the EC2 SSH Work, create a ssh-key.js file and add the contents in the following format (You can obviously pickup the Key from Environment Variables as well):

```javascript
const sshKey = `-----BEGIN RSA PRIVATE KEY-----

<SSH Key Contents>

-----END RSA PRIVATE KEY-----`;

module.exports = sshKey;
```

- In the `app-runner` folder create a `.env` file with the following content and populate the values accordingly:

```env
MAIN_BACKEND_URL=
PROJECT_SOCKET_BROADCAST_SECRET= # Should be the same as backend repo
```

We use `PROJECT_SOCKET_BROADCAST_SECRET` to enable authenticated communication between app-runner and the backend EC2 instance.
