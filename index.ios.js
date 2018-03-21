'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
} from 'react-native';
import WhisperPage from './app/Components/WhisperPage'
import styles from './app/Assets/style';

export default class whisper extends Component {
  render() {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        style={styles.container}
        initialRoute={{
          title: 'Whispers',
          component: WhisperPage,
        }}/>
    );
  }
}

AppRegistry.registerComponent('whisper', () => whisper);
