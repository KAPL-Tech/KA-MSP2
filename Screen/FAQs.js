import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getFAQs} from '../api/data/DataService';

const FAQs = props => {
  const [faqData, setFaqData] = useState([]);
  const [isClicked, setIsClicked] = useState(Array(faqData.length).fill(false));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getFAQs();

      if (
        response &&
        response.status === 'SUCCESS' &&
        Array.isArray(response.message)
      ) {
        setFaqData(response.message);
      } else {
        console.error('FAQ data is not in the expected format');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      setIsLoading(false);
    }
  };

  const toggleFAQ = index => {
    const updatedState = Array(faqData.length).fill(false);
    updatedState[index] = !isClicked[index];
    setIsClicked(updatedState);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={30}
            color="#F59E0B"
            style={styles.icon}
          />
        </TouchableOpacity>

        <Text style={styles.header}>FAQs</Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : faqData.length > 0 ? (
          faqData.map((item, index) => (
            <View style={styles.faqItem} key={index}>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => toggleFAQ(index)}>
                <Text style={styles.question}>{item.F_QUESTION}</Text>
                <Image
                  source={
                    isClicked[index]
                      ? require('../assets/uparrrow.jpg')
                      : require('../assets/dropdown.jpg')
                  }
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
              {isClicked[index] && (
                <View style={styles.dropdownArea}>
                  <Text style={styles.answer}>{item.F_ANSWER}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No FAQ data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default FAQs;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  icon: {
    width: 35,
    height: 40,
    marginHorizontal: 10,
  },
  header: {
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#404040',
  },
  faqItem: {
    marginTop: 20,
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8e8e8e',
    borderRadius: 5,
    padding: 15,
    width: '95%',
    alignSelf: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  dropdownArea: {
    width: '95%',
    minHeight: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    elevation: 3,
    marginTop: 10,
    padding: 10,
    alignSelf: 'center',
  },
  question: {
    flex: 1,
    color: '#404040',
  },
  answer: {
    color: '#404040',
  },
  noDataText: {
    alignSelf: 'center',
    marginTop: 20,
    color: '#404040',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#404040',
  },
});
