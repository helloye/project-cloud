import React, { Component } from 'react';
import * as moment from 'moment';
import openSocket from 'socket.io-client';
import './App.css';

const serverConfig = {
  "urb": {
    "hostname": "pcvm2-15.lan.sdn.uky.edu",
    "l3": "128.163.232.78",
    "l2": "10.10.4.6"
  },
  "dashboard": {
    "hostname": "pcvm3-12.lan.sdn.uky.edu",
    "l3": "128.163.232.80",
    "l2": "10.10.10.23"
  },
  "east1": {
    "hostname": "pcvm1-3.lan.sdn.uky.edu",
    "l3": "128.163.232.69",
    "l2": "10.10.10.20"
  },
  "east2": {
    "hostname": "pcvm2-12.lan.sdn.uky.edu",
    "l3": "128.163.232.75",
    "l2": "10.10.10.21"
  },
  "north1": {
    "hostname": "pcvm5-5.lan.sdn.uky.edu",
    "l3": "128.163.232.86",
    "l2": "10.10.2.3"
  },
  "north2": {
    "hostname": "pcvm5-7.lan.sdn.uky.edu",
    "l3": "128.163.232.88",
    "l2": "10.10.2.4"
  },
  "west1": {
    "hostname": "pcvm3-13.lan.sdn.uky.edu",
    "l3": "128.163.232.81",
    "l2": "10.10.1.1"
  },
  "west2": {
    "hostname": "pcvm1-5.lan.sdn.uky.edu",
    "l3": "128.163.232.71",
    "l2": "10.10.1.2"
  },
  "localhost": {
    "hostname": "localhost"
  }
};

let socket;
socket = openSocket('http://pcvm1-14.instageni.wisc.edu:3000');
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
      duration: 10,
      fileSize: 500,
      endTime,
      quality: false,
      security: false,
      backup: false,
      postTarget: 'http://pcvm1-14.instageni.wisc.edu:3000',
      // postTarget: 'http://localhost:3000',
      requestJobID: -1,
      allocationState: 'draft',
      layer: -1
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

      console.log('Matched!', matchedJob);
      // If the queued job was matched. Set it's allocation state.
      if (matchedJob.length > 0) {
        this.setState({
            allocationState: matchedJob[0].allocation,
            layer: matchedJob[0].layer
        });
      }

      const completedJobs = data.completedJobs.reduce((acc, j) => {
          if(this.state.requestJobID === j.id) {
              acc.push(j);
          }
          return acc;
      }, []);
      // If we find it in the completed pool, set state to completed and disable link
        if (completedJobs.length > 0) {
            this.setState({ allocationState: 'completed' });
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

  handleDurationChange = (e) => {
    this.setState({ duration: e.target.value });
  }

  handleFileSizeChange = (e) => {
      this.setState({ fileSize: e.target.value });
  }

  postData = () => {
    const { requestName, quality, security, endTime , backup, duration, fileSize } = this.state;
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
        fileSize,
        endTime: endTime.unix(),
      })
    }).then((res) => res.json()).then((data) => {
        console.log('Request Response:', data);
        setTimeout(() => {
            this.setState({
                allocationState: data.allocation,
                requestJobID: data.id,
                layer: data.layer
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
          duration: 10,
          fileSize: 500,
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
          {this.renderJobStatus()}
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
                      maxLength={15}
                      placeholder={'Request name...'}
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
                      min='10' max='90'
                      value={this.state.duration}
                      onChange={this.handleDurationChange}
                      step='.5'/>
              </div>
              <div id='time-slider'>
                  File Size (MB):
                  <div id='duration-label'>
                      <div>
                          {parseFloat(Math.round(this.state.fileSize * 100)/100)}
                      </div>
                  </div>
                  <input
                      id='slider'
                      type='range'
                      min='500' max='2000'
                      value={this.state.fileSize}
                      onChange={this.handleFileSizeChange}
                      step='50'/>
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

  renderJobStatus = () => {
      const { requestJobID, allocationState, requestName } = this.state;
      if (allocationState === 'draft' || requestJobID <=0 || !requestName) {
          return null;
      }
      return (<div id='job-status'>
          <h3>Job: {requestName} (ID:{requestJobID})</h3>
          <h3>Allocation Status: {allocationState}</h3>
      </div>)
  }

  renderButtons = () => {
      const { requestName, quality, security, allocationState, requestJobID, layer } = this.state;
      const canSubmit = requestName && (quality || security);
      if (this.isAllocatedOrQueued(requestJobID, allocationState)) {
          // Return link and reset button.
          return(<div id='submit-button'>
              <button id='redirect-button'
                      className={allocationState === 'queued' ? 'btn-cancel'
                          : allocationState === 'completed' ? 'btn-completed' : ''}
                      onClick={() => this.redirectOrCancel(requestJobID, allocationState)}>
                  {allocationState === 'queued' ?
                      `Job id:${requestJobID} queued. Click to Cancel Request`
                      :
                      allocationState === 'completed' ?
                          'Job Completed!' :'View Jobs On: ' + allocationState + '(layer:' + layer + ')'}
              </button>
              {allocationState === 'queued' || allocationState === 'completed' ? null :
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
                  {canSubmit && allocationState !== 'requesting' ?
                      'Submit Request' :
                      allocationState === 'requesting' ? 'Requesting...' : 'Please fill in all the required fields...'}
              </button>
          </div>
      )
  }

  // Checks if it's allocated to one of the VM's or if queued
  // And double checks if it was assigned an id
  isAllocatedOrQueued = function (jobid, allocation) {
      return allocation !== 'draft' && jobid > 0;
  }

  redirectOrCancel = (id, dataCenter) => {
      // If dataCenter is 'completed' it is not longer on any of the data center.
      // This redirect should basically reset the app state
      if (dataCenter === 'completed') {
          this.resetData();

      }

      // Else if job is still queued, we need to send a cancel.
      else if (dataCenter === 'queued') {
          // Send post to urbService to cancel job/
          this.killRequest(id);
          // Then reset state of app.
          this.resetData();
      } else {
          // Else it is already allocated.
          // TODO: Redirect to proper datacenter UI
          const serverInfo = this.getServerInfo(dataCenter)
          window.open(`http://${serverInfo.hostname}`);
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

  getServerInfo = (s) => {
    switch (s) {
      case 'east1':
        return serverConfig.east1;
      case 'east2':
        return serverConfig.east2;
      case 'west1':
        return serverConfig.west1;
      case 'west2':
        return serverConfig.west2;
      case 'north1':
        return serverConfig.north1;
      case 'north2':
        return serverConfig.north2;
      case 'urb':
        return serverConfig.urb;
      case 'dashboard':
        return serverConfig.dashboard;
      default:
        return serverConfig.localhost;
    }
  }
}

export default App;
