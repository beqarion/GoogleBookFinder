class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      num: 0,
      input: '',
      url: '',
    }
    this.handleEnter = this.handleEnter.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  
  handleEnter(event) {
    event.preventDefault();
    this.setState( prevState => ({
      num: prevState.num + 1,
    }));
    event.target.previousSibling.blur();
    event.target.previousSibling.value = '';
    event.target.previousSibling.focus();
  }
  handleInput(event) {
    if(event.target.value){
      this.setState({
        url:"https://www.googleapis.com/books/v1/volumes?q=" + event.target.value.trim().replace(/\s+/g, '+')
      })
    }
  }
  render() {
    return (                                                                                                 //APP RENDER IS HERE!
      <div id="app">
        <a href="index.html"><h1>Home</h1> </a>

        <BookStack key={this.state.num} number={this.state.num} url={this.state.url}/>

      </div>
      
    )
  }
}


class BookStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      thumbUrls: [],
      url: ''
    }
  }
  componentDidMount() {
    let books = localStorage.getItem('books')?JSON.parse(localStorage.getItem('books')):JSON.parse('[]');
    const thumbUrls = books.map( b => {
      let thisWillReturn;
      (b[1].volumeInfo.imageLinks === undefined)?
      thisWillReturn = 'src/imgs/blank-thumbnail1.jpg': 
      thisWillReturn = b[1].volumeInfo.imageLinks.thumbnail.replace(/http:\/\//gi, 'https://');
      return thisWillReturn
    });
    this.setState({
      isLoaded: true,
      books: books,
      thumbUrls: thumbUrls
    })
    
  }
  render() {                                                                                                    //BOOKSTACK RENDER IS HERE!
    let {books, thumbUrls} = this.state;
    return (
      <div id="book-stack">
        <h1>Favorite Books</h1>
        <div id="bookcase">
          {thumbUrls.map((u,i)=><BookCard 
            key={i}
            index={i+1}
            book={books[i]}
            thumbUrl={thumbUrls[i]}
          />)}
        </div>
        
      </div>
      
    )
    
  }
}

class BookCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      thumbUrl: [],
      isFavorite: true
    }
  
    this.handleDet = this.handleDet.bind(this);
    this.handleFav = this.handleFav.bind(this);
    this.handleLoad = this.handleLoad.bind(this);

  }
  componentDidMount() {
    this.setState(this.props);
    this.updateFavStatus();
  }
  
    
  handleFav(){
    this.setState({
      isFavorite: !this.state.isFavorite
    })
    this.updateLocalStorage(this.state.isFavorite);
  }

  handleDet(){
    console.log(this.state.index+" details");
  }
  
  handleLoad(event){
    let el = eveent.target;
    let par = el.parentNode;
    par.classList = 'card';
    
    
  }
  updateFavStatus(){
    const ids = localStorage.getItem('books')? JSON.parse(localStorage.getItem('books')).map( b => b[0]): [];
    if(ids.some( i => i == this.props.book.id)){
      this.setState({isFavorite:true});
    }
  }
  updateLocalStorage(isFav){
    let f = !isFav;
    let books = localStorage.getItem('books')?JSON.parse(localStorage.getItem('books')):JSON.parse('[]');
    let ids = books.map( b => b[0]);
    let book = this.state.book[1];
    let id = book.id;
    console.log(id);
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
  render() {                                                                                  //BOOKCARD RENDER IS HERE!
    return (
      <div className="hidden">
        <img src={this.props.thumbUrl} onLoad={this.handleLoad} />
        <div className="card-bottom">
          <div className="favorite" onClick={this.handleFav}><i className={this.state.isFavorite?"fa fa-star":"fa fa-star-o"}></i></div>
          <div className="details" onClick={this.handleDet}><i className="fa fa-chevron-circle-right"></i> Details</div>
        </div>
      </div>
    )

  }
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);