import React, {useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import IconChevronRight from '../assets/svg/ic-chevron-right.svg';
import IconChevronDown from '../assets/svg/ic-chevron-down.svg';

type AquaDropdownListProps = {
  data: Array<{label: string; value: string}>;
  style?: ViewStyle;
  dropdownStyle?: ViewStyle;
  value?: string;
  onSelectItem: (item: {label: string; value: string}) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

const AquaDropdownList = (props: AquaDropdownListProps) => {
  const {
    data = [],
    style = {},
    dropdownStyle = {},
    placeholder = 'Select item',
    searchPlaceholder = 'Search...',
    value,
    onSelectItem = () => null,
  } = props;
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        itemTextStyle={styles.itemTextStyle}
        style={[styles.dropdown, dropdownStyle]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
        activeColor="#00B4E4"
        itemContainerStyle={styles.itemContainerStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onSelectItem(item);
          setIsFocus(false);
        }}
        renderRightIcon={() =>
          isFocus ? (
            <IconChevronDown style={styles.icon} width={14} height={10} />
          ) : (
            <IconChevronRight style={styles.icon} width={10} height={14} />
          )
        }
      />
    </View>
  );
};

export default AquaDropdownList;

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  dropdownFocus: {
    borderColor: 'blue',
  },
  icon: {
    marginRight: 5,
  },

  labelFocus: {
    color: 'blue',
  },
  placeholderStyle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontFamily: 'Source Sans Pro',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    padding: 16,
  },
  itemContainerStyle: {
    marginVertical: 4,
    borderRadius: 4,
  },
  itemTextStyle: {
    fontFamily: 'Source Sans Pro',
  },
});
