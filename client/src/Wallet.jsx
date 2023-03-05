import server from "./server"
import * as secp from 'ethereum-cryptography/secp256k1'
import {toHex} from 'ethereum-cryptography/utils'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { useEffect } from "react"

function Wallet({ address, setAddress, balance, setBalance,privateKey, setPrivateKey }) {

    const getAddress =  async (privateKey) => {
    const publicKey =  await secp.getPublicKey(privateKey)
    const extractedPublicKey = publicKey.slice(1)
    const hashedPublicKey = keccak256(extractedPublicKey)
  
    return hashedPublicKey.slice(-20)
  } 
   const onChange = (evt) =>{
    setPrivateKey(evt.target.value)    
  }

  useEffect(() => {
    async function fetchData(){
    if(privateKey.length === 64){
      getAddress(privateKey).then((address)=> {
        setAddress(`0x${toHex(address)}`)
      })     
      await server.get(`balance/${address}`).then((res) => {
        setBalance(res.data.balance)
      })
      
      
    }else{
      setAddress('')
      setBalance(0)
    }}
    fetchData()
  }, [privateKey, address, setBalance, setAddress])

  return (
    <div className="container wallet max-w-[700px]">
      <h1 className="text-gray-200 text-xl font-bold">Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
        <p className="mt-3 font-mono">Your address: {address}</p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  )
}

export default Wallet
