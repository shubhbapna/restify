## Apps <a name="apps"></a>

- <h3>restaurant</h3>  
  Stored under the restaurant directory. Used for all restaurant related endpoints such as create restaurant, update restaurant details, add menu items, edit menu items, add pictures, delete pictures, search for restaurants, view details of a restaurant, comment on a restaurant, follow a restaurant and like a restaurant. All APIs for this app begin with `/restaurant`. The file "serializer.py" contains all model serializers to help with the below views.

  - Views (All views are inside `restaurant/views`)
    - CreateRestaurant: Uses CreateApiView to create a new Restaurant object. The code is in `CreateRestaurant.py`
    - UpdateRestaurant: Uses UpdateAPIView to allow an owner to update the general details of a restaurant. The code is in `UpdateRestaurant.py`
    - AddPicture: Uses CreateApiView to create a new Picture object. The code is in `AddPicture.py`
    - DeletePicture: Uses DestroyAPIView since we want to delete a picture object that was added previously. The code is in `DeletePicture.py`
    - AddMenuItem: Uses CreateApiView to create a new Menu object for the given Restaurant object. The code is in `AddMenuItem.py`
    - UpdateMenu: Uses UpdateAPIView to allow an owner to update the general details of a menu item that restaurant has. The code is in `UpdateMenu.py`
    - SearchRestaurants: Uses a ListAPIView since we want the user to see a paginated list of restaurants they are searching for. The code is in `SearchRestaurants.py`
    - RestaurantDetail: Uses a RetrieveAPIView to get the restaurant object whose details the user wants to see. The code is in `RestaurantDetail.py`
    - CommentRestaurant: Uses ListCreateAPIView so that we get 2 endpoints: one for getting the list of comments for the given restaurant and one for posting comments on the given restaurant

## Models <a name="model"></a>

### Restaurant

Restaurant model is used to store all the restaurants that are created on the Restify application. Each restaurant object has exactly one owner. Defined in `restaurant/models.py`.

- owner: One to One field which refers to the User model in the accounts app. This refers to the owner of a restaurant object
- name: name of the restaurant object
- address: address of the restaurant object
- logo: logo of the restaurant object. This is an image field.
- postal_cdoe: postal code of the restaurant object
- phone_num: phone number of the restaurant object
- num_likes: number of likes this restaurant object has
- num_followers: number of followers this restaurant object has

### Menu

Menu model is used to store the menu of each restaurant. Each menu object refers to one food item that is there on that restaurant's menu. Defined in `restaurant/models.py`.

- restaurant: Foreign Key field which refers to the Restaurant model in the restaurant app. This refers to the restaurant object to whom this menu object belongs to.
- name: name of the food item
- description: description of the food item
- price: price of the food item

### Comment

Comment model is used to store all the comments that are made about a particular restaurant. Defined in `restaurant/models.py`.

- restaurant: Foreign Key field which refers to the Restaurant model in the restaurant app. This refers to the restaurant object about whom the comment was made
- username: username of the user who made the comment
- message: contents of the comment
- email: email of the user who made the comment

### Picture

Picture model is used to store all the pictures that a restaurant object adds. Defined in `restaurant/models.py`.

- restaurant: Foreign Key field which refers to the Restaurant model in the restaurant app. This refers to the restaurant object about who adds these pictures
- image: An ImageField to refer to the image stored in the picture object.

# APIs <a name="api"></a>

## Endpoint: `/restaurant/create/`

### Method: `POST`

### Description

This endpoint allows a user to create a restaurant, and thus become
an owner for that restaurant

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

`name`: The name of the restaurant you want to create  
`address`: The address of the restaurant you want to create  
`logo`: [OPTIONAL] A file upload for the logo of the restaurant you want to create  
`postal_code`: The postal code of the restaurant you want to create  
`phone_num`: [OPTIONAL] The phone number of the restaurant you want to create

#### Example

```json
{
  "name": "dominos",
  "address": "3353 Mississauga road",
  "logo": "http://localhost:8000/Screen_Shot_2022-03-08_at_12.46.34_PM.png",
  "postal_code": "L5L6A2",
  "phone_num": "+14379726888"
}
```

### Response

Success response fields:

`id`: The id of the newly created restaurant  
`name`: The name of the newly created restaurant  
`address`: The address of the newly created restaurant  
`logo`: The logo of the newly created restaurant  
`postal_code`: The postal code of the newly created restaurant  
`phone_num`: The phone number of the newly created restaurant

