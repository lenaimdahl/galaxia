const axios = require("axios");

class NasaAPI {
  constructor() {
    // from Nasa Website
    this.BASE_URL = "https://api.nasa.gov";
    // this.BASE_URL_IMG = "https://images-api.nasa.gov";
    this.API_KEY = process.env.NASA_API_KEY;
  }
  async getPictureOfTheDay() {
    const response = await axios.get(`${this.BASE_URL}/planetary/apod`, {
      params: {
        api_key: this.API_KEY,
      },
    });
    return response.data;
  }
}

module.exports = NasaAPI;
