import { contractInstance } from "./admin.js";
// let accountContract = "0x15A63524a87F2a2E93595d7C33C40F9c376b6B89";
let butt = document.querySelector(".CategoryBtn");
export async function create_category() {
  let input = document.querySelector(".Category");
  let f = JSON.parse(localStorage.getItem("test"));
  console.log(contractInstance);
  console.log(f);

  let result = await contractInstance.methods
    .create_categor(input.value)
    .send({ from: f });
  console.log(result);
}
butt.addEventListener("click", create_category);
// export default create_category;
