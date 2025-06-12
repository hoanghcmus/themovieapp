import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import ScreenNames from '../constants/screenNames';
import router from '../configs/router';
import IconHomeTab from '../assets/svg/ic-home-tab.svg';
import IconWatchListTab from '../assets/svg/ic-watchlist-tab.svg';

const TabIcons = {
  Home: IconHomeTab,
  WatchList: IconWatchListTab,
};

export type BottomNavRef = {
  show: Function;
  hide: Function;
  setActiveTab: Function;
};

type BottomNavProps = {
  forwardedRef?: React.Ref<BottomNavRef> | null;
  tabData: any;
  isHide?: boolean;
};

export let navBarHeight = 64;

const ICON_SIZE = 48;
const BOTTOM_PADDING = (navBarHeight - ICON_SIZE) / 2;

interface TabItemData {
  icon: any;
  screen: string;
  params?: any;
}

const ICON_WIDTH = 28;
const ICON_HEIGHT = 28;

const BottomNavBar = (props: BottomNavProps) => {
  let {tabData, isHide: isHideBottomNav = true} = props;

  if (!tabData) {
    tabData = {
      tabOne: {},
      tabTwo: {},
      activeScreenName: ScreenNames.NONE.toString(),
    };
  } else {
    if (!tabData.tabOne) {
      tabData.tabOne = {};
    }
    if (!tabData.tabTwo) {
      tabData.tabTwo = {};
    }
  }

  const [isHide, setHide] = useState(isHideBottomNav);
  const [activeScreen, setActiveScreen] = useState(
    tabData?.activeScreenName || tabData?.tabOne?.screen,
  );

  const position = useRef(new Animated.Value(0)).current;
  const bottomPosition = position.interpolate({
    inputRange: [0, 1],
    outputRange: [-navBarHeight, 0],
  });

  const show = useCallback(() => {
    setHide(false);
    Animated.timing(position, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [position]);

  const hide = useCallback(() => {
    setHide(true);
    Animated.timing(position, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [position]);

  const setActiveTab = useCallback((name: string) => {
    setActiveScreen(name);
  }, []);

  useImperativeHandle(
    props.forwardedRef,
    () => {
      return {show, hide, setActiveTab};
    },
    [show, hide, setActiveTab],
  );

  const isActive = (tabItemData: TabItemData) => {
    const {screen} = tabItemData;
    if (!screen) {
      return false;
    }
    return screen === activeScreen;
  };

  const onPressTab = (tabItemData: TabItemData) => {
    const {screen, params = {}} = tabItemData;
    if (screen) {
      setActiveScreen(screen);
      router.navigate(screen, {...params});
    }
  };

  const isShowTab = (tabItemData: TabItemData) => {
    const {icon, screen} = tabItemData;
    if (!icon || !screen) {
      return false;
    }
    return true;
  };

  const isShowTabOne = isShowTab(tabData.tabOne);
  const isShowTabTwo = isShowTab(tabData.tabTwo);

  if (isHide && isHideBottomNav) {
    return null;
  }

  const TabOneIcon = tabData?.tabOne?.icon ?? TabIcons.Home;
  const TabTwoIcon = tabData?.tabTwo?.icon ?? TabIcons.WatchList;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY: bottomPosition}],
        },
      ]}>
      <View style={styles.wrapper}>
        <View style={styles.actionBar}>
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={[
                isShowTabOne ? styles.iconWrapper : styles.iconWrapperHide,
                isActive(tabData?.tabOne) ? styles.activeTab : {},
              ]}
              onPress={() => {
                onPressTab(tabData?.tabOne);
              }}>
              {isShowTabOne && (
                <TabOneIcon
                  width={ICON_WIDTH}
                  height={ICON_HEIGHT}
                  color={!isActive(tabData?.tabOne) ? '#FFFFFF' : '#5531B1'}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity
              style={[
                isShowTabTwo ? styles.iconWrapper : styles.iconWrapperHide,
                isActive(tabData?.tabTwo) ? styles.activeTab : {},
              ]}
              onPress={() => {
                onPressTab(tabData?.tabTwo);
              }}>
              {isShowTabTwo && (
                <TabTwoIcon
                  width={ICON_WIDTH}
                  height={ICON_HEIGHT}
                  color={!isActive(tabData?.tabTwo) ? '#FFFFFF' : '#5531B1'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -navBarHeight,
    width: '100%',
    paddingTop: 6,
    paddingBottom: Platform.select({ios: 10, android: 0}),
    backgroundColor: '#042541',
  },
  wrapper: {
    alignItems: 'center',
    height: navBarHeight,
  },
  actionBar: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  tabItem: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  iconWrapper: {
    borderRadius: ICON_SIZE,
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperHide: {
    borderRadius: 50,
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
  },
});

export default forwardRef(
  (props: BottomNavProps, ref: React.Ref<BottomNavRef>) => {
    return <BottomNavBar {...props} forwardedRef={ref} />;
  },
);
