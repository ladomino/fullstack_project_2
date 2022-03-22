Healthier Me

# Description
Healthier Me is an app designed to allow users to search for healthier recipes
based on their dietary preferences.  Users can save recipes they have tried, rate them for ease of preparation, rate them for taste and add additional comments for how they modified the recipe or problems they encountered.  Users will also receive product recommendations for the recipe or dietary restrictions and can save product choices to their profile.

# MVP Goals
-Create a profile - signup/login
-Search for recipes based off of Preferences
-Save your MyRecipes
-View the search recipes
-View your MyRecipes
-Add Comments to MyRecipes
-Edit Comments to the MyRecipes
-Add Other MyRecipes
-Edit your MyRecipes
-View Recommended Articles
-Delete your MyRecipes
-Delete your Comments

# Stretch Goals
- Allowing Users to add more specific nuturitional information or calorie searching
- Allowing Users to add Progress fitness/weight tracking to their profile
- Allowing Users to have a User Blog to track general notes for themselves.
- Allowing Users to associate articles with a given MyRecipe
- Allowing Users to view Nutritional content for ingredient

# User Stories
- As a user, I want to be able to create a personalized account.
- As a user, I want to be able to track in my recipes according to my dietary preferences.
- As a user, I want to be able to track and save specific recipes and ingredients.
- As a user, I want to know which recipes I have tried and liked.
- As a user, I want to save and comment on my recipes that I have tried
- As a user, I want to edit and customize recipes and pictures.
 -As a user, I want to be able to remove any recipes I did not like.

#APIs
[Edamam](https://developer.edamam.com/edamam-docs-recipe-api)
[HealthFinder](https://health.gov/our-work/national-health-initiatives/health-literacy/consumer-health-content/free-web-content/apis-developers/how-use-api)
[Bootstrap](https://getbootstrap.com/)

# Wire Frames

## Home
![Home](assets/home.png)

## Search
![Search](assets/search.png)

## RecipesMe
![RecipesMe](assets/recipesMe.png)

## Recipe
![Recipes](assets/recipe.png)

## ProductsMe
![ProductsMe](assets/productsMe.png)

# ERD
![ERD](assets/FullStack-Project2.jpg)

# Restful Routing API

| METHOD | URL | FUNCTIONALITY | VIEW |
| GET | / | 
| GET | /recipes |
| GET | /mine |
| GET | /new |
| POST | /new |
| POST | /:id |
| GET | /:id/edit |
| PUT | 