var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      book: null,
      thumbUrl: [],
      isFavorite: null
    };

    _this.handleFav = _this.handleFav.bind(_this);
    _this.handleLoad = _this.handleLoad.bind(_this);
    _this.updateLocalStorage = _this.updateLocalStorage.bind(_this);
    _this.updateFavStatus = _this.updateFavStatus.bind(_this);

    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var book = JSON.parse(localStorage.getItem('book'))[1];
      var thumbUrl = book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail.replace(/http:\/\//gi, 'https://') : 'src/imgs/blank-thumbnail1.jpg';

      var ids = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')).map(function (b) {
        return b[0];
      }) : [];
      if (ids.some(function (i) {
        return i == book.id;
      })) {
        this.setState({
          isFavorite: true,
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
  }, {
    key: 'handleFav',
    value: function handleFav() {
      this.setState({
        isFavorite: !this.state.isFavorite
      });
      this.updateLocalStorage(this.state.isFavorite);
    }
  }, {
    key: 'handleLoad',
    value: function handleLoad(event) {
      var el = event.target;
      var par = el.parentNode;
      par.classList = 'card';
    }
  }, {
    key: 'updateFavStatus',
    value: function updateFavStatus() {
      var _this2 = this;

      var ids = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')).map(function (b) {
        return b[0];
      }) : [];
      if (ids.some(function (i) {
        return i == _this2.state.book.id;
      })) {
        this.setState({ isFavorite: true });
      }
    }
  }, {
    key: 'updateLocalStorage',
    value: function updateLocalStorage(isFav) {
      var f = !isFav;
      var books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : JSON.parse('[]');
      console.log(books);
      var ids = books.map(function (b) {
        return b[0];
      });
      var book = this.state.book;
      console.log(book);
      var id = book.id;
      if (f && !ids.some(function (i) {
        return i == id;
      })) {
        books.push([id, book]);
        localStorage.setItem('books', JSON.stringify(books));
      } else {
        if (ids.some(function (i) {
          return i == id;
        })) {
          books.splice(ids.indexOf(id), 1);
          localStorage.setItem('books', JSON.stringify(books));
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var book = this.state.book;


      return React.createElement(
        'div',
        { id: 'app' },
        React.createElement(
          'nav',
          { id: 'navbar' },
          React.createElement(
            'ul',
            null,
            React.createElement(
              'li',
              { id: 'home-page' },
              React.createElement(
                'a',
                { href: 'index.html' },
                'Home'
              )
            ),
            React.createElement(
              'li',
              { id: 'favorites' },
              React.createElement(
                'a',
                { href: 'favorites.html' },
                'Favorites'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'content' },
          React.createElement(
            'div',
            { id: 'card', className: 'hidden' },
            React.createElement('img', { src: this.state.thumbUrl, onLoad: this.handleLoad }),
            React.createElement(
              'div',
              { className: 'card-bottom' },
              React.createElement(
                'div',
                { className: 'favorite', onClick: this.handleFav },
                React.createElement('i', { className: this.state.isFavorite ? "fa fa-star" : "fa fa-star-o" })
              )
            )
          ),
          React.createElement(
            'div',
            { id: 'details' },
            React.createElement(
              'h1',
              null,
              book ? book.volumeInfo.title : ''
            ),
            React.createElement(
              'p',
              null,
              'By ',
              book ? book.volumeInfo.authors : ''
            ),
            React.createElement(
              'p',
              null,
              book ? book.volumeInfo.description : ''
            ),
            React.createElement('hr', null),
            React.createElement(
              'p',
              null,
              'published DATE'
            ),
            React.createElement(
              'p',
              null,
              'pages'
            ),
            React.createElement(
              'a',
              null,
              'Preview link'
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

;

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));