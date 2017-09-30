

import axios from 'axios';
import {GOOGLE_KEY} from './../config/config.json';
import {checkPermission} from 'react-native-android-permissions';

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
                            + '&key=' + GOOGLE_KEY
                            + '&language=pt-BR';
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
                console.log(position);
                this.state.latitude = position.coords.latitude;
                this.state.longitude = position.coords.longitude;
                resolve(this.state);
            }, (error) => {
                console.log(error);
                checkPermission("android.permission.ACCESS_FINE_LOCATION").then((result) => {
                    console.log(result);
                    this.state.latitude = result.coords.latitude;
                    this.state.longitude = result.coords.longitude;
                    resolve(this.state);
                }, (result) => {
                    console.log(result);
                    alert('Ocorreu um erro interno ao capturar localização atual. Contate o fornecedor de software.');
                    reject(error);
                });
                
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 });
        });
    };
}

export default Place;