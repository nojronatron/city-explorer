import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

class Weather extends React.Component {

  render() {
    console.log('Weather component render()ing: ', this.props.wxData);
    
    return (
        <Card>
          <Card.Body>
            <Card.Title>3-day Forecast</Card.Title>
            {this.props.wxData.map((forecast, idx) =>
              <div key={idx}>
                <p>{forecast.date}</p>
                <p>{forecast.description}</p>
                </div>
            )}
          </Card.Body>
        </Card>
    );
  }
}

export default Weather;
