import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fixed: {
    position: 'absolute',
    top: 0,
  },
});

class TriggeringView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      layout: {},
      touched: false,
      hidden: false,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  onLayout(e) {
    this.layout = this.setState({
      layout: e.nativeEvent.layout,
      bottom: e.nativeEvent.layout.y + e.nativeEvent.layout.height,
    });
  }

  componentWillMount() {
    this.listenerId = this.context.scrollY.addListener(this.onScroll);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.context.scrollY.removeListener(this.listenerId);
    nextContext.scrollY.addListener(this.onScroll);
  }

  onScroll(e) {
    const value = e.value;
    if (!this.state.touched && value >= this.state.layout.y) {
      this.setState({ touched: true});
      this.props.onBeginHidden();
      this.props.onTouchTop(true);

    } else if (this.state.touched && value < this.state.layout.y) {
      this.setState({ touched: false });
      this.props.onDisplay();
      this.props.onTouchTop(false);
    }

    if (!this.state.hidden && value >= this.state.bottom) {
      this.setState({ hidden: true });
      this.props.onHide();
      this.props.onTouchBottom(true);
    } else if (this.state.hidden && value < this.state.bottom) {
      this.setState({ hidden: false });
      this.props.onBeginDisplayed();
      this.props.onTouchBottom(false);
    }
  }

  render() {
    const {children, ...viewProps} = this.props;
    return (
      <Animated.View
        onLayout={(e) => this.onLayout(e)}
        {...viewProps}
      >
        { children }
      </Animated.View>
    );
  }
}
TriggeringView.propTypes = {
  onBeginHidden: React.PropTypes.func,
  onHide: React.PropTypes.func,
  onBeginDisplayed: React.PropTypes.func,
  onDisplay: React.PropTypes.func,
  onTouchTop: React.PropTypes.func,
  onTouchBottom: React.PropTypes.func,
  ...View.propTypes,
};

TriggeringView.defaultProps = {
  onBeginHidden: () => {},
  onHide: () => {},
  onBeginDisplayed: () => {},
  onDisplay: () => {},
  onTouchTop: () => {},
  onTouchBottom: () => {},
};

TriggeringView.contextTypes = {
  scrollY: React.PropTypes.instanceOf(Animated.Value),
};

export default TriggeringView;
