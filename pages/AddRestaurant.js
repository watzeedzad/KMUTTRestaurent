//import liraries
import React, { Component } from "react";
import { View, Button, StyleSheet, ScrollView, Dimensions } from "react-native";
import t from "tcomb-form-native";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { ImagePicker, Location, Permissions } from "expo";
import { Avatar } from "react-native-elements";
import RestaurantMap from "../components/Restaurant/RestaurantMap";
import BackHeader from "../components/Utils/BackHeader";
import { Actions } from "react-native-router-flux";

const Form = t.form.Form;
const { width, height } = Dimensions.get("screen");

const Tel = t.refinement(t.String, tel => {
  const reg = /[0-9]{10}?/;
  return reg.test(tel);
});

const Type = t.enums({
  100001: "อาหารคาว",
  100002: "อาหารหวาน",
  100003: "ชาบู",
  100004: "ปิ้งย่าง"
});

const RestaurantForm = t.struct({
  restaurantName: t.String,
  restaurantOpenTime: t.String,
  restaurantCloseTime: t.String,
  restaurantOpenDate: t.String,
  restaurantDesc: t.String,
  restaurantLat: t.Number,
  restaurantLong: t.Number,
  restaurantTypeId: Type,
  restaurantTel: Tel,
  restaurantAddress: t.String
});

const formStyles = {
  ...Form.stylesheet, // copy over all of the default styles
  formGroup: {
    normal: {
      marginBottom: 10,
      width: (width * 70) / 100
    },
    error: {
      marginBottom: 10,
      width: (width * 70) / 100
    }
  },
  textbox: {
    normal: {
      fontSize: 18,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderWidth: 1,
      marginBottom: 5
    },
    error: {
      fontSize: 18,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderWidth: 1,
      marginBottom: 5,
      borderColor: "red"
    }
  },
  controlLabel: {
    normal: {
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    },
    error: {
      color: "red",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    }
  }
};

const multilineStyle = {
  ...Form.stylesheet,
  textbox: {
    ...Form.stylesheet.textbox,
    normal: {
      ...Form.stylesheet.textbox.normal,
      height: 100,
      width: (width * 70) / 100
    },
    error: {
      ...Form.stylesheet.textbox.error,
      height: 100,
      width: (width * 70) / 100
    }
  }
};

const options = {
  fields: {
    restaurantName: {
      label: "Name",
      error: "Name can not empty."
    },
    restaurantOpenTime: {
      label: "Open time",
      error: "Open time can not empty."
    },
    restaurantCloseTime: {
      label: "Close time",
      error: "Close time can not empty."
    },
    restaurantOpenDate: {
      label: "Open Date",
      error: "Open date can not empty."
    },
    restaurantDesc: {
      label: "Description",
      error: "Description can not empty.",
      multiline: true,
      stylesheet: multilineStyle
    },
    restaurantTypeId: {
      label: "Type",
      nullOption: false
    },
    restaurantAddress: {
      label: "Address",
      multiline: true,
      stylesheet: multilineStyle
      // editable: false
    },
    restaurantTel: {
      label: "Tel",
      error: "Tel is invalid. (ex. 012-3456789)"
    },
    restaurantLat: {
      hidden: true
    },
    restaurantLong: {
      hidden: true
    }
  },
  stylesheet: formStyles
};

// create a component
class AddRestaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        restaurantId: null,
        restaurantName: "",
        restaurantOpenTime: "",
        restaurantCloseTime: "",
        restaurantOpenDate: "",
        restaurantDesc: "",
        restaurantLat: null,
        restaurantLong: null,
        restaurantTypeId: 100001,
        restaurantAddress: "",
        restaurantTel: "",
        restaurantPicturePath: null
      }
    };
  }

  componentDidMount = () => {
    if (this.props.restaurant) {
      this.setState({ value: this.props.restaurant });
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({
        value: { ...this.state.value, restaurantPicturePath: result.uri }
      });
    }
  };

  _setAddress = async (lat, lon) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let address = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon
    });

    this.setState({
      value: {
        ...this.state.value,
        restaurantLat: lat,
        restaurantLong: lon,
        restaurantAddress:
          address[0].name + " " + address[0].street + " " + address[0].region
      }
    });
  };

  _addRestaurant = () => {
    const item = this.state.value;
    if (item == null) {
      alert("Please enter your information.");
    } else {
      this.props.addRestaurant(item.restaurantPicturePath, item);
    }
  };

  _editRestaurant = () => {
    const item = this.state.value;
    console.log("item edit:", item);
    if (item == null) {
      alert("Please enter your information.");
    } else {
      this.props.editRestaurant(item.restaurantPicturePath, item);
    }
  };

  renderHeader = () => {
    if (this.state.value.restaurantId != null) {
      return (
        <BackHeader
          titleText={"Edit Restaurant"}
          onPress={() => Actions.pop()}
        />
      );
    } else {
      return (
        <BackHeader
          titleText={"Add Restaurant"}
          onPress={() => Actions.pop()}
        />
      );
    }
  };

  renderButton = () => {
    if (this.state.value.restaurantId != null) {
      return (
        <Button
          color={"#FF8C00"}
          title="Edit Restaurant"
          onPress={() => this._editRestaurant()}
        />
      );
    } else {
      return (
        <Button
          color={"#FF8C00"}
          title="Add Restaurant"
          onPress={() => this._addRestaurant()}
        />
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <ScrollView>
          <View style={styles.container}>
            {this.props.addRestaurant.isRejected && (
              <Text style={{ color: "white", backgroundColor: "red" }}>
                {this.props.addRestaurant.data}
              </Text>
            )}
            {this.props.editRestaurant.isRejected && (
              <Text style={{ color: "white", backgroundColor: "red" }}>
                {this.props.editRestaurant.data}
              </Text>
            )}
            <Avatar
              source={{ uri: this.state.value.restaurantPicturePath }}
              size="xlarge"
              title="PIC"
              onPress={() => this._pickImage()}
              activeOpacity={0.7}
              showEditButton={true}
            />
            <Form
              ref="form"
              type={RestaurantForm}
              options={options}
              onChange={value => this.setState({ value })}
              value={this.state.value}
            />
            <RestaurantMap setAddress={this._setAddress} />
          </View>
          <View style={{ backgroundColor: "white" }}>
            <View style={styles.button}>{this.renderButton()}</View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  button: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingBottom: 20,
    width: (width * 70) / 100,
    marginLeft: (width * 15) / 100,
    marginRight: (width * 15) / 100
  }
});

function mapStateToProps(state) {
  return {
    addRestaurant: state.restaurantReducers.addRestaurant,
    editRestaurant: state.restaurantReducers.editRestaurant
  };
}

export default connect(
  mapStateToProps,
  actions
)(AddRestaurant);
