import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

class MapCard extends React.Component {

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>{this.props.display_name}</Card.Title>
          <Card.Img 
            src={this.props.map_url} 
            alt={this.props.display_name} 
            fluid="true" 
            variant="bottom" 
            />
        </Card.Body>
      </Card>
    )
  }
}

export default MapCard;