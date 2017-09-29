import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';

import Principal from './screens/Principal';

class App extends Component {
  render() {
    return (
      <View>
        <Principal />
      </View>
    );
  }
}

AppRegistry.registerComponent('TrabalhoPosAndroid', () => App);
