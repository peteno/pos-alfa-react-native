'use strict';

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  itens: {
      backgroundColor: '#F1F1F1',
      margin: 12,
      padding: 8,
      flexDirection: 'row',
      borderWidth: 0.3,
      borderColor: '#000',
  },
  picture: {
      width: 100,
      height: 100,
      flex: 1
  },
  bigimage: {
      alignSelf: 'stretch',
      height: 200,
      padding: 3
  },
  local: {
      alignSelf: 'stretch',
      height: 100,
      width: 160,
      flex: 1,
  },
  flexible: {
    flex: 1
  },
  localStretch: {
      alignSelf: 'stretch',
      height: 200
  }
});