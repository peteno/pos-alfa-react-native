import React, { Component } from 'react';
import {
    Modal,
    View,
    ScrollView,
    Text,
    Button,
    Geolocation,
    TextInput,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';
import MapView from 'react-native-maps';
import Place from './../services/Place';
import styles from '../styles/style';



const place = new Place();

class Principal extends Component {

    state = {
        buscando: false,
        locais: null,
        exibirModal: false,
        itemModal: null,
        busca: null,
        mapRegion: {},
        cordinate: {}
    };
    
    openModal = (item) => {
        this.setState({
            exibirModal: true,
            itemModal: item,
            mapRegion: { 
                latitude: item.geometry.location.lat, 
                longitude: item.geometry.location.lng, 
                latitudeDelta: 0.002, 
                longitudeDelta: 0.0001,
                inputValue: item.name
            },
            cordinate: {
                latitude: item.geometry.location.lat, 
                longitude: item.geometry.location.lng
            }
        });
    };
    
    searchInput = () => {
        return (
          <View>
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Text>Informe o nome do local que deseja encontrar.</Text>
            </View>
            <View style={{ flexDirection:'row', paddingLeft: 10, paddingRight: 10 }}>
                <View style={{flex:4}}>
                    <TextInput
                        style={{alignItems:'center',justifyContent:'center',backgroundColor:'white'}}
                        value = {this.state.busca}
                        autoFocus={true} 
                        onChangeText = {this.onChangebusca}
                        placeholder = 'Digite algo...'
                        keyboardType = 'web-search'
                        onSubmitEditing = { this.buscar }
                        ref = 'searchBar'
                    />
                </View>
                <View style={{flex:1}}>
                    <Button title="BUSCAR" onPress={ this.buscar } />
                </View>
            </View>
          </View>
        );
    }

    mountModal = () => {
        if (!this.state.itemModal) {
            return (<View></View>);
        }
        return (
            <Modal
                visible={this.state.exibirModal}
                transparent={true}
                onRequestClose={() => this.setState({ exibirModal: false })}>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Text style={{ fontSize: 24, padding: 10, textAlign: 'center' }}>
                        {this.state.itemModal.name}
                    </Text>
                    {this.mountPhotoForItem(this.state.itemModal, 500, styles.bigimage, styles.localStretch)}
                    <Text style={{ marginTop: 15, marginBottom: 15, textAlign: 'center' }}>
                        {this.state.itemModal.formatted_address}
                    </Text>
                    <MapView
                        style={styles.bigimage}
                        region={this.state.mapRegion}
                        >
                        <MapView.Marker
                            coordinate={ this.state.cordinate }
                            title={this.state.itemModal.name}
                            description={this.state.itemModal.formatted_address}
                        />
                    </MapView>
                    <Button title="Fechar" onPress={() => this.setState({ exibirModal: false })} />
                </View>
            </Modal>
        );
    }
    
    buscar = () => {
        let locais = null;
        this.setState({ buscando: true });
        place.buscar(this.state.busca).then((results) => {
            locais = results;
        }).finally(() => {
            this.setState({
                locais,
                buscando: false
            });
        });
    };
    
    onChangebusca = (busca) => {
        this.setState({ busca });
    };

    mountPhotoForItem = (item, maxSize, styleView, styleImage) => {
        if (!item.photos || item.photos.length === 0) {
            return (
                <View></View>
            );
        }
        URL = Place.BASE_URL + 'photo?maxwidth='+(maxSize || 100)+'&photoreference=' + item.photos[0].photo_reference + '&key=' + Place.GOOGLE_KEY;
        return (
            <View 
                visible={URL !== null}
                style={styleView} >
                {item.photos ? <Image style={styleImage} source={{ uri: URL }} /> : null}
            </View>
        );
    };
    
    result = () => {
        if (this.state.buscando) {
            return (
                <ActivityIndicator />
            );
        }
    
        let content;
        if (this.state.locais) {
            content = this.state.locais.map((item, index) => {
                return (
                    <View key={index} style={styles.flexible}>
                        <TouchableOpacity style={styles.itens} onPress={() => this.openModal(item)}>
                            {this.mountPhotoForItem(item, 100, styles.picture, styles.local)}
                            <View style={{ flex: 1 }}>
                                <Text>{item.name}</Text>
                                <Text>{item.formatted_address}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            });
        }
    
        return (
            <View>{content}</View>
        )
    }

    render() {
        const { latitude, longitude, exibirModal } = this.state;

            return (
                <View>
                    {this.mountModal()}
                    {this.searchInput()}
                    <ScrollView automaticallyAdjustContentInsets={false}>
                        {this.result()}
                    </ScrollView>
                </View>
            );
    }
}

export default Principal;