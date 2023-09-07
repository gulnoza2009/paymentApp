"use strict";
// DATA - bu biz ishlatadigan fake backenddan kelgan ma'lumotlar
const account1 = {
  password: "1111",
  cardNumber: 8600345613240977,
  owner: {
    firstName: "Komil",
    lastName: "Rasulov",
  },
  transfers: [
    {
      amount: 200,
      date: "2019-11-18T21:31:17.178Z",
    },

    {
      amount: 455.23,
      date: "2019-12-23T07:42:02.383Z",
    },

    {
      amount: -306.5,
      date: "2020-01-28T09:15:04.904Z",
    },

    {
      amount: 25000,
      date: "2020-04-01T10:17:24.185Z",
    },

    {
      amount: -642.21,
      date: "2020-05-08T14:11:59.604Z",
    },

    {
      amount: -133.9,
      date: "2020-05-27T17:01:17.194Z",
    },

    {
      amount: -79.97,
      date: "2020-07-11T23:36:17.929Z",
    },

    {
      amount: -1300,
      date: "2020-07-12T10:51:36.790Z",
    },
  ],
  currency: "UZS",
  locale: "ru-RU",
};
const account2 = {
  password: "2222",
  cardNumber: 9860156723000078,
  owner: {
    firstName: "Sardor",
    lastName: "Abdug'aniyev",
  },
  transfers: [
    {
      amount: 5000,
      date: "2023-05-01T13:15:33.035Z",
    },

    {
      amount: 3400,
      date: "2023-05-20T09:48:16.867Z",
    },

    {
      amount: 150,
      date: "2023-05-25T06:04:23.907Z",
    },

    {
      amount: -790,
      date: "2023-06-01T14:18:46.235Z",
    },

    {
      amount: 310,
      date: "2024-06-22T16:33:06.386Z",
    },

    {
      amount: 1000,
      date: "2023-07-05T14:43:26.374Z",
    },

    {
      amount: 8500,
      date: "2023-07-30T18:49:59.371Z",
    },

    {
      amount: -30,
      date: "2023-08-15T12:01:20.894Z",
    },
  ],
  currency: "USD",
  locale: "en-US",
};
// Akkountlarni accounts arrayiga yig'ib oldik
const accounts = [account1, account2];

// CONSTANTS
const inputLogin = document.querySelector(".inputLogin");
const inputPassword = document.querySelector(".inputPassword");
const logIn = document.querySelector(".logIn");
const brend = document.querySelector(".paymentLogo");
const logOut = document.querySelector(".logOut");
const signIn = document.querySelector(".logInbox");
const modal = document.querySelector(".modal_container");
const modalBtn = document.querySelector(".modalBtn");
const history = document.querySelector(".history");
const myCard = document.querySelector(".my_card");
const main = document.querySelector("main");
const payeeNumber = document.querySelector(".payee");
const amount = document.querySelector(".amount");
const sendBtn = document.querySelector(".send");
const modalP = document.querySelector(".modalP");

// Card info
const cardOwner = document.querySelector(".cardOwner");
const cardNumber = document.querySelector(".cardNumber");
const cardBalance = document.querySelector(".cardBalance");
const income = document.querySelector(".income");
const incomeBox = document.querySelector(".incomeBox");
const outgoings = document.querySelector(".outgoings");
const outgoingsBox = document.querySelector(".outgoingsBox");

const historyUl = document.querySelector(".history_ul");

// Sign Up
const signUpBtn = document.querySelector(".signUpBtn");
const signUp = document.querySelector(".signUp");
const createNewAcc = document.querySelector(".createNewAcc");
const signUpPassword = document.querySelector(".signUpPassword");
const signUpConfirm = document.querySelector(".confirmPassword");
const signUpName = document.querySelector(".firstName");
const signUpSurname = document.querySelector(".lastName");
const phoneNum = document.querySelector(".phoneNum");
const formSignUp = document.querySelector(".formSignUp");
const back = document.querySelector(".back");
const backDiv = document.querySelector(".backDiv");
const signUpLastBtn = document.querySelector(".signUpLastBtn");
const newCurrencySelect = document.querySelector(".newCurrencySelect");
const signUpCardNum = document.querySelector(".signUpCardNum");
const expiryDateInput = document.querySelector(".expiryDateInput");
const expiryDate = document.querySelector(".expiryDate");

const modalVerif = document.querySelector(".modalVerif");
const verificationCodeInput = document.querySelector(".verificationCode");
const interval = document.querySelector(".interval");
const verifOk = document.querySelector(".verifOk");
const verifCansel = document.querySelector(".verifCansel");

let b;
let number;
let count;
let candidate;

