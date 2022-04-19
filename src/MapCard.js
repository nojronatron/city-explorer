import React from 'react';
import Card from 'react-bootstrap/Card';

class MapCard extends React.Component {

  render() {
    return (
      <Card>
        <Card.Img src={this.props.map_url} alt={this.props.display_name} />
        <Card.Body>
          <Card.Title>{this.props.display_name}</Card.Title>
        </Card.Body>
      </Card>
    )
  }
}

export default MapCard;