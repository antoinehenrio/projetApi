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
    let getPage = (page) => {
        let start = (page - 1) * N_PER_PAGE
        let end = start + N_PER_PAGE
        let book

        //Attention si la page est trop élevée, on rappel l'API pour obtenir de nouveaux livres
        if(start >= books.length)
            getBooks(SUBJECT, (data) =>{
                books = books.push(data.works)
            }, Math.floor(data.length / N_PER_API))

        clearBooks()

        for(let i = start; i < end; i++){
            book = books[i]
            renderBook(book)
        }
    }

    //Afficher le livre
    let renderBook = (book) => {
        $('body').append('<p>' + book.title + '</p>')
        $('body').append('<img src="https://covers.openlibrary.org/b/id/' + book.cover_id + '-L.jpg" alt="' + book.title + '"/>')
    }

    //Enlever tous les livre affichés (notamment pour en afficher d'autres après)
    let clearBooks = () => {
        $('body').empty()
    }

    //Récupération des livres initial
    getBooks(SUBJECT, (data) =>{
        books = data.works

        console.log(books)

        getPage(2)        
    })



})