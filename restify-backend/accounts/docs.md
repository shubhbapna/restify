# Accounts

## Endpoint: `/accounts/login/`

### Method: `POST`

### Description

This endpoint used to authenticate a user and obtain a token back.
This token is to be passed in Authorization headers for endpoints requiring authentication.

### Headers

N/A

### Payload

`username`: The username of the user who you want to login as  
`password`: The password of the corresponding username

#### Example

```json
{
  "username": "owner",
  "password": "12345678"
}
```

### Response

Success response fields:

`token`: The auth token used in Authorization headers  
`is_owner`: Boolean specifying whether user you have logged in as has owner priveleges or not  
`restaurant`: [OPTIONAL] If `is_owner` is `true` then the id of the owned restaurant is returned

#### Example

```json
{
  "token": "f69555ec0dd10b13fd8b51aea6b057ee49cfa8d2",
  "is_owner": true,
  "restaurant": 1
}
```

Possible error responses example:

`400 Bad Request`

```json
{ "username": ["This field is required."] }
```

```json
{
  "non_field_errors": ["Unable to log in with provided credentials."]
}
```

---

## Endpoint: `/accounts/logout/`

### Method: `GET`

### Description

This endpoint used to logout a user by deleting their issued token.

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

N/A

### Response

Success response example:

```json
{
  "message": "logged out"
}
```

Possible error responses example:

`Status: 401 Unauthorized`

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Endpoint: `/accounts/register/`

### Method: `POST`

### Description

This endpoint used to register a new User. The new user created is by default not an owner.

### Headers

N/A

### Payload

`username`: The username of the user  
`password`: The password for the user  
`first_name`: [OPTIONAL] First name of the user  
`last_name`: [OPTIONAL] Last name of the user  
`phone_number`: [OPTIONAL] Phone number of the user  
`email`: [OPTIONAL] Email of the user

#### Example

```json
{
  "username": "jack123",
  "password": "12345678",
  "first_name": "Jack",
  "last_name": "Ryan",
  "phone_number": "+16412902013",
  "email": "jack@jack.com"
}
```

### Response

Success response fields:

`token`: The auth token used in Authorization headers  
`is_owner`: `false`

#### Example

```json
{
  "token": "f69555ec0dd10b13fd8b51aea6b057ee49cfa8d2",
  "is_owner": false
}
```

Possible error responses example:

`400 Bad Request`

```json
{
  "username": ["A user with that username already exists."],
  "email": ["Enter a valid email address."],
  "phone_number": ["The phone number entered is not valid."]
}
```

---

## Endpoint: `/accounts/profile/`

### Method: `GET`

### Description

This endpoint used to get all the user info of the currently logged in user.

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

N/A

### Response

Success response fields:

`first_name`: First name of the user  
`last_name`: Last name of the user  
`phone_number`: Phone number of the user
`email`: Email of the user  
`avatar`: The url to the user's avatar image  
`liked_restaurant`: List of restaurant ids liked by the user  
`followed_restaurant`: List of restaurant ids followed by the user  
`liked_blogs`: List of blog ids liked by the user  
`is_owner`: Boolean whether this new user is an owner or not  
`restaurant`: If `is_owner` is `true` then the id of the owned restaurant is returned otherwise `null`

#### Example

```json
{
  "email": "jack@jack.com",
  "first_name": "Jack",
  "last_name": "Ryan",
  "phone_number": "+16412902013",
  "is_owner": true,
  "avatar": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png",
  "liked_restaurant": [1],
  "followed_restaurant": [1],
  "liked_blogs": [2],
  "restaurant": 1
}
```

Possible error responses example:

`401 Unauthorized`

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Endpoint: `/accounts/profile/`

### Method: `PUT`, `PATCH`

### Description

This endpoint used to update the current user's info such as name, email, phone, avatar

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

`first_name`: First name of the user  
`last_name`: Last name of the user  
`phone_number`: Phone number of the user
`email`: Email of the user  
`avatar`: Image for the user avatar. If this field is provided then the content type should be `form-data` for the body

### Response

Success response fields:

`first_name`: First name of the user  
`last_name`: Last name of the user  
`phone_number`: Phone number of the user
`email`: Email of the user  
`avatar`: The url to the user's avatar image  
`liked_restaurant`: List of restaurant ids liked by the user  
`followed_restaurant`: List of restaurant ids followed by the user  
`liked_blogs`: List of blog ids liked by the user  
`is_owner`: Boolean whether this new user is an owner or not  
`restaurant`: If `is_owner` is `true` then the id of the owned restaurant is returned otherwise `null`

#### Example

```json
{
  "email": "jack@jack.com",
  "first_name": "Jack",
  "last_name": "Ryan",
  "phone_number": "+16412902013",
  "is_owner": true,
  "avatar": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png",
  "liked_restaurant": [1],
  "followed_restaurant": [1],
  "liked_blogs": [2],
  "restaurant": 1
}
```

Possible error responses example:

`401 Unauthorized`

```json
{
  "detail": "Authentication credentials were not provided."
}
```

`400 Bad Request`

```json
{
  "email": ["Enter a valid email address."],
  "phone_number": ["The phone number entered is not valid."],
  "avatar": [
    "The submitted data was not a file. Check the encoding type on the form."
  ]
}
```

---

## Endpoint: `/accounts/notification/`

### Method: `GET`

### Description

This endpoint used to get all the notifications for the current user.
This endpoint is paginated. It returns a max of 20 notifications at a time

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

`page`: [OPTIONAL] URL query which gets the page number specified in the value. If the this query is not specified then by default the first page is returned

#### Example

`http://localhost:8000/accounts/notification/?page=2`

### Response

Success response fields:

`count`: Total count of notifications
`next`: URL to the next page if it exists i.e. if there is more data otherwise `null`
`previous`: URL to the previous page. If it is the first page then `null`
`results`: An array of notifications. Each notification has a `timestamp` key and a `message` key. `timestamp` key holds the timestamp of when the activity described in the `messsage` key took place. `message` describes the activity which caused to produce the notification

#### Example

```json
{
  "count": 68,
  "next": "http://localhost:8000/accounts/notification/?page=3",
  "previous": "http://localhost:8000/accounts/notification/",
  "results": [
    {
      "message": "john liked your restaurant!",
      "timestamp": "2022-03-11T04:40:03.082085Z"
    },
    {
      "message": "sam liked your restaurant!",
      "timestamp": "2022-03-11T04:34:36.880009Z"
    },
    {
      "message": "jack liked your restaurant!",
      "timestamp": "2022-03-11T04:21:24.311398Z"
    },
    .
    .
    .
  ]
}
```

Possible error responses example:

`401 Unauthorized`

```json
{
  "detail": "Authentication credentials were not provided."
}
```

`404 Not Found`

```json
{
  "detail": "Invalid page."
}
```
