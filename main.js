import ABI from "./abi.js";
const abi = ABI;

let accountContract = "0xDf7aC5B4511d9e48bCdFDA9eF6eE9DbcDE93446c";

let address = document.querySelector(".account");
let web3, f, contractInstance;
let statusSignIn = 0;
let statusSignUp = 0;

function workForm() {
  const modalSignIn = document.querySelector(".modal-sign-in");
  const modalSignUp = document.querySelector(".modal-sign-up");
  if (statusSignIn) {
    modalSignIn.style.display = "flex";
    modalSignUp.style.display = "none";
  } else if (statusSignUp) {
    modalSignUp.style.display = "flex";
    modalSignIn.style.display = "none";
  } else {
    modalSignUp.style.display = "none";
    modalSignIn.style.display = "none";
  }
}

async function eventSignInForm() {
  const closeForm = document.querySelector(".close-sign-in");

  const signInBtn = document.querySelector(".signIn");
  const openSignUp = document.querySelector(".openSignUp");

  const signInAddress = document.querySelector(".signInAddress");
  const signInPassword = document.querySelector(".signInPassword");

  closeForm.addEventListener("click", () => {
    statusSignIn = 0;
    workForm();
  });

  openSignUp.onclick = async function (e) {
    e.preventDefault();
    statusSignIn = 0;
    statusSignUp = 1;
    workForm();
  };
  signInBtn.onclick = async function (e) {
    e.preventDefault();
    if (!signInAddress.value.length) {
      // alert("Заполните адрес");
      return;
    } else if (!signInPassword.value.length) {
      // alert("Заполните пароль");
      return;
    }
    let password = await web3.utils.soliditySha3({
      t: "string",
      v: signInPassword.value,
    });
    console.log(signInPassword.value, password);
    console.log(signInAddress.value + " " + password);
    console.log(web3.utils.soliditySha3("user1"));
    localStorage.setItem("test", JSON.stringify(signInAddress.value));
    let f = JSON.parse(localStorage.getItem("test"));
    console.log(signInAddress.value);
    registr(f);
    getBalance(f);

    let result = await contractInstance.methods
      .sing_in(signInAddress.value, password)
      .call({ from: signInAddress.value })
      .catch(function (error) {
        const data = error.data;
        const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
        console.log(reason);
      });
    console.log(result);
    if (result) {
      // alert("Вы успешно вошли");
      statusSignIn = 0;
    }
    workForm();
    create_transaction_ul();
    ulTransactions.innerHTML = "";
  };
}

eventSignInForm();
function eventSignUpForm() {
  const closeForm = document.querySelector(".close-sign-up");

  const signUpBtn = document.querySelector(".signUp");
  const openSignIn = document.querySelector(".openSignIn");

  const signUpAddress = document.querySelector(".signUpAddress");
  const signUpLogin = document.querySelector(".signUpLogin");
  const signUpPassword = document.querySelector(".signUpPassword");

  closeForm.addEventListener("click", () => {
    statusSignUp = 0;
    workForm();
  });

  openSignIn.onclick = async function (e) {
    e.preventDefault();
    statusSignIn = 1;
    statusSignUp = 0;
    workForm();
  };
  signUpBtn.onclick = async function (e) {
    e.preventDefault();
    console.log(signUpAddress.value);
    if (!signUpAddress.value.length) {
      // alert("Заполните адрес");
      return;
    } else if (!signUpLogin.value.length) {
      // alert("Заполните логин");
      return;
    } else if (!signUpPassword.value.length) {
      // alert("Заполните пароль");
      return;
    }
    let password = web3.utils.soliditySha3({
      t: "string",
      v: signUpPassword.value,
    });

    // console.log(password,signUpPassword.value)
    let result = await contractInstance.methods
      .reg(signUpAddress.value, password, signUpLogin.value)
      .send({ from: String(signUpAddress.value) })
      .catch(function (error) {
        const data = error.data;
        const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
        console.log(reason);
        // alert(reason);
      });
    console.log(result);
    if (result) {
      // alert("Вы успешно зарегистрировались");
      statusSignUp = 0;
    }
    workForm();
  };
}

eventSignInForm();
eventSignUpForm();

function eventOpenForm() {
  const btnSignIn = document.querySelector(".btnSignIn");
  const btnSignUp = document.querySelector(".btnSignUp");

  btnSignIn.addEventListener("click", () => {
    statusSignIn = 1;
    workForm();
  });
  btnSignUp.addEventListener("click", () => {
    statusSignUp = 1;
    workForm();
  });
}
eventOpenForm();
const ulTransactions = document.createElement("ul");
document.body.append(ulTransactions);
ulTransactions.className = "ulTransactions";

function network() {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  contractInstance = new web3.eth.Contract(abi, accountContract);
  workForm();
}
network();
async function getAccounts() {
  let accounts = await web3.eth.getAccounts();

  // createInput(accounts);
  localStorage.setItem("test", JSON.stringify(accounts[0]));
  let f = JSON.parse(localStorage.getItem("test"));
  // current_account = accounts[0];
  registr(f);
  getBalance(f);
}

