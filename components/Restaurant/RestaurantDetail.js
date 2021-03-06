//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { Actions } from "react-native-router-flux";

// create a component
class RestaurantDetail extends Component {
  render() {
    let {
      restaurantName,
      restaurantRating,
      restaurantTypeDesc,
      restaurantDesc,
      restaurantPicturePath,
      restaurantId
    } = this.props.restaurant;
    
    return (
      <View style={{ width: Dimensions.get('window').width}}>
        <TouchableOpacity onPress={() => {
          Actions.RestaurantDetail({
            restaurantId: restaurantId
          });
        }}>
          <View style={styles.container}>
            <View style={styles.restaurantInfoContainer}>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={{ uri: restaurantPicturePath }}
                  style={styles.restaurantPic}
                />
              </View>
              <View style={styles.restaurantTextInfoContainer}>
                <Rating
                  imageSize={20}
                  startingValue={restaurantRating}
                  readonly={true}
                  style={{ paddingBottom: 5 }}
                  fractions={1}
                />
                <Text>Name : {restaurantName}</Text>
                {/* <Text>Rating : {restaurantRating}</Text> */}
                <Text>Type : {restaurantTypeDesc}</Text>
                <Text>Description : {restaurantDesc}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    height: 180
  },
  restaurantInfoContainer: {
    flex: 1,
    flexDirection: "row"
  },
  restaurantTextInfoContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 20,
    justifyContent: "center"
  },
  restaurantPic: {
    width: 150,
    height: 150,
    resizeMode: "contain"
  },
  restaurantInfoRow: {
    flexDirection: "row"
  }
});

//make this component available to the app
export default RestaurantDetail;
