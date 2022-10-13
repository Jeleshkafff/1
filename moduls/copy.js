import { contractInstance, web3 } from "./admin.js";
export function copy() {
  function create_transaction_li(id, from, to, summa, categry, savety) {
    const div = document.createElement("div");

    const transactionId = document.createElement("p");
    const pFrom = document.createElement("p");
    const pTo = document.createElement("p");
    const pSumma = document.createElement("p");
    const pCat = document.createElement("p");
    let bt1 = document.createElement("button");
    let bt2 = document.createElement("button");
    bt1.textContent = "true";
    bt2.textContent = "false";
    bt1.className = "acept";
    bt2.className = "dAsept";
    const pSave = document.createElement("p");
    transactionId.textContent = "Transaction id: " + id;
    pFrom.textContent = "from: " + from;
    pTo.textContent = "to: " + to;
    pSumma.textContent = "sum: " + web3.utils.fromWei(summa, "ether") + " eth";
    pCat.textContent = "category: " + categry;
    pSave.textContent = "savety: " + savety;
    bt1.addEventListener("click", async () => {
      let f = JSON.parse(localStorage.getItem("test"));
      let i = transactionId.textContent.slice(16);
      console.log(i);
      let result = await contractInstance.methods
        .saveAd(0, i)
        .send({ from: f, gas: 3000000 });
      console.log(result);
    });
    bt2.addEventListener("click", async () => {
      let f = JSON.parse(localStorage.getItem("test"));
      let i = transactionId.textContent.slice(16);
      console.log(i);
      let result = await contractInstance.methods
        .saveAd(3, i)
        .send({ from: f, gas: 3000000 });
      console.log(result);
    });
    // document.body.append(div);
    div.append(transactionId);
    div.append(pFrom);
    div.append(pTo);
    div.append(pSumma);
    div.append(pCat);
    div.append(pSave);
    div.append(bt1);
    div.append(bt2);
    let f = JSON.parse(localStorage.getItem("test"));

    return div;
  }

  const ulTransactions = document.createElement("ul");
  document.body.append(ulTransactions);
  ulTransactions.className = "ulTransactions";

  async function create_transaction_ul() {
    let categories;
    categories = await contractInstance.methods.view_categories().call();
    let applications = await contractInstance.methods.view_aplications().call();
    // console.log(applications);
    ulTransactions.innerHTML = "";
    // console.log(ulTransactions);
    for (let i = 0; i < applications.length; i++) {
      let from = applications[i]["owner"];
      let to = applications[i]["recipient"];
      let summa = applications[i]["sum"];
      let status = applications[i]["savety"];

      console.log(categories);
      // console.log(categories[]);
      let categry = categories[applications[i]["id_category"]].nameCate;

      let f = JSON.parse(localStorage.getItem("test"));
      // console.log(from);
      // console.log(f);
      // console.log(from == f || to == f);
      // if (status == false) {
      if (status == 1) {
        const li = document.createElement("li");
        li.append(create_transaction_li(i, from, to, summa, categry, status));
        console.log(categry);
        ulTransactions.append(li);
        li.className = "li";
      }
      // }
    }
    console.log(ulTransactions);
  }

  create_transaction_ul();
  let bt1 = document.querySelector(".acept");
}
setTimeout(copy, 5000);
