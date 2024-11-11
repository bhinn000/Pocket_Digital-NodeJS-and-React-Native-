import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const ViewTransactions = ({ route }) => {
    const { userData1 } = route.params;
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Shiva")
                const response = await axios.post('http://192.168.1.5:8086/viewTransactions', { token: userData1.token  });
                console.log("Test" , response.data.data)
                setTransactions(response.data.data);
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Transaction History</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <Text>Type: {item.type}</Text>
                        <Text>Amount: {item.amount}</Text>
                        {item.latestBalance && <Text>Latest Balance: {item.latestBalance}</Text>}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    transactionItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default ViewTransactions;