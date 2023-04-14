from accounts.models import Notification

def like_restaurant(user, restaurant, like):
    '''
    @param user: User object who liked the restuarant
    @param restaurant: Restaurant object which got liked by the user
    @param like: Boolean if like is True then "like" the restaurant. Otherwise "unlike"
    the restaurant

    Creates a notification for the restaurant owner that user liked their restaurant.
    Adds the restaurant to the liked restaurants list of the user

    Return number of total likes for the restaurant otherwise -1
    '''
    try:
        check_liked = user.liked_restaurant.filter(id=restaurant.id).exists()
        if like and not check_liked: 
            user.liked_restaurant.add(restaurant)
            user.save()
            restaurant.num_likes += 1
            restaurant.save()
            Notification.objects.create(message=f'{user.username} liked your restaurant!', 
                                        user=restaurant.owner)            
        elif not like and check_liked:
            user.liked_restaurant.remove(restaurant)
            user.save()
            restaurant.num_likes -= 1
            restaurant.save()
        return restaurant.num_likes
    except Exception as e:
        print(e)
        return -1

def follow_restaurant(user, restaurant, follow):
    '''
    @param user: User object who followed the restuarant
    @param restaurant: Restaurant object which got followed by the user

    Creates a notification for the restaurant owner that user followed their restaurant.
    Adds the restaurant to the followed restaurants list of the user

    Return number of total followers for the restaurant otherwise -1
    '''
    try:
        check_followed = user.followed_restaurant.filter(id=restaurant.id).exists()
        if follow and not check_followed:
            user.followed_restaurant.add(restaurant)
            user.save()
            restaurant.num_followers += 1
            restaurant.save()
            Notification.objects.create(message=f'{user.username} followed your restaurant!', 
                                        user=restaurant.owner)
        elif not follow and check_followed:
            user.followed_restaurant.remove(restaurant)
            user.save()
            restaurant.num_followers -= 1
            restaurant.save()
        return restaurant.num_followers
    except Exception as e:
        print(e)
        return -1

def liked_blog(user, blog, like):
    '''
    @param user: User object who liked the blog
    @param blog: Blog object which got liked by the user

    Creates a notification for the restaurant owner that user liked their restaurant's blog.
    Adds the blog to the liked blogs list of the user

    Return number of total likes for the blog otherwise -1
    '''
    try:
        check_liked = user.liked_blogs.filter(id=blog.id).exists()
        if like and not check_liked: 
            user.liked_blogs.add(blog)
            user.save()
            blog.numLikes += 1
            blog.save()
            Notification.objects.create(message=f'{user.username} liked your restaurant\'s blog!', 
                                        user=blog.restaurant.owner)            
        elif not like and check_liked:
            user.liked_blogs.remove(blog)
            user.save()
            blog.numLikes -= 1
            blog.save()
        return blog.numLikes
    except Exception as e:
        print(e)
        return -1

def comment_restaurant_notification(user, restaurant):
    '''
    @param user: User object who commented on the restuarant
    @param restaurant: Restaurant object on which the user commented

    Creates a notification for the restaurant owner that user commented on their restaurant.

    Return True if successful otherwise False
    '''
    try:
        Notification.objects.create(message=f'{user.username} commented on your restaurant\'s blog!', 
                                        user=restaurant.owner)
        return True
    except Exception as e:
        print(e)
        return False

def blog_posted_notification(restaurant):
    '''
    @param restaurant: Restaurant object which posted the new blog

    Creates a notification for all the users following the restaurant when the restaurant
    posts a new blog post

    Return True if successful otherwise False
    '''
    try:
        following_users = restaurant.followed_restaurants.all()
        for user in following_users:
            Notification.objects.create(message=f'{restaurant.name} posted a new blog!', 
                                        user=user)
        return True
    except Exception as e:
        print(e)
        return False

def menu_updated_notification(restaurant):
    '''
    @param restaurant: Restaurant object which updated their menu

    Creates a notification for all the users following the restaurant when the restaurant
    updates their menu

    Return True if successful otherwise False
    '''
    try:
        following_users = restaurant.followed_restaurants.all()
        for user in following_users:
            Notification.objects.create(message=f'{restaurant.name} updated their menu!', 
                                        user=user)
        return True
    except Exception as e:
        print(e)
        return False
        

