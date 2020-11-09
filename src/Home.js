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
        num: prevState.num + 1
      })
    );
    
    event.target.previousSibling.blur();
    event.target.previousSibling.value = '';
    event.target.previousSibling.focus();
  }
  handleInput(event) {
    if(event.target.value){
      this.setState({
        url:"https://www.googleapis.com/books/v1/volumes?q=" + event.target.value.trim().replace(/\s+/g, '+')
      })
    } else {
      this.setState({ url: ''});
    }
  }
  render() {
    console.log(this.state.url)
    return (                                                                                                 //APP RENDER IS HERE!
      <div id="app">
        <nav id="navbar">
          <ul>
            <li id="home-page"><a href="index.html">Home</a></li>
            <li id="favorites"><a href="favorites.html">Favorites</a></li>
          </ul>
          
          <form id="search-bar">
            <input id="text-input" onBlur={this.handleInput} />
            <button id="enter" onClick={this.handleEnter}>Go</button>
          </form>
            
        </nav>

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
      isLoaded: false,
      url: ''
    }
  }
  componentDidMount() {
    
    let urlLink = this.props.url;
    if(urlLink == ''){this.setState({isLoaded: true});return}; //CASE WHEN URL = ''
    fetch(urlLink) //FETCH THE LINK
    .then(result => result.json())
    .then(res => {
      if(res.totalItems === 0) { this.setState({isLoaded: true});return }; //ONE LINE AVOID BAD URL 
      const thumbUrls = res.items.map( obj => {
        let thisWillReturn;
        (obj.volumeInfo.imageLinks === undefined)?
        thisWillReturn = 'src/imgs/blank-thumbnail1.jpg': 
        thisWillReturn = obj.volumeInfo.imageLinks.thumbnail.replace(/http:\/\//gi, 'https://');
        return thisWillReturn
      });
      this.setState({
        isLoaded: true,
        books: res.items,
        thumbUrls: thumbUrls
      })
    })
    .catch( err => {
      console.log(err);
      this.setState({isLoaded: true})
    });
  }
  render() {                                                                                                    //BOOKSTACK RENDER IS HERE!
    let {books, thumbUrls,isLoaded} = this.state;
    return (isLoaded?(
    <div id="book-stack">
      <h1>Books from Google</h1>
      <div id="bookcase">
        {thumbUrls.map((u,i)=><BookCard 
          key={i}
          index={i+1}
          book={books[i]}
          thumbUrl={thumbUrls[i]}
        />)}
      </div>
      
    </div>
      
    ):
      <div id="loader"></div>
    )
    
  }
}

class BookCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      book: [],
      thumbUrl: [],
      isFavorite: false
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
    console.log(this.state.book);
    localStorage.setItem('book',JSON.stringify([this.state.book.id, this.state.book]));
  }
  handleLoad(event){
    let el = event.target;
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
    let ids = books.map( b => b[0])
    let book = this.state.book;
    let id = book.id;
    let index = this.state.index;//
    let indexes = books.map( b => b[0]);//
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
    return (
      <div className="hidden">
        <img src={this.props.thumbUrl} onLoad={this.handleLoad} />
        <div className="card-bottom">
          <div className="favorite" onClick={this.handleFav}><i className={this.state.isFavorite?"fa fa-star":"fa fa-star-o"}></i></div>
          <a href="details.html"><div className="details" onClick={this.handleDet}><i className="fa fa-chevron-circle-right"></i> Details</div></a> 
        </div>
      </div>
    )

  }
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);