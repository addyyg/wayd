import React, { Component } from 'react'
import * as firebase from 'firebase'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      signedIn: false,
      activity: '',
      capacity: '',
      time: '',
      location: '',
      price: '', 
      events: {}
    }

    this.renderEvents = this.renderEvents.bind(this)
    this.createEvent = this.createEvent.bind(this)
    this.signInWithFacebook = this.signInWithFacebook.bind(this)
    this.handleActivity = this.handleActivity.bind(this)
    this.handleCapacity = this.handleCapacity.bind(this)
    this.handleTime = this.handleTime.bind(this)
    this.handleLocation = this.handleLocation.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.listenToEventChanges = this.listenToEventChanges.bind(this)
  }

  componentDidMount() { 
    this.listenToEventChanges()
  }

  handleActivity(event) {
    this.setState({ activity: event.target.value })
  }

  handleCapacity(event) {
    this.setState({ capacity: event.target.value })
  }

  handleTime(event) {
    this.setState({ time: event.target.value })
  }

  handleLocation(event) {
    this.setState({ location: event.target.value })
  }

  handlePrice(event) {
    this.setState({ price: event.target.value })
  }

  handleJoinEvent(key) {
    var copy = this.state.events
    copy[key]['people'] = copy[key]['people'] || {}
    copy[key]['people'][this.state.user.uid] = 0
    this.setState({
      events: copy
    })
    firebase.database().ref('events').child(key).child('people')
    .child(this.state.user.uid).set({random: 0})
  }

  listenToEventChanges() {
    let thisState = this
    firebase.database().ref('events').on('child_changed', function(snapshot) {
      thisState.renderEvents()
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      activity: '',
      capacity: '',
      time: '',
      location: '',
      price: '', 
    })
    this.createEvent(this.state.activity, this.state.capacity, this.state.time, this.state.location, 
      this.state.price)
      var textBody = 'Your friend, Mehul Gore just started ' + this.state.activity + '. Go to tinyurl.com/waydyc to check it out!'
      fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({to: '+16202680564', body: textBody})
      })
  }

  createEvent(activity, capacity, time, location, price) {
    var ref = firebase.database().ref('events').push({
      activity: activity, 
      capacity: capacity,
      time: time,
      location: location,
      price: price, 
    })
    firebase.database().ref('events').child(ref.getKey()).child('people')
    .child(this.state.user.uid).set({random: 0}).then(this.renderEvents)
  }

  renderEvents() {
    let thisState = this
    firebase.database().ref('events')
      .once('value').then(function (snapshot) {
        const temp = {}
        snapshot.forEach(snap => {
          temp[snap.key] = {activity: snap.val().activity, capacity: snap.val().capacity, time: snap.val().time, 
            location: snap.val().location, price: snap.val().price, people: snap.val().people}
        })
        thisState.setState({
          events: temp
        })
      })
  }

  signInWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    var thisState = this
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // var token = result.credential.accessToken;
      var user = result.user;
      thisState.setState({
        signedIn: true,
        user: user,
      })
    }).catch(function (error) {
      console.log(error)
    }).then(this.renderEvents());
  }

  render() {
    return (<div align="center">
      {!this.state.signedIn ?
        (
          <div> 
            <h1> Welcome to Wayd </h1>
            <h4> The On-Demand Platform for Social Activities </h4>
          <button class="btn btn-primary" onClick={this.signInWithFacebook}> Facebook Login </button>
          </div> 
        )
        :
        (<div align='center'>
          <h3> Wassup,  {this.state.user.displayName}!</h3>
          <h2> Things happening around you: </h2>

          {Object.keys(this.state.events).map((key, i) => (
            <div> 
          <div class="card w-75 p-3">
            <div class="card-header w-auto p-3"> 
            <strong> {this.state.events[key]['activity']} @ {this.state.events[key]['time']} </strong>
            </div> 
            <div class="card-body w-auto p-3">
              <p class="card-text">{this.state.events[key]['location']} </p>
              <p class="card-text"> </p>
              <p class="card-text">
              {
                this.state.events[key]['people'] != undefined ? Object.keys(this.state.events[key]['people']).length : 0}
               / {this.state.events[key]['capacity']} people &nbsp;&nbsp;&nbsp;${this.state.events[key]['price']} </p> 
              <button class="btn btn-primary" onClick={this.handleJoinEvent.bind(this, key)} >I'm down</button>
            </div>
          </div>
          <br/> 
          </div> 
          
          ))}

          <h2> Don't see something you like? Create your own! </h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              What's the activity? <br/> <input type="text" name="activity" value={this.state.activity}
                onChange={this.handleActivity} required/>
            </label> <br />
            <label>
              How many people: <br/><input type="number" name="capacity" value={this.state.capacity}
                onChange={this.handleCapacity} required/>
            </label> <br />
            <label>
              When <br/><input type="text" name="time" value={this.state.time}
                onChange={this.handleTime} required/>
            </label>             
            <br />
            <label>
              Where <br/><input type="text" name="location" value={this.state.location}
                onChange={this.handleLocation} required/>
            </label> <br />
            <label>
              How much does it cost? <br/><input type="text" name="price" value={this.state.price}
                onChange={this.handlePrice} required />
            </label> <br />
            <input class="btn btn-primary" type="submit" value="Let's Go!"required />
          </form>

        </div>

        )

      }

    </div>)
  }
}

export default App;