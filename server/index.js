const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042
const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils")
const secp = require("ethereum-cryptography/secp256k1")

app.use(cors())
app.use(express.json())

const balances = {
  "0xba9e03ade7e8a2993ecc153c39785496c9660053": 100,
  "0x06a4d34b1a649bbe37d55d5d43fc5a1f49e5ea5b": 50,
  "0x7000f21987c2901759b8e509bbaadfde9e188a6f": 75,
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post("/send", (req, res) => {
  //  TODO: Get a signature from the sender and verify it
  //  recover the public key from the signature
  //  drive the the address from the signature
  const { sender, recipient, amount, signature, publicKey } = req.body

  const messageBytes = utf8ToBytes(
    JSON.stringify({
      sender,
      amount,
      recipient,
    })
  )
  const messageHash = toHex(keccak256(messageBytes))

  const isSigned = secp.verify(signature, messageHash, publicKey)

  if (!isSigned) {
    setInitialBalance(recipient)

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" })
    } else {
      balances[sender] -= amount
      balances[recipient] += amount
      res.send({ balance: balances[sender] })
    }
  } else {
    res.status(400).send({ message: "Not authorized!" })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
