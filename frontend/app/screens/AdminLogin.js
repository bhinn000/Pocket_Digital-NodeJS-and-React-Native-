import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

function AdminLogin() {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params?.adminLogOut) {
            setAdminId('');
            setPassword('');
            navigation.setParams({ adminLogOut: false });
        }
    }, [route.params?.adminLogOut]);

    const handleAdminLogin = async () => {
        try {
            const response = await axios.post('http://192.168.43.55:5001/adminLogin', {
                adminId,
                password
            });

            if (response.status === 200) {
                console.log('Admin Login successful');
                navigation.navigate('AdminDashboard');
            }
        } catch (error) {
            console.error('Error during admin login:', error.message);
            setError('Error during admin login: ' + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageheading}>
                <Image source={require('../../assets/GIBL_Logo.png')} style={styles.logo} />
                <Text style={styles.heading}>Admin Login</Text>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Admin ID</Text>
                <TextInput
                    style={styles.input}
                    value={adminId}
                    onChangeText={setAdminId}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText} onPress={handleAdminLogin}>Login</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        resizeMode: 'cover',
        flexDirection: "column"
    },
    imageheading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30
    },
    logo: {
        width: 80,
        height: 80,
    },
    heading: {
        fontSize: 24,
        color: 'black',
        fontFamily: 'serif',
    },
    error: {
        color: '#C4161C',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        marginRight: 10,
        color: '#023F88',
        fontFamily: "monospace",
        fontWeight: "bold"
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#023F88',
        padding: 10,
        borderRadius: 20,
        fontSize: 18,
        color: '#023F88',
    },
    buttonContainer: {
        backgroundColor: '#C4161C',
        padding: 10,
        borderRadius: 20,
        width: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminLogin;



