import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { withAuthenticator } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';
import LogRocket from 'logrocket';
import AirNavBar from './components/navbar';
import Home from './pages/Home';
import MapView from './pages/MapView';
import ListView from './pages/ListView';
import TimelineView from './pages/TimelineView';
import ArtifactView from './pages/ArtifactView';
import { getDefaultRegister, getRegisters } from './utils/register';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [registers, setRegisters] = useState([]);
  const refetchRegisters = () => {
    getRegisters()
      .then(registers => {
        if (registers !== null) {
          setRegisters(registers);
        }
      })
      .catch(err => {
        LogRocket.error(err);
      });
  };
  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false
    })
      .then(user => {
        LogRocket.identify({
          name: user.attributes.name,
          email: user.attributes.email,
          userID: user.username
        });
        return getDefaultRegister();
      })
      .then(reg => {
        localStorage.setItem('reg', JSON.stringify(reg));
      })
      .catch(() => {
        LogRocket.identify({
          name: 'Anonymous'
        });
      });
    getRegisters()
      .then(registersFetched => {
        if (registersFetched !== null) {
          setRegisters(registersFetched);
        }
      })
      .catch(error => {
        LogRocket.error(error);
      });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AirNavBar refetchRegisters={refetchRegisters} registers={registers} />
        <Route exact path="/" component={Home} />
        <Route path="/map/:registerId" component={MapView} />
        <Route path="/list/:registerId" component={ListView} />
        <Route path="/timeline/:registerId" component={TimelineView} />
        <Route path="/artifact" component={ArtifactView} />
      </BrowserRouter>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpConfig: {
    hiddenDefaults: ['phone_number', 'email'],
    signUpFields: [
      { label: 'Name', key: 'name', required: true, type: 'string', displayOrder: 1 },
      { label: 'Username', key: 'username', required: true, displayOrder: 2, type: 'string' },
      { label: 'Password', key: 'password', required: true, displayOrder: 3, type: 'password' }
    ]
  }
});
