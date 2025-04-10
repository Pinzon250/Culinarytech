from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.db_recipes import Recipe, SimilarRecipes
from app.schemas.recipe import RecipeSchema, SimilarRecipesSchema, RecipesWithSimilarSchema
from app.db.database import get_db
from dotenv import load_dotenv
import os, requests

# Import environment variables
load_dotenv()

router = APIRouter(
    prefix="/recipes",
    tags=["spoonacular"],
    responses={
        404: {"description": "Recipe not found"},
        500: {"description": "Internal Server Error"},
    },
)

API_KEY = os.getenv("SPOONACULAR_API_KEY")
BASE_URL = "https://api.spoonacular.com"

#     ------------------      Endpoint to get recipes for SpoonacularAPI | User search by name or ingredient         ------------------

@router.get("/search/{title}", response_model=list[RecipeSchema])
def get_recipes_by_title(title: str, number: int = 5, db: Session = Depends(get_db)):

    # 1. Search the recipe in the database
    local_recipes = db.query(Recipe).filter(Recipe.title.ilike(f"%{title}%")).limit(number).all()

    # 2. If not found in the database, search in the Spoonacular API

    response = requests.get(
        f"{BASE_URL}/recipes/complexSearch",
        params={"query": title, "number": number, "apiKey": API_KEY},
    )
    

    if response.status_code != 200:
        raise HTTPException(status_code=500,detail="Error fetching data from API")
    data = response.json()
    results = data.get("results", [])

    if not results:
        raise HTTPException(status_code=404,detail="Recipe not found")

    # 3. Save the recipes to the database
    saved_recipes = []
    for recipe in results:
        # Check if the recipe already exists in the database
        existing_recipe = db.query(Recipe).filter_by(spoonacular_id=recipe["id"]).first()

        if existing_recipe:
            saved_recipes.append(existing_recipe)
            continue

        new_recipe = Recipe(
            title=recipe["title"],
            image=recipe["image"],
            spoonacular_id=recipe["id"],
            instructions="",
            ingredients="",
            cached=True
        )
        # Add the new recipe to the database
        db.add(new_recipe)
        saved_recipes.append(new_recipe)

        
    db.commit()


    all_recipes = {recipe.spoonacular_id: recipe for recipe in local_recipes + saved_recipes}

    return list(all_recipes.values())   

#       ------------------      Endpoint to get recipes by ingredient for SpoonacularAPI | User search by ingredient       ------------------

@router.get("/ingredients/")
def search_recipes_by_ingredients(
        ingredients: str = Query(..., description="Comma-separated list of ingredients"),
        number: int = Query(5, description="Number of recipes to return"),        
    ):
        url = f"https://api.spoonacular.com/recipes/findByIngredients"

        params = {
            "ingredients": ingredients,
            "number": number,
            "apiKey": API_KEY,
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=500,detail="Error fetching data from API")
        
        data = response.json()

        if not data:
             raise HTTPException(status_code=404,detail="Recipe not found")
        
        return data

#       ------------------       Endpoint to get similar recipes for SpoonacularAPI | Recommendation recipes by user search (cache)       ------------------      

@router.get("/{recipe_id}/similar_recipes", response_model=RecipesWithSimilarSchema)
def get_similar_recipes(
        title : str = Query(..., description="Title of the recipe"),
        number: int = Query(5, description="Number of similar recipes to return"),
        db: Session = Depends(get_db),
    ):
        
        # 1. Search the recipe in the database
        recipe = db.query(Recipe).filter(Recipe.title.ilike(f"%{title}%")).first()

        if recipe:
            similar_recipes = db.query(SimilarRecipes).filter(SimilarRecipes.recipe_id == recipe.id).all()

            if similar_recipes:
                return RecipesWithSimilarSchema(
                    spoonacular_id=recipe.spoonacular_id,
                    title=recipe.title,
                    image=recipe.image,
                    ingredients = recipe.ingredients,
                    similar_recipes=[SimilarRecipesSchema(
                        similar_spoonacular_id=sr.similar_recipe_id,
                        title= sr.title,
                        image=sr.image,
                ) for sr in similar_recipes]
            )
        
        # 2. If not found in the database, search in the Spoonacular API
        search_url = f"https://api.spoonacular.com/recipes/complexSearch"
        search_params = {
            "query": title,
            "number": number,
            "apiKey": API_KEY,
        }

        search_response = requests.get(search_url, params=search_params)

        if search_response.status_code != 200 or not search_response.json().get("results"):
            raise HTTPException(status_code=500,detail="Error fetching data from API")
        
        # Getting the recipe ID from the first result
        spoonacular_id = search_response.json()["results"][0]["id"]
        title = search_response.json()["results"][0]["title"]
        image = search_response.json()["results"][0]["image"]

        # Verify if the recipe already exists in the database
        existing_recipe = db.query(Recipe).filter(Recipe.spoonacular_id==spoonacular_id).first()
        if existing_recipe:
             recipe = existing_recipe
        else:
        # Save in the database if not exists
            recipe = Recipe(spoonacular_id=spoonacular_id, title=title, image=image, ingredients="")
            db.add(recipe)
            db.commit()
            db.refresh(recipe)

        # Get similar recipes in the Spoonacular API
        similar_url = f"https://api.spoonacular.com/recipes/{spoonacular_id}/similar"
        similar_params = {
            "number": number,
            "apiKey": API_KEY,
        }
        response = requests.get(similar_url, params=similar_params)

        if response.status_code != 200:
            raise HTTPException(status_code=500,detail="Error fetching data from API")
        
        similar_data = response.json()
        
        if not similar_data:
             raise HTTPException(status_code=404,detail="Recipe not found") 
        
        # Save similar recipes in the database
        similar_recipes_list = []
        for item in similar_data:
             similar_recipes = SimilarRecipes(
                recipe_id=recipe.id,
                similar_recipe_id=item["id"],
                title=item["title"],
                image=item["image"],
            )
        db.add(similar_recipes)
        similar_recipes_list.append(SimilarRecipesSchema(
                 similar_spoonacular_id=item["id"],
                 title=item["title"],
                 image=item["image"],
            ))
        
        db.commit()
        
        # Return similar recipes
        return RecipesWithSimilarSchema(
            spoonacular_id=recipe.spoonacular_id,
            title=recipe.title,
            image=recipe.image,
            ingredients = recipe.ingredients,
            similar_recipes=similar_recipes_list
        )
    #       ------------------      Endpoint to get random recipes for SpoonacularAPI | Random recipes       ------------------      