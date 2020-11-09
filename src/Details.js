class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        book: null,
        thumbUrl: [],
        isFavorite: null
      }
    
      this.handleFav = this.handleFav.bind(this);
      this.handleLoad = this.handleLoad.bind(this);
      this.updateLocalStorage = this.updateLocalStorage.bind(this);
      this.updateFavStatus = this.updateFavStatus.bind(this);
  
    }
    componentDidMount() {
        let book = JSON.parse(localStorage.getItem('book'))[1];
        let thumbUrl = book.volumeInfo.imageLinks.thumbnail?
            book.volumeInfo.imageLinks.thumbnail.replace(/http:\/\//gi, 'https://'):
            'src/imgs/blank-thumbnail1.jpg';
        

        const ids = localStorage.getItem('books')? JSON.parse(localStorage.getItem('books')).map( b => b[0]): [];
        if(ids.some( i => i == book.id)){
            this.setState({
                isFavorite:true,
                book: book,
                thumbUrl: thumbUrl
            });
        } else {
            this.setState({
                book: book,
                thumbUrl: thumbUrl
            });
        }
        
    }
    
      
    handleFav(){
      this.setState({
        isFavorite: !this.state.isFavorite
      })
      this.updateLocalStorage(this.state.isFavorite);
    }
  
    handleLoad(event){
      let el = event.target;
      let par = el.parentNode;
      par.classList = 'card';
      
      
    }
    updateFavStatus(){
      const ids = localStorage.getItem('books')? JSON.parse(localStorage.getItem('books')).map( b => b[0]): [];
      if(ids.some( i => i == this.state.book.id)){
        this.setState({isFavorite:true});
      }
    }
    updateLocalStorage(isFav){
      let f = !isFav;
      let books = localStorage.getItem('books')?JSON.parse(localStorage.getItem('books')):JSON.parse('[]');
      console.log(books);
      let ids = books.map( b => b[0]);
      let book = this.state.book;
      console.log(book);
      let id = book.id;
      if (f && !ids.some(i => i == id)){
        books.push([id, book]);
        localStorage.setItem('books', JSON.stringify(books));
      } else {
        if(ids.some(i => i == id)){
          books.splice(ids.indexOf(id),1);
          localStorage.setItem('books', JSON.stringify(books));
        }
      }
    }
    render() {
        
        let {book} = this.state;
        
        return (
            <div id="app">
                <nav id="navbar">
                    <ul>
                        <li id="home-page"><a href="index.html">Home</a></li>
                        <li id="favorites"><a href="favorites.html">Favorites</a></li>
                    </ul>
                </nav>

                <div id="content">
                    <div  id="card" className="hidden">
                        <img src={this.state.thumbUrl} onLoad={this.handleLoad} />
                        <div className="card-bottom">
                            <div className="favorite" onClick={this.handleFav}><i className={this.state.isFavorite?"fa fa-star":"fa fa-star-o"}></i></div>
                        </div>
                    </div>
                    <div id="details">
                        <h1>{book?book.volumeInfo.title:''}</h1>
                        <p>By {book?book.volumeInfo.authors:''}</p>
                        <p>{book?book.volumeInfo.description:''}</p>
                        <hr/>
                        <p>published DATE</p>
                        

                        <p>pages</p>
                        <a>Preview link</a>
                    </div>
                </div>
                
            </div>
        )
  
    }
};
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );