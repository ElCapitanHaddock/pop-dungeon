# Clubs App
## by Jeremy Yang
----------------------------------------------
### Running the server

1) Run `cmd.js`, then type in `.start`.

2) Or, you can run just the server without management/clustering with `server.js`

To get the full list of commands, type in `.help`


# API Guide For Backend

### Login

#### `/api/login/` 

Logs in user

##### Request: 

`email` - validated email

`password` - password > 8 chars

##### Return: 

`status` - http code style

- 200 (ok)
- 400 (no email/password)
- 401 (email/password mismatch)

`errors` - array of strings with all errors when status != 200

`X-AUTH-TOKEN` - auth token when status == 200

#### `/api/logout/` 

Logs out user

##### Request:

`X-AUTH-TOKEN` auth token of user

##### Return:

`status` - always will be 200

#### `/api/register`

Registers user

##### Request:

`name` - name of user

`email` - email of user, validated already

`password` - password > 8 chars

##### Return: 

`status` - http code style

- 200 (ok)
- 400 (no name/email/password, password too short)
- 409 (email already registered)

`errors` - array of strings with all errors when status != 200


## API to-do
### Already implemented front-end
1) Get list of clubs (user token passed to all routes)
    - Club: name, ID, icon image src, number of members

2) Get all of the events in a specific club (params: club ID)
    - Each event: title, start time, end time (optional), eventID (random), clubID
    - I will request each club separately to improve load times
    
3) Get information for one event (params: club ID, event ID)
    - Description, time, name, which club

### To be implemented front-end and back-end
1) Get club information (upon opening club) (params: club ID)
    - Page list, home page
2) Add club (params: name, school, category)
    - Generate a UID for club
3) Join club (params: id)
    - Join club based on UID, add user to club based on token
    - We may also have "guest" access ids in the future for visitors to club pages
4) Leave club (params: id)
    - Leave club based on UID
    
    
    