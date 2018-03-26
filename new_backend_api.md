# Clubsapp_backend

Backend for the clubsapp (temporary name), in development.

### IntelliJ Environment variables: 

JAWSDB_URL=jdbc:mysql://localhost:3306/clubsapp_backend?user=default&password=default

PLAY_EDITOR="http://localhost:63342/api/file/?file=%s&line=%s"

### Notes:

All json requests will include a status var -> either OK for no error, or KO for error

All json error returns will follow this format:
 - "status"
 - "errors" (array)
    - json
        - field 
        - errors (array)
            - error
            
Example 1: 
```$xslt
{
    "status": "KO",
    "error": [
        {
            "field": "email",
            "errors": [
                "email already registered"
            ]
        }
    ]
}
```
Example 2: 
```$xslt
{
    "status": "KO",
    "errors": [
        {
            "field": "pass",
            "error": [
                "missing"
            ]
        }
    ]
}
```

## JSON API:

### /api/account/register
Needs:

 - email:  email
 - name:  >4 char name
 - pass:  >8 char password

Returns:
 - status
 - (if applicable) standard error messages  **AND**
    - field "pass" -> "email already registered" 


### /api/account/login

Needs:

 - email:  email
 - pass:  >8 char password

Returns: 
 - status
 - JWT (if status == OK), valid for 100 years
 - (if applicable) standard error messages 
 
### /api/account/logout (doesn't exist)

DOCUMENTATION PURPOSES ONLY: 

Just discard the JWT if you want to logout. Otherwise it'll expire on its own in 100 years...

### /api/club/register

Needs: 
 - jwt: String
 - name: 3+ chars
 - short_desc: 10+ chars
 
Returns: 
 - status
 - (if applicable) standard error messages 
    AND field "name" -> "name already registered"
    AND field "jwt" -> "invalid"
