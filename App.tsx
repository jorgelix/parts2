import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

type RootStackParamList = {
  HomePage: undefined;
  FilterMenu: { menuItems: MenuItem[] };
  ManageMenu: { menuItems: MenuItem[]; updateMenuItems: (items: MenuItem[]) => void };
};

const Stack = createStackNavigator<RootStackParamList>();

interface MenuItem {
  name: string;
  course: string;
  price: number;
}

const calculateAverages = (menuItems: MenuItem[]) => {
  const coursePrices: Record<string, number[]> = {};

  menuItems.forEach((item) => {
    if (!coursePrices[item.course]) coursePrices[item.course] = [];
    coursePrices[item.course].push(item.price);
  });

  const averages: Record<string, number> = {};
  for (const course in coursePrices) {
    const prices = coursePrices[course];
    averages[course] = prices.reduce((acc, curr) => acc + curr, 0) / prices.length;
  }

  return averages;
};

const HomePage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: 'Caesar Salad', course: 'Starters', price: 6.5 },
    { name: 'Garlic Bread', course: 'Starters', price: 4 },
    { name: 'Grilled Chicken', course: 'Mains', price: 12.5 },
    { name: 'Vegetarian Pasta', course: 'Mains', price: 10 },
    { name: 'Beef Steak', course: 'Mains', price: 18 },
    { name: 'Chocolate Cake', course: 'Desserts', price: 7.5 },
    { name: 'Fruit Salad', course: 'Desserts', price: 6 },
    { name: 'Bruschetta', course: 'Starters', price: 5.5 },
  ]);

  const averages = calculateAverages(menuItems);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Full Menu</Text>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.name}</Text>
              <Text style={styles.menuItemSubText}>Course: {item.course}</Text>
              <Text style={styles.menuItemSubText}>Price: ${item.price.toFixed(2)}</Text>
            </View>
          )}
        />

        <Text style={styles.title}>Average Prices by Course:</Text>
        {Object.entries(averages).map(([course, avg]) => (
          <Text style={styles.averageText} key={course}>
            {course}: ${avg.toFixed(2)}
          </Text>
        ))}

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('FilterMenu', { menuItems })}
          >
            <Text style={styles.buttonText}>Filter Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('ManageMenu', { menuItems, updateMenuItems: setMenuItems })
            }
          >
            <Text style={styles.buttonText}>Manage Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const FilterMenu: React.FC<{ route: any }> = ({ route }) => {
  const { menuItems } = route.params;
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [selectedCourse, setSelectedCourse] = useState<string>('All');

  const filterByCourse = (course: string) => {
    if (course === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item: { course: string; }) => item.course === course));
    }
    setSelectedCourse(course);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Filter Menu</Text>
        <Picker selectedValue={selectedCourse} onValueChange={filterByCourse} style={styles.picker}>
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Starters" value="Starters" />
          <Picker.Item label="Mains" value="Mains" />
          <Picker.Item label="Desserts" value="Desserts" />
        </Picker>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.name}</Text>
              <Text style={styles.menuItemSubText}>Course: {item.course}</Text>
              <Text style={styles.menuItemSubText}>Price: ${item.price.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const ManageMenu: React.FC<{ route: any }> = ({ route }) => {
  const { menuItems, updateMenuItems } = route.params;
  const [dishName, setDishName] = useState<string>('');
  const [course, setCourse] = useState<string>('Starters');
  const [price, setPrice] = useState<string>('');

  const addMenuItem = () => {
    if (dishName && price) {
      const newMenuItem: MenuItem = { name: dishName, course, price: parseFloat(price) };
      updateMenuItems([...menuItems, newMenuItem]);
      setDishName('');
      setPrice('');
    }
  };

  const removeMenuItem = (itemToRemove: MenuItem) => {
    updateMenuItems(menuItems.filter((item: { name: string; }) => item.name !== itemToRemove.name));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Menu</Text>
        <TextInput
          style={styles.input}
          placeholder="Dish Name"
          value={dishName}
          onChangeText={setDishName}
        />
        <Picker selectedValue={course} onValueChange={setCourse} style={styles.picker}>
          <Picker.Item label="Starters" value="Starters" />
          <Picker.Item label="Mains" value="Mains" />
          <Picker.Item label="Desserts" value="Desserts" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={addMenuItem}>
          <Text style={styles.buttonText}>Add Dish</Text>
        </TouchableOpacity>
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.name}</Text>
              <TouchableOpacity onPress={() => removeMenuItem(item)}>
                <Text style={[styles.buttonText, { color: 'red' }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="FilterMenu" component={FilterMenu} />
        <Stack.Screen name="ManageMenu" component={ManageMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  menuItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuItemSubText: {
    fontSize: 14,
    color: '#777',
  },
  averageText: {
    fontSize: 16,
    color: '#444',
    marginVertical: 2,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
