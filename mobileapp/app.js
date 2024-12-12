import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, Switch, ActivityIndicator, Alert , FlatList,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가


// 로그인 화면 처리
const LoginScreen = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputTextColor1, setInputTextColor1] = useState('gray');
  const [inputTextColor2, setInputTextColor2] = useState('gray');

  const handleLogin = () => {
    const JSON_INFO_URL = 'https://raw.githubusercontent.com/joungyeohyeon/digitalhealthcareplatform/refs/heads/main/logininfo.json';

    fetch(JSON_INFO_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('서버 응답이 정상적이지 않습니다');
        }
        return response.json();
      })
      .then(users => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
          setIsLoggedIn(true);
          alert('로그인 성공');
        } else {
          alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
      })
      .catch(error => {
        console.error('로그인 에러:', error);
        alert('에러 발생', '로그인 요청 중 문제가 발생했습니다: ' + error.message);
      });
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setInputTextColor1(text.length > 0 ? 'black' : 'gray');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setInputTextColor2(text.length > 0 ? 'black' : 'gray');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={require('./assets/pp.jpg')} style={styles.logo} />
        <Text style={styles.welcomeText}>두통 일기</Text>
      </View>
      <View style={styles.loginInfoContainer}>
        <Text style={styles.titleText}>이메일</Text>
        <TextInput
          style={[styles.inputContainer, { color: inputTextColor1 }]}
          placeholder="이메일 입력"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.titleText}>비밀번호</Text>
        <TextInput
          style={[styles.inputContainer, { color: inputTextColor2 }]}
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// WriteScreen
function WriteScreen({ onSaveDate, isDarkMode }) {
  const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date()); // 날짜 선택 상태
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker 상태
  const [alertShown, setAlertShown] = useState(false); // 알림이 이미 표시된 경우 처리

  const saveCount = () => {
  // count와 날짜를 저장하고 상태를 업데이트
  onSaveDate(selectedDate.toISOString().split('T')[0], count);
  
  // 알림을 매번 표시하도록 변경
  Alert.alert(
    `두통 강도: ${count}이(가) 저장되었습니다.`,
    `저장된 날짜: ${selectedDate.toISOString().split('T')[0]}`, // 날짜를 추가하여 표시
    [
      {
        text: "확인",
        onPress: () => {
          // 저장 후 두통 강도와 날짜 초기화
          setCount(0);  // 두통 강도 초기화
          setSelectedDate(new Date()); // 날짜 초기화
        },
      },
    ]
  );
};

const increaseCount = () => {
  if (count < 10) {
    setCount(count + 1);
  } else {
    if (!alertShown) {
      Alert.alert("입력할 수 있는 두통 강도는 최대 10입니다.");
      setAlertShown(true);
    }
  }
};

 const resetForm = () => {
  setCount(0);
  setAlertShown(false); // 알림을 다시 활성화
};


  const handleDateChange = (event, selectedDate) => {
    // 선택된 날짜가 null인 경우 현재 날짜를 사용
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false); // DatePicker를 닫음
    setSelectedDate(currentDate); // 선택한 날짜로 상태 업데이트
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : 'skyblue' }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="sad" size={250} color="#5E7CE2" />
        <Text style={[styles.countText, styles.overlayCount]}>{count}</Text>
      </View>

      <View>
        <Text style={styles.basicText}>두통 강도와 날짜를 입력해 주세요.</Text>
        <Text style={styles.basicText}>(두통 강도는 0-10까지 입력 가능)</Text>

        {/* 날짜 선택 버튼 */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
  {selectedDate.toISOString().split('T')[0]} {/* YYYY-MM-DD 형식으로 표시 */}
</Text>

        </TouchableOpacity>

        {/* 두통 강도 입력 부분 */}
        <TouchableOpacity style={styles.eventButton} onPress={increaseCount}>
          <Text style={styles.eventButtonText}>두통 강도 증가</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.eventButtonText}>초기화</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveCount}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>

        {/* DateTimePicker 표시 */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    </View>
  );
}


// CalendarScreen
// 화면의 너비와 높이를 가져옴
const { width, height } = Dimensions.get('window');

