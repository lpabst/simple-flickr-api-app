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
    }
  }

  searchPhotos(){
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${config.apiKey}&tags=${this.state.userInput}&per_page=25&format=json&nojsoncallback=1`)
    .then( res => {
      let photos = res.data.photos.photo;
      console.log(photos)
      console.log(res)
      this.setState({photos});
    })
  }

  openFullSizeOverlay(item){
    console.log(item);
    this.setState({
      showFullSizeOverlay: true
    })
  }

  closeFullSizeOverlay(){
    this.setState({
      showFullSizeOverlay: false
    })
  }

  render() {
    return (
      <div className="home">

        <p>Search Flickr For Photos</p>
        <input onChange={(e) => this.setState({userInput: e.target.value})} placeholder='enter search term' />
        <button onClick={() => this.searchPhotos()} >Search</button>

        <section className='searchResults'>
          <p>Search Results</p>
          { this.state.photos.map( (item, i) => {
              return <div key={i} className='searchResult' onClick={() => this.openFullSizeOverlay(item)} >
                <img className='thumbnail' src="" alt="" />
                <p className='title'>{item.title}</p>
              </div>
            })
          }
        </section>

        { this.state.showFullSizeOverlay &&
          <div className='fullSizeOverlay'>
            <p onClick={() => this.closeFullSizeOverlay()} className='closeX' >X</p>
          </div>
        }

      </div>
    );
  }
}

export default Home;