import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
import config from './../../config.js';

import SearchResults from './../../components/SearchResults';
import FullSizeOverlay from './../../components/FullSizeOverlay';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      userInput: '',
      photos: [],
      showFullSizeOverlay: false,
      selectedImage: {},
      errorMessage: '',
      resultsPage: 1,
      numPages: 1,
      backButtonActive: false,
      nextButtonActive: false,
    }

    this.searchPhotos = this.searchPhotos.bind(this);
    this.openFullSizeOverlay = this.openFullSizeOverlay.bind(this);
    this.closeFullSizeOverlay = this.closeFullSizeOverlay.bind(this);
    this.getNewPage = this.getNewPage.bind(this);
  }

  // if this is called with the newPageNum var it searches for that page of results, otherwise it gets page 1
  searchPhotos(e, newPageNum){
    if (e) e.preventDefault();

    let pageNum = newPageNum || 1;
    
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${config.apiKey}&text=${this.state.userInput}&per_page=25&format=json&nojsoncallback=1&page=${pageNum}`)
    .then( res => {
      if (!res.data || !res.data.photos || !res.data.photos.photo || res.data.photos.photo.length === 0){
        return this.setState({
          errorMessage: `No search results were returned from Flickr for "${this.state.userInput}"`,
          photos: [],
        })
      }

      let errorMessage = '';
      let photos = res.data.photos.photo;
      let resultsPage = res.data.photos.page;
      let numPages = res.data.photos.pages;
      let backButtonActive = resultsPage >= 2 ? true : false;
      let nextButtonActive = resultsPage < numPages ? true : false;

      photos.forEach(photo => {
        photo.thumbnail = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
        photo.large = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`;
        photo.shortTitle = photo.title.length < 28 ? photo.title : photo.title.substring(0, 25) + '...';
      })

      this.setState({photos, errorMessage, resultsPage, numPages, backButtonActive, nextButtonActive});
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

  // if the new page requested is within appropriate bounds, gets the new page of results
  getNewPage(pageIncrementer){
    let newPageNum = this.state.resultsPage + pageIncrementer;
    if (newPageNum >= 1 && newPageNum <= this.state.numPages){
      this.searchPhotos(null, newPageNum);
    }
  }

  render() {
    let backButtonVisibility = this.state.backButtonActive ? 'visible' : 'hidden';
    let nextButtonVisibility = this.state.nextButtonActive ? 'visible' : 'hidden';

    return (
      <div className="home">

        <p className='header'>Search Flickr For Photos</p>
        <form className='searchForm' onSubmit={(e) => this.searchPhotos(e)} >
          <input onChange={(e) => this.setState({userInput: e.target.value})} placeholder='enter search term' />
          <div className='searchFormControls'>
            <div onClick={() => this.getNewPage(-1)} style={{visibility: backButtonVisibility}} >Back</div>
            <div onClick={(e) => this.searchPhotos(e)} >Search</div>
            <div onClick={() => this.getNewPage(1)} style={{visibility: nextButtonVisibility}} >Next</div>
          </div>
        </form>

        <SearchResults photos={this.state.photos} openFullSizeOverlay={this.openFullSizeOverlay} />

        { this.state.showFullSizeOverlay &&
          <FullSizeOverlay selectedImage={this.state.selectedImage} closeFullSizeOverlay={this.closeFullSizeOverlay} />
        }

        { this.state.errorMessage && 
          <p className='errorMessage' >{this.state.errorMessage}</p>
        }

      </div>
    );
  }
}

export default Home;