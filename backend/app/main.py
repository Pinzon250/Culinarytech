from fastapi import FastAPI
import uvicorn
from app.routes import user
from app.routes.spoonacular import recipes, ingredients, products, menu, wine
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

def create_tables():
    Base.metadata.create_all(bind=engine)
create_tables()



app = FastAPI()

app.include_router(user.router)
app.include_router(recipes.router)
app.include_router(ingredients.router)
# app.include_router(products.router)
# app.include_router(menu.router)
# app.include_router(wine.router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite solicitudes desde estas URLs
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
