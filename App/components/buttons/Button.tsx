import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { borderRadius, mainColor, textColor, secondaryTextColor, shadow, neutral, red } from '../../globalStyles'
import Text from '../texts/Text'

interface Props {
  title: string
  accessibilityLabel?: string
  onPress?: () => void
  disabled?: boolean
  neutral?: true
  negative?: true
}

const styles = StyleSheet.create({
  button: {
    borderRadius,
    backgroundColor: mainColor,
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  disabled: {
    backgroundColor: shadow,
  },
  neutral: {
    backgroundColor: neutral,
  },
  negative: {
    backgroundColor: red,
  },
  text: {
    fontSize: 16,
    color: secondaryTextColor,
  },
})

const Button: React.FC<Props> = ({ title, accessibilityLabel, onPress, disabled, neutral, negative }) => {
  const accessible = accessibilityLabel && accessibilityLabel !== '' ? true : false

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      style={[styles.button, neutral && styles.neutral, negative && styles.negative, disabled && styles.disabled]}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button
