import { contractInstance } from "./admin.js";

let butt = document.querySelector(".AddressBtn");
let bt = document.querySelector(".VoiseBtn");
export async function Cvoid() {
  let addr = document.querySelector(".Chel");
  console.log(addr.value);
  let f = JSON.parse(localStorage.getItem("test"));
  console.log(f);
  let result = await contractInstance.methods
    .createVoid(addr.value)
    .send({
      from: f,
      gas: 3000000,
      function(error) {
        console.log(error);
      },
    })
    .catch(function (error) {
      const data = error.data;
      const txHash = Object.keys(data)[0];
      const reason = data[txHash].reason;
      console.log(reason);
      alert(reason);
    });
  console.log(result);
}

butt.addEventListener("click", Cvoid);

export async function GVoid() {
  let id = document.querySelector(".Id");
  let bool = document.querySelector(".Bool");
  let f = JSON.parse(localStorage.getItem("test"));
  console.log(f);
  let result = await contractInstance.methods
    .give_voice(id.value, bool.checked)
    .send({
      from: f,
      gas: 3000000,
      function(error) {
        console.log(error);
      },
    })
    .catch(function (error) {
      const data = error.data;
      const txHash = Object.keys(data)[0];
      const reason = data[txHash].reason;
      console.log(reason);
      alert(reason);
    });
  console.log(result);
}

bt.addEventListener("click", GVoid);
