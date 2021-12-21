## How to install

1. Run `npm install`
2. Run `cp .env.example .env`
3. Open `.env` and fill in the appropriate values:

- `TEAM_ID`. Open Datasaur's workspace, for example `https://datasaur.ai/teams/121/projects`. The number `121` is the `TEAM_ID`.
- `CLIENT_ID` and `CLIENT_SECRET`. Open Datasaur's workspace, and then click the Avatar on the top right corner. After that click `Generate OAuth credentials`.

## How to run

This script needs a project ID to run. Project ID can be found from the project's URL. For example: `https://datasaur.ai/teams/121/projects/RIb8708Fcoj/review`, the project ID is the alphanumerical characters after `projects`, i.e `RIb8708Fcoj`.

Command to run the script:

```
npm start <project ID>
```

Example command:

```
npm start RIb8708Fcoj
```

The resulting CSV will be output to `_output` folder.

## How we calculate label accuracies

Datasaur has a term called `Agreement Table`, which follows the following structure:

```
/*
   * |---|-----|-----------|
   * |         |     B     |
   * |         |-----|-----|
   * |         | dog | cat |
   * |---|-----|-----|-----|
   * |   | dog |  1  |  2  |
   * | A |-----|-----|-----|
   * |   | cat |  3  |  4  |
   * |---|-----|-----|-----|
   * */
```

The purpose of `Agreement Table` is to compare the number of labels applied by 2 labelers (or reviewer) on a certain position within a document. For example: for every `dog` label applied by labeler A on a certain position, labeler B also applied 1 label `dog` and 2 label `cat`.

To calculate labeler's label accuracy, we compare labeler's label with reviewer's. Using our previous `Agreement Table`, let's assume A is labeler and B is reviewer. The accuracy of a label by labeler is calculated with the following formula:

```
accuracy = number_of_matched_labels_with_reviewer/number_of_labels_by_reviewer
```

Hence, the accuracy of label `dog` by labeler A is:

```
accuracy = 1/(1 + 2) = 1/3
```