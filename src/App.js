import React, { Component } from 'react';
import * as moment from 'moment';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const endTime = moment();
    this.state = {
      intervalId: undefined,
      requestName: undefined,
      duration: 5,
      config: 0,
      endTime,
      quality: false,
      security: false,
      postTarget: 'http://localhost:3000/dc1'
    }
  }

  componentDidMount() {
    const intervalID = setInterval(() => {
        const endTime = moment().add(this.state.duration, 's');
        this.setState({ endTime });
    }, 500);
    this.setState({
        intervalID
    })
  }

  componentWillUnmount() {
    if (!!this.state.intervalID) {
      clearInterval(this.state.intervalID);
    }
  }

    toggleQuality = () => {
    this.setState({ quality: !this.state.quality });
  }

  toggleSecurity = () => {
    this.setState({ security: !this.state.security });
  }

  handleRequestNameChange = (e) => {
    this.setState({ requestName: e.target.value });
  }

  handleSliderChange = (e) => {
    this.setState({ duration: e.target.value });
  }

  postData = () => {
    const { requestName, quality, security, endTime } = this.state;
    fetch(this.state.postTarget, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestName,
        quality,
        security,
        endTime: endTime.unix()
      })
    })
  }

  render() {
    // Can only submit if one of the security
    const { requestName, quality, security, postTarget } = this.state;
    // Can only submit if user had filled in request name, and selected an option.
    const canSubmit = requestName && (quality || security);
    return (
      <div className="App">
        <h1>Resource Request Dashboard</h1>
        <div id='form'>
          <div id='request-name'>
            Request Name: <input
            placeholder={' Enter your request name here...'}
            onChange={this.handleRequestNameChange}
          />
          </div>
          <div id='time-slider'>
            Duration (seconds):
            <div id='duration-label'>
              <div>
              {parseFloat(Math.round(this.state.duration * 100)/100).toFixed(2)}
              </div>
              <div>
              {'Resource reserved until: ' + this.state.endTime.format('MMMM Do YYYY, h:mm:ss a')}
              </div>
            </div>
            <input
              id='slider'
              type='range'
              min='5' max='60'
              value={this.state.duration}
              onChange={this.handleSliderChange}
              step='.5'/>
          </div>
          <div id='spec-selection'>
            <button id='btn-quality' className={quality ? 'selected' : ''} onClick={this.toggleQuality}>
              Quality { quality ? '✓' : ''}
            </button>
            <button id='btn-security' className={security ? 'selected' : ''} onClick={this.toggleSecurity}>
              Security { security ? '✓' : ''}
            </button>
          </div>
          <div id='submit-button'>
            <button className={!canSubmit ? 'btn-disabled' : 'btn-enabled'}
                    disabled={!canSubmit}
                    onClick={this.postData}
            >
              {canSubmit ? 'Submit Request' : 'Please fill in all the required fields...'}
            </button>
          </div>
          <div id='post-target'>
            <input
              value={postTarget}
              placeholder={'Target destination here... (i.e https://localhost:3000/dc1)'}
              onChange={this.handleRequestNameChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
