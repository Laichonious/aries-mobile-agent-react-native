// import { useNavigation } from '@react-navigation/core'

// const navigation = useNavigation()

// const handleUrl = (url: any) => {
//   console.log(url)
//   let cleanedUrl = url.split(linking.prefixes[1] + '://app/')[1]

//   switch (true) {
//     case cleanedUrl.startsWith('invitation'):
//       const queryString = cleanedUrl.split('?')?.[1]
//       console.log(queryString)
//       return navigation.navigate('Scan', {
//         params: queryString,
//       })
//     default:
//       return navigation.navigate('Home')
//   }
// }

const handleUrl = (event: any) => {
  console.log(event)
  let cleanedUrl = event.url.split(linking.prefixes[1] + '://app/')[1]
  console.log(cleanedUrl)
  switch (true) {
    case cleanedUrl.startsWith('invitation'):
      const queryString = cleanedUrl.split('?')?.[1]
      console.log(queryString)
      return [
        'Scan',
        {
          params: queryString,
        },
      ]
    default:
      return ['Home']
  }
}

const linking = {
  prefixes: ['didcomm'],
}

export default handleUrl
