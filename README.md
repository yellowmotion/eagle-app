# E-Agle App 🦅

E-Agle App is the innovative solution that transforms your telemetry devices into a connected and intelligent experience. With this open-source application, you can interact with your vehicle intuitively through a user-friendly web application, taking connectivity to the next level.


## Features

- Live data through MQTT
- Dynamic configuration handling with JSON Schema
- Multiple devices management
- Installable
- Light/dark mode toggle



## Run Locally

Clone the project

```bash
  git clone https://github.com/yellowmotion/eagle-app
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  bun install
```

Start the server

```bash
  bun run dev
```


## Deployment

To deploy this project run

```bash
  bun run start
```

### Deploying with Docker
1. Build the Docker Image:
Navigate to the project directory and run the following command to build the Docker image:

```bash
docker build -t eagle-app .
```

2. Run the Docker Container:
After successfully building the image, start the Docker container:

```bash
docker run -p 3000:80 eagle-app
```

Adjust the port number (e.g., -p 3000:80) based on your preferences or server configuration.

3. Access the Application:
Once the container is running, you can access the application by navigating to http://localhost:8080 in your web browser.

These Docker instructions provide a convenient way to deploy the E-Agle App in a containerized environment. Feel free to customize the Dockerfile and docker-compose.yml files based on your specific requirements.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

1. **MQTT_URL:**
  *Description:* The URL for the MQTT broker.

2. **DATABASE_URL:**
  *Description:* The connection URL for the database. This variable typically contains the necessary information such as the host, port, and authentication details to establish a connection with MongoDB.

3. **DATABASE_USERNAME:**
  *Description:* The username used to authenticate and access the database.

4. **DATABASE_PASSWORD:**
  *Description:* The password associated with the specified database username.

5. **DATABASE_NAME:**
  *Description:* The name of the database within MongoDB.

6. **GOOGLE_CLIENT_ID:**
  *Description:* The client ID issued by Google for OAuth 2.0 authentication. It is used to identify the application when making requests to Google APIs and for user authentication.

7. **GOOGLE_CLIENT_SECRET:**
  *Description:* The client secret issued by Google for OAuth 2.0 authentication. It is a confidential key used in conjunction with the client ID to authenticate the application and authorize access.

8. **NEXTAUTH_URL:**
  *Description:* The base URL of the Next.js application. This variable helps NextAuth.js, a library for authentication in Next.js, to determine the correct URL when handling authentication callbacks.

9. **NEXTAUTH_SECRET:**
  *Description:* A secret key used by NextAuth.js to sign and verify authentication tokens. It enhances the security of the authentication process.

10. **AIRTABLE_TOKEN:**
   *Description:* The authentication token for checking the right access of Airtable roles push action.
## Running Tests

Tests require a few more environment variables than normal execution:
- `TESTING_VALID_TOKEN`: A valid JWT token 
- `TESTING_CONFIGURATION_VERSION_HASH`: The SHA commit hash used by tests

To run tests, run the following command

```bash
  bun run test
```


## Documentation

[Documentation](https://github.com/yellowmotion/deliverables): Official development documentation


## Code guidelines

### Code flow branches
These branches which we expect to be permanently available on the repository follow the flow of code changes starting from development until the production.

- `main`: The production branch, if the repository is published, this is the default branch being presented.
- `dev`: All new features and bug fixes should be brought to the development branch. Resolving developer codes conflicts should be done as early as here.

### Temporary branches
A git branch should start with a category. Pick one of these:
- `feature`
- `bugfix`
- `hotfix`
- `merge`
- `release`
- `experimental`
- `test`

After the category, there should be a `/` followed by the reference of the issue/ticket you are working on. If there's no reference, just add `no-ref`.

After the reference, there should be another `/` followed by a description which sums up the purpose of this specific branch. This description should be short and _kebab-cased_.
By default, you can use the title of the issue/ticket you are working on. Just replace any special character by `-`

**To sum up, follow this pattern when branching:**
```git branch <category/reference/description-in-kebab-case>```

**Examples:**
- You need to add, refactor or remove a feature: ```git branch feature/issue-42/create-new-button-component```
- You need to fix a bug: ```git branch bugfix/issue-342/button-overlap-form-on-mobile```
- You need to fix a bug really fast (possibly with a temporary solution): ```git branch hotfix/no-ref/registration-form-not-working```
- You need to experiment outside of an issue/ticket: ```git branch test/no-ref/refactor-components-with-atomic-design```

### Commit naming convention
For commits, you can combine and simplify the **Angular Commit Message** Guideline and the **Conventional Commits** guideline.
A commit message should start with a category of change. You can pretty much use the following 4 categories for everything: `feat`, `fix`, `refactor`, and `chore`.

- `feat` is for adding a new feature
- `fix` is for fixing a bug
- `refactor` is for changing code for peformance or convenience purpose (e.g. readibility)
- `chore` is for everything else (writing documentation, formatting, adding tests, cleaning useless code etc.)
After the category, there should be a `:` announcing the commit description.

After the colon, the commit description should consist in short statements describing the changes. Each statement should start with a verb conjugated in an imperative way. Statements should be seperated from themselves with a `;`.

The commit message should include the reference of an issue using `#N`, where `N` is the issue number.


**To sum up, follow this pattern when committing:**
`git commit -m '<category: do something; do some other things>'`

**Examples:**
- `git commit -m 'feat: add new button component; add new button components to templates'`
- `git commit -m 'fix: add the stop directive to button component to prevent propagation'`
- `git commit -m 'refactor: rewrite button component in TypeScript'`
- `git commit -m 'chore: write button documentation'`

### Credits
- [A Simplified Convention for Naming Branches and Commits in Git](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4)
- [Git Branching Name Convention](https://dev.to/couchcamote/git-branching-name-convention-cch)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#summary)
- [Commit Message Guideline](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- [A Successful Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)


## Authors

- [@RickyBenevelli](https://github.com/RickyBenevelli)
- [@andreolli-davide](https://github.com/andreolli-davide)
- [@guglielmo-boi](https://github.com/guglielmo-boi)


## Support and Feedbacks

For support or feedbacks, email [davide@andreolli.dev](mailto:davide@andreolli.dev) or [rickybenevelli@gmail.com](mailto:rickybenevelli@gmail.com). Additionally, feel free to open GitHub issues to contact the project administrators. We encourage the community to utilize the GitHub issue tracker for inquiries, feedback, or any assistance related to E-Agle App. Our administrators will promptly address and engage with the community through the GitHub platform. 



