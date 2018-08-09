import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
import config from './../../config.js';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      userInput: '',
      photos: [],
      showFullSizeOverlay: false,
      selectedImage: {},
    }
  }

  searchPhotos(e){
    e.preventDefault();
    
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${config.apiKey}&tags=${this.state.userInput}&per_page=25&format=json&nojsoncallback=1`)
    .then( res => {
      let photos = res.data.photos.photo;

      photos.forEach(photo => {
        photo.thumbnail = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`;
        photo.original = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`;
        photo.shortTitle = photo.title.length < 28 ? photo.title : photo.title.substring(0, 25) + '...';
      })

      this.setState({photos});
    })
  }

  openFullSizeOverlay(item){
    this.setState({
      showFullSizeOverlay: true,
      selectedImage: item
    })
  }

  closeFullSizeOverlay(){
    this.setState({
      showFullSizeOverlay: false,
      selectedImage: {}
    })
  }

  render() {
    return (
      <div className="home">

        <p className='header'>Search Flickr For Photos</p>
        <form className='searchForm' onSubmit={(e) => this.searchPhotos(e)} >
          <input onChange={(e) => this.setState({userInput: e.target.value})} placeholder='enter search term' />
          <div onClick={(e) => this.searchPhotos(e)} >Search</div>
        </form>

        <section className='searchResults'>
          { this.state.photos.map( (item, i) => {
              return <div key={i} className='searchResult' onClick={() => this.openFullSizeOverlay(item)} title={item.title} >
                <img className='thumbnail' src={item.thumbnail} alt={item.shortTitle} />
                <p className='title'>{item.shortTitle}</p>
              </div>
            })
          }
        </section>

        { this.state.showFullSizeOverlay &&
          <div className='fullSizeOverlay' >
            <p onClick={() => this.closeFullSizeOverlay()} className='closeX' >X</p>
            <center><img src={this.state.selectedImage.original} alt={this.state.selectedImage.title} className='fullSizeImage' id='fullSizeImage' /></center>
          </div>
        }

      </div>
    );
  }
}

export default Home;