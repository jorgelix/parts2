import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Switch, FlatList, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

// Define types for navigation stack
type RootStackParamList = {
  WelcomePage: undefined;
  MenuDetails: { updateMenuItems: (items: MenuItem[]) => void; menuItems: MenuItem[] };
  MenuEdit: { item: MenuItem; index: number; updateMenuItems: (items: MenuItem[]) => void };
  ClientSort: undefined; // Ensure this type is defined
  Login: undefined;
};

// Create a stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Define the MenuItem type
interface MenuItem {
  name: string;
  description: string;
  course: string;
  price: number;
}

// Welcome Page Component
const WelcomePage: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Christoffel's Digital Menu!</Text>
      <Button title="Get Started" onPress={() => navigation.navigate('MenuDetails')} color="#3b5998" />
      <Button title="Chef" onPress={() => navigation.navigate('Login')} color="#3b5998" />
    </View>
  );
};

// Menu Details Component
const MenuDetails: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<string>('Starters');
  const [price, setPrice] = useState<string>('');

  const courses = ['Starters', 'Mains', 'Desserts'];

  const addDish = () => {
    if (dishName && description && price) {
      const newItem: MenuItem = {
        name: dishName,
        description,
        course,
        price: parseFloat(price),
      };
      setMenuItems([...menuItems, newItem]);
      setDishName('');
      setDescription('');
      setPrice('');
    } else {
      alert('Please fill in all fields.');
    }
  };

  const editDish = (item: MenuItem, index: number) => {
    navigation.navigate('MenuEdit', { item, index, updateMenuItems: setMenuItems });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Details</Text>
      <TextInput placeholder="Dish Name" value={dishName} onChangeText={setDishName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <Picker selectedValue={course} onValueChange={(itemValue) => setCourse(itemValue)} style={styles.picker}>
        {courses.map((courseOption) => (
          <Picker.Item key={courseOption} label={courseOption} value={courseOption} />
        ))}
      </Picker>
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <Button title="Add New Dish" onPress={addDish} color="#3b5998" />
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item.name}</Text>
            <Text style={styles.menuDescription}>Course: {item.course}</Text>
            <Text style={styles.menuDescription}>Price: ${item.price.toFixed(2)}</Text>
            <Text style={styles.menuDescription}>Description: {item.description}</Text>
            <Button title="Edit" onPress={() => editDish(item, index)} color="#3b5998" />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Text style={styles.totalText}>Total Menu Items: {menuItems.length}</Text>
    </View>
  );
};

// Menu Edit Component
const MenuEdit: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { item, index, updateMenuItems } = route.params;
  const [dishName, setDishName] = useState<string>(item.name);
  const [description, setDescription] = useState<string>(item.description);
  const [course, setCourse] = useState<string>(item.course);
  const [price, setPrice] = useState<string>(item.price.toString());

  const updateDish = () => {
    if (dishName && description && price) {
      const updatedItem: MenuItem = {
        name: dishName,
        description,
        course,
        price: parseFloat(price),
      };

      const updatedMenuItems = [...route.params.menuItems];
      updatedMenuItems[index] = updatedItem;

      updateMenuItems(updatedMenuItems);
      alert('Dish updated!');
      navigation.navigate('MenuDetails');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Menu Item</Text>
      <TextInput placeholder="Dish Name" value={dishName} onChangeText={setDishName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <Picker selectedValue={course} onValueChange={(itemValue) => setCourse(itemValue)} style={styles.picker}>
        {['Starters', 'Mains', 'Desserts'].map((courseOption) => (
          <Picker.Item key={courseOption} label={courseOption} value={courseOption} />
        ))}
      </Picker>
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <Button title="Update Dish" onPress={updateDish} color="#3b5998" />
    </View>
  );
};

// Client Sort Component
const ClientSort: React.FC = () => {
  const [isMeat, setIsMeat] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort Dishes</Text>
      <Text>Main Dish: Meat</Text>
      <Switch value={isMeat} onValueChange={setIsMeat} />
      <Text>{isMeat ? 'Sorting by Meat' : 'Sorting by Fish'}</Text>
    </View>
  );
};

// Login Page Component
const LoginPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login as Chef</Text>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button title="Login" onPress={() => navigation.navigate('MenuDetails')} color="#3b5998" />
    </View>
  );
};

// Main App Component with Navigation
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomePage">
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="MenuDetails" component={MenuDetails} />
        <Stack.Screen name="MenuEdit" component={MenuEdit} />
        <Stack.Screen name="ClientSort" component={ClientSort} />
        <Stack.Screen name="Login" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#3b5998',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#3b5998',
  },
  input: {
    width: '100%',
    borderColor: '#3b5998',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  menuItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuDescription: {
    fontSize: 14,
    color: '#555',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  picker: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#3b5998',
    borderWidth: 1,
  },
});


