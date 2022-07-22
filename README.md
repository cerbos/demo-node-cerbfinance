# **CerbFinance** System

CerbFinance is a expenses tracking system used companies to submit, track and approve expenses.

It has 5 different user roles:

- User - regular users who submit expenses
- Region Manager - managers of a particular region eg EMEA or NA
- Finance - members of the finance team that approve expenses
- Finance Manager - managers within the finance team
- Admin - the IT team who manage the system

Inside the system there are 5 actions:

- View an expense
- View who approved an expense
- Update an expense
- Approve an expense
- Delete an expense


## The Server

This repo contains a basic node express app server which has a dummy database of users and expense resources (see [`db.js`](./db.js)).

There are 3 versions of this server in seperate files, to run each:

- `node app.basic.js` is the basic server with no permissiosn checks
- `node app.hardcoded.js` is the server with permissions logic hardcoded into the app
- `node app.cerbos.js` is the server with permissions being handled by Cerbos. This makes use of the Demo PDP from [this playground instance](https://play.cerbos.dev/p/XhkOi82fFKk3YW60e2c806Yvm0trKEje) which holds the policies.

Each server runs on port `8000`.

## Calling the service

Authentication is emulated via passing the user value in a `Authorization` header. The users built into the demo database are:

### Users

| User | Roles | Department | Region |
| ---  | --- | --- | --- |
| `sajit` | `ADMIN` | IT | |
| `sally` | `USER` | Sales | EMEA |
| `joe` | `USER` | Finance | EMEA |
| `jamie` | `USER`, `MANAGER` | Finance | EMEA |
<!-- | `brock` | `USER`, `MANAGER` | Sales | NA |
| `john` | `USER`, `MANAGER` | Sales | EMEA |
| `zeena` | `USER` | Sales | NA | -->

### Expenses
Note: Relative created at values are based on server start time (in order to simulate conditions)

| ID | Created At | Owner | Region | Amount | Status | 
| -- | --------- | --- | --- | --- | --- |
| `expense1` | Two months ago | `sally` | EMEA | $500 | `OPEN` |
| `expense2` | Two hours ago | `sally` | EMEA | $2500 | `APPROVED` |
| `expense3` | Five minutes ago | `sally` | EMEA | $1200 | `OPEN` |
| `expense4` | 2021-10-01 | `joe` | EMEA | $2421 | `OPEN` |
| `expense5` | Two hours ago | `sally` | EMEA | $2500 | `REJECTED` |

An example cURL commands would be:

```
curl -X GET 'http://localhost:8000/expenses/expense1' -H 'Authorization: sally'
curl -X DELETE 'http://localhost:8000/expenses/expense1' -H 'Authorization: sally'
curl -X POST 'http://localhost:8000/expenses/expense1/approve' -H 'Authorization: sally'
```

## Permissions Logic
These logic for who can do what is as follows:
 
| Role      | View Expense | View Expense Approver | Update Expense | Approve Expense | Delete Expense |
| ----------- | ----------- | --- | --- | --- | --- |
| Admin     | Yes          | Yes | Yes | Yes | Yes |
| User      | IF they created the expense | __IF__ they created the expense __AND__ it is APPROVED  | __IF__ they created the expense __AND__ status is OPEN  | No | __IF__ they created the expense __AND__ status is OPEN __AND__ it was created in the last hour |
| Region Manager |  __IF__ they are the manager for the region the expense was created for | No | No | No | No |
| Finance | Yes | Yes | No | __IF__ they did not create the expense __AND__ amount <$1000 | No |
| Finance Manager | Yes | Yes | No | __IF__ they did not create the expense | Yes |

## Expected Results

| User/Expense | Action | `expense1` | `expense2` | `expense3` | `expense4` | `expense5`
| ------- | ----------------- | --------------------- | --------------------- | --------------------- | --------------------- | --------------------- |
| `sajit` | `view`            | Yes | Yes | Yes | Yes | Yes |
|         | `view:approver`   | Yes | Yes | Yes | Yes | Yes |
|         | `update`          | Yes | Yes | Yes | Yes | Yes |
|         | `approve`         | Yes | Yes | Yes | Yes | Yes |
|         | `delete`          | Yes | Yes | Yes | Yes | Yes |
| `sally` | `view`            | Yes | Yes | Yes | No  | Yes |
|         | `view:approver`   | No  | Yes | No  | No  | No  |
|         | `update`          | Yes | No  | Yes | No  | No  |
|         | `approve`         | No  | No  | No  | No  | No  |
|         | `delete`          | No  | No  | Yes | No  | No  |
| `joe`   | `view`            | Yes | Yes | Yes | Yes | Yes |
|         | `view:approver`   | Yes | Yes | Yes | Yes | Yes |
|         | `update`          | No  | No  | No  | Yes | No  |
|         | `approve`         | Yes | No  | No  | No  | No  |
|         | `delete`          | No  | No  | Yes | No  | No  |
| `jamie` | `view`            | Yes | Yes | Yes | Yes | Yes |
|         | `view:approver`   | Yes | Yes | Yes | Yes | Yes |
|         | `update`          | No  | No  | No  | No  | No  |
|         | `approve`         | Yes | Yes | Yes | Yes | Yes |
|         | `delete`          | Yes | Yes | Yes | Yes | Yes |
