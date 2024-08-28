/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  getEnrolledPackages,
  manageMSPAddress,
  deleteAccount,
} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const User_Profile = props => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userResponse, setUserResponse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [address, setAddress] = useState({
    AD_LINE1: '',
    AD_LINE2: '',
    AD_CITY: '',
    AD_STATE: '',
    AD_PIN: '',
  });

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(true);

      await new Promise(resolve => {
        setUserResponse(resolve);
      });

      if (userResponse === 'yes') {
        await AsyncStorage.clear();

        const userID = await AsyncStorage.getItem('userID');
        console.log('Test Value after AsyncStorage clear:', userID);
      }

      // props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const fetchEnrolledPackages = async () => {
      try {
        const retrievedUserID = await AsyncStorage.getItem('userID');
        const userID = retrievedUserID;

        const packages = await getEnrolledPackages(userID);
        // console.log('Packages from API:', packages);

        if (packages && Object.keys(packages).length > 0) {
          const {FNAME, LNAME, MOBILE} = packages;

          setUserName(`${FNAME} ${LNAME}`);
          setNewMobile(MOBILE);
        }
      } catch (error) {
        console.error('Error fetching enrolled packages:', error);
      }
    };

    fetchEnrolledPackages();
  });

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
        // console.log('msgData', msgData);

        setAddress(msgData.length > 0 ? msgData[0] : {});
      } else {
        throw new Error('Failed to fetch consumer addresses');
      }
    } catch (err) {
      console.error('Error retrieving addresses', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    fetchData();
  };
  const handleDeleteAccount = async () => {
    try {
      // Retrieve userID from AsyncStorage
      const userID = await AsyncStorage.getItem('userID');
      const userid = userID;
  
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete your account?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              // User clicked Cancel, set status to active
              const status = 'active';
              // Call deleteAccount API with status 'active' followed by userID
              console.log('Deleting account with status: active');
              console.log('UserID:', userid);
              deleteAccount(userid, status)
                .catch(error => console.error('Error deleting account:', error));
            },
          },
          {
            text: 'OK',
            onPress: async () => {
              // User clicked OK, set status to inactive
              const status = 'inactive';
              // Call deleteAccount API with status 'inactive' followed by userID
              console.log('Deleting account with status: inactive');
              console.log('UserID:', userid);
              try {
                await deleteAccount(userid, status);
                // Navigate to Login screen
                navigation.navigate('Login'); // Assuming navigation prop is available
              } catch (error) {
                console.error('Error deleting account:', error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error retrieving userID:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <LinearGradient
          colors={[
            'rgba(199, 43, 9, 1)',
            'rgba(215, 93, 13, 1)',
            'rgba(250, 204, 21, 1)',
          ]}
          style={styles.header}
          start={{x: 1, y: 6}}
          end={{x: 3, y: 2}}>
          <Text style={styles.headerText}>Profile</Text>
          <Image
            style={styles.profileImage}
            source={require('../assets/avtar2.jpg')}
          />
        </LinearGradient>

        <Modal
          animationType="slide"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={() => setLogoutModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to logout?
              </Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setUserResponse('no');
                    setLogoutModalVisible(false);
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutButton]}
                  onPress={() => {
                    setUserResponse('yes');
                    setLogoutModalVisible(false);
                    props.navigation.navigate('Login');
                  }}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{userName || 'Guest'}</Text>
          <InfoRow
            icon="map-marker"
            text={
              `${address.AD_LINE1} ${address.AD_LINE2} ${address.AD_CITY} ${address.AD_STATE} ${address.AD_PIN}` ||
              'Loading...'
            }
          />
          <InfoRow icon="phone" text={newMobile || 'Loading...'} />
          <View style={styles.Profile_details_main}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Payment_history')}>
              <Text style={styles.Profile_details}>Invoices History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('AccSettings')}>
              <Text style={styles.Profile_details}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Bank_details')}>
              <Text style={styles.Profile_details}>Bank Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => props.navigation.navigate('Adress_screen')}>
              <Text style={styles.Profile_details}>Address screen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Edit_profile')}>
              <Text style={styles.Profile_details}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate('FAQs')}>
              <Text style={styles.Profile_details}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('AboutUs')}>
              <Text style={styles.Profile_details}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('CusSup')}>
              <Text style={styles.Profile_details}>Customer Support</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.Profile_details}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={styles.Profile_details}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({icon, text}) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={hp('2.5')} color="#D97706" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: wp('5'),
    fontWeight: '300',
    right: wp('38%'),
  },
  profileImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    borderColor: '#FACC15',
    position: 'relative',
    right: wp('37%'),
    backgroundColor: '#fff',
    borderWidth: 1,
    margin: hp(1),
    backgroundColor: '#F59E0B',
  },
  userInfo: {
    backgroundColor: 'white',
    flex: 2,
    paddingLeft: wp('2%'),
  },
  name: {
    left: wp('2%'),
    color: '#D97706',
    fontSize: hp('2.8'),
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    width: wp('80%'),
    marginLeft: wp('2%'),
    marginTop: hp('2%'),
    fontSize: hp('5'),
  },
  infoText: {
    fontSize: hp('2.2'),
    fontWeight: '400',
    marginLeft: wp('1%'),
    color: '#404040',
    lineHeight: hp('2.5%'),
    fontFamily: 'Roboto',
  },
  profileDetails: {
    marginTop: hp('1%'),
    justifyContent: 'space-evenly',
    height: hp('40%'),
    paddingLeft: wp('5%'),
  },
  detailText: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    fontSize: wp('4'),
    fontWeight: '400',
    lineHeight: hp('2.4%'),
    padding: wp('1%'),
    width: wp('90%'),
    color: '#404040',
  },
  Profile_details: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    padding: 5,
    width: wp('90%'),
    color: '#404040',
  },
  Profile_details_main: {
    marginTop: 20,
    justifyContent: 'space-evenly',
    height: hp('45%'),
    paddingLeft: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#404040',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#CCCCCC',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default User_Profile;
