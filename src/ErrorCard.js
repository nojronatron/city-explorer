import React from 'react';
import {Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class ErrorPage extends React.Component {

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Text>{this.props.errorText}</Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

export default ErrorPage;