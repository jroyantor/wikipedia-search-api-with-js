
const form = document.querySelector('.js-form');
const query = document.querySelector('.search');

form.addEventListener('submit', actionFunction);


async function actionFunction(event){
    event.preventDefault();

    const sValue = query.value;
    const query_tr = sValue.trim();
    const spinner = document.querySelector('.lds-ripple');
    const searchResults = document.querySelector('.results-wrapper');
    searchResults.innerHTML = '';
    spinner.classList.remove('hide');
    try{
        if(query_tr.length === 0){
            alert('Query cannot be empty.');
            return;
        }
        const results = await searchWiki(query_tr);
        if(results.query.searchinfo.totalhits === 0){
            alert('No results found for the given query.');
            return;
        }
        displyResults(results);
    } catch(error){
        console.log(error);
        alert("Failed to search wikipedia.");
    }
     finally{
         spinner.classList.add('hide');
     }

}

async function searchWiki(searchQuery){
    const path = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(path);

    if(!response.ok){
        throw Error(response,statusText);
    }
    const json =  await response.json();
    return json;
}

function displyResults(results){
    const resultPanel = document.querySelector('.results-wrapper');

    results.query.search.forEach(element => {
        const url = `https://en.wikipedia.org/?curid=${element.pageid}`;

        resultPanel.insertAdjacentHTML('beforeend',
        
        `<div class="results">
        
        <h3 class="results-title">
        <a href="${url}" target="_blank">${element.title}</a>
        </h3>
        
        <a href="${url}" target="_blank" class="results-link">${url}</a>
        <p class="results-snippet">${element.snippet}</p>      
        </div>
        `)
    });
}