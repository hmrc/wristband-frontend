import React from 'react';
import RouteHandler from 'react-router';
import Reqwest from 'reqwest';

import Promote from './promote.jsx';

import '../vendor/semantic/dist/semantic.css';
import '../scss/styles.css';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      config: {},
      middleColWidth: 0
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setMiddleColWidth();
    window.addEventListener('resize', this.setMiddleColWidth.bind(this));
  }

  setMiddleColWidth() {
    this.state.middleColWidth = React
                                .findDOMNode(this.refs.middleCol)
                                .offsetWidth;
    this.forceUpdate();
  }

  fetchData() {
    Reqwest({
      url: '/api/config',
      type: 'json'
    })
    .then( (resp) => {
      this.setState({
        config: resp
      });
    })
    .fail(function (err, msg) {
      console.error('AJAX Error: ', err, msg);
    });
  }

  render() {
    return (
      <div className="ui centered grid">
        <div className="one wide column"></div>
        <div ref="middleCol" className="ui ten wide column">
          <Promote
            envs={this.state.config.envs}
            apps={this.state.config.apps}
            width={this.state.middleColWidth}/>
        </div>
        <div className="one wide column"></div>
      </div>
    );
  }
}
