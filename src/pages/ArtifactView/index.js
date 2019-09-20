import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import authFetchRequest from '../../utils/auth/cognitoFetchRequest';
import Nav from '../../components/nav';

function ArtifactView(props) {
  const [artifact, setArtifact] = useState(undefined);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const { registerId, artifactId } = props.match.params;
  useEffect(() => {
    authFetchRequest(`https://api.airloom.xyz/api/v1/register/artifact/${registerId}/${artifactId}`, {})
      .then(data => {
        if (data.length === 0){
          setErrorState(true);
        } else {
          setArtifact(data[0]);
        }
        setHasLoaded(true);
      })
      .catch(err => {
        setErrorState(true);
        setHasLoaded(true);
      });
  }, [registerId, artifactId]);
  if (!hasLoaded) {
    return <div className="loading">Loading your request</div>;
  }
  if (errorState) {
    return <div className="error">Something went wrong with your request, whoops</div>;
  }

  return <>
    <Nav registerId={registerId}/>
    <p>{JSON.stringify(artifact)}</p>
    <div>
      {artifact.photos.map(({ url }) => 
        <img src={url} alt={url} width='200' style={{ display: 'inline-block' }}/>
      )}
    </div>
  </>;
}

ArtifactView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      registerId: PropTypes.string.isRequired,
      artifactId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default ArtifactView;

