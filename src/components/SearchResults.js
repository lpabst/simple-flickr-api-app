import React, { Component } from 'react';

class SearchResults extends Component {
    render() {
        return (
            <section className='searchResults'>
                {this.props.photos.map((item, i) => {
                    return <div key={i} className='searchResult' onClick={() => this.props.openFullSizeOverlay(item)} title={item.title} >
                        <img className='thumbnail' src={item.thumbnail} alt={item.shortTitle} />
                        <p className='title'>{item.shortTitle}</p>
                    </div>
                })
                }
            </section>
        );
    }
}

export default SearchResults;