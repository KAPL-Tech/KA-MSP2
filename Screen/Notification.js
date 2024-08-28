/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable keyword-spacing */
import {
    Image,
    Text,
    TextInput,
    View,
    Button,
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import { useNavigation, useRoute } from '@react-navigation/native';
  
  const Notification = () => {
    const navigation = useNavigation();
    return (
      <SafeAreaView style={styles.add_main}>
        <View style={styles.add_one}>
          <TouchableOpacity onPress={navigation.goBack}>
          <View style={styles.add_one_child}>
            <Icon
              name="arrow-left"
              size={30}
              color="#F59E0B"
              style={{width: 32, height: 32, marginHorizontal: 10}}
            />
          </View>
          </TouchableOpacity>
          <View style={styles.add_one_child}>
            <Text
              style={{
                fontFamily: 'Roboto-Regular',
                fontSize: 22,
                fontWeight: '300',
                lineHeight: 26,
                width: '40%',
                padding: 5,
                marginHorizontal: 10,
                color:'#404040'
              }}>
              Notification
            </Text>
          </View>
          <View style={styles.add_one_child_flex}>
            <Text
              style={{
                width: '95%',
                paddingLeft: 8,
                fontFamily: 'Roboto-Regular',
                color:'#404040'
              }}>
              Delay in lunches may cause for bad health. Take a break and have
              food before you mess closes.
            </Text>
            <Text style={{paddingLeft: 8,color:'#404040'}}>5/07/2023 11:00</Text>
          </View>
          <View style={styles.add_one_child_flex}>
            <Text
              style={{
                width: '85%',
                paddingLeft: 8,
                fontFamily: 'Roboto-Regular',
                color:'#404040'
              }}>
              Would you like to add some Beverages today?
            </Text>
            <Text style={{paddingLeft: 8,color:'#404040'}}>5/07/2023 11:00</Text>
          </View>
          <View style={styles.add_one_child_flex}>
            <Text
              style={{
                width: '85%',
                paddingLeft: 8,
                fontFamily: 'Roboto-Regular',
                color:'#404040'
              }}>
              Your mess have canceled your order today
            </Text>
            <Text style={{paddingLeft: 8,color:'#404040'}}>5/07/2023 11:00</Text>
          </View>
        </View>
       </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    add_main: {
      flex: 1,
      height: '100%',
      width: '100%',
    },
    add_one: {
      flex: 4,
    },
    add_one_child: {
      margin: 5,
    },
    add_one_child_flex: {
      margin: 5,
      flexDirection: 'row',
      flexWrap: 'wrap',
      height: '9%',
      width: '90%',
      borderBottomColor: 'grey',
      borderBottomWidth: 0.8,
      justifyContent: 'space-between',
      left: 15,
      paddingBottom: 4,
   },
  });
  
  export default Notification;
  