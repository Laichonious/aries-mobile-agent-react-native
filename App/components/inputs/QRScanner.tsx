import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'

import { BarCodeReadEvent, RNCamera } from 'react-native-camera'

import { useTranslation } from 'react-i18next'

interface Props {
  handleCodeScan: (event: BarCodeReadEvent) => Promise<void>
}

const styles = StyleSheet.create({
  camera: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFinder: {
    height: 250,
    width: 250,
    padding: 100,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
})

const QRScanner: React.FC<Props> = ({ handleCodeScan }) => {
  const [active, setActive] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    if (!active) {
      setTimeout(() => setActive(true), 5000)
    }
  }, [active])

  return (
    <View style={styles.camera}>
      {active && (
        <RNCamera
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: t('QRScanner.PermissionToUseCamera'),
            message: t('QRScanner.WeNeedYourPermissionToUseYourCamera'),
            buttonPositive: t('QRScanner.Ok'),
            buttonNegative: t('Global.Cancel'),
          }}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={(e) => {
            setActive(false)
            handleCodeScan(e)
          }}
        >
          <View style={styles.viewFinder} />
        </RNCamera>
      )}
    </View>
  )
}

export default QRScanner
