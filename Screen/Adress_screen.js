import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {manageMSPAddress} from '../api/data/DataService';
import {useRoute} from '@react-navigation/native';
import {navigateToScreen} from '../utils/commonFunction';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MAX_ADDRESS_COUNT = 5;

const AddressScreen = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [addresses, setAddresses] = useState([]);
  const route = useRoute();

  const updateAddress = index => {
    const selectedAddress = addresses[index];

    navigateToScreen('Edit_Address', {addressDetails: selectedAddress});
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const retrievedUserID = await AsyncStorage.getItem('userID');
        const userID = retrievedUserID;

        const apiParams = {
          userID,
          reqtype: 'g',
          line1: 'plot-1,cidco',
          line2: 'House NO :2',
          city: 'Aurangabad',
          state: 'Maharashtra',
          pincode: '431001',
          isDefault: '1',
        };

        const response = await manageMSPAddress(apiParams);

        // console.log('API Response:', response);

        if (response && response.status === 'SUCCESS') {
          const msgData = response.message.msg;

          setAddresses(msgData);
        } else {
          throw new Error('Failed to fetch consumer addresses');
        }
      } catch (err) {
        console.error('Error retrieving addresses', err);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = index => {
    setSelectedAddressIndex(index);
    setModalVisible(true);
  };

  const deleteAddressHandler = async () => {
    if (selectedAddressIndex !== -1) {
      try {
        const selectedAddress = addresses[selectedAddressIndex];
        const addressID = selectedAddress.AD_ID;

        const retrievedUserID = await AsyncStorage.getItem('userID');
        const userID = retrievedUserID;
        const apiParams = {
          userID: userID,
          reqtype: 'd',
          addID: addressID,
        };

        const response = await manageMSPAddress(apiParams);

        if (response && response.status === 'SUCCESS') {
          setAddresses(prevAddresses =>
            prevAddresses.filter((_, i) => i !== selectedAddressIndex),
          );

          setModalVisible(false);
        } else {
          throw new Error('Failed to delete the address');
        }
      } catch (err) {
        console.error('Error deleting address:', err);
      }
    }
  };

  const addNewAddress = async () => {
    if (addresses.length < MAX_ADDRESS_COUNT) {
      props.navigation.navigate('Edit_Address', {addressDetails: ''});
      // console.log(addressDetails);
    } else {
      Alert.alert(
        'Limit Exceeded',
        `You can have a maximum of ${MAX_ADDRESS_COUNT} addresses.`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={30}
            color="#F59E0B"
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Addresses</Text>
      </View>
      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.addressItem}>
            <Icon
              name="home"
              size={20}
              color="#F59E0B"
              style={styles.homeIcon}
            />
            <Text
              style={
                item.isDefault ? styles.boldAddressText : styles.addressText
              }>
              {item?.AD_LINE1} {item?.AD_LINE2}, {item?.AD_CITY} ,{item?.AD_STATE} ,{item?.AD_PIN}{' '}
              
            </Text>
            <TouchableOpacity onPress={() => toggleMenu(index)}>
              <Image
                source={require('../assets/threedots.jpg')}
                style={styles.threeDotsIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No addresses found</Text>
        )}
      />

      {addresses.length === 0 ? (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Edit_Address')}
          style={styles.updateButtons}>
          <Text style={styles.updateButtonText}>ADD New Address</Text>
        </TouchableOpacity>
      ) : null}

      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Delete this address?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateAddress(selectedAddressIndex)}>
                <Text style={styles.updateButton}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#F59E0B',
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '400',
    color: '#F59E0B',
    marginLeft: 10,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F59E0B',
    padding: 15,
    justifyContent: 'space-between',
  },
  homeIcon: {
    width: 20,
    height: 20,
  },
  threeDotsIcon: {
    width: 20,
    height: 20,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#404040',
    marginLeft: 10,
  },
  addButtonContainer: {
    backgroundColor: '#F59E0B',
    padding: 15,
    alignItems: 'center',
  },
  addButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#404040',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    color: 'red',
    fontSize: 16,
    fontWeight: '400',
  },
  cancelButton: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '400',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#F59E0B',
  },
  boldAddress: {
    fontWeight: 'bold',
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#404040',
    marginLeft: 10,
  },

  boldAddressText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#404040',
    marginLeft: 10,
  },
  updateButton: {
    color: 'green',
    fontSize: 16,
    fontWeight: '400',
  },
  updateButtons: {
    backgroundColor: '#F59E0B',
    paddingVertical: hp('2%'),
    marginTop: hp('13.5%'),
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default AddressScreen;
