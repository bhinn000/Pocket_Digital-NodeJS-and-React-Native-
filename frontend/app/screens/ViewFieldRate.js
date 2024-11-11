import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ViewFieldRate() {
    const [presettings, setPresettings] = useState([]);

    useEffect(() => {
        fetchPresettings();
    }, []);

    const fetchPresettings = async () => {
        try {
            
            const token = await AsyncStorage.getItem('token_name');
            const response = await axios.get('http://192.168.1.5:8086/api/preSettingGET', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const latestBudgetData = {};
            response.data.forEach(item => {
                 if (!latestBudgetData[item.title] || latestBudgetData[item.title]._id < item._id) { 
                    latestBudgetData[item.title] = {
                        _id: item._id,
                        budget: item.budget.toString() // Convert budget to string
                    };                    
                }
            });

            // Structure latestPreSettings with both title and budget properties
            const latestPreSettings = Object.keys(latestBudgetData).map(title => ({
                title: title,
                budget: latestBudgetData[title].budget
            }));

            setPresettings(latestPreSettings);
                   
        } catch (error) {
            console.error('Error fetching presettings:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your Chosen Field Rate</Text>
            <View style={styles.presettingsContainer}>
                {presettings.map(item => (
                    <View key={item.title} style={styles.presettingItem}>
                        <Text style={styles.category}>{item.title}</Text>
                        <Text style={styles.budget}>Budget: {item.budget}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#023F88', // Elegant blue color
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white', // White text color
    },
    presettingsContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },
    presettingItem: {
        marginBottom: 10,
        backgroundColor: 'white', // White background color
        padding: 10,
        borderRadius: 5,
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#023F88', // Elegant blue color
    },
    budget: {
        fontSize: 16,
        color: '#023F88', // Elegant blue color
    },
});


export  default ViewFieldRate;