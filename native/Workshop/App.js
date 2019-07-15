import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

const server = '80.93.177.192'

export default function App() {
  state = {text: ''}
  handleClick = (e) => {
    return fetch('http://${server}/words/?word=${this.state}&langTo=russian&langFrom=kalmyk')
  }
  return (
    <View style={styles.container}>
        <Text style={styles.paragraph}>
          Калмыцко - русский переводчик
        </Text>
        <TextInput
          style={styles.input}
          editable={true}
          maxLength={40}
          placeholder={'Введите слово'}
          onChangeText={(v) => this.setState({text: v + ''})}
          value={this.state.text}
        />
        <View style={styles.viewButton}>
          <Button
            style={styles.button}
            title='Ok'
            onPress={this.handleClick}
          >
          </Button>
        </View>
        <Card
          style={styles.card}
        >
          {this.

          }
        </Card>

    </View>
  }
}

const styles = StyleSheet.create({
  container: {

    marginVertical: 15,
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    padding: 8,
  },
  card: {
    margin: 14,
  },
  paragraph: {
    margin: 14,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    margin: 14,
    height: 50,
    fortSize: 25,
    fontFamily: 'verdana',
    backgroundColor: '#edeef0',

  },
  output: {
    margin: 14,
  },
  viewButton: {
    margin: 14,
  },
});
