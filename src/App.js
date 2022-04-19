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
      cityData: {},
      city: ''
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
    let cityData = await axios.get(url);
    console.log(cityData.data[0]);
    this.setState({
      cityData: cityData.data[0]
    })
  }

  render() {

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3" controlId="formCityState">
            <Form.Label>Enter a City, State to search for</Form.Label>
            <Form.Control onChange={this.handleCityInput} type="text" placeholder="Seattle, WA" />
          </Form.Group>
          <Button className="btn" type="submit">Explore!</Button>
        </Form>
      </>
    )
  }
}
export default App;
