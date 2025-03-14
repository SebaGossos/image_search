// selectors
const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');
const paginationDiv = document.querySelector('#paginacion');

// variables
const registerByPage = 40;
let totalPages;
let iterator;
let currentPage = 1;


window.onload = () => {
    form.addEventListener('submit', validateForm);
}


function validateForm( e ) {
    e.preventDefault();
    const term = document.querySelector('#termino').value;
    if( term === '' ) {
        showSearch('Agregar un término de búsqueda');
        return;
    }
    
    searchImages();
}

function showSearch( message ) {
    
    const existAlert = document.querySelector('.bg-red-100');
    
    if( !existAlert ) {
        const alerta = document.createElement('P');
        alerta.classList.add( 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center' );
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${ message }</span>
        `
        
        form.appendChild( alerta );
        
        setTimeout(() => {
            alerta.remove();
        },3000 )
    }
    
    
}

function searchImages() {
    const term = document.querySelector('#termino').value;
    const key = '49327754-bcb4e960622572161d1503368'
    const url = `https://pixabay.com/api/?key=${ key }&q=${ term }&per_page=${registerByPage}&page=${ currentPage }`;
    
    fetch( url )
        .then( res => res.json() )
        .then( res => {
            totalPages = calculatePages(res.totalHits);
            showImages( res.hits );
        })

}

// generator that records quantity of element about pages 
function *createPagination( total ) {
    for( let i=1; i<=total; i++ ) {
        yield i;
    }
}

const calculatePages = total => parseInt( Math.ceil(total / registerByPage) ); 

function showImages( images ) {
    while( result.firstChild ) {
        result.removeChild( result.firstChild );
    }
    
    // iterate in array of img and show in HTML
    images.forEach( img => {
        const { previewURL, likes, views, largeImageURL } = img;
        
        result.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
        <div class="bg-white">
        <img src="${ previewURL }" class="w-full">
        
        <div class="p-4">
        <p class="font-bold">${likes} <span class="font-light">Me gustas</span></p>
        <p class="font-bold">${views} <span class="font-light">Veces vista</span></p>
        
        <a class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer" >Ver imagen</a>
        </div>
        </div>          
        </div>
        `;
    });
    
    // clean previous pagination
    while( paginationDiv.firstChild ) {
        paginationDiv.removeChild( paginationDiv.firstChild )
    }

    printPagination();
}

function printPagination() {
    iterator = createPagination( totalPages );
    while( true ) {
        const { value, done } = iterator.next();
        console.log(value, done)
        if ( done ) return;

        // Otherwise, make a button for each element in generator
        const btn = document.createElement('A')
        btn.href = '#';
        btn.dataset.pagina = value;
        btn.textContent = value;
        btn.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'rounded' );

        btn.onclick = () => {
            currentPage = value;
            searchImages();
        }

        paginationDiv.appendChild(btn);

    }
    
}