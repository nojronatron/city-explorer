import React from 'react';
import './App.css';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MapCard from './MapCard.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      cityData: null,
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
    
    this.setState({
      test: true,
    });

    let center = `${queryResponse.data[0].lat},${queryResponse.data[0].lon}`;
    let zoom = 10;
    
    base_url = `https://maps.locationiq.com/v3/staticmap`;
    let mapurl = `${base_url}?key=${api_key}&center=${center}&zoom=${zoom}&format=jpg`;

    this.setState({
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
      cityDataItems = <p>City: {this.state.display_name}, Lat: {this.state.lat}, Lon: {this.state.lon}</p>
    }

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3" controlId="formCityState">
            <Form.Label>Enter a City, State to search for</Form.Label>
            <Form.Control onChange={this.handleCityInput} type="text" placeholder="Seattle, WA" />
          </Form.Group>
          <Button className="btn" type="submit">Explore!</Button>
        </Form>
        <div>{cityDataItems}</div>
        {this.state.map_url && <MapCard map_url={this.state.map_url} display_name={this.state.display_name} /> }
      </div>
    )
  }
}

export default App;
