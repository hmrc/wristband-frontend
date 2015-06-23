/* @flow */
import React from 'react/addons';
import { RouteHandler } from 'react-router';

import '../vendor/semantic/dist/semantic.css';
import '../vendor/semantic/dist/semantic.js';

var $ = window.jQuery;

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      app: '',
      config: {}
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps() {
    this.fetchData();
  }

  componentDidMount() {
    var self = this;
    $('.dropdown').dropdown({
      onChange: function (value, text, $selectedItem) {
        self.setState({app: value});
      }
    });
  }

  fetchData() {
    $.getJSON('/wristband-api/config', (config) => {
      this.setState({config: config});
    });
  }

  render() {
    var options = '';

    if (this.state.config.hasOwnProperty('apps')) {
      options = this.state.config.apps.map(function(app, index) {
        return (<option key={index} value={app}>{app}</option>);
      });
    }

    return (
      <div className="ui grid">
        <div className="twelve wide column row">
          <div className="twelve wide column row">
            <h1>Promotions</h1>
          </div>

          <div className="ui form twelve wide column row">
            <div className="field">
              <label>Service</label>
              <select className="ui search dropdown">
                { options }
              </select>
            </div>
          </div>


        </div>
      </div>
    );
  }
}
