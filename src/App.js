import React, { Component } from 'react';
import * as moment from 'moment';
import openSocket from 'socket.io-client';
import './App.css';

let socket;
socket = openSocket('http://pcvm2-15.lan.sdn.uky.edu:3000');
// socket = openSocket('http://localhost:3000');
const socketIOCallBack = (cb) => {
  socket.on('job-update', (update) => cb(null, update));
}

class App extends Component {

  constructor(props) {
    super(props);
    const endTime = moment();
    this.state = {
      intervalId: undefined,
      requestName: undefined,
      duration: 5,
      endTime,
      quality: false,
      security: false,
      backup: false,
      postTarget: 'http://pcvm2-15.lan.sdn.uky.edu:3000',
      // postTarget: 'http://localhost:3000',
      requestJobID: -1,
      allocationState: 'draft'
    }

  }

  componentDidMount() {
    socketIOCallBack((err, ioData) => {
      const data = JSON.parse(ioData);
      console.log('[SOCKET.IO] React IO Data Received:', data);
      const matchedJob = data.activeJobs.reduce((acc, j) => {
        if(this.state.requestJobID === j.id) {
          acc.push(j);
        }
        return acc;
      }, []);

      if (matchedJob.length > 0) {
        this.setState({ allocationState: matchedJob[0].allocation });
      }
    });
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

  toggleButton = (b) => {
    switch (b) {
        case 'security':
            this.setState({ security: !this.state.security });
            break;
        case 'quality':
            this.setState({ quality: !this.state.quality });
            break;
        case 'backup':
            this.setState({ backup: !this.state.backup });
            break;
        default:
          break;
    }
  }

  handleInputChange = (e, i) => {
    switch (i) {
        case 'requestName':
            this.setState({ requestName: e.target.value });
            break;
        case 'postTarget':
            this.setState({ postTarget: e.target.value });
            break;
        default:
            break;
    }

  }

  handleSliderChange = (e) => {
    this.setState({ duration: e.target.value });
  }

  postData = () => {
    const { requestName, quality, security, endTime , backup, duration } = this.state;
    fetch(`${this.state.postTarget}/request`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestName,
        quality,
        security,
        backup,
        duration,
        endTime: endTime.unix(),
      })
    }).then((res) => res.json()).then((data) => {
        console.log('Request Response:', data);
        setTimeout(() => {
            this.setState({
                allocationState: data.allocation,
                requestJobID: data.id
            });
        }, 600);
    });

    this.setState({allocationState: 'requesting'});
  }

  resetData = () =>{
      const endTime = moment();
      this.setState({
          intervalId: undefined,
          requestName: undefined,
          duration: 5,
          endTime,
          quality: false,
          security: false,
          backup: false,
          requestJobID: -1,
          allocationState: 'draft'
      })
  }

  render() {
    // Can only submit if one of the security
    const { postTarget } = this.state;
    // Can only submit if user had filled in request name, and selected an option.
    return (
      <div className="App">
        <h1>Resource Request Dashboard</h1>
        <div id='form'>
          {this.renderFormContent()}
          {this.renderButtons()}
          <div id='post-target'>
            <input
              value={postTarget}
              placeholder={'Target destination here... (i.e https://localhost:3000/dc1)'}
              onChange={(e) => this.handleInputChange(e, 'postTarget')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderFormContent = () => {
      const { quality, security, backup, allocationState, requestJobID } = this.state;
      if (this.isAllocatedOrQueued(requestJobID, allocationState)) {
          return null;
      }
      return (
          <div>
              <div id='request-name'>
                  <div>Request Name</div>
                  <input
                      id='request-name-input'
                      placeholder={' Enter your request name here...'}
                      onChange={(e) => this.handleInputChange(e, 'requestName')}
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
                      min='5' max='90'
                      value={this.state.duration}
                      onChange={this.handleSliderChange}
                      step='.5'/>
              </div>
              <div id='spec-selection'>
                  <button id='btn-quality' className={quality ? 'selected' : ''}
                          onClick={() => this.toggleButton('quality')}>
                      Quality { quality ? '✓' : ''}
                  </button>
                  <button id='btn-security' className={security ? 'selected' : ''}
                          onClick={() => this.toggleButton('security')}>
                      Security { security ? '✓' : ''}
                  </button>
                  <button id='btn-backup' className={backup ? 'selected' : ''}
                          onClick={() => this.toggleButton('backup')}>
                      Backup { backup ? '✓' : ''}
                  </button>
              </div>
          </div>
      )
  }

  renderButtons = () => {
      const { requestName, quality, security, allocationState, requestJobID } = this.state;
      const canSubmit = requestName && (quality || security);
      if (this.isAllocatedOrQueued(requestJobID, allocationState)) {
          // Return link and reset button.
          return(<div id='submit-button'>
              <button id='redirect-button'
                      className={allocationState === 'queued' ? 'btn-cancel' : ''}
                      onClick={() => this.redirectOrCancel(requestJobID, allocationState)}>
                  {allocationState === 'queued' ?
                      `Job id:${requestJobID} queued. Click to Cancel Request`
                      :
                      'Resource allocated on: ' + allocationState}
              </button>
              {allocationState === 'queued' ? null :
              <button id='reset-button' onClick={this.resetData}>
                  Request New Resources
              </button>
              }

          </div>);
      }
      return (
          <div id='submit-button'>
              <button className={!canSubmit || allocationState === 'requesting' ? 'btn-disabled' : 'btn-enabled'}
                      disabled={!canSubmit || allocationState === 'requesting'}
                      onClick={this.postData}
              >
                  {canSubmit && !allocationState === 'requesting' ?
                      'Submit Request' :
                      allocationState === 'requesting' ? 'Requesting...' : 'Please fill in all the required fields...'}
              </button>
          </div>
      )
  }

  // Checks if it's allocated to one of the VM's or if queued
  // And double checks if it was assigned an id
  isAllocatedOrQueued = function (jobid, allocation) {
      return (allocation === 'west1' || allocation === 'west2'
      || allocation === 'north1' || allocation === 'north2'
      || allocation === 'east1' || allocation === 'east2'
      || allocation === 'queued') && jobid > 0;
  }

  redirectOrCancel = (id, dataCenter) => {
      // If job is still queued, we need to send a cancel.
      if (dataCenter === 'queued') {
          // Send post to urbService to cancel job/
          this.killRequest(id);
          // Then reset state of app.
          this.resetData();
      } else {
          // Else it is already allocated.
          // TODO: Redirect to proper datacenter UI
          window.open('http://www.google.com');
      }
  }

  killRequest = (id) => {
      fetch(`${this.state.postTarget}/kill`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
      })
  }
}

export default App;
