import { useState } from "react"
import server from "./server"
import * as secp from 'ethereum-cryptography/secp256k1'
import {toHex, utf8ToBytes} from 'ethereum-cryptography/utils'
import { keccak256 } from 'ethereum-cryptography/keccak'

function Transfer({ address, setBalance,privateKey}) {
  const [sendAmount, setSendAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  const setValue = (setter) => (evt) => setter(evt.target.value)

  const signMessage = async (message) => {
    const messageBytes = utf8ToBytes(JSON.stringify(message))
    const messageHash = keccak256(messageBytes)

    const signature = await secp.sign(messageHash, privateKey)
    return signature
  }


  async function transfer(evt) {
    evt.preventDefault()
    const signature = await signMessage({
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    })
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        publicKey: toHex(secp.getPublicKey(privateKey)),
        signature,
      })
      setBalance(balance)
    } catch (ex) {
      alert(ex.response.data.message)
    }
  }

  return (
    <form className="container transfer max-w-[700px]" onSubmit={transfer}>
      <h1 className="text-gray-200 text-xl font-bold">Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <button type="submit" className="button">
        Transfer
      </button>
    </form>
  )
}

export default Transfer
