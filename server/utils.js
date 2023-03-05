const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils")
const secp = require("ethereum-cryptography/secp256k1")

function getAddress(privateKey) {
  const publicKey = secp.getPublicKey(privateKey)
  const extractedPublicKey = publicKey.slice(1)
  const hashedPublicKey = keccak256(extractedPublicKey)

  return hashedPublicKey.slice(-20)
}

async function recoverKey(message, signature, recoveryBit) {
  const hashedMessage = hashMessage(message)

  const publicKey = await secp.recoverPublicKey(hashedMessage, signature, recoveryBit)

  return publicKey
}

async function signMessage(msg) {
  const PRIVATE_KEY = generateRandomPrivateKey()
  const hashed = hashMessage(msg)
  const signature = await secp.sign(hashed, PRIVATE_KEY, { recovered: true })
  return signature
}

function hashMessage(message) {
  const messageBytes = utf8ToBytes(message)
  const messageHash = keccak256(messageBytes)

  return messageHash
}

function generateRandomPrivateKey() {
  const privateKey = secp.utils.randomPrivateKey()
  return toHex(privateKey)
}

const privateKey = generateRandomPrivateKey()
const address = getAddress(privateKey)
console.log("Private key: ", privateKey)
console.log("Address: ", `0x${toHex(address)}`)

const message = "Hello world"
const signature = signMessage(message).then((signature) => {
  console.log("Signature: ", signature)
})
