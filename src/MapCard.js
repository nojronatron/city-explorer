import React from 'react';
import Card from 'react-bootstrap/Card';
import './MapCard.css';

class MapCard extends React.Component {

  render() {
    return (
      <Card className='mapCard'>
        <Card.Body>
          <Card.Title>{this.props.display_name}</Card.Title>
          <Card.Img src={this.props.map_url} alt={this.props.display_name} fluid="true" variant="bottom" className="cardImg" />
        </Card.Body>
      </Card>
    )
  }
}

export default MapCard;