import React, { Component } from 'react';

class FullScreenOverlay extends Component {
    render() {
        let image = this.props.selectedImage;
        console.log(image);
        return (
            <div className='fullSizeOverlay' >
                <p onClick={() => this.props.closeFullSizeOverlay()} className='closeX' >X</p>
                <center>
                    <img src={image.large} alt={image.title} className='fullSizeImage' id='fullSizeImage' />
                </center>
            </div>
        );
    }
}

export default FullScreenOverlay;