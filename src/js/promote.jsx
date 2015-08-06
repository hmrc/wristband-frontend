import React from 'react';
import Reqwest from 'reqwest';
import ClassNames from 'classnames';
import Progress from 'react-progress';
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
    this.promoteApp = this.promoteApp.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.deployButtonRenderer = this.deployButtonRenderer.bind(this);

    this.state = {
      envs: [],
      filterBy: '',
      filteredRows: [],
      buildProgress: 0,
      promotedApp: null
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

  promoteApp(app, index, event) {
    event.preventDefault();

    var envToPromoteTo = '',
        versionToPromote = '',
        appToPromote = this.props.apps[index];

    // TODO: iterate envs config instead
    // which environment to promote to
    this.props.envs[Object.keys(this.props.envs)[1]].forEach(
      env => {
        if (env in appToPromote.envs) {
          envToPromoteTo = env;
        }
      }
    );

    // version to promote
    this.props.envs[Object.keys(this.props.envs)[0]].forEach(
      env => {
        if ( env in appToPromote.envs ) {
          versionToPromote = appToPromote.envs[env].versions[0].ver;
        }
      }
    );

    // TODO: disable the button instead
    if ( versionToPromote ) {
      this.setState({
        promotedApp: index
      });

      this.triggerPromotion(appToPromote, versionToPromote, envToPromoteTo);
    }
  }

  triggerPromotion(app, ver, env) {
    var url = '/api/promote/' + env + '/' + app.name + '/' + ver;

    Reqwest({
      url,
      method: 'post',
      type: 'json'
    })
    .then(
      resp => {
        this.getBuildId(resp.queue_id, env);
      }
    )
    .fail( (err, msg) => {
      console.error('AJAX Error: ', err, msg);
    });
  }

  getBuildId(queueId, env) {
    var url = '/api/build/' + env + '/' + queueId;

    Reqwest({
      url,
      type: 'json'
    })
    .then( resp => {
      if(!resp.build_id) {
        this.getBuildId(queueId, env);
      }
      else {
        this.setState({
        }, this.getProgress(env, resp));
      }
    })
    .fail( (err, msg) => {
      console.error('AJAX Error: ', err, msg);
    });
  }

  getProgress(env, build) {
    var url = '/api/progress/' + env + '/' + build.build_id;

    Reqwest({
      url,
      type: 'json'
    })
    .then( resp => {
      if(resp.progress !== 1) {
        this.setState({
          buildProgress: Math.floor(resp.progress * 100)
        }, this.getProgress(env, build));
      }
      else {
        this.setState({
          promotedApp: null,
          buildProgress: 0
        });
      }
    })
    .fail( (err, msg) => {
      console.error('AJAX Error: ', err, msg);
    });
  }

  deployButtonRenderer(cellData, cellDataKey, rowData, rowIndex) {
    var wasClicked = this.state.promotedApp === rowIndex,
        isDeploying = wasClicked && !!this.state.buildProgress;

    var buttonClasses = ClassNames({
      'ui button': true,
      'red': !wasClicked
    });

    var iconClasses = ClassNames({
      'right icon': true,
      'chevron': !wasClicked,
      'notched circle loading': wasClicked
    });

    var progressBar = isDeploying ? (
      <Progress percent={this.state.buildProgress}/>
    ) : '';

    var buttonText = isDeploying ? 'Deploying' : wasClicked ? 'Pending' : 'Deploy';

    return (
      // TODO: disable button if no version in left env column
      <button className="ui red button" onClick={this.promoteApp.bind(null, rowData, rowIndex)}>
        {buttonText} <i className={iconClasses}></i>
        {progressBar}
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
            ref="inputText"
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
