import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Button , Alert , TextInput , Modal , Image} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from 'react-native-feather';


function Role() {

    const fieldOptions = [
        "Restaurant/Cafe",
        "Canteen",
        "Travel",
    ];
    

    const [pay,setPay]=useState('')
    const [payVerify, setPayVerify]=useState(false)
    const [paymentAmount, setPaymentAmount] = useState('');
    const [receiverID, setReceiverID]=useState('')
    const [receiverIDVerify, setReceiverIDVerify]=useState(false)
    const [receiverPhNum, setReceiverPhNum]=useState('')
    const [receiverPhNumVerify, setReceiverPhNumVerify]=useState(false)
    const [showReceiverUI, setShowReceiverUI]=useState(false)
    const [showPaymentInput, setShowPaymentInput] = useState(false); // State variable to toggle visibility
    // const [user,setUser]=useState('')
    const [transactions, setTransactions] = useState([]);
    const [showPresettings, setShowPresettings] = useState(false); 
    const [showNotificationSettings, setShowNotificationSettings]=useState(false)
    // const [selectedField, setSelectedField]=useState(fieldOptions[0])
    const [selectedField, setSelectedField]=useState(null)
    const [currentBalance, setCurrentBalance]=useState('')
    const [okay, setOkay]=useState(false)
    const [userData, setUserData] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const [fieldLimit, setFieldLimit] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const [logOut, setLogOut]=useState(false)
    const [deleteAccount, setDeleteAccount]=useState(false)
    const [showFeedbackSpace, setshowFeedbackSpace]=useState(false)
    const [feedback, setFeedback] = useState('');
    const [showModal, setShowModal]=useState(false)
    const [isBalanceVisible, setIsBalanceVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [loadedAmount, setLoadedAmount] = useState('');
    const [showLoadAmountInput, setshowLoadAmountInput]=useState(false)
    const [fieldLimits, setFieldLimits] = useState({});



    const navigation=useNavigation()
 
    async function getData(){
        const token=await AsyncStorage.getItem('token_name')
        // const token=await AsyncStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFtdW4iLCJpYXQiOjE3MTgxNTQyODJ9.eWH-OahzRvLa7JHHGSa17r2yBKNAsr2hRFfrJwHBkK0')
        axios.post('http://192.168.1.4:8086/api/userData', {token:token}) //backend:varkhar ko token
        .then(res=>{
            const fetchedUserData = res.data.data;
            setUserData(fetchedUserData)  
            setLoading(false); // Set loading state to false after data is fetched 
            if (fetchedUserData.bankBalance && fetchedUserData.bankBalance.length > 0) {
                setCurrentBalance(fetchedUserData.bankBalance[0].currentBalance);
            }
        })
        .catch(err => {
            console.log(err);
            setLoading(false); // Set loading state to false even if there's an error
        });
    }


    const handleScan = (data) => {
        setScannedData(data);
        // Process the scanned QR code data here
        console.log('Scanned data:', data);
    };

    const toggleBalanceVisibility = () => {
        setIsBalanceVisible(!isBalanceVisible);
    };
    

    function validateReceiverID(id) {
        const regex = /^[A-Za-z]{2}[0-9]{3}$/;
        return regex.test(id);
    }

    function handleReceiverID(id) {
        setReceiverID(id);
        setReceiverIDVerify(validateReceiverID(id));
    }

    function validateReceiverPhNum(phNum){
        const phonePattern = /^(98|97)\d{8}$/;
        return phonePattern.test(phNum)
    }

    function handleReceiverPhNumber(phNum){
        setReceiverPhNum(phNum)
        setReceiverPhNumVerify(validateReceiverPhNum(phNum))
    }

    useEffect(()=>{
        getData()
    },[])

    useEffect(() => {
    

        async function fieldDetails() {
            const token = await AsyncStorage.getItem('token_name');
            try {
                const response = await axios.post('http://192.168.1.4:8086/api/fieldDetails', { token, selectedField });
                console.log("Here", JSON.stringify(response.data.message, null, 2));
                const selectedFieldData = response.data.message.find(item => item.selectedField === selectedField);
                if (selectedFieldData) {
                    console.log("selectedFieldData", selectedFieldData);
                    setFieldLimits(prevFieldLimits => ({
                        ...prevFieldLimits,
                        [selectedField]: selectedFieldData.amount
                    }));
                } else {
                    setFieldLimits(prevFieldLimits => ({
                        ...prevFieldLimits,
                        [selectedField]: null
                    }));
                }
            } catch (err) {
                console.log(err.response.data.message);
            }
        }
        if (selectedField) {
            fieldDetails();
        }
    }, [selectedField]);


    //View_transaction 
    async function handleViewTransaction(){
        const token=await AsyncStorage.getItem('token_name')
        const response=await axios.post('http://192.168.1.4:8086/api/ViewTransactions' , {token})
        // console.log(response.data.data)
        console.log(JSON.stringify(response.data.data, null, 2));
        setTransactions(response.data.data)
        navigation.navigate("View_Transactions", { userData1: userData })  
    }
    

    //pre-settings for portion for a month
    function handlePreSettings(){
        // setShowPresettings(true);   
        navigation.navigate("SetFieldRate")
    }

    async function handlePayOkay() {
        const token = await AsyncStorage.getItem('token_name');
        try {
            const response = await axios.post('http://192.168.1.4:8086/api/payOkay', { token, amount: paymentAmount, selectedField, receiverID });
            if (response.data.status === "ok") {
                console.log(response.data.currentBalance);
                setFieldLimits(prevFieldLimits => ({
                    ...prevFieldLimits,
                    [selectedField]: response.data.fieldLimit
                }));
                setCurrentBalance(response.data.currentBalance);
                Alert.alert("Payment Successful");
                console.log("response.data", response.data.currentBalance);
    
                // Reset payment amount and selected field
                setPaymentAmount('');
                setSelectedField(null);
                setReceiverID('');
            } else if (response.data.status === "not ok") {
                alert(response.data.message);
                console.log(response.data.message);
            }
        } catch (err) {
            console.log(err.response.data.message);
        }
    }

    
    async function handleDeleteAccount() {
        const token = await AsyncStorage.getItem('token_name');
        try {
            
            const response = await axios.post('http://192.168.1.4:8086/api/deleteAccount', { token });
            if (response.data.status === "ok") {
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('userId');
                navigation.navigate('Login', { accountDeleted: true });
                Alert.alert('Account Deleted', 'Your account has been successfully deleted.')
                return response.data.message;
            } else {
                throw new Error('Error deleting account');
            }
        } catch (err) {
            return { err: err.message };
        }
    }
    

    async function handleUserLogOut() {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userId');
            navigation.goBack();
           
           
                // return res.status(200).send(response.data.message);
                Alert.alert('Logged Out')
            
        } catch (err) {
            return res.status(500).send({ err: err.message });
        }
    }
    

    async function handleFeedback() {
        try {
            const token = await AsyncStorage.getItem('token_name');
            const response = await axios.post('http://192.168.1.4:8086/api/feedback', { token, rating }); // Send the rating to the backend
            if (response.data.status === "ok") {
              
                alert(response.data.message)
                // alert("response.data.data");
                setshowFeedbackSpace(false);
                setRating(0); // Reset the rating after submission
            }
        } catch (err) {
            console.error('Error during feedback submission:', err.message);
            alert('Error during feedback submission: ' + err.message);
        }
    }
    
      // Render loading indicator if data is still loading
      if (loading) {
        return <Text>Loading...</Text>;
    }


    return (

        <ScrollView  
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[styles.container, {flexGrow: 1}]}
            keyboardShouldPersistTaps="handled"    
         >
              

            <View style={styles.leftContainer}>
 
            <View style={styles.topHolder}>
                     

                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceText}>Rs.{isBalanceVisible ? currentBalance : '******* '}</Text>
                    <TouchableOpacity onPress={toggleBalanceVisibility}>
                        <Feather name={isBalanceVisible ? "visibility-off" : "visibility"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <Image source={require('../../assets/poster.png')} style={styles.poster}></Image>
 
            <View style={styles.mainContainer}>

            <Text style={styles.featureStyle}>Features</Text>

            

            <View style={styles.row}>
                <TouchableOpacity style={[styles.button,{height:50}]} onPress={() => {setShowPaymentInput(true); setShowModal(true)}}>
                         <Text style={styles.buttonText}>Expenses</Text>
                </TouchableOpacity>

                {
                    showModal &&(
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showModal} 
                        onRequestClose={() => setShowModal(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Choose Field</Text>

                                {fieldOptions.map((fieldOption, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.modalOptionButton}
                                        onPress={() => { setSelectedField(fieldOption); setShowModal(false); }}
                                    >
                                        <Text style={styles.modalOptionText}>{fieldOption}</Text>
                                    </TouchableOpacity>
                                ))}

                            </View>
                        </View>
                    </Modal>

                    )
                }


                {selectedField && (
                    <>
                        <View style={styles.wrapper}>
                            <Text style={styles.balanceText}>Field: Rs {selectedField}</Text>
                            <Text style={styles.balanceText}>Limit: Rs {fieldLimits[selectedField]}</Text>
                            <TouchableOpacity style={[styles.button, { width: 120, marginTop: 10 }]} onPress={() => setShowReceiverUI(true)}>
                                <Text style={[styles.buttonText]}>Receiver</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}


                {showReceiverUI &&(
                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showReceiverUI}
                    onRequestClose={() => setShowReceiverUI(false)}
                > 
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={[{ width: '80%', marginTop: "20%" }]}>
                                <TextInput
                                    style={[styles.input]}
                                    placeholder="Enter Receiver ID"
                                    keyboardType='default'
                                    onChangeText={handleReceiverID}
                                />
                                {receiverID.length > 0 &&
                                    <Feather
                                        color={receiverIDVerify ? "green" : "red"}
                                        name={receiverIDVerify ? "check-circle" : "x-circle"}
                                        size={20}
                                        style={styles.icon}
                                    />
                                }
                            </View>

                    

                            <TextInput
                                style={[styles.input, { width: '80%', marginTop: "20%" }]}
                                placeholder="Enter amount"
                                keyboardType="numeric"
                                onChangeText={text => setPaymentAmount(text)}
                            />

                            <TouchableOpacity style={[styles.button,{width:"40%", margin:10}]} onPress={() => {
                                setShowReceiverUI(false);
                                handlePayOkay();
                                setSelectedField(false)
                            }}>
                                <Text style={[styles.buttonText]} >Okay</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

                )}

          
            </View>
            

        
            <View style={styles.row}>
                <TouchableOpacity style={[styles.button]} onPress={handlePreSettings}>
                    <Text style={styles.buttonText}>Field Rate</Text>
                </TouchableOpacity>

               

                    <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showLoadAmountInput}
                    onRequestClose={() => setshowLoadAmountInput(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>

                            <TextInput
                                style={styles.loadInput}
                                placeholder="Loaded Amount"
                                value={loadedAmount}
                                onChangeText={text => setLoadedAmount(text)}
                                keyboardType="numeric"
                            />

                            <TextInput
                                style={styles.loadInput}
                                placeholder="Current Balance"
                                value={currentBalance}
                                onChangeText={text => setCurrentBalance(text)}
                                keyboardType="numeric"
                            />

                            {/* Load balance button */}
                            <TouchableOpacity
                                style={styles.loadButton}
                                onPress={() => handleLoadBalance(loadedAmount, currentBalance)}

                            >
                                <Text style={styles.loadButtonText}>Load Balance</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* )} */}
                    

            </View>

            </View>
                           
            </View>

           
                        
          


            <View style={styles.rightContainer}>
                <TouchableOpacity style={[styles.rightButton]} onPress={handleViewTransaction}>
                    {/* <Text style={styles.buttonText}>View transaction history</Text> */}
                    <Image
                        source={require('../../assets/transaction-history.png')}
                        style={styles.image}
                    />

                </TouchableOpacity>
 
 
                <TouchableOpacity style={[styles.rightButton]} onPress={handleDeleteAccount}>
                        {/* <Text style={styles.buttonText}>Delete Account</Text> */}
                        <Image
                        source={require('../../assets/remove-user.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>
  
                <TouchableOpacity style={styles.rightButton} onPress={() => { setshowFeedbackSpace(true) }}>
                    {/* <Text style={styles.buttonText}>Feedback</Text> */}
                    <Image
                        source={require('../../assets/reply-message.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>

                <Modal
                animationType="slide"
                transparent={true}
                visible={showFeedbackSpace}
                onRequestClose={() => setshowFeedbackSpace(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                       
                        {/* Rating stars */}
                        <View style={styles.ratingContainer}>
                            <Text style={styles.modalTitle}>Rate your experience:</Text>
                            <View style={styles.ratingStars}>
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setRating(index)}
                                    >
                                        <Feather
                                            name={index <= rating ? "star" : "star-o"}
                                            size={30}
                                            color={index <= rating ? "orange" : "gray"}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleFeedback}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

                <TouchableOpacity style={[styles.rightButton]} onPress={handleUserLogOut}>
                        {/* <Text style={styles.buttonText}>Log out</Text> */}
                        <Image
                        source={require('../../assets/log-out.png')}
                        style={styles.image}
                    />
                </TouchableOpacity>
   
            </View>



            
        </ScrollView>
    );
}
    

const styles = StyleSheet.create({
    wrapper:{
        backgroundColor:"white", 
        padding:10
    },

    poster:{
        width:200,
        height:150,
        alignSelf:"center",
        marginTop:30
    },
    rightButton:{
        // backgroundColor:"red",
        borderRadius:10,
        padding:10,
        marginVertical:10
    },
    image:{
        width:30,
        height:30
    },
    leftContainer:{
        // backgroundColor:"blue",
        alignSelf:"flex-start",
        width:"75%",
        top: 0,
        right: 0,
        marginTop:40,
        flex:1
    },
    rightContainer: {
        // backgroundColor: "green",
        position: 'absolute',
        top: 40,
        right: 0,
        width: "20%",
        flex:1
        // padding: 10,
    },
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems:"center", 
        backgroundColor:"#FCDC94"
    },
    topHolder:{
        // backgroundColor:"#C4161c",
        padding:10,
        width:"98%",
        alignSelf:"flex-start",
        marginTop:10,
        marginLeft:5,
        borderRadius:20
    },
    greeting: {
        fontSize: 20, 
        marginBottom: 5,
        alignSelf: 'flex-start',
        fontFamily:"serif",
        fontWeight:"500",
        color:"black"
    },
    balance: {
        fontSize: 30,
        alignSelf: 'flex-start',
        fontFamily: "monospace",
        fontWeight:" 900",
        flexDirection: 'row',
        alignItems: 'center'
       
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    balanceText: {
         color:"black",
        fontSize: 12,
        fontFamily:'monospace',
    },
    featureStyle:{
        fontFamily:"monospace",
        fontWeight:"1000",
        fontSize:25
    },
    mainContainer:{
        // backgroundColor:"#F1E5D1",
        alignSelf:"flex-start",
        borderRadius:5,
        marginTop:'auto',
        borderRadius:20,
        padding:10
        // marginBottom:
    },
    row:{
        flexDirection:"row",
        marginVertical:10,
        justifyContent:"space-between",
        // backgroundColor:"blue"
    },
    button:{
        backgroundColor:"#C4161c",
        paddingHorizontal:5,
        paddingVertical:15,
        borderRadius:30,
        marginHorizontal: 5,
        // margin:10,
    },
 
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily:'serif',
     
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        // flex: 1,// This property makes the TextInput expand to fill available space
        marginLeft: 5,
        borderRadius: 5,
        paddingHorizontal: 10,
        
    },
    picker: {
        width: '80%',
        marginBottom: 20,
      },

      limitText: {
        marginTop: 10,
        fontSize: 16,
        color: 'red',
    }
    ,
    feedbackContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
        marginTop: 20,
    },
    feedbackInput: {
        height: 100,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        flexDirection: 'column', // Arranges items vertically
        justifyContent: 'center', // Center content vertically
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalOptionButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    modalOptionText: {
        fontSize: 14,
    },
    pickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        marginVertical: 10, // Adjusts the space around the picker container
        alignItems: 'center', // Center the picker within the container
    },
    picker: {
        width: '100%', // Make sure picker takes full width of its container
        height: 50, // Adjust height as necessary
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalOptionButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center', // Center text within button
    },
    modalOptionText: {
        fontSize: 14,
    },
     ratingContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    ratingStars: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#C4161c',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
    loadInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      loadButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
      },
      loadButtonText: {
        color: 'white',
        textAlign: 'center',
      },
});


export default Role;





