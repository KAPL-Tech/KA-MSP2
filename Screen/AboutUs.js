import React, {useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Aboutus = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Icon
              name="arrow-left"
              size={30}
              color="#F59E0B"
              style={{marginHorizontal: 10}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/backmess.jpg')}
            style={styles.image}
          />
        </View>

        <View style={styles.contactDetails}>
          <Text style={styles.contactTitle}>
            ABOUT US
          </Text>
          <Text style={styles.contactText}>
            <Text style={{color: '#404040', fontWeight: 'bold'}}>
              Khana Anywhere Pvt Ltd
            </Text>{' '}
            is a revolutionary platform that plays a pivotal role in empowering
            entrepreneurs and small businesses engaged in the
            Mess/Bhojnalay/Mini Restaurants/Daily Meals Provider sector.
            Recognizing the challenges faced by such businesses, Khana Anywhere
            steps in as a comprehensive solution, offering a full-stack
            technology suite designed to boost earnings and streamline
            operations.
          </Text>
          <Text style={styles.contactText}>
            <Text style={{color: '#404040', fontWeight: 'bold'}}>
              Product Description : 
            </Text>{' '}
            At the heart of Khana Anywhere's mission is the commitment to
            making affordable and trustworthy meals readily accessible to
            everyone. The platform distinguishes itself through a unique
            business model that seeks to transform fragmented, unbranded, and
            underutilized hospitality assets into digitally-enabled, branded
            storefronts. This transformation not only enhances the visibility
            and credibility of these businesses but also unlocks their potential
            for higher revenue generation.
          </Text>
          <Text style={styles.contactText}>
            {/* <Text style={{ color: '#404040', fontWeight: 'bold' }}>
              Interesting Project
            </Text>{' '} */}
            One of the standout features of Khana Anywhere is its commitment to
            providing customers with access to a diverse range of high-quality
            storefronts at compelling price points. By curating a selection of
            trustworthy options, the platform ensures that users can instantly
            find meals that suit their preferences and dietary requirements.
            Khana Anywhere's impact extends beyond the realm of commerce. The
            platform envisions contributing to upward social and economic
            mobility for millions of households associated with its Mess
            partners. By elevating these small businesses and creating
            opportunities for increased revenue, Khana Anywhere becomes a
            catalyst for positive change in the communities it serves. In
            essence, Khana Anywhere Pvt Ltd stands as a beacon of innovation,
            leveraging technology to transform traditional food service
            businesses into modern, digitally-enabled entities. Through its
            unique approach, the platform not only benefits entrepreneurs and
            small businesses but also addresses the needs of consumers,
            providing them with a convenient and diverse array of meal options.
            The company's commitment to social and economic progress further
            underscores its role as a positive force in the ever-evolving
            landscape of the food service industry.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  contactTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 10,
    textAlign: 'center',
    // backgroundColor:'red'
    marginTop: 20,
  },
  contactText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#404040',
    marginBottom: 10,
    lineHeight: 24,
  },
  languageToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    // marginBottom:30
    marginTop: 195,
  },
  languageToggleText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Aboutus;
