    import React, { useEffect, useState } from 'react';
    import { Text, TextInput, View, StyleSheet,  ScrollView, Image } from 'react-native';
    import axios from 'axios';
    import { useNavigation, useRoute} from '@react-navigation/native';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    function Login() {
        const navigation=useNavigation()
        const route=useRoute()

        const [name, setName] = useState('');
        const [password, setPassword] = useState('');
        const [userID, setUserID] = useState('');


        useEffect(() => {
            if (route.params?.accountDeleted) {
                setName('');
                navigation.setParams({ accountDeleted: false });  
            }
        }, [route.params?.accountDeleted]);

            
        function handleLogin(){
            const userData={
                name:name,
                userId:userID
            }  
            console.log("Sending login request with data:", userData);
            axios.post('http://192.168.1.4:8086/api/login', userData)
            .then(res=>{
                if(res.data.status=="ok"){
                    AsyncStorage.setItem('token_name' , res.data.token)
                    console.log("Test Login")
                    navigation.navigate("Role")         
                }
                else {
                    console.error("Login failed:", res.data.data);
                }
            })
            .catch(err=>{
                console.error("Error during login:", err);
            })
        }
        
        return (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
                >
                <View style={styles.background}>

                    <View style={styles.imageheading}>
                        <Image source={require('../../assets/GIBL_Logo.png')} style={styles.logo} />
                            <Text style={styles.heading}>User Login</Text>
                        
                    </View>


                    <Text style={styles.textStyle}>User Name</Text>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Name'
                        value={name}
                        onChangeText={setName}
                        keyboardType="name-phone-pad"
                    />

                    <Text style={styles.textStyle}>User Id</Text>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='UserId'
                        value={userID}
                        onChangeText={setUserID}
                        keyboardType="name-phone-pad"
                    />
            
                    
                    <Text style={styles.textStyle}>Password</Text>
                    <TextInput
                        style={styles.boxStyle}
                        placeholder='Password'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    /> 

                    <View style={styles.buttonContainer}>
                        <Text  style={styles.buttonText} onPress={handleLogin} >Login</Text> 
                    </View>

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
        imageheading:{
            flexDirection:"row",
            alignItems:"center", // Center vertically
            justifyContent:"center", // Center horizontally
            marginBottom:10,
            marginTop:-30
        },
        logo: {
            width: 80,
            height: 80,
        },
        heading: {
            fontSize: 24,
            color: 'black',
            fontFamily: 'serif',
            // marginLeft:10,  
            // marginTop:20
        },
        boxStyle: {
            width: '80%',
            height: 40,
            paddingHorizontal: 20,
            fontSize: 14,
            fontFamily:"monospace",
            fontWeight:"400",
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 25, // More rounded border
            marginBottom: 20,
            color: '#333',
        },
        textStyle: {
            fontSize: 14,
            fontFamily:"monospace",
            fontWeight:"900",
            marginBottom: 10,
            color: '#000',
            alignSelf: 'flex-start',
            marginLeft: '10%', 
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

    export default Login;




