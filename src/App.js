import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: 1,
      config: 0
    }
  }

  handleSliderChange = (e) => {
    this.setState({ duration: e.target.value });
  }

  handleSelectConfig = (i) => {
    const selection = this.state.config === i ? 0 : i;
    this.setState({ config: selection});
  }

  render() {
    return (
      <div className="App">
        <div id='form'>
          <div id='request-name'>
            Request Name: <input
            placeholder={' Enter your request name here...'}
          />
          </div>
          <div id='time-slider'>
            Duration (hrs):
            <div id='duration-label'>
              {parseFloat(Math.round(this.state.duration * 100)/100).toFixed(2)}
            </div>
            <input
              id='slider'
              type='range'
              min='1' max='12'
              value={this.state.duration}
              onChange={this.handleSliderChange}
              step='.25'/>

          </div>
          <div id='resource-spec-section'>
            <div id='cpu-dropdown'>
              CPU:
              <select>
                <option value='C2_2.4'>2 Cores, 2.4 Ghz</option>
                <option value='C6_3.6'>6 Cores, 3.6 Ghz</option>
                <option value='C8_4.1'>6 Cores, 4.1 Ghz</option>
                <option value='C8_3.2'>8 Cores, 3.2 Ghz</option>
                <option value='C16_4.1'>16 Cores, 4.1 Ghz</option>
              </select>
            </div>
            <div id='resource-request-input'>
              <div id='ram-input'>
                RAM (GB): <input
              />
              </div>
              <div id='storage-input'>
                Storage (GB): <input
              />
              </div>
              <div id='network-down-input'>
                Network Down (Mbps): <input
              />
              </div>
              <div id='network-up-input'>
                Network Up (Mbps): <input
              />
              </div>
              <div id='encrypt-traffic'>
                Encrypt Network Traffic: <input
                type='checkbox'
              />
              </div>
            </div>
          </div>
          <div id='pre-config-resources'>
            <table>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>CPU</th>
                <th>RAM</th>
                <th>Storage</th>
                <th>Network</th>
              </tr>
              <tr style={this.state.config === 1 ? {
                background: 'lightblue'
              } : {}}>
                <td>
                  <input
                    value = 'Select'
                    type ='button'
                    onClick={() => this.handleSelectConfig(1)}
                  />
                </td>
                <td>Config 1</td>
                <td>2 Cores 2.4GHz</td>
                <td>8 GB</td>
                <td>1 TB</td>
                <td>10/10</td>
              </tr>
              <tr style={this.state.config === 2 ? {
                background: 'lightblue'
              } : {}}>
                <td>
                  <input
                    value = 'Select'
                    type ='button'
                    onClick={() => this.handleSelectConfig(2)}
                  />
                </td>
                <td>Config 2</td>
                <td>6 Cores 3.4GHz</td>
                <td>16 GB</td>
                <td>4 TB</td>
                <td>100/100</td>
              </tr>
              <tr style={this.state.config === 3 ? {
                background: 'lightblue'
              } : {}}>
                <td>
                  <input
                    value = 'Select'
                    type ='button'
                    onClick={() => this.handleSelectConfig(3)}
                  />
                </td>
                <td>Config 3</td>
                <td>18 Cores 4.1GHz</td>
                <td>32 GB</td>
                <td>50 TB</td>
                <td>100/50</td>
              </tr>
              <tr style={this.state.config === 4 ? {
                background: 'lightblue'
              } : {}}>
                <td>
                  <input
                    value = 'Select'
                    type ='button'
                    onClick={() => this.handleSelectConfig(4)}
                  />
                </td>
                <td>Config 4</td>
                <td>32 Cores 3.6GHz</td>
                <td>64 GB</td>
                <td>1 PB</td>
                <td>50/50</td>
              </tr>
            </table>
            <div id='submit-button'>
              <button>Submit Request</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
