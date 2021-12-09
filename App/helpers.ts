export function parseSchema(schemaId?: string): string {
  try {
    if (schemaId) {
      const schemaIdRegex = /(.*?):([0-9]):([a-zA-Z .\-_0-9]+):([a-z0-9._-]+)$/
      const schemaIdParts = schemaId.match(schemaIdRegex)

      if (schemaIdParts!.length === 5) {
        const prettyName = `${schemaIdParts![3].replace(/_/g, ' ')}`
        //  V${schemaIdParts![4]}
        return prettyName
      } else {
        return 'Credential'
      }
    } else {
      return 'Credential'
    }
  } catch (e) {
    console.warn(`Unable to parse Schema: ${schemaId}`, e)
    return 'Credential'
  }
}
