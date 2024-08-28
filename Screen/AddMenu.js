import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMenuItemList, addMenuDetails} from '../api/data/DataService';
import Dropdwon from '../Components/Dropdwon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import ModalDropdown from 'react-native-modal-dropdown';

const backgroundImage = require('../assets/ProfileBack.jpg');

const AddMenu = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState('');

  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [takeaway, setTakeAway] = useState('');
  const [selectedThali, setSelectedThali] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [isPlateSelected, setIsPlateSelected] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState();
  const [isContentVisible, setIsContentVisible] = useState(false);

  const [foodType, setFoodType] = useState('');
  const [showFoodTypeModal, setShowFoodTypeModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [menuStatus, setMenuStatus] = useState('');
  const [initialMenuDetails, setInitialMenuDetails] = useState([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [thaliSelectionTouched, setThaliSelectionTouched] = useState(false);

  const route = useRoute();
  const {menuID, menuDetailsID} = route.params || {};

  // console.log('menuID', menuID);
  // console.log('menuDetailsID', menuDetailsID);
  const selectedItem = route.params?.selectedItem || null;
  // console.log('selectItem', selectedItem);
  const isEditMode = selectedItem !== null;
  // console.log('editmode', isEditMode);

  const showSuccessModal = message => {
    setModalMessage(message);
    setSuccessModalVisible(true);
  };

  const showErrorModal = errorMessage => {
    setModalMessage(errorMessage);
    setErrorModalVisible(true);
  };

  const closeModal = () => {
    setSuccessModalVisible(false);
    setErrorModalVisible(false);

    if (successModalVisible) {
      navigation.navigate('BottomNavigate');
    }
  };

  const handleInitialSetup = () => {
    if (selectedThali && selectedThali !== '') {
      if (thaliSelectionTouched) {
        setShowDropdown(true);
      }
      setIsContentVisible(
        selectedThali === 'Full Thali' ||
          selectedThali === 'Half Thali' ||
          selectedThali === 'Add On',
      );
    }
  };

  useEffect(() => {
    handleInitialSetup();
  }, [selectedThali, thaliSelectionTouched]);

  const handleThaliSelection = thali => {
    setSelectedThali(thali);
    setShowDropdown(false);
    setIsContentVisible(
      thali === 'Full Thali' || thali === 'Half Thali' || thali === 'Add On',
    );
    // setIsPlateSelected(true);
  };

  const handleThaliSelection1 = thali => {
    // setSelectedThali(thali);
    setShowDropdown(false);
    // setIsContentVisible(
    //   thali === 'Full Thali' || thali === 'Half Thali' || thali === 'Add On',
    // );
    // setIsPlateSelected(true);
  };

  useEffect(() => {
    if (selectedThali) {
      setShowDropdown(true);
    }
  }, [selectedThali]);

  useEffect(() => {
    const fetchDataForDropdown = async () => {
      try {
        // console.log('Request Parameters:', {menuID, reqtype: 'g'});
        const response = await addMenuDetails({menuID, reqtype: 'g'});
        // console.log('API Response:', response);
        if (response && response.status === 'SUCCESS') {
          const data = response.message.map(item => {
            return {
              MI_ID: item.MD_ITMID,
              MI_MCID: item.MD_CATID,
              unit: item.MD_TAG,
              quantity: item.MD_QTY,
              MD_Detail: item.MD_ID,
            };
          });
          setSelectedMenuItems(data);
          setInitialMenuDetails(data);

          // console.log('data', data);
        } else {
          console.log('Failed to fetch menu items:', response);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    if (menuID) {
      fetchDataForDropdown();
    }
  }, [menuID]);

  useEffect(() => {
    if (isEditMode && selectedItem) {
      setSelectedThali(selectedItem.M_CAT || '');
      setThaliSelectionTouched(true);
      setMenu(selectedItem.M_TITLE || '');
      setPerson(selectedItem.M_QNTY || '');
      setAmount(selectedItem.M_PRICE || '');
      setTakeAway(selectedItem.M_TAKEAWAY_CHG || '');
      setFoodType(selectedItem.M_TYPE || '');
      setMenuStatus(selectedItem.M_STATUS === 1 ? 'Active' : 'Inactive');

      const thali = selectedItem.M_CAT;
      setIsContentVisible(
        thali === 'Full Thali' || thali === 'Half Thali' || thali === 'Add On',
      );
      setShowDropdown(true);
    }
  }, [isEditMode, selectedItem]);

  const handleFoodTypeSelection = value => {
    setFoodType(value);
    setShowFoodTypeModal(false);
  };

  useEffect(() => {
    fetchMenuItemsForMSP();
  }, []);

  const fetchMenuItemsForMSP = async () => {
    try {
      const mspID = await AsyncStorage.getItem('mspID');
      const response = await getMenuItemList(mspID);
      // console.log('response menu list ', response);

      if (response && response.status === 'SUCCESS') {
        // console.log('fetchMenuItemsForMSP Success:', response);
        setMenuItems(response.message);
      } else {
        console.error('fetchMenuItemsForMSP Error:', response);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleSave = async () => {
    try {
      selectedMenuItems.forEach(item => {
        if (!item.MI_ID || !item.MI_NAME || !item.quantity) {
          showErrorModal('Please Enter All the fields');
        }
      });
      
      const mspID = await AsyncStorage.getItem('mspID');
      let menuTag = 'plate';
  
      if (
        selectedThali === 'Full Thali' &&
        selectedMenuItems.some(item => item.MI_NAME === 'Roti')
      ) {
        menuTag = 'piece';
      }
  
      const quantity = 1;
  
      const menuData = {
        mspID: mspID,
        menuCatgeory: selectedThali,
        title: menu,
        reqtype: 's',
        type: foodType === 'Vegetarian' ? 'Vegetarian' : 'Non-Vegetarian',
        quantity: quantity,
        price: parseFloat(amount),
        takeaway: parseFloat(takeaway),
        status: isEnabled ? '1' : '0',
        menuID: menuID,
  
        menu: selectedMenuItems.map(item => ({
          menuCatID: item.MI_MCID,
          menuItemID: item.MI_ID ? item.MI_ID.toString() : '', // Check if MI_ID is defined
          menuQTY: parseInt(item.quantity),
          menuTag: item.MI_NAME === 'Roti' ? 'piece' : 'plate',
        })),
      };
  
      console.log('menuData', menuData);
      console.log('foodType after condition:', foodType);
  
      const response = await addMenuDetails(menuData);
      console.log('API Response:', response);
  
      if (response && response.status === 'SUCCESS') {
        showSuccessModal('Menu items added successfully');
      } else {
        showErrorModal('Failed to add menu items');
      }
    } catch (error) {
      console.error('Error saving menu details:', error);
      showErrorModal('An error occurred while saving menu details');
    }
  };
  

  const thaliOptions = ['Full Thali', 'Half Thali', 'Add On'];

  const toggleCheckbox = () => {
    const newMenuStatus = menuStatus === 'Active' ? 'Inactive' : 'Active';
    setMenuStatus(newMenuStatus);
    setIsEnabled(newMenuStatus === 'Active');
  };

  const handleUpdate = async () => {
    try {
      const mspID = await AsyncStorage.getItem('mspID');
      // console.log('mspiD', mspID);

      const quantity = 1;
      const menuData = {
        menuID: menuID,
        mspID: mspID,
        menuCatgeory: selectedThali,
        title: menu,
        reqtype: 'u',
        type: foodType === 'Vegetarian' ? 'Vegetarian' : 'Non-Vegetarian',
        quantity: quantity,
        price: parseFloat(amount),
        takeaway: parseFloat(takeaway),
        status: isEnabled ? '1' : '0',

        menu: selectedMenuItems.map((item, index) => ({
          menuDetailsID:
            initialMenuDetails[index]?.MD_Detail !== undefined
              ? initialMenuDetails[index].MD_Detail
              : '',
          menuCatID: item.MI_MCID,
          menuItemID: item.MI_ID.toString(),
          menuQTY: parseInt(item.quantity),
          menuTag: item.unit && item.unit.value ? item.unit.value : 'plate',
        })),
      };
      console.log('menuID update', menuID);
      console.log('menuData', menuData);

      const response = await addMenuDetails(menuData);
      console.log('API Response:', response);
      if (response && response.status === 'SUCCESS') {
        showSuccessModal('Menu items updated successfully');
      } else {
        showErrorModal('Failed to update menu items');
      }
    } catch (error) {
      console.error('Error updating menu items:', error);
      showErrorModal('Error updating menu items');
    }
  };

  const handleSaveOrUpdate = () => {
    if (selectedItem) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  // console.log('selectedMenuItems', selectedMenuItems);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigation.goBack}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="arrow-left"
              size={30}
              color="#F59E0B"
              style={{width: 32, height: 32, marginHorizontal: 10}}
            />
            {/* <Text style={{fontSize: 20, color: '#FACC15'}}>ADD MENU</Text> */}
          </View>
        </TouchableOpacity>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"></ImageBackground>
      </View>

      <View>
        <Text style={styles.contactTitle}>ADD MENU</Text>
      </View>

      <View style={{borderWidth: 4, borderColor: '#fff', marginHorizontal: 2}}>
        <Text style={styles.text_Edit_profile}>Add Thali</Text>
        <View style={styles.thaliDropdown}>
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <TextInput
              placeholder={'Select Thali'}
              placeholderTextColor={'#A3A3A3'}
              value={selectedThali}
              editable={false}
              style={styles.selectedThaliText}
            />
            <Icon
              name={showDropdown ? 'chevron-up' : 'chevron-down'}
              size={36}
              color="#000"
              style={{position: 'absolute', right: -9, top: 6}}
            />
          </TouchableOpacity>
          {showDropdown && !isPlateSelected && (
            <View style={styles.dropdownContent}>
              {thaliOptions.map((thali, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleThaliSelection(thali)}
                  style={styles.dropdownOption}>
                  <Text style={styles.text_Edit_profile}>{thali}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => handleThaliSelection1('')}
                style={[styles.dropdownOption, styles.cancelOption]}>
                <Text style={[styles.text_Edit_profile]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.text_Edit_profile}>Menu Title</Text>
        <View>
          <TextInput
            placeholder={'Menu Title'}
            value={menu}
            onChangeText={text => setMenu(text)}
            keyboardType="default"
            style={styles.input}
            placeholderTextColor="#404040"
          />
        </View>
        <Text style={styles.text_Edit_profile}>Food Type</Text>
        <ModalDropdown
          options={
            foodType === 'Non-Vegetarian'
              ? ['Non-Vegetarian', 'Vegetarian']
              : ['Vegetarian', 'Non-Vegetarian']
          }
          onSelect={(index, value) => handleFoodTypeSelection(value)}
          dropdownStyle={styles.dropdownContainer}
          dropdownTextStyle={styles.dropdownText}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={'Select Food Type'}
              value={foodType}
              editable={false}
              style={styles.input}
              placeholderTextColor="#404040"
            />
            <Icon
              name={showFoodTypeModal ? 'chevron-up' : 'chevron-down'}
              size={35}
              color="#000"
              style={{position: 'absolute', right: 15, top: 12}}
            />
          </View>
        </ModalDropdown>

        <Text style={styles.text_Edit_profile}>Amount</Text>
        <View>
          <TextInput
            placeholder={'Amount'}
            value={String(amount)}
            onChangeText={text => setAmount(text)}
            keyboardType="numeric"
            maxLength={10}
            style={styles.input}
            placeholderTextColor="#404040"
          />
        </View>
        <Text style={styles.text_Edit_profile}>Take-Away Charge</Text>
        <View>
          <TextInput
            placeholder={'Take-Away Charge'}
            value={String(takeaway)}
            onChangeText={text => setTakeAway(text)}
            keyboardType="numeric"
            maxLength={10}
            style={styles.input}
            placeholderTextColor="#404040"
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Text style={styles.text_Edit_profile}>Enable</Text>
          <TouchableOpacity onPress={toggleCheckbox}>
            <Icon
              name={
                menuStatus === 'Active'
                  ? 'checkbox-marked'
                  : 'checkbox-blank-outline'
              }
              size={25}
              color={menuStatus === 'Active' ? '#F59E0B' : '#000'}
              style={styles.checkboxIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {selectedThali && isContentVisible && (
        <View style={{borderWidth: 1, marginHorizontal: 10, marginTop: 15}}>
          <View>
            {selectedThali === 'Full Thali' && isContentVisible && (
              <>
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Rassa sabji', id: 1}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />

                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Sukhi sabji', id: 2}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Dal', id: 3}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Roti', id: 4}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Rice', id: 5}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
              </>
            )}

            {selectedThali === 'Half Thali' && isContentVisible && (
              <>
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Rassa sabji', id: 1}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Sukhi sabji', id: 2}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Dal', id: 3}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Roti', id: 4}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Rice', id: 5}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
              </>
            )}

            {selectedThali === 'Add On' && isContentVisible && (
              <>
                <Dropdwon
                  menuItems={menuItems}
                  item={{name: 'Sweet', id: 5}}
                  setSelectedMenuItems={setSelectedMenuItems}
                  selectedMenuItems={selectedMenuItems}
                  foodType={foodType}
                />
              </>
            )}

            <TouchableOpacity
              onPress={handleSaveOrUpdate}
              style={styles.saveButton}>
              <Text style={{color: '#fff'}}>
                {selectedItem ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.cancelText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{color: '#404040'}}>{modalMessage}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.cancelText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    // backgroundColor:'red'
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
  input: {
    marginVertical: responsiveHeight(1),
    height: responsiveHeight(6),
    width: responsiveWidth(90),
    borderBottomWidth: responsiveWidth(0.2),
    fontSize: responsiveWidth(3.5),
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#fff',
    color: 'black',
    marginLeft: 10,
  },
  text_Edit_profile: {
    paddingLeft: responsiveWidth(3),
    fontSize: responsiveWidth(4),
    fontWeight: '800',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
  },
  text_Edit: {
    paddingLeft: responsiveWidth(30),
    fontSize: responsiveWidth(4),
    fontWeight: '800',
    fontFamily: 'Roboto-Regular',
    color: '#404040',
    letterSpacing: responsiveWidth(0.1),
  },
  contactTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 10,
    textAlign: 'center',
  },
  thaliDropdown: {
    marginVertical: responsiveHeight(1),
    height: responsiveHeight(6),
    width: responsiveWidth(90),
    borderBottomWidth: responsiveWidth(0.2),
    fontSize: responsiveWidth(3.5),
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#fff',
    color: 'black',
    marginLeft: 10,
    zIndex: 1,
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 4,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  selectedThaliText: {
    color: '#000',
    width: responsiveWidth(90),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  enabledText: {
    marginRight: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#404040',
    marginLeft: 10,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginTop: 15,
    alignSelf: 'center',
    color: '#404040',
  },
  cancelText: {
    fontSize: 18,
    color: '#404040',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    padding: 10,
    margin: 10,
  },
  cancelOption: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    color: '#F59E0B',
  },
  cancelText: {
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: responsiveWidth(90),
    height: 90,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#404040',
    marginBottom: 15,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    marginTop: 15,
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default AddMenu;
