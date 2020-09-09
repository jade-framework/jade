![Jade logo](https://i.imgur.com/hxu6ISd.png)

Jade is a framework to help users automate the deployment of JAMstack applications with AWS and GitHub. For more details on Jade or the JAMstack, please visit [our website](https://jadeframework.dev).

## Setup guide

To install the Jade package, run 

    $ npm install -g @jade-framework/jade

In order to use Jade, you will need an AWS account, a Gatsby project and a public GitHub repo. To get started, you may use our Gatsby template [here](https://github.com/gatsbyjs/gatsby-starter-default) or follow the official Gatsby instructions to set up a Gatsby project [here](https://www.gatsbyjs.com/docs/quick-start/).

To provision your AWS services, run

    $ jade init

You will be prompted for the following information:

- Your project name
- Your GitHub repo
- Other relevant configuration commands (use the Jade defaults if you're running a Gatsby template)

## Jade commands

| Command                    | Description                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `jade init`                | Initialize a new JAMstack app and associated AWS services                                      |
| `jade add`                 | Add a new JAMstack app                                                                         |
| `jade list`                | List all your existing JAMstack apps                                                           |
| `jade freeze <app name>`   | Freeze your EC2 instance when you aren't developing your app                                   |
| `jade unfreeze <app name>` | Unfreeze your EC2 instance to continue development                                             |
| `jade delete <app name>`   | Remove an app from the JAMstack                                                                |
| `jade destroy`             | Remove all apps and all Jade AWS infrastructure (note the synchronous vs asynchronous options) |

## Notes regarding Jade commands
`jade init` and `jade add` will provision a new EC2 instance for each app. In order for the EC2 instance to pull source code on updates, a webhook must be setup on GitHub with it's destination address set to the EC2 instance's public IPv4 adress. The IP address and instructions on how to setup a GitHub webhook will be provided by Jade when a new app is deployed.

`jade freeze` will stop the EC2 instance. When this happens the EC2 instance will lose its public IPv4 address. The project's GitHub webhook destination address will need to be updated when the EC2 instance is restarted.

`jade unfreeze` will restart the EC2 instance and a new IPv4 address will be assigned. Please note that you have to change the GitHub webhook IP address when you unfreeze the app. You can use `jade list` or `jade admin` to see the new IP address of the EC2 instance associated with the app.

`jade destroy` will give the option to synchronously or asynchronously remove all apps and their associated AWS infrastracture. Due to the nature of CloudFront, it can take up to 90 minutes to remove a distribution.


## Concluding remarks

Thanks for checking out the Jade framework! Please feel free to reach out to us with any questions and to discuss our code.

Team Jade

## License

This NPM package is available as open source under the terms of the MIT License.
