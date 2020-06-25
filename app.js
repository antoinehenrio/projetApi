let getPage, firstPage;
let updateRightPagination;
let updateLeftPagination;
let flag = false;
$(function(){
    //Stockage
    const STORAGE = localStorage
    //Sujet du livre
    const SUBJECT = 'fantasy'
    //Nombre de livre par page
    const N_PER_PAGE = 10
    //Nombre de livre a récupéré par l'API
    const N_PER_API = 100
    //Page courante (commence à 1)
    let page = 1

    let number = 0
    let lastPage = 10

    let constBooks = []
    let books = []

    //Récupérer les livres par sujet depuis l'API
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

    //Recherche les livres
    searchBooks = (query, cb, page = 0) => {
        page++
        $.ajax({
            url: `http://openlibrary.org/search.json?q=${query}&page=${page}`,
            success: (data) => {
                console.log(data)
                cb(data)
            }
        })
    }

    //Pagination
    getPage = (page) => {
        let start = (page - 1) * N_PER_PAGE
        let end = start + N_PER_PAGE
        let book

        if (flag == true){
            start = (page - 10) * N_PER_PAGE
            end = start + N_PER_PAGE
            flag = false
        }
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
        let rating = STORAGE.getItem(book.key) || 0
        let ratingStar = ""
        for(let i = 0; i < 5; i++)
            if(i < 5 - rating)
                ratingStar += '<span class="star">☆</span>'
            else
                ratingStar += '<span class="star">★</span>'
        html = '<li class="book1 ' + (STORAGE.getItem(book.key) ? 'favorite' : '') + '" data-key="' + book.key + '">' +
            '<img src="https://covers.openlibrary.org/b/id/' + book.cover_id + '-L.jpg" height="70" width="50" class="bookCover">' +
            '<p class="bookTitle"><span class="title">' + book.title + '</span></br>' +
                book.authors[0].name +
            '</p>' +
            '<div class="rating">' +
                ratingStar +
            '</div>' +
        '</li>';

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
            if (max > number){
                max = number
            }
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
        console.log('Page actuelle : ' + page)
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
        if (firstPage != 1){
            flag = true
            getPage(firstPage)
        }
    }

    //Récupération des livres initial
    getBooks(SUBJECT, (data) =>{
        books = data.works
        constBooks = data.works
        number = data.work_count
        getPage(1)        
    })

    //Appuie sur la touche entrée de la barre de recherche
    /*$('#search').keyup((e) => {
        if(e.keyCode == 13){
            searchBooks($(e.target).val(), (data) => {
                isSearch = true
                //Traiter pour avoir des données similaires à getBooks
                books = data.docs

                for(let i = 0; i < books.length; i++)
                {
                    books[i].cover_id = books[i].cover_i
                    books[i].authors = []
                    books[i].authors.push({name: books[i].author_name})
                }

                getPage(1)
            })
        }
    })*/

    $('#search').on('keyup', (e) => {
        let el = $(e.target)
        let query = el.val().trim().toLowerCase()

        books = []

        if(query === "")
            books = constBooks
        else {
            for(let book of constBooks){
                let searching = (book.title + JSON.stringify(book.authors)).toLowerCase().trim()
                console.log(searching)
                if(searching.indexOf(query) > -1)
                    books.push(book)
            }
        }

        getPage(1)
    })

    $(document).on('click', '.star', (e) => {
        let el = $(e.target)
        console.log($('.rating span').index(el))
        STORAGE.setItem(el.closest('li').data('key'), 5 - ($('.rating span').index(el) % 5))
        el.addClass('active')
    })

    /*$(document).on('click', (e) => {
        console.log($('.rating span').index($(e.target)))
    })*/
})