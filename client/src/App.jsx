import Wallet from "./Wallet"
import Transfer from "./Transfer"
import "./App.scss"
import { useState } from "react"

function App() {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState("")
  const [privateKey, setPrivateKey] = useState("")

  return (
    <div className="app flex  lg:flex-row gap-3 flex-column justify-center">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} />
    </div>
  )
}

export default App
