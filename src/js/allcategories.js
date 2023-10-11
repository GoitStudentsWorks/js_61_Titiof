import { BooksAPI } from "./books-api";
import { menuTemplate } from "./allcategories/category_template";
import { markupCategoryBook } from "./allcategories/category_template";
import { createListMarkup } from "./bookMarkupLi";

const listEl = document.querySelector('.vertical-menu');
const categoryTitle = document.querySelector('.main-header');
const bestsellersList = document.querySelector('.bestsellers-list');
const items = listEl.querySelectorAll('a');


const booksAPI = new BooksAPI();


window.addEventListener("DOMContentLoaded", async () => {
    items[0].classList.add('active');

    try{
        const listData =  await booksAPI.getCategoriesList();
        const markup = menuTemplate(listData);
        listEl.insertAdjacentHTML("beforeend", markup);
    }catch(error) {
        Notiflix.Notify.failure('Oops, something went wrong!');
    }
});

listEl.addEventListener('click', onChangeCategoryPage);


bestsellersList.addEventListener('click', (e) => {
    if(e.target.nodeName === 'BUTTON'){
        categoryTitle.style.display = "none";
        renderBooksFromCategory(e.target.name)
    }
});


async function onChangeCategoryPage(e){
    e.preventDefault();

    if(e.target.nodeName === 'A'){

            listEl.querySelectorAll('a').forEach(item => {
                item.classList.remove('active');
            });
    
            e.target.classList.add('active');
    
        if(e.target.name === 'allcategories'){
            try {
                const response = await booksAPI.getBooks();
                createListMarkup(response);
    
                categoryTitle.style.display = "block";
                
              } catch (error) {
                Notiflix.Notify.failure('Oops, something went wrong!');
              }
        }else {
            categoryTitle.style.display = "none";
            const title = e.target.name;
            renderBooksFromCategory(title);
        }    
    } else{
        return;
    }
}

async function renderBooksFromCategory(category_name){
    try{
        const booksCategoryData = await booksAPI.getFullCategory(category_name);
        markupCategoryBook(booksCategoryData, category_name);
    }catch(error){
        Notiflix.Notify.failure('Sorry, there is no books in this category');
    }
}

