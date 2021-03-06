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
      num: 0,
      input: '',
      url: ''
    };
    _this.handleEnter = _this.handleEnter.bind(_this);
    _this.handleInput = _this.handleInput.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'handleEnter',
    value: function handleEnter(event) {
      event.preventDefault();
      this.setState(function (prevState) {
        return {
          num: prevState.num + 1
        };
      });

      event.target.previousSibling.blur();
      event.target.previousSibling.value = '';
      event.target.previousSibling.focus();
    }
  }, {
    key: 'handleInput',
    value: function handleInput(event) {
      if (event.target.value.length > 0) {
        this.setState({
          url: "https://www.googleapis.com/books/v1/volumes?q=" + event.target.value.trim().replace(/\s+/g, '+')
        });
      } else {
        this.setState({ url: '' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      console.log(this.state.url);
      return (//APP RENDER IS HERE!
        React.createElement(
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
            ),
            React.createElement(
              'form',
              { id: 'search-bar' },
              React.createElement('input', { id: 'text-input', onBlur: this.handleInput }),
              React.createElement(
                'button',
                { id: 'enter', onClick: this.handleEnter },
                'Enter'
              )
            )
          ),
          React.createElement(BookStack, { key: this.state.num, number: this.state.num, url: this.state.url })
        )
      );
    }
  }]);

  return App;
}(React.Component);

var BookStack = function (_React$Component2) {
  _inherits(BookStack, _React$Component2);

  function BookStack(props) {
    _classCallCheck(this, BookStack);

    var _this2 = _possibleConstructorReturn(this, (BookStack.__proto__ || Object.getPrototypeOf(BookStack)).call(this, props));

    _this2.state = {
      books: [],
      thumbUrls: [],
      isLoaded: false,
      url: ''
    };
    return _this2;
  }

  _createClass(BookStack, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      var urlLink = this.props.url;
      if (urlLink == '') {
        this.setState({ isLoaded: true });return;
      }; //CASE WHEN URL = ''
      fetch(urlLink) //FETCH THE LINK
      .then(function (result) {
        return result.json();
      }).then(function (res) {
        if (res.totalItems === 0) {
          _this3.setState({ isLoaded: true });return;
        }; //ONE LINE AVOID BAD URL 
        var thumbUrls = res.items.map(function (obj) {
          var thisWillReturn = void 0;
          obj.volumeInfo.imageLinks === undefined ? thisWillReturn = 'src/imgs/blank-thumbnail1.jpg' : thisWillReturn = obj.volumeInfo.imageLinks.thumbnail.replace(/http:\/\//gi, 'https://');
          return thisWillReturn;
        });
        _this3.setState({
          isLoaded: true,
          books: res.items,
          thumbUrls: thumbUrls
        });
      }).catch(function (err) {
        console.log(err);
        _this3.setState({ isLoaded: true });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          books = _state.books,
          thumbUrls = _state.thumbUrls,
          isLoaded = _state.isLoaded;

      return isLoaded ? this.state.books.length == 0 ? React.createElement(
        'div',
        { id: 'div-placeholder' },
        'enter your keywords in the field an press/click enter'
      ) : React.createElement(
        'div',
        { id: 'book-stack' },
        React.createElement(
          'div',
          { id: 'bookcase' },
          thumbUrls.map(function (u, i) {
            return React.createElement(BookCard, {
              key: i,
              index: i + 1,
              book: books[i],
              thumbUrl: thumbUrls[i]
            });
          })
        )
      ) : React.createElement('div', { id: 'loader' });
    }
  }]);

  return BookStack;
}(React.Component);

var BookCard = function (_React$Component3) {
  _inherits(BookCard, _React$Component3);

  function BookCard(props) {
    _classCallCheck(this, BookCard);

    var _this4 = _possibleConstructorReturn(this, (BookCard.__proto__ || Object.getPrototypeOf(BookCard)).call(this, props));

    _this4.state = {
      book: [],
      thumbUrl: [],
      isFavorite: false
    };

    _this4.handleDet = _this4.handleDet.bind(_this4);
    _this4.handleFav = _this4.handleFav.bind(_this4);
    _this4.handleLoad = _this4.handleLoad.bind(_this4);

    return _this4;
  }

  _createClass(BookCard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState(this.props);
      this.updateFavStatus();
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
    key: 'handleDet',
    value: function handleDet() {
      console.log(this.state.index + " details");
      console.log(this.state.book);
      localStorage.setItem('book', JSON.stringify([this.state.book.id, this.state.book]));
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
      var _this5 = this;

      var ids = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')).map(function (b) {
        return b[0];
      }) : [];
      if (ids.some(function (i) {
        return i == _this5.props.book.id;
      })) {
        this.setState({ isFavorite: true });
      }
    }
  }, {
    key: 'updateLocalStorage',
    value: function updateLocalStorage(isFav) {
      var f = !isFav;
      var books = localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : JSON.parse('[]');
      var ids = books.map(function (b) {
        return b[0];
      });
      var book = this.state.book;
      var id = book.id;
      var index = this.state.index; //
      var indexes = books.map(function (b) {
        return b[0];
      }); //
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
      return React.createElement(
        'div',
        { className: 'hidden' },
        React.createElement('img', { src: this.props.thumbUrl, onLoad: this.handleLoad }),
        React.createElement(
          'div',
          { className: 'card-bottom' },
          React.createElement(
            'div',
            { className: 'favorite', onClick: this.handleFav },
            React.createElement('i', { className: this.state.isFavorite ? "fa fa-star" : "fa fa-star-o" })
          ),
          React.createElement(
            'a',
            { href: 'details.html' },
            React.createElement(
              'div',
              { className: 'details', onClick: this.handleDet },
              React.createElement('i', { className: 'fa fa-chevron-circle-right' }),
              ' Details'
            )
          )
        )
      );
    }
  }]);

  return BookCard;
}(React.Component);

;

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));