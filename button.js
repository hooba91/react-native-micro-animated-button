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

  initialStep = this.props.disabled
    ? 0
    : ['success', 'error'].includes(this.props.initialState)
      ? 3
      : this.props.initialState === 'loading'
        ? 2
        : 1;

  state = {
    step: this.initialStep,
    error: this.props.initialState === 'error'
  };

  animated = new Animated.Value(this.initialStep);

  micro = new Animated.Value(0);

  componentWillReceiveProps(nextProps) {
    const { disabled } = this.props;

    if (nextProps.disabled !== disabled) this.disable(disabled);
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

  width = this.props.width ||
  this.animated.interpolate({
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

  animate = (step, { cb, error = false, timing = false, micro } = {}) => {
    this.setState({ step, error }, () =>
      (timing ? Animated.timing : Animated.spring)(this.animated, {
        toValue: step,
        ...(timing ? { duration: 250 } : {})
      }).start(({ finished }) => finished && cb && cb())
    );

    if (micro) micro();
  };

  microScale = () =>
    this.props.scaleOnSuccess &&
    Animated.sequence([
      Animated.timing(this.micro, { toValue: 1, duration: 80 }),
      Animated.timing(this.micro, { toValue: 0, duration: 80 })
    ]).start();

  microShake = () =>
    this.props.shakeOnError &&
    Animated.sequence([
      Animated.timing(this.micro, { toValue: 0, duration: 40 }),
      Animated.timing(this.micro, { toValue: 2, duration: 40 }),
      Animated.timing(this.micro, { toValue: 0, duration: 40 })
    ]).start();

  disable = disabled => this.animate(disabled ? 1 : 0, { timing: true });

  reset = () => this.animate(1, { cb: this.props.onReset });

  onPress = () =>
    this.props.static
      ? this.props.onPress && this.props.onPress()
      : this.animate(2, { cb: this.props.onPress });

  load = () => this.animate(2, { cb: this.props.onLoad });

  success = () =>
    this.animate(3, { cb: this.props.onSuccess, micro: this.microScale });

  error = () =>
    this.animate(3, {
      cb: this.props.onError,
      error: true,
      micro: this.microShake
    });

  animatedIcon = Animated.createAnimatedComponent(
    this.props.iconSet || FontAwesome
  );

  renderLabel = (label, style) => (
    <Animated.Text style={style}>{label}</Animated.Text>
  );

  renderIcon = (icon, color) => (
    <this.animatedIcon
      name={icon}
      size={this.props.iconSize}
      style={[{ color }, this.props.iconStyle]}
    />
  );

  render() {
    const {
      activeOpacity,
      bounce,
      disabled,
      errorIcon,
      errorLabel,
      foregroundColor,
      icon,
      label,
      labelStyle,
      noRadius,
      onSecondaryPress,
      renderErrorIcon,
      renderIndicator,
      renderLabel,
      renderSuccessIcon,
      style,
      successIcon,
      successLabel
    } = this.props;

    const { step, error } = this.state;

    const {
      errorBackgroundColor,
      errorForegroundColor,
      onPress,
      scale,
      shake,
      successBackgroundColor,
      successForegroundColor,
      width
    } = this;

    const animatedBackgroundColor = error
      ? errorBackgroundColor
      : successBackgroundColor;

    const animatedForegroundColor = error
      ? errorForegroundColor
      : successForegroundColor;

    const buttonStyle = [
      {
        backgroundColor: animatedBackgroundColor,
        borderColor: animatedForegroundColor,
        transform: [error ? { translateX: shake } : { scale }],
        width
      },
      styles.button,
      noRadius && { borderRadius: 0 },
      style
    ];

    const newLabelStyle = [
      { color: animatedForegroundColor },
      styles.label,
      labelStyle
    ];

    const button = (
      <Animated.View style={buttonStyle}>
        {(step === 0 || step === 1) && (
          <View>
            {renderLabel ||
              (icon
                ? this.renderIcon(icon, animatedForegroundColor)
                : this.renderLabel(label, newLabelStyle))}
          </View>
        )}

        {step === 2 &&
          (renderIndicator || (
            <ActivityIndicator color={foregroundColor || colors.blue} />
          ))}

        {step === 3 &&
          (error
            ? errorLabel
              ? this.renderLabel(errorLabel, newLabelStyle)
              : renderErrorIcon ||
                this.renderIcon(errorIcon, errorForegroundColor)
            : successLabel
              ? this.renderLabel(successLabel, newLabelStyle)
              : renderSuccessIcon ||
                this.renderIcon(successIcon, successForegroundColor))}
      </Animated.View>
    );

    const props = {
      children: button,
      disabled: step === 2 || (step === 3 && !onSecondaryPress) || disabled,
      onPress: (step === 3 && onSecondaryPress) || onPress,
      ...(!bounce ? { activeOpacity } : {})
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
