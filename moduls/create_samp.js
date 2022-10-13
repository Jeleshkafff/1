import { contractInstance } from "./admin.js";
// let accountContract = "0x15A63524a87F2a2E93595d7C33C40F9c376b6B89";
let butt = document.querySelector(".SampleBtn");
export async function create_sample() {
  let id = document.querySelector(".CategoryId");
  let name = document.querySelector(".SampleName");
  let sum = document.querySelector(".SampleSum");
  let f = JSON.parse(localStorage.getItem("test"));
  console.log(contractInstance);
  console.log(f);

  let result = await contractInstance.methods
    .create_sample(id.value, name.value, sum.value)
    .send({ from: f, gas: 3000000 });
  console.log(result);
}
butt.addEventListener("click", create_sample);
// export default create_category;
