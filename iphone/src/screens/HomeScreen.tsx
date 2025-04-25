import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to ICBC Study Hub</Text>
          <Text style={styles.subtitle}>
            Your companion for ICBC knowledge test preparation
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Study')}>
            <Icon name="library-books" size={30} color="#fff" />
            <Text style={styles.buttonText}>Study Materials</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.quizButton]}
            onPress={() => navigation.navigate('Quiz')}>
            <Icon name="quiz" size={30} color="#fff" />
            <Text style={styles.buttonText}>Practice Quiz</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Getting Started</Text>
          <Text style={styles.infoText}>
            1. Review study materials{'\n'}
            2. Take practice quizzes{'\n'}
            3. Track your progress{'\n'}
            4. Master road signs and rules
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quizButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default HomeScreen; 