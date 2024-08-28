import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import ModalSelector from 'react-native-modal-selector';

const CustomComponent = ({
  item,
  menuItems,
  setSelectedMenuItems,
  selectedMenuItems,
  foodType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [openUnitDropdown, setOpenUnitDropdown] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState('');
  const [newOption, setNewOption] = useState('');

  const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);

  const handleOpen = () => {
    setIsOpen(!isOpen);

    if (isOpen) {
    }
  };

  useEffect(() => {
    // console.log('foodType', foodType);
    // console.log('item', item);
    // console.log('menuItems', menuItems);
    // console.log('selectedMenuItems', selectedMenuItems);

    if (Array.isArray(selectedMenuItems)) {
      const value =
        selectedMenuItems.find(menu => menu.MI_MCID === item.id) || null;
      setSelectedDropdownValue(value);
      setSelectedUnit(value?.unit || '');
    }
  }, [selectedMenuItems, item.id]);

  // console.log("setselectmenuitems",setSelectedMenuItems)

  // console.log('selectedDropdownValue', selectedDropdownValue);
  useEffect(() => {
    if (menuItems?.length && item.id) {
      // console.log('foodType:', foodType);
      // console.log('item.id:', item.id);

      const filteredValues = menuItems.filter(value => {
        if ([3, 4, 5].includes(item.id)) {
          return value.MI_MCID === item.id;
        } else if (
          foodType === 'Non-Vegetarian' &&
          (item.id === 1 || item.id === 2)
        ) {
          return value.MI_MCID === item.id && value.MI_TYPE === 'Non-Veg';
        } else if (
          foodType === 'Vegetarian' &&
          (item.id === 1 || item.id === 2)
        ) {
          return value.MI_MCID === item.id && value.MI_TYPE !== 'Non-Veg';
        } else {
          return value.MI_MCID === item.id;
        }
      });

      // console.log('Filtered Values:', filteredValues);
      setOptions(filteredValues || []);
    }
  }, [menuItems, item.id, foodType]);

  useEffect(() => {
    if (currentValue) {
      setSelectedMenuItems(prev => {
        if (prev?.length) {
          const values = prev?.filter(
            item => item.MI_MCID !== currentValue.MI_MCID,
          );
          return [...values, currentValue];
        } else {
          return [currentValue];
        }
      });
    }
  }, [currentValue]);

  const handleUnitSelection = value => {
    const selectedLabel = value.value;
    // options.find(item => item.value === value)?.label || '';
    setSelectedUnit(selectedLabel);
    setCurrentValue(prev => ({...prev, unit: selectedLabel}));
    setOpenUnitDropdown(false);
  };

  const handleAddNewOption = () => {
    if (newOption.trim() !== '') {
      const newItem = {
        MI_ID: options.length + 1,
        MI_NAME: newOption.trim(),
      };
      setOptions(prevOptions => [...prevOptions, newItem]);
      setCurrentValue(newItem);
      setNewOption('');
      setIsOpen(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{item.name}</Text>
      <View style={styles.rowContainer}>
      <View style={[styles.dropdown, {zIndex: isOpen ? 10 : 1}]}>
          <DropDownPicker
            schema={{
              label: 'MI_NAME',
              value: 'MI_ID',
              type: 'MI_TYPE',
            }}
            items={options}
            open={isOpen}
            value={selectedDropdownValue?.MI_ID || ''}
            setOpen={handleOpen}
            searchable={true}
            placeholder={'Select ' + (item?.name?.toLowerCase() || 'option')}
            placeholderStyle={{color: 'grey', fontSize: 15}}
            placeholderTextColor={'#A3A3A3'}
            theme="LIGHT"
            listMode="SCROLLVIEW"
            autoScroll={false}
            maxHeight={200}
            onSelectItem={item => setCurrentValue(prev => ({...prev, ...item}))}
            style={{height: 50, width: 240}}
            scrollViewProps={{
              decelerationRate: 'fast',
            }}
            dropDownContainerStyle={{
              width: 240,
              maxHeight: 300,
            }}
          />

          {/* <TextInput
          style={styles.newOptionInput}
          placeholder="Add new option"
          placeholderTextColor={'black'}
          value={newOption}
          onChangeText={setNewOption}
          onSubmitEditing={handleAddNewOption}
        /> */}
        </View>

        <View style={styles.quantity}>
          <TextInput
            style={styles.textInput}
            placeholder="Qty"
            inputMode="numeric"
            editable={!!selectedDropdownValue?.MI_ID}
            placeholderTextColor={'#A3A3A3'}
            value={selectedDropdownValue?.quantity?.toString() || ''}
            // placeholderStyle={{color: 'black', fontSize: 15}}
            onChangeText={quantity =>
              setCurrentValue(prev => ({...prev, quantity}))
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    marginTop: 10,
    marginVertical: -5,
  },
  text: {
    color: '#404040',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    fontFamily: 'Roboto',
    letterSpacing: 0.25,
  },
  textInputContainer: {
    width: '28%',
  },
  textInput: {
    height: 40,
    width: 50,
    borderColor: 'gray',
    borderWidth: 1.2,
    borderRadius: 4,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: 'black',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dropdown: {
    height: 50,
    width: 240,
  },
  quantity: {
    width: '20%',
    marginLeft: 30,
  },
  unit: {
    width: '20%',
  },
  newOptionInput: {
    height: 40,
    width: 150,
    borderColor: 'gray',
    borderWidth: 1.2,
    borderRadius: 4,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: 'black',
  },
});

export default CustomComponent;