getAccounts();
async function getBalance(account) {
  address.textContent = "Аккаунт: " + account;
  let balanceEthP = document.querySelector(".balanceEth");
  let balanceWei = await web3.eth.getBalance(account);
  let balanceEth = await web3.utils.fromWei(balanceWei, "ether");
  balanceEthP.textContent = "Баланс в eth: " + balanceEth + " eth";
  getUser(account);
}

async function getApplications() {
  let number = await contractInstance.methods.view_aplications().call();

  // console.log(number);
  return number;
}

async function getUser(address) {
  let user = await contractInstance.methods.view_people(address).call();

  console.log(user.admin);
  if (user.admin != 1) {
    let admPan = document.querySelector(".admin");
    admPan.style.display = "none";
  } else {
    let admPan = document.querySelector(".admin");
    admPan.style.display = "flex";
  }
}

let inp = document.querySelector(".inp");
let btn = document.querySelector(".btn");

async function registr(account) {
  let inp = document.querySelector(".inp1");
  let stat = document.querySelector(".stat");
  let btnSignUp = document.querySelector(".btnSignUp");
  let btnSignIn = document.querySelector(".btnSignIn");
  let result = await contractInstance.methods
    .reg_test(account)
    .call()
    .catch(function (error) {
      const data = error.data;
      const adm = account;
      const txHash = Object.keys(data)[0];
      const reason = data[txHash].reason;

      stat.textContent = reason;
      console.log(reason);
      if (reason == "you registated") {
        inp.style.display = "block";
      }
    });
}

async function create_transf() {
  const people = document.querySelector(".why");
  const summa = document.querySelector(".sum");
  const codeword = document.querySelector(".code");
  const save = document.querySelector(".save");
  const button = document.querySelector(".btn");
  //   let inp = document.querySelector(".inp1");
  async function view_aplications() {
    let test = await contractInstance.methods
      .view_aplications()
      .call({ from: 0 });
    console.log(test);
  }
  view_aplications();

  button.addEventListener("click", async () => {
    let f = JSON.parse(localStorage.getItem("test"));
    console.log(f);
    let test = document.querySelector(".select-category");
    console.log(test.selectedIndex - 1);
    console.log(summa.value * 10 ** 18);
    let summa1 = web3.utils.fromWei(String(summa.value * 10 ** 18), "ether");
    console.log(summa1);
    console.log(save.checked);
    let res = await contractInstance.methods
      .translation_formation(
        people.value,
        String(summa.value * 10 ** 18),
        web3.utils.soliditySha3({
          t: "string",
          v: codeword.value,
        }),
        test.selectedIndex - 1,
        save.checked
      )
      .send({
        from: f,
        value: String(summa.value * 10 ** 18),
        gas: 3000000,
      })
      .catch(function (error) {
        const data = error.data;
        // const adm = account;
        const txHash = Object.keys(data)[0];
        const reason = data[txHash].reason;
        // console.log(data);
        // stat.textContent = reason;
        alert(reason);
      });

    console.log(res);
    create_transaction_ul();
    // location.reload();
  });
}
create_transf();

