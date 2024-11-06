//imported things
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import React from 'react';
import { name as appName } from './app.json';

import HomeScreen from './app/screens/home'; 
import AdminLogin from './app/screens/AdminLogin';
import Register from './app/screens/Register';
import Login from './app/screens/Login';
import Role from './app/screens/Role';
import SetFieldRate from './app/screens/SetFieldRate';
import ViewFieldRate from './app/screens/ViewFieldRate';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="Register" component={Register} /> 
        <Stack.Screen name="Login" component={Login} /> 
        <Stack.Screen name="Role" component={Role}/>
        <Stack.Screen name="SetFieldRate" component={SetFieldRate}/>
        <Stack.Screen name="ViewFieldRate" component={ViewFieldRate}/>
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

export default App;

AppRegistry.registerComponent(appName, () => App);
