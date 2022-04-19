import React from 'react';
import './App.css';
import axios from 'axios';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import MapCard from './MapCard.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // city: '',
      // cityData: null,
      display_name: '',
      lat: '',
      lon: '',
      map_url: ''
    }
  }

  handleCityInput = (event) => {
    this.setState({
      city: event.target.value
    })
  }

  getSearchResult = async () => {
    let qry = `${this.state.city}`;
    let api_key = `${process.env.REACT_APP_LOCATIONIQ_API_KEY}`;
    let base_url = `https://us1.locationiq.com/v1/search.php`;
    let url = `${base_url}?key=${api_key}&q=${qry}&format=json`;
    let queryResponse = await axios.get(url);
    
    // this.setState({
    //   test: true,
    // });

    let center = `${queryResponse.data[0].lat},${queryResponse.data[0].lon}`;
    let zoom = 10;    
    base_url = `https://maps.locationiq.com/v3/staticmap`;
    let mapurl = `${base_url}?key=${api_key}&center=${center}&zoom=${zoom}&format=jpg`;
    let tempName = queryResponse.data[0].display_name;
    let tempLat = queryResponse.data[0].lat;
    let tempLon = queryResponse.data[0].lon;
    this.setState({
      display_name: tempName,
      lat: tempLat,
      lon: tempLon,
      map_url: mapurl,
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.getSearchResult();
  }

  render() {

    let cityDataItems = null;

    if (this.state.cityData !== null) {
      console.log(`this.state.display_name: ${this.state.display_name}`);
      cityDataItems = <div><p>City: {this.state.display_name}</p><p>Lat: {this.state.lat}, Lon: {this.state.lon}</p></div>
    }

    return (
      <Container fluid>
        <Row>
          <Col>Welcome to City Explorer!</Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="formCityState">
                <Form.Label>Enter a City, State to search for</Form.Label>
                <Form.Control onChange={this.handleCityInput} type="text" placeholder="Seattle, WA" />
              </Form.Group>
            <Button variant="primary" className="btn" type="submit">Explore!</Button>
            </Form>
          </Col>
          <Col>
        <div>{cityDataItems}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.map_url && <MapCard map_url={this.state.map_url} display_name={this.state.display_name} /> }
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App;