function CalendarScreen({ savedDates, headacheIntensities, onDeleteDate, isDarkMode }) {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const updatedMarkedDates = {};
    savedDates.forEach((date, index) => {
      const colorIntensity = getColorForIntensity(headacheIntensities[index]);
      updatedMarkedDates[date] = {
        selected: true,
        selectedColor: colorIntensity,
        selectedTextColor: 'white',
      };
    });
    setMarkedDates(updatedMarkedDates);
  }, [savedDates, headacheIntensities]);

  const getColorForIntensity = (intensity) => {
    const color = `rgb(${173 - (intensity * 17)}, ${216 - (intensity * 17)}, 230)`;
    return color;
  };

  const onDayPress = (day) => {
    const date = day.dateString;
    const index = savedDates.indexOf(date);
    if (index !== -1) {
      alert(`선택된 날짜: ${date}, 두통 강도: ${headacheIntensities[index]}`);
    } else {
      alert(`선택된 날짜: ${date}, 두통 강도가 저장되지 않았습니다.`);
    }
  };

  const handleDelete = (date) => {
    onDeleteDate(date);
    alert('두통 강도와 날짜가 삭제되었습니다.');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : 'skyblue' }]}>
       <Text style={[styles.titleText, { color: isDarkMode ? '#fff' : '#000' }]}>두통 기록 달력</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          monthFormat={'yyyy MM'}
          style={{
            width: width,
            height: height * 0.6,
          }}
        />
      </View>
      {savedDates.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(savedDates[savedDates.length - 1])}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}




function ChartScreen({ savedDates, headacheIntensities , isDarkMode}) {
  // 날짜와 두통 강도를 바탕으로 차트 데이터 생성
  const lineChartData = {
    labels: savedDates,  // x축에는 저장된 날짜
    datasets: [
      {
        data: headacheIntensities,  // y축에는 두통 강도
        strokeWidth: 2,  // 선 두께
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,  // 선 색상
      },
    ],
  };

  const barChartData = {
    labels: savedDates,  // x축에는 저장된 날짜
    datasets: [
      {
        data: headacheIntensities,  // y축에는 두통 강도
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,  // 막대 색상
      },
    ],
  };

  return (
    <View style={[styles.webContainer, {backgroundColor: isDarkMode ? '#333' : 'skyblue'}]}>
       <Text style={[styles.titleText, { color: isDarkMode ? '#fff' : '#000' }]}>차트</Text>

      {/* LineChart */}
      <LineChart
        data={lineChartData}
        width={Dimensions.get('window').width - 40}  // 화면 너비에 맞게 설정
        height={220} // 차트의 높이
        yAxisLabel="강도" // y축 라벨
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 2, // 소수점 이하 2자리
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: 'center',
          justifyContent: 'center'
          
        }}
      />

      {/* BarChart */}
      <BarChart
        data={barChartData}
        width={Dimensions.get('window').width - 40}  // 화면 너비에 맞게 설정
        height={220} // 차트의 높이
        yAxisLabel="강도" // y축 라벨
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 0, // 소수점 없이 정수로 표시
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      />
    </View>
  );
}


// InfoScreen
function InfoScreen({isDarkMode}) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.webContainer, {backgroundColor: isDarkMode ? '#333' : '#fff'}]}>
     <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>정보</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WebView
        source={{ uri: 'https://www.headache.or.kr/index.php' }}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
}

