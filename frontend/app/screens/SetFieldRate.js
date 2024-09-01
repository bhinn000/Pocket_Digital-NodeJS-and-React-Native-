
import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function SetFieldRate() {

    const navigation=useNavigation()
    const [budgetData, setBudgetData] = useState({});
    const [cafe,setCafe] = useState("");
    const [cafeVerify, setCafeVerify]=useState(false)
    const [travel,setTravel] = useState("");
    const [travelVerify, setTravelVerify]=useState(false)
    const [canteen,setCanteen] = useState("");
    const [canteenVerify, setCanteenVerify]=useState(false)
    const [showSubmit,setShowSubmit]=useState(false)

    const handleBudgetDataChange = (category, value) => {
    
        setBudgetData(prevState => ({
            ...prevState,
            // [category]: {budget:value} 
            [category]: {
                // ...(prevState[category] || {}), // Ensure category object exists
                budget: value
            }
           
           
        }));    
    };

    const fetchPresettings = async () => {
 
        try {
            const token = await AsyncStorage.getItem('token_name');
            const response = await axios.get('http://192.168.1.3:8086/api/preSettingGET', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

         

            if (response.data.length === 0) {
                setBudgetData({});
                return;
            }

            const latestBudgetData = {};
            response.data.forEach(item => {
                if (!latestBudgetData[item.title] || latestBudgetData[item.title]._id < item._id) { 
                    latestBudgetData[item.title] = {
                        _id: item._id,
                        budget: item.budget.toString() 
                    };
                }
            });

``
            setBudgetData(latestBudgetData);
            // console.log("Test2" , budgetData)
        } catch (error) {
            console.error('Error fetching presettings:', error);
        }
    };



    useEffect(() => {
        fetchPresettings();
    }, []); 

    useEffect(() => {
        console.log("Test2", budgetData);
    }, [budgetData]);


    function handleCafe(cafeVar){
        setCafe(cafeVar)
        setCafeVerify(cafeVar.length>0 && cafeVar > 5)  
    }

    function handleCanteen(canteenVar){
        setCanteen(canteenVar)
        setCanteenVerify(canteenVar.length>0 && canteenVar > 3)
    }

    function handleTravel(travelVar){
        setTravel(travelVar)
        setTravelVerify(travelVar.length>0 && travelVar > 3)
    }

    function handleSubmitVisibility(){
        setShowSubmit(true)
    }

   
    async function handleSubmit() {
        const budgetList = Object.keys(budgetData).map(category => ({
            title: category,
            budget: budgetData[category].budget
        }));

            const token = await AsyncStorage.getItem('token_name');

            const response = await axios.get('http://192.168.1.3:8086/api/preSettingGET', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            response.data.forEach(item=>console.log(item))
        
            if(cafeVerify && canteenVerify && travelVerify){
                await axios.post('http://192.168.1.3:8086/api/preSettingPOST', { token, budgets: budgetList }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        console.log(res.data.message)
                        navigation.navigate("ViewFieldRate")
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            }
            else{
                console.log("Frontend requirements has not been done")
            }

    }

        return (
            <ScrollView>
                <Text style={styles.text}>Fields and Rate</Text>
                {[
                    "Restaurant/Cafe",
                    "Canteen",
                    "Travel",
                  
                ].map(category => (
                    <ScrollView key={category} style={styles.container}>
                        <Text style={styles.category}>{category}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter budget"
                            keyboardType="numeric"
                            value={budgetData[category] ? budgetData[category].budget : ''}
                            
                            onChangeText={value =>
                                {
                                    handleBudgetDataChange(category, value)  
                            
                                    // console.log("budgetData[category].budget" , budgetData[category].budget)//this is creating problem
                                    handleSubmitVisibility()                    
                                 }
                            
                            }

                            onBlur={() => {

                                if (category === "Restaurant/Cafe") {
                                    handleCafe(budgetData[category].budget);                            
                                } else if (category === "Canteen") {
                                    handleCanteen(budgetData[category].budget);
                                }
                                else if (category === "Travel") {
                                    handleTravel(budgetData[category].budget);
                                }

                                
                    
                            }}
                        />

                     
                    
                    </ScrollView>
                ))}
                    {showSubmit &&(
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
                )} 
               
                
            </ScrollView>
        );
        

}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#023F88', 
    },
    input: {
        borderWidth: 1,
        borderColor: '#023F88', 
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: '50%',
        color: '#023F88', 
        borderWidth:2
    },
    text:{
        fontFamily:"monospace",
        fontWeight:"1000",
        fontSize:18,
        marginBottom:30
    },
    submitBtn: {
        backgroundColor: '#023F88', // Elegant blue color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center', // Center content horizontally
        marginTop: 10, 
        width:"30%"
    },
    submitText: {
        color: 'white', // White text color
        fontWeight: 'bold',
        fontSize: 16,
    }
    
});

export default SetFieldRate;


