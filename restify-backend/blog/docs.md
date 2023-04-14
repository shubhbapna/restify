# Apps <a name="apps"></a>

- <h3>restaurant</h3>    
  - Views
    - LikeRestaurant: Uses a generic APIview as all we have to do is update the restaurants's like counter
    - FollowRestaurant: Uses a generic APIview as all we have to do is update the restaurants's like counter
    - CommentRestaurant: Uses a generic APIview as the api create a comment and adds it to the restaurants blogs



- <h3>blog</h3>    
  Stored under the "blog" directory. Used for all blog related endpoints such as creating, viewing, updating, . All APIs for this app begin with "/blog". The file "serializer.py" contains all model serializers to help with the below views.  
  
  - Views (All views and their code can be found inside the file `blog/views.py`)  
    - blogView: Uses RetrieveAPIView since we are retrieving a blog object
    - blogCreateView: Uses CreateAPIView since we want to create a new blog object  
    - blogDeleteView: Uses DestroyApiView since we are deleting a blog object
    - blogUpdateView: Uses UpdateAPIView since we want to update the blog object
    - blogListView: Uses a ListAPIView since we want the user to see a paginated list of blogs from restaurants that they follow
    - blogLikeView: Uses a generic APIview as all we have to do is update the blog's like counter


# Models <a name="model"></a>

### Blog

- created_timestamp: Date time field to record when this blog was created
- modified_timestamp: Date time field to record when this blog was last modified
- title: Title of the blog
- content: Content of the blog
- imgs: The blog's only image
- numLikes: The number of likes the blog has
- restaurant: The restaurant object that the blog belongs to

# APIs <a name="api"></a>

## Endpoint: `/blog/create/`

### Method: `POST`

### Description

This endpoint used to create a blog object as a restaurant owner

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

`title`: The title of the blog  
`content`: The content of the blog  
`imgs`: Image file that will be the blog's image

#### Example

```json
{
  "title": "owner",
  "content": "12345678",
  "imgs": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png"
}
```

### Response

Success response fields:

`id`: the unique identification number of the blog  
`created_timestamp`: The time of when the blog was created   
`modified_timestamp`: The time of when the blog was last modified (should be the same as `created_timestamp`)  
`title`: The title of the blog created  
`content`: The content of the blog created  
`imgs`: The image of the blog created  
`numLikes`: The number of likes the created blog has (always zero)  
#### Example

```json
{
    "created_timestamp": "2022-03-15T02:11:20.498380Z",
    "modified_timestamp": "2022-03-15T02:11:20.498434Z",
    "title": "Insert Blog Name Here",
    "content": "Ipsum Lorem",
    "imgs": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png",
    "numLikes": 0
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Authentication credentials were not provided."
}
```

`400 Bad Request`

```json
{
    "detail": ["title is missing","content is missing"]
}
```




## Endpoint: `/blog/<blog_id>/`

### Method: `GET`

### Description

This endpoint used to get a blog object

### URL Parameter

`blog_id`: Unique ID of the blog to be viewed

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

`id`: the unique identification number of the blog  
`created_timestamp`: The time of when the blog was created  
`modified_timestamp`: The time of when the blog was last modified  
`title`: The title of the blog  
`content`: The content of the blog   
`imgs`: The image of the blog   
`numLikes`: The number of likes the blog has
#### Example

