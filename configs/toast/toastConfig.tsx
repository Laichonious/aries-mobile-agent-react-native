import React from 'react'

import { neutral, green, red } from '../../App/globalStyles'

import BaseToast from '../../App/components/misc/BaseToast'

export const toastConfig = {
  success: (props: any) => <BaseToast backgroundColor={green} icon="check-circle" title={props.text1} />,
  error: (props: any) => <BaseToast backgroundColor={red} icon="cancel" title={props.text1} />,
  info: (props: any) => <BaseToast backgroundColor={neutral} icon="alarm" title={props.text1} />,
}

export default toastConfig