function SettingsScreen({ isDarkMode, setIsDarkMode, setIsLoggedIn, navigation }) {
  const [showAppInfo, setShowAppInfo] = useState(false);

  const settingsData = [
    { id: '1', title: '다크모드', component: <Switch value={isDarkMode} onValueChange={setIsDarkMode} /> },
    { id: '2', title: '앱 정보', component: <Text style={{ fontSize: 20, color: isDarkMode ? '#fff' : '#000' }}>앱 정보</Text> },
    { id: '3', title: '데이터 및 캐시 지우기', component: <Text style={{ fontSize: 16, color: isDarkMode ? '#fff' : '#000' }}>데이터 및 캐시 지우기</Text> },
    { id: '4', title: '로그아웃', component: <Text style={styles.logoutText}>로그아웃</Text> }
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  const clearDataAndCache = async () => {
    try {
      await AsyncStorage.clear(); // AsyncStorage에 저장된 모든 데이터 지우기
      alert('데이터와 캐시가 성공적으로 지워졌습니다.');
    } catch (error) {
      console.error('데이터 및 캐시 지우기 실패:', error);
      alert('데이터 및 캐시 지우기 실패');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, styles.button]}
      onPress={() => {
        if (item.id === '4') {
          handleLogout();
        } else if (item.id === '2') {
          setShowAppInfo(true);
        } else if (item.id === '3') {
          Alert.alert(
            '확인',
            '정말로 데이터와 캐시를 지우시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { text: '확인', onPress: clearDataAndCache }
            ]
          );
        }
      }}
    >
      <Text style={[styles.titleText, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
      {item.component}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#333' : 'skyblue' }]}>
      <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>설정</Text>
      
      {/* ScrollView로 전체 설정 항목을 감쌈 */}
      <ScrollView style={styles.scrollContainer}>
        <FlatList
          data={settingsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </ScrollView>

      {/* 앱 정보 모달 */}
      {showAppInfo && (
        <View style={styles.appInfoContainer}>
          <AppInfoScreen isDarkMode={isDarkMode} closeInfo={() => setShowAppInfo(false)} />
        </View>
      )}
    </SafeAreaView>
  );
}

// AppInfoScreen
function AppInfoScreen({ isDarkMode, closeInfo }) {
  const appVersion = '1.0.0'; // 앱 버전
  const developerContact = '200x3@naver.com'; // 개발자 연락처

  return (
    <View style={[styles.appInfoContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>앱 정보</Text>
      <Text style={[styles.basicText, { color: isDarkMode ? '#fff' : '#000' }]}>앱 버전: {appVersion}</Text>
      <Text style={[styles.basicText, { color: isDarkMode ? '#fff' : '#000' }]}>개발자 연락처:{developerContact}</Text>
      <TouchableOpacity onPress={closeInfo} style={styles.closeButton}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>닫기</Text>
      </TouchableOpacity>
    </View>
  );
}




// 하단 탭 네비게이션 설정
const Tab = createBottomTabNavigator();

// App.js
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedDates, setSavedDates] = useState([]);
  const [headacheIntensities, setHeadacheIntensities] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSaveDate = (date, intensity) => {
    setSavedDates((prevDates) => [...prevDates, date]);
    setHeadacheIntensities((prevIntensities) => [...prevIntensities, intensity]);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === '작성') {
              iconName = focused ? 'create' : 'create-outline';
            } else if (route.name === '캘린더') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === '통계') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === '정보') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === '설정') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#5E7CE2',
          inactiveTintColor: 'gray',
        }}
      >
        {!isLoggedIn ? (
          <Tab.Screen name="로그인">
            {() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
          </Tab.Screen>
        ) : (
          <>
            <Tab.Screen name="작성">
              {() => <WriteScreen onSaveDate={handleSaveDate} isDarkMode={isDarkMode} />}
            </Tab.Screen>
            <Tab.Screen name="캘린더">
              {() => <CalendarScreen savedDates={savedDates} headacheIntensities={headacheIntensities} isDarkMode={isDarkMode} />}
            </Tab.Screen>
            <Tab.Screen
              name="통계"
              component={() => <ChartScreen savedDates={savedDates} headacheIntensities={headacheIntensities} isDarkMode={isDarkMode} />}
            />
            <Tab.Screen name="정보" component={() => <InfoScreen isDarkMode={isDarkMode} />} />
            <Tab.Screen name="설정">
              {() => <SettingsScreen isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsLoggedIn={setIsLoggedIn} />}
            </Tab.Screen>
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'skyblue'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: 'rgba(0,0,0, .7)',
    shadowOffset: { height:1, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 3,
  },
  loginInfoContainer: {
    width: '100%',
    marginTop: 30,
    fontWeight: 'bold'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf:'relative',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: 'ivory',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    position: 'absolute',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    top: '40%',
  },
  loginButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',  // 상대 위치로 자식 요소들의 위치를 제어
  },
  overlayCount: {
    position: 'absolute',  // 이미지를 덮도록 배치 
  },
  basicText: {
    fontSize: 18,
    color: '#5E7CE2',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  eventButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  eventButtonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center'
  },
  resetButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#800080',
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webContainer: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: '#007BFF',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  calendarContainer: {
    width: '100%',  // 화면 전체를 차지하도록 설정
    justifyContent: 'center',
    alignItems: 'center',
  },
headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'relative'
  },
  item: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row', // 텍스트와 컴포넌트를 가로로 배치
  },
  button: {
    backgroundColor: 'skyblue', // 버튼 배경색
    elevation: 2, // 그림자 효과
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.2, // 그림자 투명도
    shadowRadius: 3, // 그림자 반경
  },
  logoutText: {
    fontSize: 20,
    color: 'red', // 로그아웃 텍스트는 빨간색으로 표시
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  appInfoContainer: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 100,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
});
