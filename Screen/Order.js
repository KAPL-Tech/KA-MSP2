import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CalendarStrip from 'react-native-calendar-strip';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LinearGradient} from 'react-native-linear-gradient';
import {getOrderHistory, manageOrderStatus} from '../api/data/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Order = props => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [ordersForSelectedDate, setOrdersForSelectedDate] = useState([]);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderStatus, setOrderStatus] = useState({});

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrdersByDate(selectedDate).finally(() => setRefreshing(false));
  };

  const handleDateSelected = date => {
    setSelectedDate(date);
    setOrdersForSelectedDate([]);
    fetchOrdersByDate(date);
  };

  const fetchOrdersByDate = async date => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      // console.log('formated date', formattedDate);
      const type = 'msp';

      let mspID = await AsyncStorage.getItem('mspID');
      // console.log('mspID:', mspID);
      mspID = mspID;
      if (mspID) {
        // setUserID(retrievedUserID);
        const orders = await getOrderHistory(mspID, formattedDate, type);
        console.log('orders fetched', orders);
        setOrdersForSelectedDate(orders?.message || []);
      } else {
        console.log('UserID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.log('Error message', error.message);
    }
  };

  useEffect(() => {
    handleOrderStatus();
    fetchOrdersByDate(selectedDate);
  }, []);

  const handleOrderStatus = async (orderID, status) => {
    try {
      const response = await manageOrderStatus(orderID, status);
      console.log('order Status API Response:', response);

      setOrderStatus(prevState => ({
        ...prevState,
        [orderID]: status,
      }));

      fetchOrdersByDate(selectedDate);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
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
          <LinearGradient
            colors={['#F59E0B', '#FFD539']}
            style={styles.gradientHeader}
            start={{x: 0, y: 2}}
            end={{x: 3, y: 2}}>
            <View style={styles.headerContent}>
              <Text style={styles.textstyle}>Order Book</Text>
              <TouchableOpacity
              // onPress={() => props.navigation.navigate('Ordermonthly')}
              >
                <Icon
                  name="calendar-month"
                  size={30}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <CalendarStrip
          scrollable
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'background',
            duration: 300,
            highlightColor: '#F59E0B',
          }}
          style={styles.calendarStrip}
          calendarHeaderStyle={styles.calendarHeader}
          calendarColor="#FEFCE8"
          dateNumberStyle={styles.dateNumber}
          dateNameStyle={styles.dateName}
          iconContainer={{flex: 0.1}}
          onDateSelected={handleDateSelected}
        />

        <View>
          {selectedDate && selectedDate instanceof Date && (
            <Text style={styles.selectedDateText}>
              Selected Date: {selectedDate.toDateString()}
            </Text>
          )}
        </View>

        <View>
          {ordersForSelectedDate.length > 0 ? (
            <View>
              {/* Filter pending orders */}
              {ordersForSelectedDate
                .filter(order => order.O_STATUS === 'PENDING')
                .map((order, index) => (
                  <View key={index} style={styles.orderContainer}>
                    <View style={styles.orderItem}>
                      <View style={{borderBottomWidth: 1}}>
                        <Text style={styles.orderTitles}>
                          Order ID : {order.O_ID}
                        </Text>
                      </View>
                      <Text style={styles.orderTitle}>
                        Name: {order.U_FNAME} {order.U_LNAME}{' '}
                      </Text>
                      {/* <Text style={styles.orderDetail}>Restaurant : {order.MSP_NAME}</Text> */}
                      <Text style={styles.orderDetail}>
                        Items : {order.OD_MENUITEMS}
                      </Text>
                      <View style={{flexDirection: 'row', gap: 10}}>
                        <Text style={styles.orderDetail}>
                          Takeaway-charge : {order.O_TAKEWAY_CHG}
                        </Text>
                        <Text style={styles.orderDetail}>
                          Delivery-charge : {order.O_DEL_CHG}
                        </Text>
                      </View>
                      {/* <Text style={styles.orderDetail}>DISCOUNT TYPE: {order.O_DISC_TYPE}</Text> */}
                      <Text style={styles.orderDetail}>
                        Discount : {order.O_DISC}%
                      </Text>
                      <View style={{borderBottomWidth: 1}}>
                        <Text style={styles.orderTitle}>
                          FINAL AMOUNT : {order.O_FINAL_AMOUNT}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.orderTitle,
                            {
                              color:
                                order.O_STATUS === 'CONFIRMED'
                                  ? 'green'
                                  : 'red',
                            },
                          ]}>
                          ORDER STATUS : {order.O_STATUS}
                        </Text>

                        {order.O_STATUS === 'PENDING' &&
                          !orderStatus[order.O_ID] && (
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                style={styles.button1}
                                onPress={() =>
                                  handleOrderStatus(order.O_ID, 'CONFIRMED')
                                }>
                                <Text style={styles.buttonText}>CONFIRM</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                  handleOrderStatus(order.O_ID, 'REJECTED')
                                }>
                                <Text style={styles.buttonText}>REJECT</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                      </View>
                    </View>
                    <View style={styles.divider} />
                  </View>
                ))}

              {ordersForSelectedDate
                .filter(order => order.O_STATUS !== 'PENDING')
                .map((order, index) => (
                  <View key={index} style={styles.orderContainer}>
                    <View style={styles.orderItem}>
                      <View style={{borderBottomWidth: 1}}>
                        <Text style={styles.orderTitles}>
                          Order ID : {order.O_ID}
                        </Text>
                      </View>
                      <Text style={styles.orderTitle}>
                        Name: {order.U_FNAME} {order.U_LNAME}{' '}
                      </Text>
                      {/* <Text style={styles.orderDetail}>Restaurant : {order.MSP_NAME}</Text> */}
                      <Text style={styles.orderDetail}>
                        Items : {order.OD_MENUITEMS}
                      </Text>
                      <View style={{flexDirection: 'row', gap: 10}}>
                        <Text style={styles.orderDetail}>
                          Takeaway-charge : {order.O_TAKEWAY_CHG}
                        </Text>
                        <Text style={styles.orderDetail}>
                          Delivery-charge : {order.O_DEL_CHG}
                        </Text>
                      </View>
                      {/* <Text style={styles.orderDetail}>DISCOUNT TYPE: {order.O_DISC_TYPE}</Text> */}
                      <Text style={styles.orderDetail}>
                        Discount : {order.O_DISC}%
                      </Text>
                      <View style={{borderBottomWidth: 1}}>
                        <Text style={styles.orderTitle}>
                          FINAL AMOUNT : {order.O_FINAL_AMOUNT}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.orderTitle,
                            {
                              color:
                                order.O_STATUS === 'CONFIRMED'
                                  ? 'green'
                                  : 'red',
                            },
                          ]}>
                          ORDER STATUS : {order.O_STATUS}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                  </View>
                ))}
            </View>
          ) : (
            <Text style={styles.noOrdersText}>
              NO ORDERS FOR THE SELECTED DATE. 😋
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    // flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  textstyle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '300',
  },
  calendarIcon: {
    // padding: 10,
  },
  calendarStrip: {
    height: 100,
    paddingTop: 15,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: '#404040',
    fontSize: 18,
  },
  dateNumber: {
    color: '#404040',
    fontSize: 15,
  },
  dateName: {
    color: '#404040',
    fontSize: 10,
  },
  orderDetailsContainer: {
    borderWidth: 1.2,
    justifyContent: 'space-around',
    height: '50%',
    width: '90%',
    left: 10,
    marginTop: 30,
    borderRadius: 10,
    borderColor: 'grey',
    bottom: 50,
  },
  orderDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  messName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B21A8',
  },
  mealType: {
    borderWidth: 1,
    borderRadius: 10,
    width: '15%',
    textAlign: 'center',
    borderColor: '#EAB308',
    fontSize: 12,
    fontWeight: '400',
    color: '#CA8A04',
  },
  subscribedText: {
    bottom: 15,
    fontSize: 12,
    fontWeight: '400',
    color: '#A3A3A3',
    marginHorizontal: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    marginHorizontal: 10,
  },
  orderItemText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#404040',
  },
  orderItemQuantity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: '20%',
    top: 9,
  },
  cancelButton: {
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  checkInButton: {
    backgroundColor: '#6B21A8',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  selectedDateText: {
    color: '#404040',
  },
  orderContainer: {
    top: 10,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#404040',
  },
  orderTitles: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#404040',
    // backgroundColor:'#FACC15',
    // borderWidth:1,
  },
  orderDetail: {
    fontSize: 14,
    marginBottom: 3,
    color: '#404040',
  },
  divider: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  noOrdersText: {
    color: '#404040',
    textAlign: 'center',
    marginTop: 200,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  button1: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Order;
