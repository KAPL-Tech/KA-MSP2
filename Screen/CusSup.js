/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable keyword-spacing */
import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity,Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const CusSup = () => {
  const navigation = useNavigation();

  const handlePhonePress = () => {
    Linking.openURL('tel:+919607994777');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:Abhilashgoje@khanaanywhere.com');
  };

  const handleAddressPress = () => {
    Linking.openURL(
      'https://www.google.com/maps?q=Shop,+no+8,9+Bilvakunj+Apt,+Nageswarwadi,+Chhatrpati+SambhjiNagar+431001',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon
            name="arrow-left"
            size={30}
            color="#F59E0B"
            style={{marginHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Customer Support</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/ProfileBack.jpg')}
          style={styles.image}
        />
      </View>

      <View style={styles.contactDetails}>
        <Text style={styles.contactTitle}>Contact Us</Text>
        <Text style={styles.contactTitle}>khana Anywhere Pvt.Ltd</Text>
        <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
          <Icon name="phone" size={24} color="#F59E0B" />
          <Text style={styles.contactText}>+91 9607994777</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={handleAddressPress}>
          <Icon name="map-marker" size={24} color="#F59E0B" />
          <Text style={styles.contactText}>
            Shop, no 8,9 Bilvakunj Apt, Nageswarwadi, Chhatrpati SambhjiNagar
            431001
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
          <Icon name="email" size={24} color="#F59E0B" />
          <Text style={styles.contactText}>Abhilashgoje@khanaanywhere.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
          <Icon name="email" size={24} color="#F59E0B" />
          <Text style={styles.contactText}>jeevathul@khanaanywhere.com</Text>
        </TouchableOpacity>
      </View>
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
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 22,
    fontWeight: '300',
    color: '#404040',
    marginLeft: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '90%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contactDetails: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
  },
  contactText: {
    marginLeft: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#404040',
  },
  contactTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CusSup;
