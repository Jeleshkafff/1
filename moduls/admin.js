import ABI from "/abi.js";
const abi = ABI;

// console.log(abi);
let accountContract = "0xDf7aC5B4511d9e48bCdFDA9eF6eE9DbcDE93446c";

let address = document.querySelector(".account");
export let web3, current_account, contractInstance;
import { create_category } from "./create_cat.js";
import { create_sample } from "./create_samp.js";
import { Cvoid } from "./void.js";
import { copy } from "./copy.js";
function network() {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  contractInstance = new web3.eth.Contract(abi, accountContract);
  // web3.eth.getAccounts()
  // .then(console.log);
}
network();
// create_category();
