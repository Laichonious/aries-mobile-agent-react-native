import React, { useState } from 'react'

const AgentContext = React.createContext({})

interface Props {
  children: any
  agent: any
}

const AgentProvider: React.FC<Props> = ({ children, agent }) => {
  const [loading, setLoading] = useState(true)

  return (
    <AgentContext.Provider
      value={{
        agent,
        loading,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

export default AgentContext
export { AgentProvider }
