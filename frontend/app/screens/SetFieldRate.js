
import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity , Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function SetFieldRate() {

    const navigation=useNavigation()
    const [budgetData, setBudgetData] = useState({});
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
            const response = await axios.get('http://192.168.1.4:8086/api/preSettingGET', {
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

            setBudgetData(latestBudgetData);
            
        } catch (error) {
            console.error('Error fetching presettings:', error);
        }
    };



    useEffect(() => {
        fetchPresettings();
    }, []); 

    //min and max expenses rate for each topics: cafe => 10 to 15 % , canteen => 20 to 30 % , travel => 10 to 15 % , remaining in saving(others)and reload back to the main account 
    // Instead of keeping track , you just check if the age is valid when the user tries to submit the form.
    function handleCafe(cafeVar) {
        const isValid = cafeVar.length > 0 && parseFloat(cafeVar) > 5;
        return isValid;
    }
    
    function handleCanteen(canteenVar) {
        const isValid = canteenVar.length > 0 && parseFloat(canteenVar) > 3;
        return isValid;
    }
    
    function handleTravel(travelVar) {
        const isValid = travelVar.length > 0 && parseFloat(travelVar) > 3;
        return isValid;
    }

    function handleSubmitVisibility(){
        setShowSubmit(true)
    }

   
    async function handleSubmit() {

             const token = await AsyncStorage.getItem('token_name');
             const budgetList = Object.keys(budgetData).map(category => ({
                title: category,
                budget: budgetData[category].budget
            }));

            const cafeValid = handleCafe(budgetData["Restaurant/Cafe"]?.budget || '');
            const canteenValid = handleCanteen(budgetData["Canteen"]?.budget || '');
            const travelValid = handleTravel(budgetData["Travel"]?.budget || '');

            const totalRate=parseInt(budgetData["Restaurant/Cafe"]?.budget) + parseInt(budgetData["Canteen"]?.budget) + parseInt(budgetData["Travel"]?.budget)

            if(totalRate == 100){

                 if(cafeValid && canteenValid && travelValid){
                
                await axios.post('http://192.168.1.4:8086/api/preSettingPOST', { token, budgets: budgetList }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
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
            else{
                console.log("Do mathematical calculation properly , the percentage is always 100%");
                Alert.alert("Should be 100% at total")
            }
     
    }

        return (
            <ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.navigate("ViewFieldRate")}>
                <Text style={styles.submitText}>View Previous Rate</Text>
            </TouchableOpacity>

                <Text style={styles.text}> Update Fields and Rate</Text>
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
        backgroundColor: '#023F88', 
        paddingTop: 5,
        paddingBottom:5,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10, 
        marginBottom: 10,
        width:"40%"
    },
    submitText: {
        color: 'white', // White text color
        fontWeight: 'bold',
        fontSize: 16,
    }
    
});

export default SetFieldRate;


