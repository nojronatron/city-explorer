import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      cityData: null,
      display_name: '',
      lat: '',
      lon: ''
    }
  }

  handleCityInput = async (event) =>
  {
    this.setState({
      city: event.target.value
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let format = 'json';
    let qry = `${this.state.city}`;
    let api_key = `${process.env.REACT_APP_LOCATIONIQ_API_KEY}`;
    let base_url = `https://us1.locationiq.com/v1/search.php`;
    let url = `${base_url}?key=${api_key}&q=${qry}&format=${format}`;
    let queryResponse = await axios.get(url);
    console.log(queryResponse.data[0]);
    this.setState({
      cityData: queryResponse.data[0],
      display_name: queryResponse.data[0].display_name,
      lat: queryResponse.data[0].lat,
      lon: queryResponse.data[0].lon,
    })
  }

  render() {

    let cityDataItems = null;

    if (this.state.cityData !== null) {
      console.log(cityDataItems);
      cityDataItems = <p>City: {this.state.display_name}, Lat: {this.state.lat}, Lon: {this.state.lon}</p>
      console.log(cityDataItems);
    }

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3" controlId="formCityState">
            <Form.Label>Enter a City, State to search for</Form.Label>
            <Form.Control onChange={this.handleCityInput} type="text" placeholder="Seattle, WA" />
          </Form.Group>
          <Button className="btn" type="submit">Explore!</Button>
        </Form>
        <div>{cityDataItems}</div>
      </>
    )
  }
}

export default App;
