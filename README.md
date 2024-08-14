# Dson Market #

This is a marketplace for Dickinson Student to trade, sell, or buy any items at ease on one common platform. The website is only available for Dickinson students, members, and faculties who possess a @dickinson.edu email.

## Usage ##

For users, using Dson Market is very straightforward.

- Ensure that you have a @dickinson.edu email.
- Navigate to [Dson Market website](https://dsonmarket.netlify.app)
- Register at the main login page and confirm your email. (A confirmation email will be sent to the email address you provide).
- To begin using all the features:
  - Go to your profile page by clicking on your avatar on the top right of the screen.
  - Change the weird-looking name into your name.
  - Add a profile picture to make it easier for other users to identifies you.

## Built With ##

ReactJS - JavaScript library for building user interfaces based on components. ([react.dev/](https://react.dev/))

NextJS - A React framework used for server-side rendering ([nextjs.org](https://nextjs.org/))

Node.js - JavaScript runtime environment ([nodejs.org](https://nodejs.org/en/))

Supabase - An open-source replacement for Firebase ([supabase.com](https://supabase.com/))

and lots of other software/packages.

## Authors ##

This application is owned by Nathan Nguyen - Dickinson College '25.

For a list of contributors, [click here](https://github.com/nathang15/dson-market/graphs/contributors)

## Licensing ##

This project is licensed under the GNU General Public License version 3.0.

See the full licensing agreement [here](LICENSE.txt)

## Contributions ##

Before beginning this install please review the [Code of Conduct](CODE_OF_CONDUCT.md) that sets the expectations for the FarmData2 community and the [License Information](LICENSE.txt) that describes DsonMarket's licensing.

Full installation details for these tools are provided by the projects themselves as described and linked below:

- [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    - Test your install using the command: `git --version`
- [Install NodeJS](https://nodejs.org/en/download)
    - Test your install using the command: `node -v` and `npm -v`
- [Install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
    - Test your install using the command: `yarn --version`
- [Install Docker](https://docs.docker.com/get-docker)
    - Test your install using the command: `docker --version` 
- Assuming you are using VSCode, it is very beneficial to add ESLint extension as it greatly helps with code linting.
### Setting up development environment
DsonMarket uses the fork model for development. (There are many descriptions of this process on the web but GitHub ones include a [general one](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) and one with [more operational details.](https://docs.github.com/en/get-started/quickstart/fork-a-repo)) 

- This means you need to go to the main [DsonMarket GitHub](https://github.com/nathang15/dson-market) page (after login to GitHub),
- Fork the project onto your own GitHub account.
- Clone the forked copy onto you own development machine to work on the code base. You can place the clone anywhere you want on your machine.
- Note the clone will place all the files inside a new directory named dson-market unless you put a "." at the end of the git clone command.
- This model has the advantage that you can commit and push to your account without needing write permission on the main project repository.

#### Run DsonMarket
- Once you have DsonMarket installed and running, you will want to open it in a web browser. It should not matter which one you use.
- To do this (use the terminal inside VSCode, assuming you are using VSCode): 
  - If you are not already in DsonMarket folder, navigate to it by using the command `cd dson-market`
  - To check if you are in the correct folder, run the command `ls` and it should displays a bunch of files like package.json, .github, .next, etc.
  - Next, make sure docker is running and run the chain of commands:
      - `git switch dev-env` to switch to the development environment branch.
      - `npx supabase start` to start supabase local environment.
      - `yarn run dev` to start the server
  - Enter the address: 127.0.0.1:3000 and load the page. "127.0.0.1" indicates the page is being served up from your machine and "3000" is the default port that DsonMarket uses to accept web connections.
 
#### Stop DsonMarket
- If you want to stop running dsonmarket, do the following:
    - Close the server by perform Ctrl + C on Windows or Cmd + C on Mac
    - `npx supabase stop` to stop the supabase local instance
    - Stop Docker
      
### Steps for creating a pull request (PR) to integrate your code into DsonMarket.
- While developing your code, we suggest you do the following:
  - **Create a branch of development branch** (the main branch is the default when you clone the project) and give it a name that indicates the work you intend to do.
  - Make sure you run DsonMarket in a web browser and it works as expected. Please check any feature that might have been impacted by your work and do a quick general check of the system so you know it works
- When your fork has code that is ready to add to the main code base, create a pull request from your branch into development on the main DsonMarket GitHub repository ([GitHub documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)). The pull request template should include the following: 
  - An area at the top to describe this PR. It states: "Please include a summary of the change and which issue is touched on. Please also include relevant motivation and context." This is also the area to add recognition of others that worked on code. Use the @<GitHub name> where you put in the person's actual GitHub name (user id) without the angle brackets and GitHub will automatically link to their GitHub account.
  - Note any issues this PR addresses. Check to see if you are addressing any open issues. If so, please note in the pull request description. If your pull request completely fixes/addresses an open issue then put the words "Fixes #XXX", where XXX is the issue number. If it only partly addresses an issue then use "Partly Addresses #XXX". If it fixes an open issue then everyone will see the a note in the pull request (after opened) indicating it will close this issue when merged and there is also a related note in the issue.
  - There is a checkbox to indicate: "You acknowledge that every person contributing to this work has signed the DsonMarket Contributing License Agreement and each author is listed in the Description section."
  - An area to list any limitations of the PR: "Describe any issues that remain or work that should still be done."
  - If your work is not yet ready and you are sharing to get early feedback, please make the PR as a draft.

## Code of Conduct ##

Dson Market is based on the idea of sharing so everyone benefits from our combined efforts. To benefit everyone, we need to maintain a welcoming and appropriate community.<br />
Dson Market has as a [code of conduct](CODE_OF_CONDUCT.md) that follows the [Contributor Covenant](https://www.contributor-covenant.org/) used by many
open source projects.<br/>
We are committed to promptly addressing any feedback that clearly articulates potential actions and reasons behind them. Regardless of the outcome, you will be informed of our decision. We want to emphasize our dedication to maintaining a welcoming and inclusive community, and we are committed to taking any concerns or improvement ideas seriously, working diligently to address them.

## Contact ##

To contact us, send an email to nguyenat@dickinson.edu or open an issue on GitHub.
