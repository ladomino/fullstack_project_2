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

| METHOD | URL                           | FUNCTIONALITY           | VIEW                           |
|--------|-------------------------------|-------------------------|--------------------------------|
| GET    | /                             | Home page               | render index.liquid            |
| GET    | /recipes                      | Search results          | render index.liquid            |
| GET    | /recipes/:id                  | Show a recipe           | renders recipes/show.liquid    |
| GET    | /recipes/mine                 | MyRecipes               | renders recipes/index.liquid   |
| GET    | /recipes/new                  | New Recipe              | renders recipes/new.liquid     |
| POST   | /recipes/new                  | Create Recipe           | redirect recipes/mine          |
| POST   | /recipes/:id                  | Add to MyRecipes        | redirect recipes?q=searchQuery |
| GET    | /recipes/:id/edit             | Edit a recipe           | render recipes/edit            |
| PUT    | /recipes/:id                  | Update a recipe         | redirect recipes/mine          |
| GET    | /recipes/mine/:id             | Show specific recipe    | renders recipes/show.liquid    |
| DELETE | /recipes/:id                  | Delete a recipe         | redirect recipes/mine          |
| GET    | /comment/:commentId           | Show a recipes comments | renders comment/index.liquid   |
| GET    | /comment/:id/:commentId       | Edit a specific comment | render comment/edit.liquid     |
| POST   | /comment/:id                  | Create a comment        | redirect comment/recipeId      |
| PATCH  | /comment/:id/:commentId/      | Update a comment        | redirect comment/recipeId      |
| DELETE | /comment/delete/:id/commentId | Delete a comment        | redirect comment/recipeId      |
| GET    | /signup                       | Sign up                 | render auth/signup.liquid      |
| POST   | /signup                       | Create user             | render auth/login.liquid       |
| GET    | /login                        | Sign in                 | render auth/login.liquid       |
| POST   | /login                        | Log in verification     | redirect /                     |
| GET    | /logout                       | Log out                 | redirect /                     |

# Home Page

![DeployedHome](assets/HealthyRecipeMe.png)

# Edit Recipe/Comments

![EditAndComments](assets/EditRecipeAndComments.png)