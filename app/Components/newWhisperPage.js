import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import styles from '../Assets/style';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class NewWhisper extends Component {
    state = {
      text: 'Type here...'
    }
    render(){
        return(
        <View style={styles.container}>
            <Text style={styles.name}>{this.props.type + ' to: '}</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(text) => this.setState({text})}
                clearTextOnFocus={true}
                value={this.state.text}
            />
            <KeyboardSpacer/>
        </View>
        );
    }
}