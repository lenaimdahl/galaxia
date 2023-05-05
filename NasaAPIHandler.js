const axios = require("axios");

class NasaAPI {
  constructor() {
    // from Nasa Website
    this.BASE_URL = "https://api.nasa.gov";
    this.BASE_URL_IMG = "https://images-api.nasa.gov";
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

  async getRandomSpaceImages(num) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        media_type: "image",
        q: "earth",
      },
    });

    const items = response.data.collection.items;
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  async getdetailedNasaImage(id) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        nasa_id: id,
      },
    });
    const item = response.data.collection.items[0];
    return item;
  }

  async getMarsRoverImages(num) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        media_type: "image",
        q: "Mars Exploration Rover MER",
      },
    });
    const items = response.data.collection.items;
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  async getMarsCuriosityImages(num) {
    const response = await axios.get(
      `${this.BASE_URL}/mars-photos/api/v1/rovers/curiosity/photos`,
      {
        params: {
          sol: 1000,
          api_key: this.API_KEY,
        },
      }
    );

    const items = response.data.photos;
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  async SearchNasaImages(keyword, num) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        media_type: "image",
        q: keyword,
      },
    });
    const items = response.data.collection.items;
    return items.slice(0, num);
  }
}

module.exports = NasaAPI;
