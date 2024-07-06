<div align="center">
<img src="public/metadachi-icon-circle.png" alt="Metadachi Icon" style="width: 80px; height: auto;" />
<h1>Metadachi Tasks</h1>

[![Discord](https://img.shields.io/discord/1142672787820007454?logo=discord&label=Discord)](https://t.co/Wwdk6CoGxq)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/metadachi)](https://twitter.com/metadachi)

Introducing Metadachi Tasks: your smart productivity partner. This AI-powered tool learns your goals and habits, creating custom schedules to optimize your day. Compete on leaderboards, team up with friends, and reflect in your digital journal. Metadachi Tasks doesn't just help you check off to-dos—it empowers you to become a more efficient, happier you. Try it and transform your daily grind into a journey of personal growth.
</div>

## Getting Started
Welcome to our community! 🎉

> Hosted version is coming soon.

## Features
*To be updated*

## Technology Stack
| Technology  | Description                                                                                                         |
|-------------|---------------------------------------------------------------------------------------------------------------------|
| Next.js v14 | React framework for server-rendered, statically-generated, & hybrid sites    |
| Vercel      | Streamlined deployment & scaling platform for Next.js apps    |
| Vercel AI SDK | The AI Toolkit for TypeScript           |
| Supabase    | Open source Firebase alternative.                                                                                   |
| NextUI      | Beautiful, fast and modern React UI Library                                                                         |

## Deployment Guide
Follow these steps to get your own Metadachi instance running in the cloud with Vercel and Supabase.

### 1. Clone or fork the repo
Forking the repo will make it easier to receive updates.
- Fork: Click the fork button in the upper right corner of the GitHub page.
- Clone: `git clone https://github.com/phanturne/metadachi.git`

### 2. Install dependencies
Open a terminal in the root directory of your local repository and run:
```sh
pnpm install
```

### 3. Set up backend with Supabase
#### a. Create a new project
Head over to [Supabase](https://supabase.com/) and create a new project.

#### b. Get project values (save these for later)
1. In the project dashboard, click on the "Project Settings" icon tab on the bottom left.
   - `Project ID`: found in the "General settings" section as "Reference ID"
2. While still in "Project Settings" page, click on the "API" tab on the left.
   - `Project URL`: found in "Project URL" section as "URL"
   - `Anon Key`: found in "Project API keys" section as "anon public"
   - `Service Role Key`: Found in "Project API keys" as "service_role"

#### c. Add vault secrets
1. While still in the "Project Settings" page, click on the "Vault" tab on the left.
2. Add the following secrets
   - `SUPABASE_PROJECT_URL`: Use the `Project URL` value from above
   - `SUPABASE_SERVICE_ROLE_KEY`: Use the `Service Role Key` value from above

#### d. Configure auth
1. Click on the "Authentication" icon tab on the far left.
2. In the text tabs, click on "Providers" and make sure "Email" is enabled.

#### e. Connect database
1. Open a terminal in the root directory of your local repository.
2. Login to Supabase by running: 
```sh 
supabase login
```

3. Link your project by running the following with the "Project ID" from above: 
```sh
supabase link --project-ref <project-id>
```

4. Push your database to Supabase by running:
```sh
supabase db push
```

### 4. [Optional] Configure website settings
Open the [lib/config.ts](lib/config.ts) file and customize any of the variables to suit your needs.

After making your changes, commit and push them.

### 5. Deploy with Vercel
1. Go to [Vercel](https://vercel.com/) and create a new project.
2. On the setup page, import your GitHub repository for your instance of Metadachi Tasks.
3. In the **Environment Variables** section, add entries for the values listed in the [.env.example](.env.example) file.
4. Click "Deploy" and wait for your frontend to deploy.

Once it's up and running, you’ll be able to use your hosted instance of Metadachi Tasks via the URL provided by Vercel. Enjoy your new setup!

## License
This project is licensed under the [Apache License 2.0](LICENSE) - see the [LICENSE](LICENSE) file for details.

## Third-Party Licenses
This project uses third-party libraries or other resources that may be
distributed under licenses different from this software. Please see the
[THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES) file for details.

## Acknowledgements
Kudos to the creators of the following repositories for their valuable contributions to the open-source community
- [Next.js AI Chatbot](https://github.com/vercel/ai-chatbot): A full-featured, hackable Next.js AI chatbot built by Vercel
- [Chatbot UI](https://github.com/mckaywrigley/chatbot-ui): The open-source AI chat app for everyone.