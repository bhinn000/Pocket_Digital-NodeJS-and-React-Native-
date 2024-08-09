import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, Image } from 'react-native';


function HomeScreen({ navigation }) {
    const [showOptions, setShowOptions] = useState(false);


    const handleUserOption = (option) => {
        setShowOptions(false);
        if (option === 'login') {
            navigation.navigate('Login');
        } else if (option === 'register') {
            navigation.navigate('Register');
        } 
    };

    return (
        <View style={styles.container}>
            {/* <Image source={require('../../assets/GIBL_Logo.png')} style={styles.logo} /> */}
            <View style={styles.textBox}>
                <Text style={styles.welcomeText}>Welcome to GlobalIME Pocket Expenses</Text>
                
            </View>
            <Text style={styles.subText}>Kindly Choose one</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} style={styles.adminButton}>
                <Text style={styles.buttonText}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.userButton}>
                <Text style={styles.buttonText}>User</Text>
            </TouchableOpacity>
            <Modal
                visible={showOptions}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowOptions(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => handleUserOption('login')}>
                            <Text style={[styles.option, styles.borderBottom]}>Already have an account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleUserOption('register')}>
                            <Text style={[styles.option, styles.borderBottom]}>Create account</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View> 
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    textBox: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    welcomeText: {
        fontSize: 22,
        marginBottom: 10,
        color: '#023F88',
        textAlign: 'center',
        fontFamily: "serif",
    },
    subText: {
        fontSize: 16,
        color: '#023F88',
        textAlign: 'center',
        fontFamily: 'monospace', 
    },
    adminButton: {
        backgroundColor: '#C4161C',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    userButton: {
        backgroundColor: '#023F88',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 10,
        width: 250,
        alignItems: 'center',
    },
    option: {
        fontSize: 15,
        paddingVertical: 10,
        color: '#023F88',
        textAlign: 'center',
        fontFamily:"monospace",
        fontWeight:"700"
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#023F88',
    },
});

export default HomeScreen;