// FUNCTIONS ***********************************************
const updatedHistoryUl = () => {
  historyUl.innerHTML = "";

  candidate.transfers.forEach((e) => {
    const li = `
          <li>
              <div class="information">
                  <div class="name">${e.amount >= 0 ? "Kirim" : "Chiqim"}</div>
                  <div class="date">${formatted(e.date, candidate)}</div>
              </div>
              ${
                e.amount >= 0
                  ? `<span class="income">+${moneyFormat(
                      e.amount,
                      candidate
                    )}</span>`
                  : `<span class="outgoings">${moneyFormat(
                      e.amount,
                      candidate
                    )}</span>`
              }
          </li>
          `;
    historyUl.insertAdjacentHTML("afterbegin", li);
  });
  count = 0;
  cardNumberFn();
  balanceFn();
};
const renderHistoryUl = () => {
  historyUl.innerHTML = "";

  candidate.transfers.forEach((e) => {
    const li = `${
      e.amount >= 0 && count == 1
        ? `<li>
            <div class="information">
              <div class="name">Kirim</div>
              <div class="date">${formatted(e.date, candidate)}</div>
            </div>
            <span class="income">+${moneyFormat(e.amount, candidate)}</span>
          </li>`
        : ""
    }
    ${
      e.amount <= 0 && count == 2
        ? `<li>
            <div class="information">
              <div class="name">Chiqim</div>
              <div class="date">${formatted(e.date, candidate)}</div>
            </div>
            <span class="outgoings">${moneyFormat(e.amount, candidate)}</span>
          </li>`
        : ""
    }`;
    historyUl.insertAdjacentHTML("afterbegin", li);
  });
  count = 0;
  cardNumberFn();
  balanceFn();
};
const calculateBalance = (transfers) => {
  const objBalance = transfers.reduce(
    (obj, el) => {
      if (el.amount > 0) obj.income += el.amount;
      else obj.expense += el.amount;
      obj.balance += el.amount;
      return obj;
    },
    {
      income: 0,
      expense: 0,
      balance: 0,
    }
  );
  return objBalance;
};
const createLogin = (accounts) => {
  accounts.forEach(
    (acc) =>
      (acc.username = (
        acc.owner.firstName[0] + acc.owner.lastName[0]
      ).toLowerCase())
  );
};
const cardNumberFn = () => {
  cardOwner.textContent = Object.values(candidate.owner).join(" ");
  const number = candidate.cardNumber.toString().split("");
  let str = "";
  for (let i = 0; i < number.length; i++) {
    if (i % 4 == 0) str += " ";
    str += number[i];
  }
  const hideNumber = str.replace(str.slice(-7), "** ****");
  cardNumber.textContent = hideNumber.trim();
};
const balanceFn = () => {
  const balance = calculateBalance(candidate.transfers);

  cardBalance.textContent = moneyFormat(balance.balance);

  income.textContent = "+" + moneyFormat(balance.income);

  outgoings.textContent = moneyFormat(balance.expense);
};
const formatted = (date) => {
  const intlObj = new Intl.DateTimeFormat(candidate.locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
  return intlObj;
};
const moneyFormat = (amount) => {
  return amount.toLocaleString(candidate.locale, {
    style: "currency",
    currency: candidate.currency,
  });
};

const moneysFN = (candidateSend) => {
  const convertationUZSToUSD = +(amount.value / 12145).toFixed(2);
  const convertationUSDToUZS = +(amount.value * 12145).toFixed(2);

  candidate.transfers.push({
    amount: amount.value * -1,
    date: new Date().toISOString(),
  });
  if (candidateSend.currency !== candidate.currency)
    candidateSend.transfers.push({
      amount:
        candidateSend.currency === "UZS"
          ? convertationUSDToUZS
          : convertationUZSToUSD,
      date: new Date().toISOString(),
    });
  else {
    candidateSend.transfers.push({
      amount: +amount.value,
      date: new Date().toISOString(),
    });
  }
  payeeNumber.value = "";
  amount.value = "";
  updatedHistoryUl();
};
function sendMoney() {
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const candidateSend = accounts.find(
      (acc) => acc.cardNumber == payeeNumber.value
    );
    if (candidateSend && candidateSend.cardNumber != candidate.cardNumber) {
      const balanse = calculateBalance(candidate.transfers).balance;
      if (amount.value.length > 1 && balanse >= +amount.value) {
        moneysFN(candidateSend);
      } else {
        modalP.textContent = `Pul miqdori ko'rsatilmagan yoki mablag'ingiz yetarli emas !!!`;
        modal.classList.add("show");
      }
    }
  });
}
const enterFn = () => {
  brend.textContent = `Xush kelibsiz, ${candidate.owner.firstName}!`;
  clear(inputLogin, inputPassword);
  main.classList.add("overflow");
  signIn.classList.add("none");
  logOut.classList.remove("none");
  history.classList.add("right");
  myCard.classList.add("left");
  formSignUp.classList.add("none");
  backDiv.classList.add("none");

  // Card info
  cardNumberFn();
  balanceFn();
  updatedHistoryUl();
  sendMoney();
  createLogin(accounts);
};

