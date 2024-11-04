# mentalcareapp
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // 네비게이션 컨테이너 
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; // Drawer 네비게이션
import { WebView } from 'react-native-webview';

function Page1({ navigation }) { // 홈화면 구현
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'steelblue' }}>
      <Text>Page1</Text>
      <Text style={styles.paragraph}>About Mental Health</Text>
    </View>
  );
}
function Page2({ navigation }) {
  return (
    <View style={styles.web_container}>
      <Text style={{color:'blue', fontSize: 20, fontWeight: 'bold', margin:10}}>depression test</Text>
      <WebView source={{ uri: 'https://www.psycacademy.com/landing/psyh/DEPS-1740?hl=KR&gad_source=1&gclid=Cj0KCQjwvpy5BhDTARIsAHSilymoaUT6PcxcWEjFNtfZkYfVDRUppPUX83j1rUR8ilqnBk1YVSwocRcaArMwEALw_wcB&logid=6a2445a79761418698f101d988dd1fb5' }}/> //웹뷰 사용
    </View> 
  );
}

const Page3 = ({ navigation }) => {
  return (
    <View style={styles.web_container}>
      <Text style={{color:'blue', fontSize: 20, fontWeight: 'bold', margin:10}}>Informaiton</Text>
      <WebView source={{ uri: 'https://www.ncmh.go.kr/ncmh/main.do' }}/> // 웹뷰 사용
    </View> 
  );
}

function Page4({ navigation }) {
  return(
    <ScrollView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
      <Text>Page2</Text>
      <Text style={styles.paragraph}>~명상 시간~</Text>
      <Image style={styles.logo} source={require('./assets/pp1.jpg')} /> //스크롤뷰와 이미지 사용
    </ScrollView>
  );
}

function CustomDrawerContent (props) {
  return (
    <DrawerContentScrollView {...props} style={{backgroundColor:"seagreen"}}>
      <DrawerItemList {...props}/>
      <DrawerItem label="Copyright" onPress={() => alert("Copyright 2024. PKNU all right reserved.")} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator(); // Drawer Navigation함수를 Drawer변수명으로 저장

const App = () => {
  return (
    <NavigationContainer>
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Page1} />
      <Drawer.Screen name="Depression test" component={Page2} />
      <Drawer.Screen name="Meditation" component={Page4} />
      <Drawer.Screen name="Info." component={Page3} />
      
    </Drawer.Navigator>
    </NavigationContainer>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 20,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'hotpink',
  },
  logo: {
    height: 200,
    width:200,
  },
  web_container: {
    flex: 1,
  },
});
