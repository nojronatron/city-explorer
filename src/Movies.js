import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

class Movies extends React.Component {

  render() {
    console.log('Movie component render()ing: ', this.props.movieData);
    
    return (
        <Card>
          <Card.Body>
            <Card.Title>Movies Playing in Town</Card.Title>
            {this.props.movieData.map((movie, idx) =>
              <Card.Header key={idx}>
                <Card.Img
                  src={movie.image_url} 
                  alt={movie.title} 
                  fluid='true' 
                  style={{width: '50%'}}
                />
                <Card.Text>{movie.title}</Card.Text>
                <Card.Text>{movie.overview}</Card.Text>
              </Card.Header>
            )}
          </Card.Body>
        </Card>
    );
  }
}

export default Movies;
