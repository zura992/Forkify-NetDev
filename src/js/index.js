import Recipe from './models/Recipe';
import Search from './models/Search';
import List from './models/List';
import Like from './models/Like';
import { clearLoader, elements, renderLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';




const state = {};
window.state = state;
 

const controlSearch = async () => {
    const query = searchView.getInput();


    if(query){

        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResList);

        state.search = new Search(query);
        await state.search.getResults() 

        clearLoader();
        searchView.renderResult(state.search.result)
    } 
}

//Recipe
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '')
        
    if(id){
        //Prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        state.search && searchView.activeLinkStyle(id); 

        //Create new rRecipe object
        state.recipe = new Recipe(id)

        try {
            await state.recipe.getRecipe();
        } catch (error) {
            alert('Recipe error')
        }
        
        state.recipe.parseIngredients();

        //Calculate time and servings
        state.recipe.calcTime()   
        state.recipe.calcServings()   


        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
    }
}

//shopping List 
const controllerList =() =>{
    //create a new list
    if(!state.list) state.list = new List();

    listView.clearShoppingList(); 

    //add each ingredient
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItems(el.count, el.unit, el.ingredient)
        listView.renderItem(item);
    })
}

//Like
const controlLike = () => {
    if(!state.likes) state.likes = new Like();

    const currentId = state.recipe.id;

    if(!state.likes.isLiked(currentId)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );
        
        //toogle to the button
        likesView.toggleLikeBtn(true)

        //Add like to ui list
        likesView.renderLike(newLike)
    }else{
                
        //toogle to the button
        likesView.toggleLikeBtn(false)

        //Delete like from state
        state.likes.deleteLike(currentId);

        //delete like from the Ui
        likesView.deleteLike(currentId)
    }

    likesView.toggleLikeMenu(state.likes.getLikeNum);
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete items
        state.list.deleteItem(id);  
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count__input')){
        //update item
        const newValue = +e.target.value;
        state.list.updareItem(id, newValue)
    }
})

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
})
  
elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');

    if(btn){
        const goToPage = +btn.dataset.goto;
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }
})  


window.addEventListener('hashchange', () =>{
    controlRecipe();
})

window.addEventListener('load', () => {
    state.likes = new Like()

    //Restore likes
    state.likes.readStorage(); 

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))

    likesView.toggleLikeMenu(state.likes.getLikeNum);

    controlRecipe();
})

elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('btn-decrease, .btn-decrease *')){ 
        // Decrease button
        if(state.recipe.servings  > 1){
            state.recipe.updateServingIngredient('dec')
            recipeView.updateServingIngredient(state.recipe);   
        }

    
    
    }else if(e.target.matches('btn-increase, .btn-increase *')){
       // Increase button 
       state.recipe.updateServingIngredient('inc'); 
       recipeView.updateServingIngredient(state.recipe);
    }else if(e.target.matches('.recipe__btn__add, .recipe__btn__add *')){
        //shopping List
        controllerList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }   
})