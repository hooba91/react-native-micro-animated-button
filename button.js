import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
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
    errorIcon: 'warning',
    iconSize: 17,
    maxWidth: 240,
    minWidth: 40,
    scaleFactor: 1.1,
    successIcon: 'check'
  };

  state = {
    step: this.props.disabled ? 0 : 1,
    error: false
  };

  animated = new Animated.Value(this.props.disabled ? 0 : 1);
  micro = new Animated.Value(0);

  deprecate = (prop, newProp) => {
    if (this.props[prop])
      console.warn(
        `${prop} has been deprecated${newProp ? ` use ${newProp}` : ''}`
      );
  };

  componentWillMount() {
    this.deprecate('errorColor', 'errorBackgroundColor');
    this.deprecate('errorIconColor', 'errorForegroundColor');
    this.deprecate('errorIconName', 'errorIcon');
    this.deprecate('labelIcon', 'icon');
    this.deprecate('renderIcon', 'renderErrorIcon and renderSuccessIcon');
    this.deprecate('shouldExpandOnFinish', 'expandOnFinish');
    this.deprecate('successColor', 'successBackgroundColor');
    this.deprecate('successIconColor', 'successForegroundColor');
    this.deprecate('successIconName', 'successIcon');
  }

  componentWillReceiveProps(nextProps) {
    const { disabled } = this.props;

    if (nextProps.disabled !== disabled)
      this.setState({ step: disabled ? 1 : 0, error: false }, () =>
        Animated.timing(this.animated, {
          toValue: disabled ? 1 : 0,
          duration: 250
        }).start()
      );
  }

  successBackgroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      this.props.disabledBackgroundColor || colors.white,
      this.props.backgroundColor || colors.white,
      this.props.backgroundColor || colors.white,
      this.props.noFill
        ? this.props.backgroundColor || colors.white
        : this.props.successBackgroundColor ||
          this.props.foregroundColor ||
          colors.green
    ]
  });

  errorBackgroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      this.props.disabledBackgroundColor || colors.white,
      this.props.backgroundColor || colors.white,
      this.props.backgroundColor || colors.white,
      this.props.noFill
        ? this.props.backgroundColor || colors.white
        : this.props.errorBackgroundColor ||
          this.props.foregroundColor ||
          colors.red
    ]
  });

  successForegroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      this.props.disabledForegroundColor || colors.gray,
      this.props.foregroundColor || colors.blue,
      this.props.foregroundColor || colors.blue,
      this.props.noFill
        ? this.props.successForegroundColor ||
          this.props.foregroundColor ||
          colors.blue
        : this.props.successForegroundColor ||
          this.props.backgroundColor ||
          colors.white
    ]
  });

  errorForegroundColor = this.animated.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      this.props.disabledForegroundColor || colors.gray,
      this.props.foregroundColor || colors.blue,
      this.props.foregroundColor || colors.blue,
      this.props.noFill
        ? this.props.errorForegroundColor ||
          this.props.foregroundColor ||
          colors.blue
        : this.props.errorForegroundColor ||
          this.props.backgroundColor ||
          colors.white
    ]
  });

  width = this.animated.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      this.props.maxWidth,
      this.props.maxWidth,
      this.props.minWidth,
      this.props.expandOnFinish ? this.props.maxWidth : this.props.minWidth
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
      this.setState({ step: 2 }, () =>
        Animated.spring(this.animated, { toValue: 2 }).start(
          ({ finished }) =>
            finished && this.props.onPress && this.props.onPress()
        )
      );
  };

  success = () => {
    this.setState({ step: 3, error: false }, () =>
      Animated.spring(this.animated, { toValue: 3 }).start(
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
    this.setState({ step: 3, error: true }, () =>
      Animated.spring(this.animated, { toValue: 3 }).start(
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
    this.setState({ step: 1, error: false }, () =>
      Animated.spring(this.animated, { toValue: 1 }).start(
        ({ finished }) => finished && this.props.onReset && this.props.onReset()
      )
    );

  load = () =>
    this.setState({ step: 2, error: false }, () =>
      Animated.spring(this.animated, { toValue: 2 }).start(
        ({ finished }) => finished && this.props.onLoad && this.props.onLoad()
      )
    );

  Icon = Animated.createAnimatedComponent(this.props.iconSet || FontAwesome);

  render() {
    const {
      activeOpacity,
      bounce,
      disabled,
      errorIcon,
      foregroundColor,
      icon,
      iconSize,
      iconStyle,
      label,
      labelStyle,
      noRadius,
      onSecondaryPress,
      renderErrorIcon,
      renderIndicator,
      renderLabel,
      renderSuccessIcon,
      style,
      successIcon
    } = this.props;

    const { step, error } = this.state;

    const {
      errorBackgroundColor,
      errorForegroundColor,
      Icon,
      onPress,
      scale,
      shake,
      successBackgroundColor,
      successForegroundColor,
      width
    } = this;

    const AnimatedBackgroundColor = error
      ? errorBackgroundColor
      : successBackgroundColor;

    const AnimatedForegroundColor = error
      ? errorForegroundColor
      : successForegroundColor;

    const button = (
      <Animated.View
        style={[
          {
            backgroundColor: AnimatedBackgroundColor,
            borderColor: AnimatedForegroundColor,
            transform: [error ? { translateX: shake } : { scale }],
            width
          },
          styles.button,
          noRadius && { borderRadius: 0 },
          style
        ]}>
        {(step === 0 || step === 1) && (
          <View>
            {renderLabel ||
              (icon ? (
                <Icon
                  name={icon}
                  size={iconSize}
                  style={[{ color: AnimatedForegroundColor }, iconStyle]}
                />
              ) : (
                <Animated.Text
                  style={[
                    { color: AnimatedForegroundColor },
                    styles.label,
                    labelStyle
                  ]}>
                  {label}
                </Animated.Text>
              ))}
          </View>
        )}

        {step === 2 &&
          (renderIndicator || (
            <ActivityIndicator color={foregroundColor || colors.blue} />
          ))}

        {step === 3 &&
          (error
            ? renderErrorIcon || (
                <Icon
                  name={errorIcon}
                  size={iconSize}
                  style={[{ color: errorForegroundColor }, iconStyle]}
                />
              )
            : renderSuccessIcon || (
                <Icon
                  name={successIcon}
                  size={iconSize}
                  style={[{ color: successForegroundColor }, iconStyle]}
                />
              ))}
      </Animated.View>
    );

    const props = {
      children: button,
      disabled: step === 2 || (step === 3 && !onSecondaryPress) || disabled,
      onPress: (step === 3 && onSecondaryPress) || onPress,
      ...(bounce ? {} : { activeOpacity })
    };

    if (bounce) return <TouchableBounce {...props} />;

    return <TouchableOpacity {...props} />;
  }
}

const styles = {
  button: {
    alignItems: 'center',
    borderRadius: 40 / 2,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginVertical: 10
  },
  label: {
    backgroundColor: 'transparent',
    padding: 10
  }
};
