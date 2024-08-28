/* eslint-disable prettier/prettier */
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';


const commonStyles = {
  titleStyles: {color: '#D97706', fontSize: responsiveFontSize(3)},
  subtitleStyles: {color: '#404040', fontSize: responsiveFontSize(2)},
  containerStyles: {backgroundColor: '#FEF3C7'},
  dotStyle: {backgroundColor: 'red'},
  bottomBarColor: '#F59E0B',
};
const onboardingPages = [
  {
    backgroundColor: '#fff',
    image: <Image source={require('../assets/onboarding_msp-1.png')} />,
    title: 'Add Mess',
    subtitle: 'Add your mess and configure its properties to get listed',
  },
  {
    backgroundColor: '#fff',
    image: <Image source={require('../assets/onboarding_msp-2.png')} />,
    title: 'Post Menu',
    subtitle: 'Post your menu daily so your guests know what is cooking today',
  },
  {
    backgroundColor: '#fff',
    image: (
      <Image
        source={require('../assets/onboarding_1.png')}
        resizeMode="contain"
        style={{height: responsiveHeight(40), width: responsiveWidth(100)}}
      />
    ),
    title: 'Manage Orders',
    subtitle:
      'Track your orders and other operational activities through mobile',
  },
];

const CustomBottom = ({pageIndex, totalPages, goToNext}) => {
  const isLastPage = pageIndex === totalPages - 1;

  return (
    <View style={styles.bottomBar}>
      {!isLastPage && (
        <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const OnboardScreen = ({navigation}) => {
  return (
    <Onboarding
      onSkip={() => navigation.navigate('Edit_Address')}
      onDone={() => navigation.navigate('Edit_Address')}
      pages={onboardingPages}
      bottomBarHighlight
      BottomBarComponent={props => <CustomBottom {...props} />}
      {...commonStyles}
    />
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: commonStyles.containerStyles.backgroundColor,
    padding: 10,
  },
  nextButton: {
    backgroundColor: '#7E22CE',
    padding: 12,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
  },
});

export default OnboardScreen;
