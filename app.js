let getPage, firstPage;
let updateRightPagination;
let updateLeftPagination;
$(function(){
    //Sujet du livre
    const SUBJECT = 'fantasy'
    //Nombre de livre par page
    const N_PER_PAGE = 10
    //Nombre de livre a récupéré par l'API
    const N_PER_API = 100
    //Page courante (commence à 1)
    let page = 1

    let books = []

    let number = 0

    let lastPage = 10

    //Récupérer les livres depuis l'API
    let getBooks = (subject, cb, page = 0) => {
        //du livre numéro
        let offset =  page * N_PER_API
        //au livre numéro
        let limit = offset + N_PER_API
        $.ajax({
            url: `http://openlibrary.org/subjects/${subject}.json?offset=${offset}&limit=${limit}`,
            success: (data) => {
                cb(data)
            }
        })
    }


    //Pagination
    getPage = (page) => {
        let start = (page - 1) * N_PER_PAGE
        let end = start + N_PER_PAGE
        let book

        //Attention si la page est trop élevée, on rappel l'API pour obtenir de nouveaux livres
    if(start >= books.length){
        getBooks(SUBJECT, (data) =>{
        for(let book of data.works)
            books.push(book)
        console.log(books)
        getPage(page)
        }, Math.floor(books.length / N_PER_API))
        return
    }   

        clearBooks()

        for(let i = start; i < end; i++){
            book = books[i]
            renderBook(book)
        }
        renderPagination(page)
    }

    //Afficher le livre
    let renderBook = (book) => {
        html = '<li class="book1">' +
        '<img src="https://covers.openlibrary.org/b/id/' + book.cover_id + '-L.jpg" height="70" width="50" class="bookCover">' +
        '<p>' + book.title + '</br>' +
        book.authors[0].name + '</p></li>';
        $('.listBook').append(html) 
    }

    //Afficher la pagination
    let renderPagination = (numpage) =>{
        clearLinks()
        let compteur,max
        if (numpage<lastPage && numpage != 1){
            compteur = numpage - 9
            max = numpage
        } else{
            compteur = numpage
            max = numpage + 9
        }
        let i 
        let firstLink = '<li>' +
        '<a class="lien" id="leftArrow" href="#" onclick="updateLeftPagination();">' +
        '&lsaquo;' +
        '</a></li>'
        $('.listeNav').append(firstLink)
        for (i=compteur;i<max;i++){
            let html = ''
            html = '<li>'+
            '<a class="lien" href="#" onclick="getPage(' + i +');return false;">' + 
            i +
            '</a></li>'
            $('.listeNav').append(html)
        }
        $('.listeNav').append('<li><a class="lien" id="rightArrow" href="#" onclick="updateRightPagination();">&rsaquo;</a></li>')
        html = ''
        lastPage = max
        firstPage = compteur
    }

    //Enlever tous les livre affichés (notamment pour en afficher d'autres après)
    let clearBooks = () => {
        $('.listBook').empty()
    }

    //Enlever les liens de pagination
    let clearLinks = () => {
        $('.listeNav').empty()
    }

    //Actualise la pagination en cliquant sur la flèche de droite
    updateRightPagination = () => {
        getPage(lastPage)
    }

    updateLeftPagination = () => {
        getPage(firstPage)
    }

    //Récupération des livres initial
    getBooks(SUBJECT, (data) =>{
        books = data.works
        console.log(books)
        getPage(1)        
    })


})