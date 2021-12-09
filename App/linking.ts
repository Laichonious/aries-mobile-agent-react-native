import { useEffect, useState } from 'react'
import { Linking } from 'react-native'

// export const handleUrl = (url: string) => {
//   let cleanedUrl = url.split('didcomm://')[1]
//   switch (true) {
//     case cleanedUrl.startsWith('invitation'):
//       const queryString = cleanedUrl.split('?')?.[1]
//       return [
//         'Scan',
//         {
//           params: queryString,
//         },
//       ]
//     default:
//       return ['Home']
//   }
// }

// const linking = {
//   prefixes: ['didcomm'],
// }

const useDidCommDeepLink = (deepLinkCallback: (url: string, initialUrl: boolean) => void) => {
  const [handledInitialUrl, setHandledInitialUrl] = useState(false)

  useEffect(() => {
    if (!handledInitialUrl) {
      Linking.getInitialURL()
        .then((url: string | null) => {
          if (url) {
            setHandledInitialUrl(true)
            deepLinkCallback(url, true)
          }
        })
        .catch((err: any) => console.warn(err))
    }
  }, [])

  useEffect(() => {
    const eventCallback = (event: any) => deepLinkCallback(event.url, false)

    Linking.addEventListener('url', eventCallback)

    return () => {
      Linking.removeEventListener('url', eventCallback)
    }
  }, [deepLinkCallback])
}

export default useDidCommDeepLink
