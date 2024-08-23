import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Feather } from 'react-native-feather';

function Register(props) {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [phone_number, setPhone_number] = useState('');
    const [phone_numberVerify, setPhone_numberVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mainID, setMainID] = useState('');
    const [mainIDVerify, setMainIDVerify] = useState(false);
  

    function handleName(nameVar) {
        setName(nameVar);
        setNameVerify(nameVar.length > 1);
    }

    function handleEmail(emailVar) {
        setEmail(emailVar);
        setEmailVerify(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailVar));
    }

    function handlePhoneNumber(phoneNumberVar) {
        setPhone_number(phoneNumberVar);
        setPhone_numberVerify(/^9[7-8]\d{8}$/.test(phoneNumberVar));
    }

    function handlePassword(passwordVar) {
        setPassword(passwordVar);
        setPasswordVerify(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(passwordVar));
    }

    function handleSubmit() {
        console.log("Hello")
        const userData = {
            name: name,
            email: email,
            phoneNumber: phone_number,
            password: password,
            mainID:mainID
        };
        if (nameVerify && emailVerify && phone_numberVerify && passwordVerify && mainIDVerify) {
            axios.post('http://192.168.1.3:8086/api/register', userData)
                .then(res => {
                    console.log(res.data);
                    if (res.data.status === "ok") {
                        Alert.alert("Registered successfully");
                         navigation.navigate("Login");
                    } else {
                        Alert.alert(JSON.stringify(res.data.data));
                    }
                })
                .catch(e => console.log(e));
        } else {
            Alert.alert("Fill mandatory details in proper format");
        }
    }

    function handleMainID(mainIDVar){
        const regex = /^0000-MBI-\d{3}$/;
        setMainIDVerify(regex.test(mainIDVar));
    }


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.background}>
                <View style={styles.imageheading}>
                    <Image source={require('../../assets/GIBL_Logo.png')} style={styles.logo} />
                    <Text style={styles.heading}>User Registration</Text>
                </View>

                <Text style={styles.textStyle}>Name</Text>
                <View style={styles.statusShower}>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Name'
                        value={name}
                        onChangeText={handleName}
                    />
                    {name.length > 0 &&
                        <Feather
                            color={nameVerify ? "green" : "red"}
                            name={nameVerify ? "check-circle" : "x-circle"}
                            size={20}
                            style={styles.icon}
                        />
                    }
                </View>

                <Text style={styles.textStyle}> Main ID </Text>
                <View style={styles.statusShower}>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Main ID of the bank'
                        value={mainID}
                        onChangeText={(text) => {
                          setMainID(text);
                          handleMainID(text);
                        }}
                    />
                    {mainID.length > 0 &&
                            <Feather
                                color={mainIDVerify ? "green" : "red"}
                                name={mainIDVerify ? "check-circle" : "x-circle"}
                                size={20}
                                style={styles.icon}
                            />
                        }
                </View>

                <Text style={styles.textStyle}>Email Address</Text>
                <View style={styles.statusShower}>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Email'
                        value={email}
                        onChangeText={handleEmail}
                    />
                    {email.length > 0 &&
                        <Feather
                            color={emailVerify ? "green" : "red"}
                            name={emailVerify ? "check-circle" : "x-circle"}
                            size={20}
                            style={styles.icon}
                        />
                    }
                </View>

                <Text style={styles.textStyle}>Phone Number</Text>
                <View style={styles.statusShower}>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Phone Number'
                        value={phone_number}
                        onChangeText={handlePhoneNumber}
                        maxLength={10}
                        keyboardType="phone-pad"
                    />
                    {phone_number.length > 0 &&
                        <Feather
                            color={phone_numberVerify ? "green" : "red"}
                            name={phone_numberVerify ? "check-circle" : "x-circle"}
                            size={20}
                            style={styles.icon}
                        />
                    }
                </View>

                <Text style={styles.textStyle}>Password</Text>
                <View style={styles.statusShower}>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Password'
                        value={password}
                        onChangeText={handlePassword}
                        secureTextEntry={!showPassword}
                    />
                    {password.length > 0 &&
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={showPassword ? "eye-off" : "eye"}
                                color={'green'}
                                size={23}
                                style={[styles.icon, { top: 10 }]}
                            />
                        </TouchableOpacity>
                    }
                </View>
                {password.length > 0 && !passwordVerify &&
                    <Text style={styles.errorText}>Uppercase, lowercase, special characters, and numbers are required.</Text>
                }

                    <TouchableOpacity onPress={handleSubmit} style={[styles.createAccountButton ]}>
                        <Text style={[styles.buttonTextStyle, {color:"white"}]}>Register</Text>
                    </TouchableOpacity>
         

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#F8F8FF",
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        paddingTop: 50,
    },
    imageheading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: -30
    },
    logo: {
        width: 60,
        height: 60,
    },
    heading: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'serif',
    },
    boxStyle: {
        width: '80%',
        height:40,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 15,
        marginBottom: 10,
        color: '#333',
        fontFamily:"monospace",
        fontSize:14,
        fontWeight:"200"
    },
    textStyle: {
        fontFamily:"monospace",
        fontWeight:"500",
        fontSize:16,
        marginBottom: 10,
        color: '#000',
        alignSelf: 'flex-start',
        marginLeft: '10%',
    },
    buttonTextStyle: {
        fontFamily:"monospace",
        fontWeight:"500",
        fontSize:16
    },
    createAccountButton: {
        backgroundColor: '#C4161C',
        borderRadius: 15,
        padding:15
    },
    statusShower: {
        flexDirection: "row",
    },
    icon: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },
    errorText: {
        color: "red",
        marginLeft: 20,
    }
});

export default Register;