const randomNumberForVerification = () => {
  const num = Math.trunc(Math.random() * 1000) + 456732;
  console.log(num);
  number = num;
};
const watchPerMinute = () => {
  b = setInterval(() => {
    interval.textContent--;
    if (+interval.textContent === 0) {
      interval.textContent = "15";
      modalVerif.classList.remove("show");
      clearInterval(b);
    }
  }, 1000);
};
const createNewAccount = () => {
  expiryDate.textContent = expiryDateInput.value;
  const account = {
    password: signUpPassword.value.trim(),
    cardNumber: +signUpCardNum.value.trim(),
    owner: {
      firstName: signUpName.value.trim(),
      lastName: signUpSurname.value.trim(),
    },
    transfers: [],
    currency: newCurrencySelect.value,
    locale: navigator.language,
  };
  alert(
    `Your login: ${(account.username = (
      account.owner.firstName[0] + account.owner.lastName[0]
    ).toLowerCase())}`
  );
  accounts.push(account);
};

function clear(...args) {
  args.forEach((e) => (e.value = ""));
  args.forEach((e) => (e.textContent = ""));
}
const date = () => {
  const num = expiryDateInput.value.split("-");
  if (+num[0] > +new Date().getFullYear()) {
    return true;
  } else if (+num[0] == +new Date().getFullYear()) {
    if (+num[1] > +new Date().getMonth()) return true;
  }
  return false;
};

createLogin(accounts);
// EVENTS **********************************************************

logIn.addEventListener("click", (e) => {
  e.preventDefault();

  candidate = accounts.find((acc) => acc.username === inputLogin.value);

  modalP.textContent =
    "Login yoki parol xato!!! Iltimos qaytadan urinib ko`ring";
  if (!candidate) return modal.classList.add("show");
  if (candidate.password !== inputPassword.value)
    return modal.classList.add("show");
  enterFn();
});
modalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});
logOut.addEventListener("click", () => {
  brend.textContent = "Payments App";
  history.classList.remove("right");
  myCard.classList.remove("left");
  signIn.classList.remove("none");
  logOut.classList.add("none");
  main.classList.remove("overflow");
  clear(
    cardNumber,
    cardOwner,
    cardBalance,
    income,
    outgoings,
    payeeNumber,
    amount
  );
  historyUl.innerHTML = "";
});
signUpBtn.addEventListener("click", () => {
  signUp.classList.remove("none");
  signIn.classList.add("none");
  backDiv.classList.remove("none");
});
createNewAcc.addEventListener("click", () => {
  if (
    signUpName.value.trim().length > 0 &&
    signUpSurname.value.trim().length > 0 &&
    signUpPassword.value.trim() === signUpConfirm.value.trim() &&
    signUpPassword.value.trim().length > 3 &&
    phoneNum.value.trim().length == 9 &&
    !accounts.find((acc) => acc.password == signUpPassword.value.trim())
  ) {
    modalVerif.classList.add("show");
    watchPerMinute();
    randomNumberForVerification();
  } else {
    modalP.textContent = `Ro'yxatdan o'tishda xatolik yuz berdi!
Iltimos qaytadan urinib ko'ring`;
    modal.classList.add("show");
  }
});
back.addEventListener("click", () => {
  signUp.classList.add("none");
  signIn.classList.remove("none");
  backDiv.classList.add("none");
  clear(
    signUpCardNum,
    signUpConfirm,
    signUpName,
    signUpPassword,
    signUpSurname,
    expiryDateInput,
    phoneNum
  );
});
signUpLastBtn.addEventListener("click", () => {
  if (
    signUpCardNum.value.length == 16 &&
    !accounts.find((acc) => acc.cardNumber == signUpCardNum.value) &&
    expiryDateInput.value.trim() &&
    date()
  ) {
    createNewAccount();
    candidate = accounts.find(
      (acc) => acc.cardNumber === +signUpCardNum.value.trim()
    );
    clear(
      signUpCardNum,
      signUpConfirm,
      signUpName,
      signUpLastBtn,
      signUpPassword,
      signUpSurname,
      expiryDateInput,
      phoneNum
    );
    enterFn();
  } else {
    modalP.textContent = `Ro'yxatdan o'tishda xatolik yuz berdi!
Iltimos qaytadan urinib ko'ring`;
    modal.classList.add("show");
  }
});

incomeBox.addEventListener("click", () => {
  outgoingsBox.classList.remove("all");
  incomeBox.classList.toggle("all");
  if (incomeBox.classList.contains("all")) {
    count = 1;
    renderHistoryUl();
  } else {
    updatedHistoryUl();
  }
});
outgoingsBox.addEventListener("click", () => {
  incomeBox.classList.remove("all");
  outgoingsBox.classList.toggle("all");
  if (outgoingsBox.classList.contains("all")) {
    count = 2;
    renderHistoryUl();
  } else {
    updatedHistoryUl();
  }
});

verifOk.addEventListener("click", () => {
  if (+interval.textContent === 0) {
    modalVerif.classList.remove("show");
    return;
  }
  if (+verificationCodeInput.value === number) {
    clear(verificationCodeInput);
    signUp.classList.add("none");
    formSignUp.classList.remove("none");
    modalVerif.classList.remove("show");
    backDiv.classList.add("none");
  }
});
verifCansel.addEventListener("click", () => {
  clear(verificationCodeInput);
  modalVerif.classList.remove("show");
  interval.textContent = "15";
  clearInterval(b);
});