function create_transaction_li(
  id,
  from,
  to,
  summa,
  categry,
  savety,
  statusClose,
  statusCloseOwner,
  statusCloseRecipient
) {
  const div = document.createElement("div");

  const transactionId = document.createElement("p");
  const pFrom = document.createElement("p");
  const pTo = document.createElement("p");
  const pSumma = document.createElement("p");
  const pCat = document.createElement("p");
  const Pstatus = document.createElement("p");
  const pSave = document.createElement("p");
  transactionId.textContent = "Transaction id: " + id;
  pFrom.textContent = "from: " + from;
  pTo.textContent = "to: " + to;
  pSumma.textContent = "sum: " + web3.utils.fromWei(summa, "ether") + " eth";
  pCat.textContent = "category: " + categry;
  pSave.textContent = "savety: " + savety;
  Pstatus.textContent = "state: ";
  if (statusClose) {
    Pstatus.textContent += "Translation completed";
  } else {
    Pstatus.textContent += "Translation incomplete";
  }
  if (statusCloseOwner) {
    Pstatus.textContent += " senders";
  }
  if (statusCloseRecipient) {
    Pstatus.textContent += " recipients";
  }
  if (!statusCloseOwner && !statusCloseRecipient) {
    Pstatus.textContent += "(money transferred)";
  }
  // document.body.append(div);
  div.append(transactionId);
  div.append(pFrom);
  div.append(pTo);
  div.append(pSumma);
  div.append(pCat);
  div.append(pSave);
  div.append(Pstatus);
  let f = JSON.parse(localStorage.getItem("test"));
  if (from == f && statusClose == false) {
    const buttonCancelFrom = document.createElement("button");
    buttonCancelFrom.textContent = "Cancel transfer";
    buttonCancelFrom.classList.add("buttonCancelFrom");

    buttonCancelFrom.addEventListener("click", async () => {
      let res = await contractInstance.methods
        .canceling_owner_transfer(id)
        .send({
          from: f,
          gas: 3000000,
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(res);
      console.log(await contractInstance.methods.view_aplications().call());
    });

    div.append(buttonCancelFrom);
  } else if (to == f && statusClose == false) {
    // if()
    const divBtnTo = document.createElement("div");

    const inputAcceptCodWord = document.createElement("input");
    const buttonAcceptTo = document.createElement("button");
    const buttonCancelTo = document.createElement("button");

    buttonAcceptTo.textContent = "accept";
    buttonAcceptTo.classList.add("buttonAcceptTo");
    inputAcceptCodWord.className = "inputAcceptCodWord";
    buttonCancelTo.textContent = "Refuse transfer";
    buttonCancelTo.classList.add("buttonCancelTo");

    buttonAcceptTo.addEventListener("click", async () => {
      let res = await contractInstance.methods
        .acceptance_of_translation(
          id,
          web3.utils.soliditySha3({
            t: "string",
            v: inputAcceptCodWord.value,
          })
        )
        .send({
          from: f,
          gas: 3000000,
        })
        .catch(function (error) {
          console.log(error);
        });
      location.reload();
      console.log(res);
    });

    buttonCancelTo.addEventListener("click", async () => {
      console.log("click");
      let res = await contractInstance.methods
        .canceling_recipient_transfer(id)
        .send({
          from: f,
          gas: 3000000,
        })
        .catch(function (error) {
          console.log(error);
        });
      location.reload();
    });

    div.append(inputAcceptCodWord);
    divBtnTo.append(buttonAcceptTo, buttonCancelTo);
    div.append(divBtnTo);
  }
  return div;
}

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
    // console.log(categories);
    // console.log(categories[]);
    let categry = categories[applications[i]["id_category"]].nameCate;
    let statusClose = applications[i]["status"];
    let statusCloseOwner = applications[i]["statusOwner"];
    let statusCloseRecipient = applications[i]["statusRecipient"];

    let f = JSON.parse(localStorage.getItem("test"));
    // console.log(from);
    // console.log(f);
    // console.log(from == f || to == f);
    // if (status == false) {
    if (from == f) {
      const li = document.createElement("li");
      li.append(
        create_transaction_li(
          i,
          from,
          to,
          summa,
          categry,
          status,
          statusClose,
          statusCloseOwner,
          statusCloseRecipient
        )
      );
      console.log(categry);
      ulTransactions.append(li);
      li.className = "li";
    }
    if (to == f) {
      const li = document.createElement("li");
      li.append(
        create_transaction_li(
          i,
          from,
          to,
          summa,
          categry,
          status,
          statusClose,
          statusCloseOwner,
          statusCloseRecipient
        )
      );
      console.log(categry);
      ulTransactions.append(li);
      li.className = "li";
    }
    // }
  }
  console.log(ulTransactions);
}

create_transaction_ul();

//---------------------------------------------------//

let categories;

getCategories();

async function getCategories() {
  categories = await contractInstance.methods
    .view_categories()
    .call()
    .then((data) => data);
  console.log(categories);
  // return categories;
}
// import { contract } from "../main.js";
async function getSamples() {
  samples = await contractInstance.methods.view_samples().call();
}
let samples;

getSamples();
function test() {
  let inp = document.querySelector(".inp1");
  // import { contract } from "../index.js";

  const selectCategory = document.createElement("select");
  selectCategory.className = "select-category";
  inp.append(selectCategory);
  const optionForCategory = document.createElement("option");
  optionForCategory.textContent = "Select category";
  selectCategory.append(optionForCategory);
  console.log(categories);
  categories.map((element) => {
    console.log(element);

    const option = document.createElement("option");
    option.textContent = element.nameCate;
    selectCategory.append(option);
  });
  function createSamplesForm() {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const select = document.createElement("select");
    select.className = "Sample";
    // span.textContent = "Или выберите шаблон";

    const option = document.createElement("option");
    // option.textContent = "-- Выберите категорию --";
    selectCategory.append(option);
    console.log(categories);
    samples.map((element) => {
      const option = document.createElement("option");
      option.textContent = `${element.nameSample}, ${element.CountMoney}`;
      select.append(option);
    });

    select.addEventListener("input", () => {
      // console.log(select.selectedIndex - 1);
      document.querySelector(".sum").value =
        samples[select.selectedIndex].CountMoney;
      document.querySelector(".select-category").selectedIndex =
        Number(samples[select.selectedIndex].idCat) + 1;
    });
    inp.append(div); // div.append(select)
    div.append(span, select);
  }
  createSamplesForm();
}
setTimeout(test, 3000);

//-----------------------------------------------------------------------//
