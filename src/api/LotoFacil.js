import axios from 'axios';

export default class LotoFacilApi {

  // https://loterias-api-gutotech.herokuapp.com/api/v0/lotofacil
  async getAllLotofacil() {

    return await axios.get('https://loterias-api-gutotech.herokuapp.com/api/v0/lotofacil');
  }

  // https://loterias-api-gutotech.herokuapp.com/api/v0/lotofacil/latest
  async getLatestLotofacil() {

    return await axios.get('https://loterias-api-gutotech.herokuapp.com/api/v0/lotofacil/latest');
  }
}

