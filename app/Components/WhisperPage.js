'use strict';
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image,
    ListView,
    StatusBar,
    Modal
} from 'react-native';
import Hr from 'react-native-hr';
import SearchResults from './searchResults';
import styles from '../Assets/style';
import loadPeople from '../src/peopleService';
import Conversation from './Conversation';
import loadUser from "../src/userService";
import getMessages from "../src/messageService";
import postMessage from "../src/textService";
import NewWhisper from './newWhisperPage';
import Icon from 'react-native-vector-icons/Ionicons';

var UserID = 1;//Global Variable for who the user is, Jacky Chen

function urlForQueryAndPage(key, value, pageNumber){
    var data = {
          country: 'uk',
          pretty: '1',
          encoding: 'json',
          listing_type: 'buy',
          action: 'search_listings',
          page: pageNumber
      };
      data[key] = value;
    var queryString = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');
    return 'http://api.nestoria.co.uk/api?' + queryString;
};

class Friend extends Component {
  constructor(props){
    super(props);
  }
  state = {
    dirTo: '',
    otherUser: {
      id: UserID,
      img: '?',
      fName: '',
      lName: '',
      dir: ''
    }
  };
  rowPressed(){
    console.log('pressedRow: ' + this.state.fName);
    this.props.navigator.push({
      title: 'Conversations',
      component: Conversation,
      passProps: {
        depth: this.props.depth ? this.props.depth + 1 : 1,
        convo: this.props.conversation,
        otherUser: this.state.otherUser
        }
    });
  }
  componentWillMount(){
    let convo = this.props.conversation;
    // Check if ogSender and user are the same
    let dirTo = (convo.ogSender === UserID) ? true : false;
    // Get user.profilePic and name and 
    let otherUser = dirTo ? convo.ogReceiver : convo.ogSender;
    loadUser(otherUser)
      .then(user => {
        let dir = dirTo ? "to" : "from";
        this.setState({
          dirTo,
          otherUser: {
            id: otherUser,
            img: user.profilePic, 
            fName: user.fName,
            lName: user.lName,
            dir: dir
          }
        });
      });
  }

  render(){
    let name = this.state.otherUser.fName + ' ' + this.state.otherUser.lName;
    if (name.length > 14) {
      name = name.split(' ')[0]
      if (name.length > 14) {
        name = name.substring(0,12) + '...'
      }
    }
    return(
        <View style={{marginTop: 5}}>
          <TouchableHighlight 
              onPress={()=>this.rowPressed()}
              underlayColor='#2f5183'>
            <View style={{
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flex: 1
            }}>
              <Image style={styles.image} source={{uri: this.state.otherUser.img}} />
              <Text style={styles.name}>
                <Text style={styles.description}>
                  {this.props.conversation.type + ' ' + this.state.otherUser.dir + ' '}
                </Text>
                {name}
              </Text>
            </View>
          </TouchableHighlight>
          <Hr lineColor='#b3b3b3' text={this.props.conversation.firstReadTime} textColor='steelblue'/>
        </View>
    );
  }
}

class FriendsList extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }
  componentDidMount() {
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    loadUser(UserID)
      .then(user => {
        if (user.knownWhisperIDs.length) return getMessages(user.knownWhisperIDs, UserID, this.props.type);
      }).then(res => {
        this.setState({dataSource: ds.cloneWithRows(res)});
      })
  }
  render(){
    return (
      <View style={styles.friendList}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(conversation) => <Friend conversation={conversation} navigator={this.props.navigator}></Friend>}
        />
      </View>
    );
  }
}

class OtherButtons extends Component {
  constructor(){
    super();
  }
  buttonPressed(){
    console.log("PRESSED BUTTON!");
    this.props.navigator.push({
      title: 'NewWhisper',
      component: NewWhisper,
      passProps: {
        depth: this.props.depth ? this.props.depth + 1 : 1,
        type: this.props.messageType
      }
    });
    this.props.hideModal();
  }
  render(){
    return(
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={{color: 'black', fontSize: 20, paddingRight: 50, fontWeight: 'bold'}}>{this.props.messageType}</Text>
          <TouchableHighlight
              style={styles.messageButton1}
              underlayColor='#dddddd'
              onPress={() => this.buttonPressed()}>
              <Text style={styles.buttonText}>{this.props.messageType[0]}</Text>
          </TouchableHighlight>
        </View>
      );
  }
}

