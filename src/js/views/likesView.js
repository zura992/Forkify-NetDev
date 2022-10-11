import { elements } from "./base";
import { converTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
    const iconStr = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconStr}`)
}

export const toggleLikeMenu = numLikes => {
    elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hiden'
}



 export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${converTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>    
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
 }

export const deleteLike = id =>{
    const el = document.querySelector(`.likes__link[href="#${id}"]`)
    el.parentElement.removeChild(el);
}