#### Example

```json
{
  "id": "1",
  "name": "dominos",
  "address": "3353 Mississauga road",
  "logo": "http://localhost:8000/Screen_Shot_2022-03-08_at_12.46.34_PM.png",
  "postal_code": "L5L6A2",
  "phone_num": "+14379726888"
}
```

Possible error responses example:

`400 Bad Request`  
If all the fields required to create a restaurant are not provided

```json
{
  "detail": "HTTPStatus.BAD_REQUEST"
}
```

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`403 Forbidden`  
When a user tries to create more than one restaurant

```json
{
  "detail": "HTTPStatus.FORBIDDEN"
}
```

---

## Endpoint: `/restaurant/update/`

### Method: `PUT/PATCH`

### Description

This endpoint allows an owner to update the basic details of a restaurant  
such as name, address, logo, postal code, phone number

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

In case of a PUT request all the below fields must be present,  
and in case of a PATCH request atleast one of the fields must be
present

`name`: [OPTIONAL] The updated name for the restaurant  
`address`: [OPTIONAL] The updated address for the restaurant  
`logo`: [OPTIONAL] The updated logo for the restaurant  
`postal_code`: [OPTIONAL] The updated postal code for the restaurant  
`phone_num`:[OPTIONAL] The updated phone number for the restaurant

#### Example

```json
{
  "name": "dominos restaurant"
}
```

### Response

Success response fields:

`id`: The id of the given restaurant  
`name`: The name of the given restaurant after the update  
`address`: The address of the given restaurant after the update  
`logo`: The logo of the given restaurant after the update  
`postal_code`: The postal code of the given restaurant after the update  
`phone_num`: The phone number of the given restaurant after the update

#### Example

```json
{
  "name": "dominos restaurant",
  "address": "3353 Mississauga road",
  "logo": "http://localhost:8000/Screen_Shot_2022-03-08_at_12.46.34_PM.png",
  "postal_code": "L5L6A2",
  "phone_num": "+14379726888"
}
```

Possible error responses example:

`400 Bad Request`  
If no fields are provided for a PUT request

```json
{
  "name": ["This field is required."],
  "address": ["This field is required."],
  "postal_code": ["This field is required."]
}
```

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`403 Forbidden`  
When a normal user who is not an owner of any restaurant  
tries to update a restaurant's details

```json
{
  "detail": "HTTPStatus.FORBIDDEN"
}
```

---

## Endpoint: `/restaurant/picture/add/`

### Method: `POST`

### Description

This endpoint allows an owner to add pictures to their restaurant

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

`image`: The image file you want to add to the restaurant

#### Example

```json
{
  "image": "http://localhost:8000/Screen_Shot_2022-03-08_at_12.46.34_PM.png"
}
```

### Response

Success response fields:

`image`: The image that you just added to your restaurant

#### Example

```json
{
  "image": "http://localhost:8000/Screen_Shot_2022-03-08_at_12.46.34_PM.png"
}
```

Possible error responses example:

`400 Bad Request`  
If no image file is provided

```json
{
  "detail": "HTTPStatus.BAD_REQUEST"
}
```

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`403 Forbidden`  
When a normal user who is not an owner of any restaurant  
tries to add pictures to a restaurant

```json
{
  "detail": "HTTPStatus.FORBIDDEN"
}
```

---

## Endpoint: `/restaurant/picture/<int:picture_id>/delete/`

### URL parameters

`<int:picture_id>` refers to the id of the picture  
you want to delete. You can get the id of the picture
as a response when you add that particular picture to your restaurant.

### Method: `DELETE`

### Description

This endpoint allows an owner to delete pictures they previously  
added for their restaurant

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

N/A

### Response

N/A  
since the required image was deleted so when it  
tries to return that image you get a `204 No Content`  
thus showing that the image was successfuly deleted

Possible error responses example:

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`403 Forbidden`  
When a normal user who is not an owner of any restaurant  
tries to delete a restaurant's pictures

```json
{
  "detail": "HTTPStatus.FORBIDDEN"
}
```

`404 Not Found`  
When you try to delete a picture which doesn't exist for that restaurant

```json
{
  "detail": "HTTPStatus.NOT_FOUND"
}
```

---

## Endpoint: `/restaurant/menu/add/`

### Method: `POST`

### Description

This endpoint allows an owner to add items to their restaurant's menu

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

`name`: The name of the item to be added to the restaurant's menu  
`description`: The description of the item to be added to the restaurant's menu  
`price`: The price of the item to be added to the restaurant's menu

