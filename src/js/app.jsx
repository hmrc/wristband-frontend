/* @flow */
import React from 'react';
import RouteHandler from 'react-router';
import FixedDataTable from 'fixed-data-table';

import '../../node_modules/fixed-data-table/dist/fixed-data-table.css';
import '../vendor/semantic/dist/semantic.css';
import '../scss/styles.css';
import '../vendor/semantic/dist/semantic.js';

var $ = window.jQuery;

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      config: [],
      filteredRows: [],
      filterBy: '',
      middleColWidth: 0
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps() {
    this.fetchData();
  }

  setMiddleColWidth() {
    this.state.middleColWidth = React.findDOMNode(this.refs.middleCol).offsetWidth;
    this.forceUpdate();
  }

  componentDidMount() {
    this.setMiddleColWidth();
    window.addEventListener('resize', this.setMiddleColWidth.bind(this));
  }

  fetchData() {
    $.getJSON('/wristband-api/config', (config) => {
      this.setState({
        config: config,
        filteredRows: config.apps
      });
    });
  }

  rowGetter(rowIndex) {
    var appConfig = this.state.filteredRows;
    return {
      appName: appConfig[rowIndex].name,
      qaVersion: appConfig[rowIndex].qa.version,
      stagingVersion: appConfig[rowIndex].staging.version
    };
  }

  _filterRowsBy(filterBy) {
    var rows = this.state.config.apps.slice();
    var filteredRows = filterBy ? rows.filter(function(row){
      return row.name.toLowerCase().indexOf(filterBy.toLowerCase()) >= 0;
    }) : rows;

    this.setState({
      filteredRows: filteredRows,
      filterBy: filterBy
    });
  }

  _onFilterChange(e) {
    this._filterRowsBy(e.target.value);
  }

  promoteApp(e) {
    e.preventDefault();
    // TODO: AJAX req
  }

  deployButtonRenderer() {
    return (
      <button className="ui red button" onClick={this.promoteApp}>
        Deploy <i className="chevron right icon"></i>
      </button>
    );
  }

  render() {
    var apps = (this.state.config.hasOwnProperty('apps')) ?
      this.state.config.apps : [];

    return (
      <div className="ui centered grid">
        <div className="one wide column"></div>
        <div ref="middleCol" className="ui ten wide column">
          <div className="ui icon input">
            <input type="text" onChange={this._onFilterChange.bind(this)} placeholder='Filter Services..'/>
              <i className="search icon"></i>
            </div>
          <Table
            rowHeight={50}
            rowGetter={this.rowGetter.bind(this)}
            rowsCount={this.state.filteredRows.length}
            width={this.state.middleColWidth}
            height={500}
            headerHeight={50}>
            <Column
              label="App"
              width={100}
              flexGrow={1}
              dataKey="appName"
              />
            <Column
              label="QA"
              width={100}
              dataKey="qaVersion"
              align="center"
              />
            <Column
              cellRenderer={this.deployButtonRenderer.bind(this)}
              width={120}
              dataKey="deployButton"
              align="center"
              />
            <Column
              label="Staging"
              width={100}
              dataKey="stagingVersion"
              align="center"
              />
          </Table>
        </div>
        <div className="one wide column"></div>
      </div>
    );
  }
}
