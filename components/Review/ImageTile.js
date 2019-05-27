import React, { Component } from "react";
import {
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
const { width } = Dimensions.get('window')

class ImageTile extends Component {
  render() {
    let { item, index, selected, selectImage } = this.props;
    if (!item) return null;
    return (
      <TouchableHighlight
        style={{opacity: selected ? 0.5 : 1}}
        underlayColor='transparent'
        onPress={() => selectImage(index)}
      >
        <Image
          style={{width: width/4, height: width/4}}
          source={{uri: item}}
        />
      </TouchableHighlight>
    )
  }
}

export default ImageTile;
