# E-Agle App 🦅

## Code guidelines

### Code flow branches
These branches which we expect to be permanently available on the repository follow the flow of code changes starting from development until the production.

- `main`: The production branch, if the repository is published, this is the default branch being presented.
- `development`: All new features and bug fixes should be brought to the development branch. Resolving developer codes conflicts should be done as early as here.

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