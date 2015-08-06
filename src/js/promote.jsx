import React from 'react';
import RouteHandler from 'react-router';
import FixedDataTable from 'fixed-data-table';

import '../../node_modules/fixed-data-table/dist/fixed-data-table.css';
import '../vendor/semantic/dist/semantic.css';
import '../scss/styles.css';

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

export default class Promote extends React.Component {
  constructor() {
    super();

    this.rowGetter = this.rowGetter.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.deployButtonRenderer = this.deployButtonRenderer.bind(this);

    this.state = {
      envs: [],
      filterBy: '',
      filteredRows: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.apps ) {
      // TODO: return this structure from the api?
      var envData = Object.keys(nextProps.envs).map(
        env => ({
          title: env,
          key: env.toLowerCase() + 'Version'
        })
      );

      this.setState({
        envs: envData,
        filteredRows: nextProps.apps
      });
    }
  }

  rowGetter(rowIndex) {
    var app = this.state.filteredRows[rowIndex];

    var appData = {
      appName: app.name
    };

    // set env versions
    this.state.envs.forEach(
      (env, i) => {
        Object.keys(app.envs).forEach(
          appEnv => {
            var re = new RegExp(env.title, 'i');
            if ( re.test(appEnv) ) {
              appData[this.state.envs[i].key] = app.envs[appEnv].versions[0].ver;
            }
          }
        );
      }
    );

    return appData;
  }

  filterRowsBy(filterBy) {
    var rows = this.props.apps;

    var filteredRows = filterBy ? rows.filter(
      row => row.name.toLowerCase().indexOf(filterBy.toLowerCase()) >= 0
    ) : rows;

    this.setState({
      filteredRows: filteredRows,
      filterBy: filterBy
    });
  }

  onFilterChange(e) {
    this.filterRowsBy(e.target.value);
  }

  promoteApp(e) {
    e.preventDefault();
    // TODO: AJAX req
  }

  deployButtonRenderer() {
    return (
      // TODO: disable button if no version in left env column
      <button className="ui red button" onClick={this.promoteApp}>
        Deploy <i className="chevron right icon"></i>
      </button>
    );
  }

  render() {
    var Columns = this.state.envs.map(
      (env, i) => {
        return (
          <Column
            dataKey={this.state.envs[i].key}
            label={this.state.envs[i].title}
            align="center"
            width={100}
            key={this.state.envs[i].key}
            />
        );
      }
    );

    // Insert deploy button as second column
    Columns.splice(1, 0, (
      <Column
        cellRenderer={this.deployButtonRenderer}
        dataKey="deployButton"
        align="center"
        width={120}
        key="deploy"
        />
    ));

    return (
      <div>
        <div className="ui icon input">
          <input
            type="text"
            onChange={this.onFilterChange}
            placeholder='Filter Services..'
            />
          <i className="search icon"></i>
        </div>
        <Table
          rowsCount={this.state.filteredRows.length}
          rowGetter={this.rowGetter}
          width={this.props.width}
          headerHeight={50}
          rowHeight={50}
          height={500}>
          <Column
            dataKey="appName"
            label="App"
            flexGrow={1}
            width={100}
            />
          {Columns}
        </Table>
      </div>
    );
  }
}
