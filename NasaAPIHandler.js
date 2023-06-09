const axios = require("axios");
const moment = require("moment");

class NasaAPI {
  constructor() {
    // from Nasa Website
    this.BASE_URL = "https://api.nasa.gov";
    this.BASE_URL_IMG = "https://images-api.nasa.gov";
    this.API_KEY = process.env.NASA_API_KEY;
  }
  async getPictureOfTheDay() {
    try {
      const response = await axios.get(`${this.BASE_URL}/planetary/apod`, {
        params: {
          api_key: this.API_KEY,
        },
      });
      return response.data;
    } catch (err) {
      return {
        url: "https://api.nasa.gov/assets/img/favicons/favicon-192.png",
      };
    }
  }

  async getRangeOfPicturesOfTheDay() {
    try {
      let startdate = moment();
      startdate = startdate.subtract(15, "days");
      startdate = startdate.format("YYYY-MM-DD");

      let enddate = moment();
      enddate = enddate.format("YYYY-MM-DD");

      const response = await axios.get(`${this.BASE_URL}/planetary/apod`, {
        params: {
          api_key: this.API_KEY,
          start_date: startdate.toString(),
          end_date: enddate.toString(),
        },
      });
      return response.data.reverse();
    } catch (err) {
      return [
        {
          url: "https://api.nasa.gov/assets/img/favicons/favicon-192.png",
        },
      ];
    }
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
    const items = await this.getDetailsForNasaId(id);
    return items[0];
  }

  async getMarsCuriosityImages(num) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        media_type: "image",
        q: "Curiosity",
      },
    });

    const items = response.data.collection.items;
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  async searchNasaImages(keyword, num) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        media_type: "image",
        q: keyword,
      },
    });
    const items = response.data.collection.items;
    return items.slice(0, num);
  }

  //try to get find nasa id and show its picture, by using the mongodb id from favorites
  async getDetailsForNasaId(id) {
    const response = await axios.get(`${this.BASE_URL_IMG}/search`, {
      params: {
        nasa_id: id,
      },
    });
    const items = response.data.collection.items;
    return items;
  }
}

module.exports = NasaAPI;
