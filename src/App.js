import React from 'react';
import './App.css';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import MapCard from './MapCard.js';
import ErrorCard from './ErrorCard.js';
import Weather from './Weather.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorTitle: '',
      errorText: '',
      display_name: '',
      lat: '',
      lon: '',
      map_url: '',
      showModal: false,
      wxData: null,
    }
  }

  handleCityInput = (event) => {
    this.setState({
      city: event.target.value
    })
  }

  getSearchResult = async () => {
    // setup function-scope variables
    let queryResponse;
    let cityWeather;
    let cityMovies;

    // setup city query specific variables
    let qry = `${this.state.city}`;
    let api_key = `${process.env.REACT_APP_LOCATIONIQ_API_KEY}`;
    let base_url = `https://us1.locationiq.com/v1/search.php`;
    let url = `${base_url}?key=${api_key}&q=${qry}&format=json`;
    try {
      //  get city data
      queryResponse = await axios.get(url);
    }
    catch (err) {
      this.setState({
        errorTitle: 'Request failed',
        errorText: err.response.status,
        showModal: true,
        display_name: '',
        lat: '',
        lon: '',
        map_url: '',
        wxData: null,
        movieData: null,
      })
    }
    let center = `${queryResponse.data[0].lat},${queryResponse.data[0].lon}`;
    let zoom = 12;
    base_url = `https://maps.locationiq.com/v3/staticmap`;
    let mapurl = `${base_url}?key=${api_key}&center=${center}&zoom=${zoom}&format=jpg`;
    let tempName = queryResponse.data[0].display_name;
    let tempLat = queryResponse.data[0].lat;
    let tempLon = queryResponse.data[0].lon;

    //  get weather info
    let wxUrl = `http://localhost:3001/weather?city=${this.state.city}`;
    console.log('asking server for ', wxUrl);

    try {
      cityWeather = await axios.get(wxUrl);
      console.log('cityWeather.data[0] (before setState): ',cityWeather.data[0]);
    }
    catch (err) {
      this.setState({
        errorTitle: 'Request failed',
        errorText: err.response.status,
        showModal: true,
        display_name: '',
        lat: '',
        lon: '',
        map_url: '',
        wxData: null,
      })
    }

    //  movies
    let moviesUrl = `http://localhost:3001/movies?city=${this.state.city}`;
    console.log('asking server for ', moviesUrl);

    try {
      cityMovies = await axios.get(moviesUrl);
      console.log('cityMovies.data[0] (before setState): ',cityMovies.data[0]);
    }
    catch(err) {
      this.setState({
        errorTitle: 'Request failed',
        errorText: err.response.status,
        showModal: true,
        display_name: '',
        city: '',
        lat: '',
        lon: '',
        map_url: '',
        wxData: null,
        movieData: null,
      })
    }

    this.setState({
      display_name: tempName,
      lat: tempLat,
      lon: tempLon,
      map_url: mapurl,
      wxData: cityWeather.data,
      movieData: cityMovies,
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.getSearchResult();
  }

  hideModalHandler = () => {
    document.getElementById('cityInputText').value = '';
    this.setState({
      modalTitle: '',
      modalErrorText: '',
      showModal: false
    })
  }

  render() {
    //  leave this console log here to verify state at every render
    // console.log(`current thisState:`, this.state);

    let cityDataItems = null;

    if (this.state.cityData !== null) {
      cityDataItems = <div className="cityData">
        <p>City: {this.state.display_name}</p>
        <p>Lat: {this.state.lat}, Lon: {this.state.lon}</p>
        </div>
    }

    return (
      <Container className="mainBody" fluid>
        <Row className="row-1">
          <Col className="welcome">
            <h1>Welcome to City Explorer!</h1>
            </Col>
        </Row>
        <Row className="row-2">
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter a City, State to search for, below.</Form.Label>
                <Form.Control 
                  onChange={this.handleCityInput} 
                  id="cityInputText" 
                  type="text" 
                  placeholder="Seattle, WA" 
                />
              </Form.Group>
              <Button 
                variant="primary" 
                className="btn" 
                type="submit">Explore!
              </Button>
            </Form>
          </Col>
          <Col>
            {cityDataItems && <div>{cityDataItems}</div>}
          </Col>
        </Row>
        <Row className="row-3">
          <Col>
            {this.state.map_url && <MapCard map_url={this.state.map_url} display_name={this.state.display_name} />}
          </Col>
          <Col>
            {this.state.wxData && <Weather wxData={this.state.wxData} />}
          </Col>
        </Row>
        <Modal
          show={this.state.showModal}
          onHide={this.hideModalHandler}
          className="errorModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>An Error Has Occurred!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorCard 
              title={this.state.errorTitle} 
              errorText={this.state.errorText} 
            />
          </Modal.Body>
        </Modal>
      </Container>
    )
  }
}

export default App;