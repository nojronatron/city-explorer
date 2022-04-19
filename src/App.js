import React from 'react';
import './App.css';
import axios from 'axios';
import {Form, Button, Container, Row, Col, Modal} from 'react-bootstrap';
import MapCard from './MapCard.js';
import ErrorCard from './ErrorCard.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      errorTitle: 'default_errorTitle',
      errorText: 'default_errorText',
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
    try {
      let queryResponse = await axios.get(url);
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
    catch (err) {
      this.setState({
        errorTitle: 'Request failed',
        errorText: err.response.status,
        display_name: '',
        lat: '',
        lon: '',
        map_url: '',
        city: '',
        showModal: true,
      })
    }
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

    let cityDataItems = null;

    if (this.state.cityData !== null) {
      cityDataItems = <div className="cityData"><p>City: {this.state.display_name}</p><p>Lat: {this.state.lat}, Lon: {this.state.lon}</p></div>
    }

    return (
      <Container className="mainBody" fluid>
        <Row>
          <Col className="welcome"><h1>Welcome to City Explorer!</h1></Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter a City, State to search for, below.</Form.Label>
                <Form.Control onChange={this.handleCityInput} id="cityInputText" type="text" placeholder="Seattle, WA" />
              </Form.Group>
            <Button variant="primary" className="btn" type="submit">Explore!</Button>
            </Form>
          </Col>
          <Col>
            {cityDataItems && <div>{cityDataItems}</div>}
          </Col>
        </Row>
        <Row>
          <Col className='mapCardCol'>
            {this.state.map_url && <MapCard map_url={this.state.map_url} display_name={this.state.display_name} /> }
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
            <ErrorCard title={this.state.errorTitle} errorText={this.state.errorText} />
          </Modal.Body>
        </Modal>
      </Container>
    )
  }
}

export default App;