```json
{
    "created_timestamp": "2022-03-15T02:11:20.498380Z",
    "modified_timestamp": "2022-03-15T02:11:20.498434Z",
    "title": "Insert Blog Name Here",
    "content": "Ipsum Lorem",
    "imgs": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png",
    "numLikes": 0
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---



## Endpoint: `/blog/feed/`

### Method: `GET`

### Description

This endpoint used to get the recommended feed, a list of blogs from restaurants the user follows, for the user

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

`count`: Number of blogs posted by restaurant the user is following
`next`: URL to the next page if it exists i.e. if there is more data otherwise `null`  
`previous`: URL to the previous page. If it is the first page then `null`  
`results`: An array of blogs from restaurants that the user follows sorted by newest first. Each blog has a `created_timestamp` key, a `modified_timestamp` key, a `title` key, a `content` key, a `imgs` key, and a `numlikes` key. These keys refer to the fields of the same name in the blogs model.

#### Example

```json
{
    "count":2,
    "next":null,
    "previous":null,
    "results":[
        {
            "created_timestamp":"2022-03-15T02:05:14.394406Z","modified_timestamp":"2022-03-15T02:05:14.394470Z",
            "title":"Title 2",
            "content":"Ipsum Lorem 1",
            "imgs":null,
            "numLikes":0
        },
        {
            "created_timestamp":"2022-03-15T02:11:20.498380Z","modified_timestamp":"2022-03-15T04:02:39.051571Z",
            "title":"Title 2",
            "content":"Ipsum Lorem 2",
            "imgs":"http://127.0.0.1:8000/blog/blog-logo/1234_r3D3r4p.PNG",
            "numLikes":1
        }
    ]
}
```

Possible error responses example:

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---


## Endpoint: `/blog/<blog_id>/update/`

### Method: `PUT`

### Description

This endpoint used to update a blog object

### URL Parameter

`blog_id`: Unique ID of the blog to be updated

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload
 
`title`: The new title of the blog  
`content`: The new content of the blog   
`imgs`: [OPTIONAL] The new image of the blog    

#### Example

```json
{
    "title": "Insert New Blog Name Here",
    "content": "Ipsum Lorem",
    "imgs": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png",
}
```

### Response

Success response fields:

`id`: the unique identification number of the blog  
`created_timestamp`: The time of when the blog was updated    
`modified_timestamp`: The time of when the blog was updated  
`title`: The title of the updated blog  
`content`: The content of the updated blog  
`imgs`: The image of the updated blog  
`numLikes`: The number of likes the updated blog has

#### Example

```json
{
    "created_timestamp": "2022-03-15T02:11:20.498380Z",
    "modified_timestamp": "2022-03-15T02:11:20.498434Z",
    "title": "Insert Blog Name Here",
    "content": "Ipsum Lorem",
    "imgs": "http://localhost:8000/accounts/avatars/rainbow-black_1_kV1SeaG.png",
    "numLikes": 0
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`400 Bad Request`

```json
{
    "content": [
        "This field is required."
    ]
}
```
---

## Endpoint: `/blog/<blog_id>/delete/`

### Method: `DELETE`

### Description

This endpoint used to delete a blog object

### URL Parameter

`blog_id`: Unique ID of the blog to be deleted

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload
 
N/A


### Response

Returns status `204` on Success

Success response fields:

N/A

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`403 Forbidden`

```json
{
    "detail": "HTTPStatus.FORBIDDEN"
}
```
---

## Endpoint: `/blog/<blog_id>/like/`

### Method: `PUT`

### Description

This endpoint used for a user to like a blog object

### URL Parameter

`blog_id`: Unique ID of the blog to be liked

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload
 
`like`: 1 to like to blog, 0 to unlike the blog 

#### Example

```json
{
    "like": 1
}
```

### Response

Returns 202 if the user's like/unlike is successful. Returns 200 if user tries to like when they have already liked or unlikes when they haven't liked

Success response fields:

`numLikes`: The number of likes the liked/unliked blog has

#### Example

```json
{
    "numLikes": 0
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`400 Bad Request`

```json
{
    "like": [
        "This field is required."
    ]
}
```
---



## Endpoint: `/restaurant/<restaurant_id>/like/`

### Method: `PUT`

### Description

This endpoint used to like a restaurant object

### URL Parameter

`restaurant_id`: Unique ID of the restaurant to be liked

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload
 
`like`: 1 to like to blog, 0 to unlike the blog 

#### Example

```json
{
    "like": 1
}
```

### Response

Returns 202 if the user's like/unlike is successful. Returns 200 if user tries to like when they have already liked or unlikes when they haven't liked

Success response fields:

`num_likes`: The number of likes of the restaurant that was liked

#### Example

```json
{
    "numLikes": 1
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`400 Bad Request`

```json
{
    "like": [
        "This field is required."
    ]
}
```
---




## Endpoint: `/restaurant/<restaurant_id>/follow/`

### Method: `PUT`

### Description

This endpoint used to follow a restaurant object

### URL Parameter

`restaurant_id`: Unique ID of the restaurant to be followed

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload
 
`like`: 1 to follow to blog, 0 to unfollow the blog 

#### Example

```json
{
    "follow": 1
}
```

### Response

Returns 202 if the user's follow/unfollow is successful. Returns 200 if user follows when they are already following or unfollows when they aren't following

Success response fields:

`num_followers`: The number of followers of the restaurant that was followed

#### Example

```json
{
    "num_followers": 1
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`400 Bad Request`

```json
{
    "num_followers": [
        "This field is required."
    ]
}
```
---


## Endpoint: `/restaurant/<restaurant_id>/comment/`

### Method: `POST`

### Description

This endpoint used to comment on a restaurant object

### URL Parameter

`restaurant_id`: Unique ID of the restaurant to be commented on

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload
 
`message`: the comment's message

#### Example

```json
{
    "message": "first :)"
}
```

### Response

Success response fields:

`message`: The message of the comment created

#### Example

```json
{
    "message": "first :)"
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`400 Bad Request`

```json
{
    "message": [
        "This field is required."
    ]
}
```
---

## Endpoint: `/restaurant/<restaurant_id>/blogs/`

### Method: `GET`

### Description

This endpoint used to get all blogs posted by the restaurant

### URL Parameter

`restaurant_id`: Unique ID of the restaurant that the blogs will be from
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

`count`: Number of blogs posted by restaurant the user is following
`next`: URL to the next page if it exists i.e. if there is more data otherwise `null`  
`previous`: URL to the previous page. If it is the first page then `null`  
`results`: An array of blogs. Each blog has a `created_timestamp` key, a `modified_timestamp` key, a `title` key, a `content` key, a `imgs` key, and a `numlikes` key. These keys refer to the fields of the same name in the blogs model.

#### Example

```json
{
    "count":2,
    "next":null,
    "previous":null,
    "results":[
        {
            "created_timestamp":"2022-03-15T02:05:14.394406Z","modified_timestamp":"2022-03-15T02:05:14.394470Z",
            "title":"Title 2",
            "content":"Ipsum Lorem 1",
            "imgs":null,
            "numLikes":0
        },
        {
            "created_timestamp":"2022-03-15T02:11:20.498380Z","modified_timestamp":"2022-03-15T04:02:39.051571Z",
            "title":"Title 2",
            "content":"Ipsum Lorem 2",
            "imgs":"http://127.0.0.1:8000/blog/blog-logo/1234_r3D3r4p.PNG",
            "numLikes":1
        }
    ]
}
```

Possible error responses example:

`404 Not Found`

```json
{
    "detail": "Not found."
}
```

`401 Unauthorized`

```json
{
    "detail": "Invalid token."
}
```
```json
{
    "detail": "Authentication credentials were not provided."
}
```
---

`400 Bad Request`

```json
{
    "message": [
        "This field is required."
    ]
}
```
---