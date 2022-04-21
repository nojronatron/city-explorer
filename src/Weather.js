import React from 'react';
import Card from 'react-bootstrap/Card';

class Weather extends React.Component {

  render() {
    console.log(this.props.weather);
    let weatherCards = this.props.weather.map((wx, idx) => {
      return (
        <Card id={idx}>
          <Card.Body>
            <Card.Title>{wx.wxDate}</Card.Title>
            <Card.Text>{wx.wxDescription}</Card.Text>
          </Card.Body>
        </Card>
      )
    });

    return (
      <>
        {weatherCards}
      </>
    );
  }
}

export default Weather;