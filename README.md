![Jade logo](https://i.imgur.com/hxu6ISd.png)

Jade is a framework to help users automate the deployment of JAMstack applications with AWS and GitHub. For more details on Jade or the JAMstack, please visit [our website](https://jadeframework.dev) or feel free to contact us directly.

## Setup guide

To install the Jade package, run `npm install -g @jade-framework/jade`.

In order to use Jade, you will need an AWS account, a Gatsby project and a public GitHub repo. To get started, you may use our Gatsby template [here](https://github.com/gatsbyjs/gatsby-starter-default) or follow the official Gatsby instructions to set up a Gatsby project [here](https://www.gatsbyjs.com/docs/quick-start/).

To provision your AWS services, run `jade init`. You will be prompted for the following information:

- Your project name
- Your GitHub repo
- Other relevant configuration commands (use the Jade defaults if you're running a Gatsby template)

## Jade commands

<<<<<<< HEAD
| Command                    | Description                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `jade init`                | Initialize a new JAMstack app and associated AWS services                                      |
| `jade add`                 | Add a new JAMstack app                                                                         |
| `jade list`                | List all your existing JAMstack apps                                                           |
| `jade freeze <app name>`   | Freeze your EC2 instance when you aren't developing your app                                   |
| `jade unfreeze <app name>` | Unfreeze your EC2 instance to continue development                                             |
| `jade delete <app name>`   | Remove an app from the JAMstack                                                                |
| `jade destroy`             | Remove all apps and all Jade AWS infrastructure (note the synchronous vs asynchronous options) |
=======
| Command                    | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| `jade init`                | Set up the initial Jade infrastructure on AWS and deploy your JAMstack app |
| `jade add`                 | Deploy a new JAMstack app                                                  |
| `jade list`                | List all your existing JAMstack apps deployed with Jade                    |
| `jade freeze <app name>`   | Freeze your EC2 instance when you aren't developing your app               |
| `jade unfreeze <app name>` | Unfreeze your EC2 instance to continue development                         |
| `jade delete <app name>`   | Remove an app from the Jade infrastructure                                 |
| `jade destroy`             | Remove all apps and all Jade AWS infrastructure                            |
>>>>>>> master

## Concluding remarks

Thanks for checking out the Jade framework! Please feel free to reach out to us with any questions and to discuss our code.

Team Jade

## License

This NPM package is available as open source under the terms of the MIT License.
