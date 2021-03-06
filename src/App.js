import React from 'react';
import './App.css';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import MapCard from './MapCard.js';
import ErrorCard from './ErrorCard.js';
import Weather from './Weather.js';
import Movies from './Movies.js';
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
    /* setup function-scoped variables */
    let queryResponse;
    let cityWeather;
    let cityMovies;

    /* setup city query specific variables */
    let userInput = `${this.state.city}`;
    let cityQuery = userInput.split(',')[0];
    let api_key = `${process.env.REACT_APP_LOCATIONIQ_API_KEY}`;
    let base_url = `https://us1.locationiq.com/v1/search.php`;
    let url = `${base_url}?key=${api_key}&q=${cityQuery}&format=json`;

    try {
      /*  AXIOS call city data */
      queryResponse = await axios.get(url);
      // console.log('axios locationiq response: ', queryResponse);
    }
    catch (err) {
      this.setState({
        errorTitle: 'Request failed',
        errorText: err.response.status,
        showModal: true,
      })
    }

    /* Concatenate static map path */
    let center = `${queryResponse.data[0].lat},${queryResponse.data[0].lon}`;
    let zoom = 12;
    base_url = `https://maps.locationiq.com/v3/staticmap`;
    let mapurl = `${base_url}?key=${api_key}&center=${center}&zoom=${zoom}&format=jpg`;
    let tempName = queryResponse.data[0].display_name;
    let tempLat = queryResponse.data[0].lat;
    let tempLon = queryResponse.data[0].lon;

    /* AXIOS call weather info */
    let wxUrl = `http://localhost:3001/weather?lat=${tempLat}&lon=${tempLon}`;
    // console.log('wxUrl to my api server: ', wxUrl);

    try {
      cityWeather = await axios.get(wxUrl);
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
    let moviesUrl = `http://localhost:3001/movies?city=${cityQuery}`;
    // console.log('asking server for ', moviesUrl);

    try {
      cityMovies = await axios.get(moviesUrl);
      // console.log('cityMovies (before setState): ',cityMovies);
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
    // console.log('this.state.movieData:', this.state.movieData);
    
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
        <Row className="row-4">
          <Col>
            {this.state.movieData && <Movies movieData={this.state.movieData.data} />}
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