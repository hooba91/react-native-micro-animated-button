import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

export default class extends Component {
  static defaultProps = {
    backgroundColor: colors.white,
    disabledBackgroundColor: colors.gray,
    disabledForegroundColor: colors.white,
    errorIconColor: colors.white,
    foregroundColor: colors.blue,
    iconSize: 17,
    maxWidth: 240,
    minWidth: 40,
    scaleFactor: 1.1,
    successIconColor: colors.white
  };

  state = { step: 0, error: false };

  animated = new Animated.Value(0);
  micro = new Animated.Value(0);

  successBackgroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      this.props.backgroundColor,
      this.props.backgroundColor,
      this.props.successColor || this.props.foregroundColor || colors.green
    ]
  });

  errorBackgroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      this.props.backgroundColor,
      this.props.backgroundColor,
      this.props.errorColor || this.props.foregroundColor || colors.red
    ]
  });

  width = this.animated.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      this.props.maxWidth,
      this.props.minWidth,
      this.props.shouldExpandOnFinish
        ? this.props.maxWidth
        : this.props.minWidth
    ]
  });

  shake = this.micro.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 10, -10]
  });

  scale = this.micro.interpolate({
    inputRange: [0, 1],
    outputRange: [1, this.props.scaleFactor]
  });

  onPress = () => {
    if (this.props.static) {
      if (this.props.onPress) this.props.onPress();
    } else
      this.setState({ step: 1 }, () =>
        Animated.spring(this.animated, { toValue: 1 }).start(
          ({ finished }) =>
            finished && this.props.onPress && this.props.onPress()
        )
      );
  };

  success = () => {
    this.setState({ step: 2, error: false }, () =>
      Animated.spring(this.animated, { toValue: 2 }).start(
        ({ finished }) =>
          finished && this.props.onSuccess && this.props.onSuccess()
      )
    );

    if (this.props.scaleOnSuccess)
      Animated.sequence([
        Animated.timing(this.micro, { toValue: 1, duration: 80 }),
        Animated.timing(this.micro, { toValue: 0, duration: 80 })
      ]).start();
  };

  error = () => {
    this.setState({ step: 2, error: true }, () =>
      Animated.spring(this.animated, { toValue: 2 }).start(
        ({ finished }) => finished && this.props.onError && this.props.onError()
      )
    );

    if (this.props.shakeOnError)
      Animated.sequence([
        Animated.timing(this.micro, { toValue: 0, duration: 40 }),
        Animated.timing(this.micro, { toValue: 2, duration: 40 }),
        Animated.timing(this.micro, { toValue: 0, duration: 40 })
      ]).start();
  };

  reset = () =>
    this.setState({ step: 0 }, () =>
      Animated.spring(this.animated, { toValue: 0 }).start(
        ({ finished }) => finished && this.props.onReset && this.props.onReset()
      )
    );

  load = () =>
    this.setState({ step: 1 }, () =>
      Animated.spring(this.animated, { toValue: 1 }).start(
        ({ finished }) => finished && this.props.onLoad && this.props.onLoad()
      )
    );

  render() {
    const {
      backgroundColor,
      bounce,
      disabled,
      disabledBackgroundColor,
      disabledForegroundColor,
      errorColor,
      errorIconColor,
      errorIconName,
      foregroundColor,
      iconSet,
      iconSize,
      label,
      labelIcon,
      labelStyle,
      noFill,
      onSecondaryPress,
      renderIcon,
      renderIndicator,
      style,
      successColor,
      successIconColor,
      successIconName
    } = this.props;

    const { step, error } = this.state;

    const {
      errorBackgroundColor,
      onPress,
      scale,
      shake,
      successBackgroundColor,
      width
    } = this;

    const Icon = iconSet || FontAwesome;

    const button = (
      <Animated.View
        style={[
          {
            backgroundColor: disabled
              ? disabledBackgroundColor
              : noFill
                ? backgroundColor
                : error ? errorBackgroundColor : successBackgroundColor,
            borderColor: disabled
              ? disabledBackgroundColor
              : step === 2
                ? error
                  ? errorColor || foregroundColor || colors.red
                  : successColor || foregroundColor || colors.green
                : foregroundColor,
            transform: [error ? { translateX: shake } : { scale }],
            width
          },
          styles.button,
          style
        ]}>
        {step === 0 && (
          <View>
            {labelIcon ? (
              <Icon
                color={disabled ? disabledForegroundColor : foregroundColor}
                name={labelIcon}
                size={iconSize}
              />
            ) : (
              <Text
                style={[
                  {
                    color: disabled ? disabledForegroundColor : foregroundColor
                  },
                  styles.label,
                  labelStyle
                ]}>
                {label}
              </Text>
            )}
          </View>
        )}
        {step === 1 &&
          (renderIndicator || <ActivityIndicator color={foregroundColor} />)}
        {step === 2 &&
          (renderIcon || (
            <Icon
              color={error ? errorIconColor : successIconColor}
              name={error ? errorIconName : successIconName}
              size={iconSize}
            />
          ))}
      </Animated.View>
    );

    const props = {
      disabled: step === 1 || (step === 2 && !onSecondaryPress) || disabled,
      onPress: (step === 2 && onSecondaryPress) || onPress,
      children: button
    };

    if (bounce) return <TouchableBounce {...props} />;

    return <TouchableOpacity {...props} />;
  }
}

const styles = {
  button: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginVertical: 10
  },
  label: { padding: 9 }
};
