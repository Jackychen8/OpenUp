'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableHighlight,
    ListView,
} from 'react-native';
import styles from '../Assets/style';
import postMessage from '../src/textService';
import moment from 'moment';
import KeyboardSpacer from 'react-native-keyboard-spacer';

//EmojiOne
let emotions ={
  "Happy":"https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f600.png?raw=true",
  "Sad": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f613.png?raw=true",
  "Anxious": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f605.png?raw=true",
  "Confident": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f60e.png?raw=true",
  "Nervous": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f625.png?raw=true",
  "Skeptical": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f914.png?raw=true",
  "Tease": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f61c.png?raw=true",
  "Angry": "https://github.com/Ranks/emojione/blob/master/assets/png_512x512/1f624.png?raw=true"
};

class MyTextInput extends Component {
  state = {
    text: 'Type here...'
  }
  render() {
    let convoDetails = this.props.conversation;
    return (
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => this.setState({text})}
        clearTextOnFocus={true}
        value={this.state.text}
        onSubmitEditing={() => {
          if (this.state.text !== "..."){
            convoDetails.messages.push({
              time: moment().format('h:mm a'),
              date: moment().format("MMM Do YY"),
              content: this.state.text,
              fromOgSender: true,
              emotion: "Sad",
              initialReact: "Happy"
            });
            postMessage(convoDetails);
            this.props.onAddMessage(convoDetails.messages);
            this.setState({text: ''});
          }
        }}

      />
    );
  }
}

class Message extends Component {
  constructor(props){
    super(props);
  }
  state = {
    'pressed': false,
    'apologized': false,
  };
  apologize(){
    this.setState({
      'apologized': !this.state.apologized,
      'pressed': false
  });
  }
  rowPressed(){
    console.log('pressedRow: ' + this.props.message);
    this.setState({'pressed': !this.state.pressed});
  }
  _renderApology(){
    if(this.state.pressed && !this.state.apologized){
      return (
        <View style={{flexDirection: 'row', alignItems: 'center',
         height:30, width: 30, backgroundColor: '#2ecc71', borderWidth: 2,
         borderRadius: 15, borderColor: 'white', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontSize: 16}} onPress={()=>this.apologize()}>
            A
          </Text>
        </View>);
    }if(this.state.pressed && this.state.apologized){
      return (<Text style={{color: "#e74c3c", alignSelf: 'center'}} onPress={()=>this.apologize()}>Unapologize</Text>);
    }
    return null;
  }
  _renderApologized(){
    if(this.state.apologized){
      return(<View style={{backgroundColor: '#2ecc71', height: 8, width: 8, borderRadius: 4}}/>);
    }
    return null;
  }
  render(){
    return(
      <View>
          <TouchableHighlight 
              onPress={()=>this.rowPressed()}
              underlayColor='#2f5183'>

            <View style={{
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flex: 1,
              padding: 10,
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderColor: 'white',
              borderWidth: 2,
              borderRadius: 20,
              margin: 10
            }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{height: 25, width: 25}} source={{uri: emotions.Happy}}/>
                <Text style={{color: "white", justifyContent: 'center'}}>
                  {"  " + this.props.message.time}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: "white", fontSize: 18}}>
                  {this.props.message.content + ' '}
                </Text>
                {this._renderApologized()}
              </View>
            </View>
          </TouchableHighlight>
          <View style={{alignItems: 'center'}}>
          {this._renderApology()}
          </View>
      </View>
    );
  }
}

class MessageFeed extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }
  componentWillReceiveProps(nextProps) {
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    console.log("JDEBUG nextProps: " + JSON.stringify(nextProps.messageParts));

    this.state = {
      dataSource: ds.cloneWithRows(nextProps.messageParts)
    }
  }
  componentDidMount() {
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    console.log("JDEBUG props.messageParts: " + JSON.stringify(this.props.messageParts));
    this.setState({dataSource: ds.cloneWithRows(this.props.messageParts)});
  }
  componentWillUpdate() {

  }
  render(){
    return (
      <View style={styles.friendList}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(message) => <Message message={message}></Message>}
        />
      </View>
    );
  }
}

export default class Conversation extends Component {
    constructor(props){
      super(props);
      this.state = {
        messages: this.props.convo.messages
      }
    }

    _handleAddMessage = (messages) => {
      console.log("Got here: " + messages);
      this.setState({messages});
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.barBg}>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableHighlight onPress={()=>this.props.navigator.pop()} activeOpacity={0.6} 
                            underlayColor='black' style={{position: 'absolute', left: 10}}>
                            <Text style={styles.description}>Back</Text>
                        </TouchableHighlight>
                        <Text style={{color: 'white', fontSize: 20}}>{this.props.otherUser.fName}</Text>
                    </View>
                </View>

                <View style={{
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flex: 0.1,
                }}>
                  <Text style={styles.name}>
                    <Text style={styles.description}>
                      {this.props.convo.type + ' ' + this.props.otherUser.dir + ' '}
                    </Text>
                    {this.props.otherUser.fName}
                  </Text>
                </View>
                <MessageFeed messageParts={this.state.messages}/>
                <MyTextInput conversation={this.props.convo} onAddMessage={this._handleAddMessage}/>
                <KeyboardSpacer/>
            </View>
        );
    }
}
