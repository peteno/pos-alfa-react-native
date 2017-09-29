

import axios from 'axios';
import {GOOGLE_KEY} from './../config/config.json';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/';

class Place {

    static get BASE_URL () { return BASE_URL; };
    static get GOOGLE_KEY () { return GOOGLE_KEY; };
    state = {
        latitude: null,
        longitude: null
    };

    buscar = (textoBusca) => {
        let error = (error) => {
            console.log(error);
            alert('Ocorreu um erro ao buscar os locais. Contate o fornecedor do software.');
        };
        return new Promise((resolve, reject) => {
            this.searchLocalPosition().then(function (state) {
                let URL = BASE_URL 
                            + 'textsearch/json?query=' + textoBusca 
                            + '&location=' + state.latitude + ',' + state.longitude 
                            + '&key=' + GOOGLE_KEY;
                axios.get(URL).then((response) => {
                    resolve(response.data.results);
                }).catch(error);
            });
        }).catch(error);
    }

    searchLocalPosition = () => {
        return new Promise((resolve, reject) => {
            if (this.state.latitude !== null && this.state.longitude !== null) {
                resolve(this.state);
                return;
            }
            navigator.geolocation.getCurrentPosition((position) => {
                this.state.latitude = position.coords.latitude;
                this.state.longitude = position.coords.longitude;
                resolve(this.state);
            }, (error) => {
                console.log(error);
                alert('Ocorreu um erro interno ao capturar localização atual. Contate o fornecedor de software.');
                reject(error);
            }, { enableHighAccuracy: true });
        });
    };
}

export default Place;