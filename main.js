'use-strict'

const searchImages = async (text) => {
    const key = '34701051-97d0295922e1adf6e71754621';
    const url = `https://pixabay.com/api/?key=${key}&q=${text}&image_type=photo`;
    const response = await fetch(url);
    return response.json();
}

const createLink = ( tag ) => 
`
    <a href="#" onClick='loadGallery(${JSON.stringify(tag)})'>
        ${tag}
    </a>
`

const createCard = ({webformatURL, pageURL, tags, likes, comments}) => {
    const card = document.createElement('div');
    card.classList.add ('card-container')
    card.innerHTML = `
        <a href="${pageURL}" class="card-image">
            <img src=${webformatURL} >
        </a>
        <div class="card-info">
            <div class="card-tags">
                ${tags.split(',').map(createLink).join('')}
            </div>
            <div class="card-action">
                <div class "card-like><i class="fa-regular fa-thumbs-up"></i></div>
                <span>${likes}</span>
                <div class "card-comment><i class="fa-regular fa-comment"></i></div>
                <span>${comments}</span>
                <div class "card-save><i class="fa-regular fa-bookmark"></i></div>
            </div>
        </div>   
    `;
    return card;
};

const loadGallery = async (text, page = 1) => {
    const container = document.querySelector('.container-gallery')
    const { hits, totalHits } = await searchImages(`${text}&page=${page}`)
    const cards = hits.map(createCard);
    container.replaceChildren(...cards);

    const totalPages =  Math.ceil(totalHits/20);
    document.querySelector('#page-total').textContent = `/ ${totalPages}`;
    document.querySelector('#search-input').value = text;
    document.querySelector('#page').value = page;
    
}

const handleKeyPress = ({key, target}) => {
    let text = target.value;
    if(text.includes(' ')){
        text = text.replace(' ', '+');
    }
    if(key==='Enter'){
        loadGallery(text);
    }
}

const handlePage = ({key, target}) => {
    let text = document.querySelector('#search-input').value;
    if(key==='Enter'){
        loadGallery(text, target.value);
    }
}

const handleNext = () => {
    let page = Number(document.querySelector('#page').value);
    const totalPages = Number(document.querySelector('#page-total').textContent.replace('/', ''));
    let text = document.querySelector('#search-input').value;
    if (page < totalPages){
        page++;
        loadGallery(text, page);
    }
}

const handlePrevious = () => {
    let page = Number(document.querySelector('#page').value);
    let text = document.querySelector('#search-input').value;
    if (page > 1){
        page--;
        loadGallery(text, page);
    }
}

document.querySelector('#search-input')
        .addEventListener('keypress', handleKeyPress);

document.querySelector('#page').addEventListener('keypress', handlePage);
document.querySelector('#page-next').addEventListener('click', handleNext);
document.querySelector('#page-previous').addEventListener('click', handlePrevious);