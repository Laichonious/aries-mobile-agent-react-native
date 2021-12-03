import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { borderRadius, mainColor, secondaryTextColor, shadow, neutral, textColor, mediumGrey } from '../../globalStyles'
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
    backgroundColor: mediumGrey,
  },
  text: {
    fontSize: 16,
    color: textColor,
  },
})

const Button: React.FC<Props> = ({ title, accessibilityLabel, onPress, disabled, neutral, negative }) => {
  const accessible = accessibilityLabel && accessibilityLabel !== '' ? true : false

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      style={[styles.button, disabled && styles.disabled, neutral && styles.neutral, negative && styles.negative]}
      disabled={disabled}
    >
      <Text style={[styles.text, neutral && { color: secondaryTextColor }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button
