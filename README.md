# react-native-micro-animated-button

<img src="https://raw.githubusercontent.com/sonaye/react-native-micro-animated-button/master/demo.gif" width="400">

# Installation

`yarn add react-native-vector-icons react-native-micro-animated-button`

`react-native-vector-icons` may require native linking, see package [repository](https://github.com/oblador/react-native-vector-icons) for more details.

# Definition

```javascript
type button = {
  activeOpacity?: number,           // default = 1
  backgroundColor?: string,         // default = white
  bounce?: boolean,                 // default = false
  disabled?: boolean,               // default = false
  disabledBackgroundColor: string,  // default = gray
  disabledForegroundColor: string,  // default = white
  errorColor: string,               // default = red
  errorIconColor?: string,          // default = white
  errorIconName: string,
  foregroundColor?: string,         // default = blue
  iconSet? any,                     // default = FontAwesome
  iconSize?: number,                // default = 17
  label: string,
  labelIcon?: string,               // default = icons names from FontAwesome
  labelStyle?: Object,              // default = defaultLabelStyle
  maxWidth?: number,                // default = 240
  minWidth?: number,                // default = 40
  noFill?: boolean,                 // default = false
  onError?: Function,               // default = () => null
  onLoad?: Function,                // default = () => null
  onPress?: Function,               // default = () => null
  onReset?: Function,               // default = () => null
  onSecondaryPress?: Function,      // default = () => null
  onSuccess?: Function,             // default = () => null
  renderIcon?: any,                 // default = <FontAwesome />
  renderIndicator?: any,            // default = <ActivityIndicator />
  scaleFactor?: number,             // default = 1.1
  scaleOnSuccess?: boolean,         // default = false
  shakeOnError?: boolean,           // default = false
  shouldExpandOnFinish?: boolean,   // default = false
  static?: boolean,                 // default = false
  style?: Object,                   // default = defaultStyle
  successColor?: string,            // default = green
  successIconColor?: string,        // default = white
  successIconName: string,
};

const defaultStyle = {
  alignItems: 'center',
  borderRadius: 20,
  borderWidth: 1,
  height: 40,
  justifyContent: 'center',
  marginVertical: 10
};

const defaultLabelStyle = {
  padding: 9
};

// methods
button.error();   // Animates button to error state
button.load();    // Animates button to loading state
button.reset();   // Animates button to initial/default state
button.success(); // Animates button to success state
```

## Examples

```javascript
import React, { Component } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';

import Button from 'react-native-micro-animated-button';

const colors =
  Platform.OS === 'ios'
    ? {
        blue: '#007aff',
        gray: '#d8d8d8',
        green: '#4cd964',
        red: '#ff3b30',
        white: '#ffffff'
      }
    : {
        blue: '#4285f4',
        gray: '#d8d8d8',
        green: '#0f9d58',
        red: '#db4437',
        white: '#ffffff'
      };

const Example1 = () => (
  <View style={styles.center}>
    <Button
      foregroundColor={colors.green}
      label="Submit"
      onPress={() => this.b1.success()}
      ref={ref => (this.b1 = ref)}
      successIconName="check"
    />

    <Button
      foregroundColor={colors.blue}
      label="Retweet"
      onPress={() => this.b2.success()}
      ref={ref => (this.b2 = ref)}
      successIconName="retweet"
    />

    <Button
      foregroundColor={colors.red}
      label="Favorite"
      onPress={() => this.b3.success()}
      ref={ref => (this.b3 = ref)}
      successIconName="heart"
    />
  </View>
);

const Example2 = () => (
  <View style={styles.center}>
    <Button
      errorColor={colors.red}
      errorIconName="thumbs-down"
      foregroundColor={colors.blue}
      label="Am I even?"
      onPress={() =>
        new Date().getSeconds() % 2 === 0 ? this.b4.success() : this.b4.error()
      }
      ref={ref => (this.b4 = ref)}
      successColor={colors.green}
      successIconName="thumbs-up"
      shouldExpandOnFinish
    />

    <Button
      errorColor={colors.red}
      errorIconName="thumbs-down"
      foregroundColor={colors.blue}
      label="Am I even?"
      onPress={() =>
        new Date().getSeconds() % 2 === 0 ? this.b5.success() : this.b5.error()
      }
      ref={ref => (this.b5 = ref)}
      successColor={colors.green}
      successIconName="thumbs-up"
      shouldExpandOnFinish
    />
  </View>
);

const Example3 = () => (
  <View style={styles.center}>
    <Button
      backgroundColor={colors.blue}
      errorColor={colors.red}
      errorIconName="warning"
      foregroundColor={colors.white}
      label="Simulate an error"
      onPress={() => this.b6.error()}
      ref={ref => (this.b6 = ref)}
      shakeOnError
      style={styles.noRadius}
    />

    <Button
      backgroundColor={colors.blue}
      foregroundColor={colors.white}
      label="Smile at me"
      onPress={() => this.b7.success()}
      ref={ref => (this.b7 = ref)}
      scaleOnSuccess
      style={styles.noRadius}
      successColor={colors.green}
      successIconName="smile-o"
    />
  </View>
);

const Example4 = () => (
  <View style={styles.center}>
    <Button disabled label="Disabled Button" style={styles.noRadius} />

    <Button
      activeOpacity={0.5}
      backgroundColor={colors.blue}
      foregroundColor={colors.white}
      label="Static Button"
      onPress={() => null}
      static
      style={styles.noRadius}
    />
  </View>
);

class Example5 extends Component {
  state = { clicked: false };

  render() {
    return (
      <View style={styles.row}>
        <Button
          activeOpacity={0.5}
          foregroundColor={colors.blue}
          labelIcon="cloud-download"
          noFill
          onPress={() =>
            this.setState({ clicked: true }, () => this.b8.success())
          }
          onSecondaryPress={() =>
            this.setState({ clicked: false }, () => this.b8.reset())
          }
          ref={ref => (this.b8 = ref)}
          style={styles.noRadius}
          successColor={colors.blue}
          successIconColor={colors.blue}
          successIconName="remove"
        />

        {this.state.clicked && (
          <Text style={styles.rightText}>I just got downloaded</Text>
        )}
      </View>
    );
  }
}

const Examples = () => (
  <ScrollView contentContainerStyle={styles.landing}>
    <Example1 />
    <Example2 />
    <Example3 />
    <Example4 />
    <Example5 />
  </ScrollView>
);

const styles = {
  center: { alignItems: 'center' },
  landing: { flex: 1, justifyContent: 'center' },
  noRadius: { borderRadius: 0 },
  rightText: { color: colors.blue, marginLeft: 10 },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }
};

export default Examples;
```

Live demo in Expo [available here](https://expo.io/@nnals/react-native-micro-animated-button-example).