class MessageButton extends Component {
  constructor(){
    super();
  }
  //onPress={this.onLocationPressed.bind(this)}>
  state = {
    modalVisible: false,
  }
  toggleModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
  }
  render(){
    return (
        <View>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisible}
            >
              <View style={{flex: 0.4, backgroundColor: 'rgba(256,256,256,0.6)'}}/>
              <View style={{justifyContent: 'space-around', 
                            alignItems: 'flex-end',
                            backgroundColor: 'rgba(256,256,256,0.6)',
                            flex: 0.4
                          }}>
                <OtherButtons messageType='Request' navigator={this.props.navigator} hideModal={()=>this.toggleModalVisible()}/>
                <OtherButtons messageType='Suggestion' navigator={this.props.navigator} hideModal={()=>this.toggleModalVisible()}/>
                <OtherButtons messageType='Confession' navigator={this.props.navigator} hideModal={()=>this.toggleModalVisible()}/>
              </View>
              <View style={{flex: 0.1, backgroundColor: 'rgba(256,256,256,0.6)'}}>
                <TouchableHighlight
                    style={styles.messageButton}
                    underlayColor='#dddddd'
                    onPress={() => {this.toggleModalVisible() }}>
                    <Text style={styles.buttonText}>W</Text>
                </TouchableHighlight>
              </View>
          </Modal>
          <TouchableHighlight
              style={styles.messageButton}
              underlayColor='#dddddd'
              onPress={() => {this.toggleModalVisible() }}>
              <Text style={styles.buttonText}>W</Text>
          </TouchableHighlight>
        </View>
    );
  }
}

class Bar extends Component {
  render(){
    let arrow = this.props.contentVisible ? 'v' : '>';
    return (
      <TouchableHighlight
          style={{
            flexDirection:'row',
            backgroundColor:'rgba(255,255,255,0.15)',
            justifyContent: 'flex-start',
            alignSelf: 'stretch',
            padding: 8
          }}
          onPress={()=>this.props.toggle()}
          underlayColor='rgba(255,255,255,0.25)'>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{this.props.type} Whispers   {arrow}</Text>
      </TouchableHighlight>
    );
  }
}

class TopBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
          searchString: 'Find your Friends...',
          isLoading: false,
          message: ''
      };
  }
  onSearchTextChange(e) {
      this.setState({ searchString: e.nativeEvent.text });
  }
  _handleResponse(json) {
      this.setState({ isLoading: false, message: ''});
      if(json.application_response_code.substr(0, 1) === '1') {
          this.setState({ message: 'Properties found: ' + json.listings.length});
          this.props.navigator.push({
              title: 'Results',
              component: SearchResults,
              passProps: {listings: json.listings}
          });
      } else {
          this.setState({ message: 'Location not recognized; please try again.'});
      }
  }
  _executeQuery(query) {
      fetch(query).then(res => res.json())
          .then(json => this._handleResponse(json.response))
          .catch(err => 
              this.setState({
                  isLoading: false,
                  message: 'Something bad happened ' + err
              }));

      this.setState({isLoading: true, message: ''});
  }
  onSearchPressed() {
      var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
      this._executeQuery(query);
  }
  render(){
    var spinner = this.state.isLoading ? 
        <ActivityIndicator size='large'/> : <View/>;
    return (
      <View style={styles.searchBg}>
          <Image source={require('../Assets/bar-icon.png')} style={styles.menuButton}/>
          <TextInput
              style={styles.searchInput}
              value={this.state.searchString}
              placeholder='Search Friends'
              onChange={this.onSearchTextChange.bind(this)}/>
      </View>
    );
  }
}

class WhisperPage extends Component {
    state = {
      receivedBar: true,
      sentBar: true
    }
    _onToggleReceiveBar = () => this.setState({receivedBar: !this.state.receivedBar})
    _onToggleSentBar = () => this.setState({sentBar: !this.state.sentBar})    
    _renderReceivedList = () => {
      if(this.state.receivedBar){
        return (<FriendsList navigator={this.props.navigator} type={"Received"}/>);
      }else{
        return null;
      }
    }
    _renderSentList = () => {
      if(this.state.sentBar){
        return (<FriendsList navigator={this.props.navigator} type={"Sent"}/>);
      }else{
        return null;
      }
    }
    render() {
        let emptyBox = (this.state.receivedBar | this.state.sentBar) ? null : <View style={{flex:1}}></View>;
        return(
            <View style={styles.container}>
              <StatusBar hidden/>
              <TopBar />
              <Bar contentVisible={this.state.receivedBar} toggle={this._onToggleReceiveBar} type={"Received"}/>
              {this._renderReceivedList()}
              <Bar contentVisible={this.state.sentBar} toggle={this._onToggleSentBar} type={"Sent"}/>
              {this._renderSentList()}
              {emptyBox}
              <MessageButton navigator={this.props.navigator}/>
            </View>
        );
    }
}

module.exports = WhisperPage;