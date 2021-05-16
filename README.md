# BigLab 2 - Class: 2021 AW1 M-Z

## Team name: TEAM_NAME

Team members:
* s267652 PELLEGRINO MATTEO
* s282753 SCOVOTTO DAVIDE 
* s287930 PONCHIONE LUCA
* s123456 LASTNAME FIRSTNAME (delete line if not needed)

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

### __List tasks__

URL: `/api/tasks`

Method: GET

Description: Get the list of all the tasks from the database.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing the characteristics of a task
```
[
    {
        "id": "2",
        "description": "Go for a walk", 
        "important": "1",
        "private": "1",
        "deadline": "2021-04-14 8:30",
        "completed": "1",
        "user": "1"
    },
    {
        "id": "7",
        "description": "Study for the exam", 
        "important": "1",
        "private": "1",
        "deadline": "NULL",
        "completed": "0",
        "user": "1"
    },
    ...
]
```

### __Apply filters to tasks (By Filter)__

URL: `/api/tasks/filter/<filter>`

Method: GET

Description: Get the tasks that satisfy the given filter.
             Available `<filters>`:
                1. Important
                2. Private
                3. Completed
                4. Today
                5. Next7Days

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong filter), or `500 Internal Server Error` (generic error).

Respose body: One or more objects that fullfill the given `<filter>`

```
(eg. filter = Important)
[
    {
        "id": "2",
        "description": "Go for a walk", 
        "important": "1",
        "private": "1",
        "deadline": "2021-04-14 8:30",
        "completed": "1",
        "user": "1"
    },
    {
        "id": "7",
        "description": "Study for the exam", 
        "important": "1",
        "private": "1",
        "deadline": "NULL",
        "completed": "0",
        "user": "1"
    },
    ...
]
```

### __Get a task (By ID)__

URL: `/api/tasks/<id>`

Method: GET

Description: Retrieve the task idendified by its `<id>`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong id), or `500 Internal Server Error` (generic error).

Response body: An object identifying the task selected.

```
(e.g. <id> = 2)
[
    {
        "id": "2",
        "description": "Go for a walk", 
        "important": "1",
        "private": "1",
        "deadline": "2021-04-14 8:30",
        "completed": "1",
        "user": "1"
    }
]
```

### __Add a new Task__

URL: `/api/tasks`

Method: POST

Description: Add a new task into the already existing list of tasks.

Request body: An object representing the task to be added (Content-Type: `application/json`). 
              The _id_ is incrementally created automatically by the back end.
```
{
    "description": "New task", 
    "important": "1",
    "private": "0",
    "deadline": "2021-05-25 17:30",
    "completed": "0",
    "user": "1"
}
```

Response: `201 Created` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### __Update a task__

URL: `/api/tasks/<id>`

Method: PUT

Description: Update entirely an existing task identified by its `<id>`.

Request body: An object representing the entire task with the new values (Content-Type: `application/json`).
```
{
    "id": "2",
    "description": "Go for a walk", 
    "important": "1",
    "private": "1",
    "deadline": "2021-04-14 8:30",
    "completed": "1",
    "user": "1"
}
```

Response:  `200 OK` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### __Mark task as Completed/Uncompleted__

URL: `/api/tasks/<id>/<mark>`

Method: PUT

Description: Mark an existing task identified by its `<id>` as Completed(`<mark>` = 1) or 
             as Uncompleted(`<mark>` = 0).

Request body: _None_

Response: `200 OK` (success), `503 Service Unavailable` (generic error), or `404 Not Found` if trying 
          to mark a non-existing task.

Response body: _None_

### __Delete a task__

URL: `/api/tasks/:id`

Method: DELETE

Request body: _None_

Response: `200 OK` (success), `503 Service Unavailable` (generic error), or `404 Not Found` if trying 
          to delete a non-existing task.

Response body: _None_ 