#### Example

```json
{
  "name": "pizza",
  "description": "food",
  "price": "10"
}
```

### Response

Success response fields:

`name`: The name of the item added to the restaurant's menu  
`description`: The description of the item added to the restaurant's menu  
`price`: The price of the item added to the restaurant's menu

#### Example

```json
{
  "name": "pizza",
  "description": "food",
  "price": "10"
}
```

Possible error responses example:

`400 Bad Request`  
If no fields are provided to add the menu item

```json
{
  "detail": "HTTPStatus.BAD_REQUEST"
}
```

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`403 Forbidden`  
When a normal user who is not an owner of any restaurant  
tries to add menu items to a restaurant

```json
{
  "detail": "HTTPStatus.FORBIDDEN"
}
```

---

## Endpoint: `/restaurant/menu/<int:menu_id>/update/`

### URL parameters

`<int:menu_id>` refers to the id of the menu item  
you want to update. You can get the id of a menu item
as a response when you add that menu item to the restaurant

### Method: `PUT/PATCH`

### Description

This endpoint allows an owner to update the details of the items in their  
restaurant's menu such as the menu items' name, description, price

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

In case of a PUT request all the below fields must be present,  
and in case of a PATCH request atleast one of the fields must be
present

`name`: [OPTIONAL] The name of the menu item you want to update  
`description`: [OPTIONAL] The description of the menu item you want to update  
`price`: [OPTIONAL] The price of the menu item you want to update

#### Example

```json
{
  "name": "pasta"
}
```

### Response

Success response fields:

`name`: The name of the menu item after the update  
`description`: The description of the menu item after the update  
`price`: The price of the menu item after the update

#### Example

```json
{
  "name": "pasta",
  "description": "food",
  "price": "10"
}
```

Possible error responses example:

`400 Bad Request`  
If no fields are provided for a PUT request

```json
{
  "name": ["This field is required."],
  "description": ["This field is required."]
}
```

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`403 Forbidden`  
When a normal user who is not an owner of any restaurant  
tries to update a menu item

```json
{
  "detail": "HTTPStatus.FORBIDDEN"
}
```

`404 Not Found`  
When you try to update a menu item which doesn't exist

```json
{
  "detail": "HTTPStatus.NOT_FOUND"
}
```

---

## Endpoint: `/restaurant/search/`

### Method: `GET`

### Description

This endpoint allows a user to search for restaurants based on  
the restaurant name, address, or the name of the food items it sells

### Headers

`Authorization: Token {TOKEN_OBTAINED_FROM_LOGIN}`

#### Example

```
Authorization: Token 55d8de2d907664eb4dc4c7932a8c0f6ae41d3f50
```

### Payload

N/A

### Query Parameters

It is not necessary for all of these query parameters  
to be present. As long as one of them is present it will filter  
the results based on that criteria.

`name`: [OPTIONAL] The name of the restaurant you want to search for  
`address`: [OPTIONAL] The address of the restaurant you want to search for  
`food_name`: [OPTIONAL] The food name within the menu of the restaurant you want to search for

#### Example

```json
{
  "address": "mississauga"
}
```

### Response

Success response fields:

`count`: The number of restaurants returned as a result of search  
`next`: A link to the next page of results  
`previous`: A link to the previous page of results  
`results`: A list of restaurants which are returned as a result of search, each  
restaurant's details include their name, address, logo, postal code, and phone number.  
The restaurants in this list are arranged in the order of their popularity so the
restaurant with the most number of likes is on the top.

