import React, { PureComponent } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { List, AddDevice, EditDevices } from '../views';

import '../sass/App.scss';

class Rooter extends PureComponent {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/devices/edit/:id' component={props => <EditDevices {...props} />} />
            <Route exact path='/devices/add' component={props => <AddDevice {...props} />} />
            <Route exact path='/' component={props => <List {...props} />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Rooter;
