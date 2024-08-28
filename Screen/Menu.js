import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {getMSPMenuDetails} from '../api/data/DataService';
import {addMenuDetails} from '../api/data/DataService';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('../assets/ProfileBack.jpg');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Menu = () => {
  const navigation = useNavigation();
  const [messDetails, setMessDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMenuDetails = async () => {
    try {
      const mspID = await AsyncStorage.getItem('mspID');
      const menuDetails = await getMSPMenuDetails(mspID);
      setMessDetails(menuDetails);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching menu details:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchMenuDetails();
    } catch (error) {
      console.error('Error refreshing menu details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMenuDetails();
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  const handleDelete = menu => {
    setMenuToDelete(menu);
    setModalVisible(true);
    setSuccessMessage(`Are you sure Do you want to delete ${menu.M_TITLE}?`);
  };

  const handleDeleteConfirmed = async () => {
    if (menuToDelete) {
      try {
        const menuData = {
          reqtype: 'd',
          menuID: menuToDelete.M_ID,
          menu: messDetails.map(item => ({
            menuDetailsID: item.MD_ID,
          })),
        };

        const response = await addMenuDetails(menuData);

        if (response && response.status === 'SUCCESS') {
          setSuccessMessage('Menu item deleted successfully');
          fetchMenuDetails();
        } else {
          setSuccessMessage('Failed to delete menu item');
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
      } finally {
        setModalVisible(false);
        setMenuToDelete(null);
      }
    }
  };

  const handleEdit = menu => {
    navigation.navigate('AddMenu', {
      menuID: menu.M_ID,
      selectedItem: menu,
      menuDetailsID: menu.MD_ID,
    });
    // console.log('MENu', menu);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#F59E0B']}
        />
      }>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigation.goBack}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="arrow-left"
              size={30}
              color="#F59E0B"
              style={{width: 32, height: 32, marginHorizontal: 10}}
            />
            {/* <Text style={{fontSize: 20, color: '#FACC15'}}>MENU</Text> */}
          </View>
        </TouchableOpacity>
        <ImageBackground
          source={backgroundImage}
          style={[styles.backgroundImage, styles.backgroundOverlay]}
          resizeMode="cover"></ImageBackground>
      </View>

      <View style={styles.menuTitleContainer}>
        <Text style={styles.text_Menu}>MENU</Text>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{successMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteConfirmed}>
                <Text style={styles.modalButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.menuContainer}>
        {messDetails.map((menu, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.itemContainer}>
              <View style={styles.menuItemContainer}>
                <View style={styles.menuItemTextContainer}>
                  <View style={styles.numberedItemContainer}>
                    <View style={styles.numberContainer}>
                      <Text style={styles.text_Number}>{index + 1}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.text_Item}>{menu.M_TITLE}</Text>
                      <Text style={styles.M_TYPE}>Type: {menu.M_TYPE}</Text>
                      <Text style={styles.M_TYPE}>{menu.M_CAT} </Text>
                    </View>
                  </View>

                  {/* <Text style={styles.text_Profile}>{menu.M_QNTY} Person</Text> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Text style={styles.text_Amount}>
                      ₹ {menu.M_PRICE} Rupees
                    </Text>
                    <View style={styles.menuItemIconContainer}>
                      {menu.M_STATUS === 1 ? (
                        <Icon
                          name="check"
                          size={24}
                          color="green"
                          style={styles.menuItemIcon}
                        />
                      ) : (
                        <Icon
                          name="close"
                          size={24}
                          color="red"
                          style={styles.menuItemIcon}
                        />
                      )}

                      <TouchableOpacity onPress={() => handleEdit(menu)}>
                        <Icon
                          name="pencil"
                          size={24}
                          color="blue"
                          style={{width: 32, height: 32, marginHorizontal: 10}}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(menu)}>
                        <Icon
                          name="delete"
                          size={24}
                          color="red"
                          style={{width: 32, height: 32, marginHorizontal: 10}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{marginBottom: 10}}>
                    <Text style={styles.text_Profile}>
                      Takeaway: {menu.M_TAKEAWAY_CHG}{' '}
                    </Text>
                  </View>

                  <View style={{width: responsiveWidth(85), borderTopWidth: 1}}>
                    <Text style={styles.text_description}>Description:-</Text>
                    <Text style={styles.text_description}>{menu.M_ITEMS}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    borderWidth: 2,
    borderColor: '#e1e1e1',
    padding: windowWidth * 0.03,
    marginBottom: windowHeight * 0.01,
    borderRadius: windowWidth * 0.03,
    backgroundColor: '#fff',
    elevation: 2,
    marginHorizontal: 10,
    marginTop: 15,
  },
  menuItemTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  menuItemIconContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  menuItemIcon: {
    width: 32,
    height: 32,
    marginHorizontal: 10,
  },
  menuTitleContainer: {
    borderBottomWidth: 0.2,
    marginTop: 15,
  },
  menuItemsContainer: {
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
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

  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },

  text_Edit_profile: {
    paddingLeft: responsiveWidth(3),
    fontSize: responsiveWidth(4),
    fontWeight: '900',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
  },
  text_Profile: {
    color: '#696969',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: responsiveWidth(8),
  },
  text_Amount: {
    color: '#1e90ff',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    paddingLeft: responsiveWidth(8),
  },
  text_Menu: {
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 10,
    textAlign: 'center',
  },
  text_Item: {
    paddingLeft: responsiveWidth(3),
    fontSize: responsiveWidth(4),
    fontWeight: '900',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
  },
  backgroundOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  text_description: {
    color: '#696969',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    paddingLeft: responsiveWidth(3),
  },
  numberedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberContainer: {
    backgroundColor: 'grey',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    // marginRight: 10,
  },
  text_Number: {
    fontWeight: 'bold',
    color: 'white',
  },
  text_Item: {
    paddingLeft: responsiveWidth(2),
    color: '#000',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    // paddingLeft: responsiveWidth(3),
  },
  M_TYPE: {
    color: '#fff',
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
    width: responsiveWidth(80), // Set the width as needed
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#404040',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align buttons to the right
    marginTop: 20, // Add some margin at the top of buttons
  },
  modalButton: {
    color: '#F59E0B', // Set the color for OK button
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20, // Add some space between buttons
  },
  modalCancelButton: {
    color: '#000', // Set the color for Cancel button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Menu;
