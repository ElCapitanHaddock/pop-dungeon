API For Backend

Security

/api/login/ 

Logs in user

Request:

email - validated email

password - password > 8 chars

Return:

status - http code style

- 200 (ok)
- 400 (no email/password)
- 401 (email/password mismatch)

errors - array of strings with all errors when status != 200

X-AUTH-TOKEN - auth token when status == 200

/api/logout/

Logs out user

Request:

X-AUTH-TOKEN auth token of user

Return:

status - always will be 200

/api/register/

Registers user

Request:

name - name of user

email - email of user, validated already

password - password > 8 chars

Return:

status - http code style

- 200 (ok)
- 400 (no name/email/password, password too short)
- 409 (email already registered)

errors - array of strings with all errors when status != 200

Authenticated Actions

Clubs

Members should be able to create a club, have it show up in the school list, and be able to browse through the various club pages. Verified members should also have access to member pages, and admins should have the ability to edit the pages, change settings, etc. All admins have delete power for now.

General Actions

/api/clubs/list

/api/clubs/details

Club Specific Actions

/api/clubs/create/

/api/clubs/delete/

/api/clubs/members/

/api/clubs/pages/

/api/clubs/edit/

/api/clubs/settings/