#### Example

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "name": "Starbucks",
      "address": "mississauga",
      "logo": "http://localhost:8000/restaurant/restaurant-logo/Screen_Shot_2022-03-08_at_12.46.34_PM_3AcGgMc.png",
      "postal_code": "123456",
      "phone_num": "+14379726884"
    },
    {
      "name": "dominos",
      "address": "mississauga",
      "logo": "http://localhost:8000/restaurant/restaurant-logo/Screen_Shot_2022-03-08_at_12.46.34_PM.png",
      "postal_code": "123456",
      "phone_num": "+14379726884"
    },
    {
      "name": "pizza hut",
      "address": "mississauga",
      "logo": "http://localhost:8000/restaurant/restaurant-logo/Screen_Shot_2022-03-09_at_11.38.26_AM.png",
      "postal_code": "123456",
      "phone_num": "+14379726884"
    }
  ]
}
```

Possible error responses example:

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

---

## Endpoint: `/restaurant/search/<int:restaurant_id>/`

### URL parameters

`<int:restaurant_id>` refers to the id of the restaurant  
you want to see the details of. You get this id as a response  
when a restaurant is created, or if you try to search for this restaurant.  
This id is also displayed as a response when an owner logs in.

### Method: `GET`

### Description

This endpoint allows a user to view the details of a restaurant,  
which includes its name, address logo, postal code, phone number,  
number of likes, number of followers, menu items, pictures, blogs, and comments

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

`name`: The name of the restaurant  
`address`: The address of the restaurant  
`logo`: An image file for the restaurant's logo  
`postal_code`: The postal code of the restaurant  
`phone_num`: The phone number of the restaurant  
`num_likes`: The number of likes for this restaurant  
`num_followers`: The number of followers for this restaurant  
`menu`: A list of menu items for this restaurant. Each menu item's  
details includes its name, description, and price  
`pictures`: A list of pictures that this restaurant has  
`blog`: A list of blogs that this restaurant has posted. Each blog's  
details include its timestamp when it was created, the tiemstamp when  
it was modified, title, content, images, and the number of likes  
`comments`: A list of comments that this restaurant has

#### Example

```json
{
  "name": "dominos",
  "address": "mississauga",
  "logo": "http://localhost:8000/restaurant/restaurant-logo/Screen_Shot_2022-03-08_at_12.46.34_PM.png",
  "postal_code": "123456",
  "phone_num": "+14379726884",
  "num_likes": 2,
  "num_followers": 0,
  "menu": [
    {
      "name": "pizza",
      "description": "food",
      "price": 1
    }
  ],
  "pictures": [
    {
      "image": "http://localhost:8000/restaurant/restaurant-pictures/Screen_Shot_2022-01-21_at_10.46.29_PM.png"
    }
  ],
  "blog": [
    {
      "created_timestamp": "2022-03-14T07:02:01.855409Z",
      "modified_timestamp": "2022-03-14T07:02:35.550240Z",
      "title": "hello",
      "content": "hello world",
      "imgs": "http://localhost:8000/Screen_Shot_2022-03-08_at_12.46.34_PM.png",
      "numLikes": 0
    }
  ],
  "comments": [
    {
      "message": "how are you"
    }
  ]
}
```

Possible error responses example:

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`404 Not Found`  
When you try to get the details of a restaurant which doesn't exist

```json
{
  "detail": "HTTPStatus.NOT_FOUND"
}
```

---

## Endpoint: `/restaurant/<int:restaurant_id>/menu/list/`

### URL parameters

`<int:restaurant_id>` refers to the id of the restaurant  
you want to see the menu items of. You get this id as a response  
when a restaurant is created, or if you try to search for this restaurant.  
This id is also displayed as a response when an owner logs in.

### Method: `GET`

### Description

This endpoint allows a user to see the list of menu items  
for a given restaurant

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

`count`: The number of menu items the given restaurant has  
`next`: A link to the next page of results  
`previous`: A link to the previous page of results  
`results`: A list of menu items the given restaurant has. For each menu  
item the details displayed include name, description and price.

#### Example

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "pizza",
      "description": "food",
      "price": 1
    }
  ]
}
```

Possible error responses example:

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`404 Not Found`  
When you try to get the menu items of a restaurant which doesn't exist

```json
{
  "detail": "HTTPStatus.NOT_FOUND"
}
```

---

## Endpoint: `/restaurant/<int:restaurant_id>/comment/list/`

### URL parameters

`<int:restaurant_id>` refers to the id of the restaurant  
you want to see the comments of. You get this id as a response  
when a restaurant is created, or if you try to search for this restaurant.  
This id is also displayed as a response when an owner logs in.

### Method: `GET`

### Description

This endpoint allows a user to see the list of comments  
for a given restaurant

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

`count`: The number of menu items the given restaurant has  
`next`: A link to the next page of results  
`previous`: A link to the previous page of results  
`results`: A list of commments the given restaurant has. For each comment  
we can see its contents.

#### Example

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "message": "how are you"
    }
  ]
}
```

Possible error responses example:

`401 Unauthorized`  
If a non-logged in user tries to access the endpoint  
or if an invalid token was used

```json
{
  "detail": "Invalid token."
}
```

`404 Not Found`  
When you try to get the comments of a restaurant which doesn't exist

```json
{
  "detail": "HTTPStatus.NOT_FOUND"
}
```

---
