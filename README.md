# Expenses System


## Permissions Logic

| Role      | View Expense | View Expense Approver | Update Expense | Approve Expense |
| ----------- | ----------- | --- | --- | --- |
| Admin     | Yes          | Yes | Yes | Yes |
| User      | IF they created the expense | __IF__ they created the expense __AND__ it is APPROVED  | __IF__ they created the expense __AND__ status is OPEN  | __IF__ they are in the Finance department __AND__ it is OPEN __AND__ they are not the owner |
|           | __IF__ they are in the finance department         | __IF__ they are in the finance department      | 
|           | __IF__ they are the manager for the region the expense was created for    |