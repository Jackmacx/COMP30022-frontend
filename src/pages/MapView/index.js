import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArtifactMap from '../../components/map';
import authFetchRequest from '../../utils/auth/cognitoFetchRequest';
import styled from './index.module.scss';

function MapView(props) {
  const [artifacts, setArtifacts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const { registerId } = props.match.params;
  useEffect(() => {
    authFetchRequest(`https://api.airloom.xyz/api/v1/register/all/${registerId}`, {})
      .then(data => {
        const mapData = Object.values(data);
        for (let i = 0; i < mapData.length; i++) {
          mapData[i].lat = parseInt(mapData[i].lat, 10);
          mapData[i].lon = parseInt(mapData[i].lon, 10);
        }
        setArtifacts(mapData);
        setHasLoaded(true);
      })
      .catch(err => {
        setErrorState(true);
      });
  }, [registerId]);
  if (!hasLoaded) {
    return <div className="loading">Loading your request</div>;
  }
  if (errorState) {
    return <div className="error">Something went wrong with your request, woops</div>;
  }
  return <ArtifactMap className={styled['artifact-map']} artifacts={artifacts} />;
}

MapView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      registerId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default MapView;
