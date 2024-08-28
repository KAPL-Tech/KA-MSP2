/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, ActivityIndicator,RefreshControl} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getInvoiceItems} from '../api/data/DataService';

const Payment_history = ({navigation}) => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoiceData = async () => {
    try {
      setRefreshing(true); 
      const mspID = await AsyncStorage.getItem('mspID');
      const response = await getInvoiceItems(mspID);

      if (response && response.status === 'SUCCESS' && response.message) {
        setInvoiceList(response.message.list || []);
        setStats(response.message.stats || []);
      } else {
        throw new Error('Failed to fetch invoice data');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setRefreshing(false); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const onRefresh = () => {
    fetchInvoiceData();
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  if (error && error.response && error.response.status === 500) {
    return (
      <View style={styles.container}>
        <Text style={styles.transaction}>Transactions</Text>

        <Text style={styles.noInvoices}>No invoices available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Icon
        name="arrow-left"
        size={hp('4.3%')}
        color="#D97706"
        onPress={() => navigation.goBack()}
        style={styles.backArrow}
      />
      <Text style={styles.heading}>Invoices History</Text>

      <View style={styles.statsContainer}>
        {stats.length > 0 ? (
          stats.map(stat => (
            <View key={stat.STATUS} style={styles.statItem}>
              <Text
                style={[
                  styles.statAmount,
                  {color: stat.STATUS === 'Pending' ? 'red' : 'green'},
                ]}>
                {stat.AMOUNT}
              </Text>
              <Text style={styles.statStatus}>{stat.STATUS}</Text>
            </View>
          ))
        ) : (
          <View style={styles.statItem}>
            <Text style={styles.statAmount}>0</Text>
            <Text style={styles.statStatus}>Don't have invoices</Text>
          </View>
        )}
      </View>

      <View style={{borderBottomWidth: 0.2, marginTop: 20, marginBottom: 8}}>
        <Text style={styles.transaction}>Transactions</Text>
      </View>

      <FlatList
        data={invoiceList}
        keyExtractor={item => item.I_INVID.toString()}
        renderItem={({item}) => (
          <View style={styles.invoiceItem} key={item.I_INVID}>
            <Text style={styles.invoiceID}>Invoice ID: {item.I_INVID}</Text>
            <Text style={{color: '#404040'}}> {item.I_ORDERS}</Text>
            <Text style={{color: '#404040'}}>Date: {item.I_GEN_DT}</Text>
            <Text style={{color: '#404040'}}>Amount: {item.I_AMOUNT}</Text>
            <Text style={{color: '#404040'}}>
              Admin charge: {item.I_ADMIN_CHG}
            </Text>
            <Text style={{color: '#404040'}}>
              Final Amount: {item.I_FINAL_AMNT}
            </Text>
            <Text style={{color: '#404040'}}>Status: {item.I_STATUS}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F59E0B']} />
        }
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: wp('2%'),
    backgroundColor: '#E5E7EB',
  },
  backArrow: {
    marginRight: wp('2%'),
  },
  heading: {
    color: '#404040',
    fontSize: hp('3.5%'),
    fontWeight: '500',
    marginTop: hp('2%'),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('3%'),
    // backgroundColor:'red'
  },
  statItem: {
    alignItems: 'center',
    borderRadius: 5,
    width: '22%',
    height: '110%',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  statStatus: {
    // fontWeight: 'bold',
    fontSize: hp('2%'),
    color: '#404040',
    marginTop: 5,
    fontWeight: '500',
  },
  statAmount: {
    marginTop: hp('1%'),
    fontSize: hp('2.5%'),
    color: '#16A34A',
    fontWeight: '700',
  },
  invoiceItem: {
    marginTop: hp('3%'),
    padding: wp('3%'),
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  invoiceID: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginBottom: hp('1%'),
    color: '#404040',
  },
  transaction: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginTop: hp('2%'),
    color: '#404040',
  },
};

export default Payment_history;
