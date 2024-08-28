/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import {getMenuItemList} from '../api/data/DataService';

import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  responsiveWidth as wp,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getEnrolledPackages} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMspStatus, addFCMToken} from '../api/data/DataService';
import DeviceInfo from 'react-native-device-info';

const Dashboard = props => {
  const [isVisible, setIsVisible] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [mspApproved, setMspApproved] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [messName, setMSPName] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleStatus = () => {
    if (!isOpen) {
      setModalVisible(true);
    } else {
      setIsOpen(!isOpen);
      fetchMESSStatus();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsOpen(true);
    fetchMESSStatus();
  };

  useEffect(() => {
    fetchMspStatus(), fetchEnrolledPackages(), sendFCMToken();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchEnrolledPackages();
    fetchMspStatus();
    setRefreshing(false);
  }, []);

  const fetchMspStatus = async () => {
    let mspID;
    try {
      const retrievedUserID = await AsyncStorage.getItem('userID');

      if (!retrievedUserID) {
        console.error('Failed to retrieve userID from AsyncStorage');
        return;
      }

      const userID = retrievedUserID;
      // console.log('userID =', userID);

      const type = 1;
      // console.log('type =', type);

      // console.log('API Request:', {userID, type});
      const response = await getMspStatus(userID, type);
      // console.log('API Response:', response);

      if (response && response.status === 'SUCCESS') {
        const mspID = response.message[0]?.MSP_ID;
        // console.log('mspID', mspID);

        const messName = response.message[0]?.MSP_NAME;
        // console.log('messName', messName);

        const mspApprovalStatus = response.message[0]?.MSP_APPROVED;
        // console.log('MSPApproval status', mspApprovalStatus);

        if (mspID !== undefined) {
          // console.log('mspID =', mspID);
          await AsyncStorage.setItem('mspID', mspID.toString());
        } else {
          console.warn('MSP_ID is not defined in the API response');
        }

        if (messName !== undefined) {
          // console.log('messName =', messName);
          await AsyncStorage.setItem('messName', messName);
          setMSPName(messName);
        } else {
          console.warn('MESS_NAME is not defined in the API response');
        }

        if (mspApprovalStatus !== undefined) {
          // console.log('Setting mspApproved:', mspApprovalStatus);
          setMspApproved(mspApprovalStatus);
        } else {
          console.warn('MSP_APPROVED is not defined in the API response');
        }
      } else {
        console.error('Failed to fetch MSP status:', response);
        throw new Error('API request failed');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching MSP status:', error);

      if (
        !mspID ||
        (error.message &&
          error.message.includes('No MSPs found for given user id'))
      ) {
        console.error('No MSPs found for the given user id');
        // Alert.alert(
        //   'No MSPs Found',
        //   'Please add an MSP and fill the account settings.',
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => {
        //         props.navigation.navigate('AccSettings');
        //       },
        //     },
        //   ],
        //   {cancelable: false},
        // );
      } else {
        console.error('Unexpected error:', error);
      }

      setLoading(false);
    }
  };

  const fetchMESSStatus = async () => {
    try {
      const mspID = await AsyncStorage.getItem('mspID');
      const retrievedUserID = await AsyncStorage.getItem('userID');

      if (!mspID) {
        console.error('Failed to retrieve mspID from AsyncStorage');
        return;
      }

      const type = 2;
      const status = isOpen;

      // console.log('API Request Parameters:', {
      //   retrievedUserID,
      //   mspID,
      //   type,
      //   status,
      // });

      const response = await getMspStatus(retrievedUserID, type, mspID, status);

      // console.log('API Response:', response);
    } catch (error) {
      console.error('Error fetching MESS status:', error);
    }
  };

  const sendFCMToken = async () => {
    try {
      const [storedToken, retrievedUserID] = await AsyncStorage.multiGet([
        'fcmToken',
        'userID',
      ]);

      let deviceId = await AsyncStorage.getItem('deviceId');
      let deviceIdObject = await DeviceInfo.getUniqueId();

      if (deviceIdObject) {
        deviceId = deviceIdObject;

        await AsyncStorage.setItem('deviceId', deviceId);
      } else {
        console.warn(
          'DeviceInfo.getUniqueId() returned null. Unable to obtain a valid device ID.',
        );
      }

      // console.log('DeviceInfo.getUniqueId() result:', deviceIdObject);
      // console.log('Retrieved device ID directly:', deviceId);
      // console.log('Retrieved FCM token from AsyncStorage:', storedToken);
      // console.log('Retrieved userID from AsyncStorage:', retrievedUserID);

      if (storedToken && deviceId && retrievedUserID) {
        const [token, userID] = [storedToken[1], retrievedUserID[1]];
        // console.log(
        //   'Sending FCM Token for User ID:',
        //   userID,
        //   'Token:',
        //   token,
        //   'Device ID:',
        //   deviceId,
        // );

        const addFCMTokenResponse = await addFCMToken(userID, token, deviceId);

        // console.log('API Response:', addFCMTokenResponse);

        if (
          addFCMTokenResponse &&
          addFCMTokenResponse.status === 200 &&
          addFCMTokenResponse.data.status === 'SUCCESS'
        ) {
          // console.log('FCM Token added successfully');
        } else {
          console.log('FCM Token addition failed:', addFCMTokenResponse.status);
        }
      } else {
        console.error(
          'Failed to retrieve necessary data for sending FCM token',
        );
      }
    } catch (error) {
      console.error('Error sending FCM Token:', error);
    }
  };

  const fetchEnrolledPackages = async () => {
    try {
      const retrievedUserID = await AsyncStorage.getItem('userID');
      const userID = retrievedUserID;
      // console.log('User ID:', userID);

      const packages = await getEnrolledPackages(userID);
      // console.log('Packages from API:', packages);

      if (packages.FNAME) {
        setUserName(packages.FNAME);
      }
    } catch (error) {
      console.error('Error fetching enrolled packages:', error);
    }
  };

  // const fetchMenuItemsForMSP = async () => {
  //   const storedMSPID = await AsyncStorage.getItem('mspID');
  //   // console.log('storedMSPID', storedMSPID);

  //   const mspID = parseInt(storedMSPID, 10);

  //   try {
  //     const response = await getMenuItemList(mspID);
  //     if (response && response.status === 'SUCCESS') {
  //       // console.log('fetchMenuItemsForMSP', response);
  //       setMenuItems(response.message);
  //     } else {
  //       console.log('Error', 'Failed to fetch menu items. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching menu items:', error);
  //     console.log('Error', 'Failed to fetch menu items. Please try again.');
  //   }
  // };

  const toggleVisibility = () => {
    setIsVisible(prevVisible => !prevVisible);
  };

  const backgroundImage = require('../assets/dashback.jpg');

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#F59E0B']}
        />
      }>
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.userInfo}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Profile_Scrren')}>
              <Text style={styles.greetingText}>Hi {userName || 'Guest'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bellIcon}
              onPress={() => props.navigation.navigate('Notification')}>
              <Icon name="bell-o" size={hp(3)} color="#7E22CE" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F59E0B" />
      ) : isVisible && mspApproved !== 1 ? (
        <View style={styles.content}>
          <Text style={styles.headerText}>
            Your application is under process
          </Text>
          <Image
            style={styles.processImage}
            source={require('../assets/process.png')}
            resizeMode="contain"
          />
          <Text style={styles.infoText}>
            Our representatives will get back to you within 3 business days
          </Text>
        </View>
      ) : (
        mspApproved == 1 && (
          <View>
            <View
              style={{
                backgroundColor: '#F2F2F2',
                padding: 15,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#D97706',
                top: 20,
              }}>
              <Icon name="building" size={24} color={'#D97706'} />
              <Text
                style={{
                  fontSize: 25,
                  color: '#D97706',
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                {messName}
              </Text>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Are you sure?</Text>
                  <Text style={styles.modalText}>
                    Do you want to close the MESS?
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={styles.modalButtonCancel}
                      onPress={() => setModalVisible(false)}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButtonYes}
                      onPress={closeModal}>
                      <Text style={styles.buttonText}>YES</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => props.navigation.navigate('AddMenu')}>
                <Text style={styles.menutext}>ADD MENU</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => props.navigation.navigate('Menu')}>
                <Text style={styles.menutext}>MENU</Text>
              </TouchableOpacity>

              <View style={[styles.menuItem, styles.messStatus]}>
                <Text style={styles.menutext}>MESS STATUS: </Text>
                <TouchableOpacity
                  onPress={toggleStatus}
                  style={isOpen ? styles.openButton : styles.closedButton}>
                  <Text style={styles.buttonText}>
                    {isOpen ? 'CLOSED' : 'OPEN'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  container: {
    backgroundColor: '#fff',
    height: hp(25),
    borderRadius: hp(2.5),
  },
  linearGradient: {
    height: hp(26.5),
    flexDirection: 'row',
    borderRadius: hp(2.5),
    bottom: hp(1.5),
  },
  userInfo: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginBottom: 120,
    marginHorizontal: 15,
  },
  tinyLogo: {
    width: wp(18),
    height: wp(20),
    borderRadius: wp(10),
    borderColor: '#FACC15',
    backgroundColor: '#FACC15',
    borderWidth: 1,
  },
  greetingText: {
    color: '#a52a2a',
    fontSize: rf(3),
    fontWeight: '900',
    // right: 25,
    // bottom: 30,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#404040',
    marginTop: 10,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    marginRight: 5,
  },
  arrowIcon: {
    color: 'blue',
  },
  boxContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  box: {
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
  },
  boxHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxContent: {
    fontSize: 20,
    marginTop: 5,
  },
  background: {
    height: hp('25%'),
  },
  rectangle: {
    height: heightPercentageToDP('8%'),
    borderRadius: widthPercentageToDP('5%'),
    borderTopLeftRadius: widthPercentageToDP('5%'),
    borderTopRightRadius: widthPercentageToDP('5%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#7E22CE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP('2%'),
    marginTop: 20,
    flexDirection: 'row',
  },
  fullThaliText: {
    paddingHorizontal: widthPercentageToDP('2%'),
    fontSize: heightPercentageToDP('2.8%'),
    color: 'white',
  },
  text: {
    color: 'black',
    flex: 1,
    paddingHorizontal: widthPercentageToDP('2%'),
    fontSize: heightPercentageToDP('2.8%'),
  },
  icon: {
    marginHorizontal: widthPercentageToDP('2%'),
    marginTop: 10,
  },
  selectedMI: {
    fontSize: heightPercentageToDP('3%'),
    color: 'black',
    flex: 1,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#7E22CE',
    padding: 10,
    margin: 10,
  },
  text_Edit_profile_name: {
    fontSize: responsiveWidth(4),
    fontWeight: '400',
    letterSpacing: responsiveWidth(0.2),
    fontStyle: 'normal',
    paddingLeft: responsiveWidth(3),
    color: '#404040',
  },
  text_Edit_profile: {
    paddingLeft: responsiveWidth(4),
    fontSize: responsiveWidth(4),
    fontWeight: '500',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
    marginTop: 10,
  },
  text_Edit: {
    paddingLeft: responsiveWidth(3),
    fontSize: responsiveWidth(4),
    fontWeight: '500',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
    marginHorizontal: 5,
  },
  input: {
    marginVertical: responsiveHeight(2),
    height: responsiveHeight(5),
    width: responsiveWidth(30),
    borderWidth: responsiveWidth(0.4),
    fontSize: responsiveWidth(3.5),
    borderRadius: responsiveWidth(2),
    backgroundColor: '#fff',
    color: 'black',
    marginLeft: 10,
    flexDirection: 'row',
    marginHorizontal: responsiveHeight(2),
    borderColor: '#404040',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 2,
    marginTop: 10,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  content: {
    height: hp(75),
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: 30,
  },
  headerText: {
    color: '#D97706',
    fontSize: rf(4),
    fontWeight: '400',
    width: wp(60),
    textAlign: 'center',
  },
  processImage: {
    height: hp(25),
  },
  infoText: {
    color: '#404040',
    fontSize: rf(2),
    fontWeight: '400',
    width: wp(60),
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
    width: '100%',
    height: '130%',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 25,
    color: '#404040',
    marginTop: 10,
    marginLeft: 5,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  menu: {
    alignItems: 'center',
    marginTop: 80,
  },
  menuItem: {
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#F59E0B',
  },
  menutext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 12,
  },
  messStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 35,
  },
  openButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'darkred',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closedButton: {
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: 'darkred',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#404040',
  },
  modalButtonCancel: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 15,
  },
  modalButtonYes: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Dashboard;
