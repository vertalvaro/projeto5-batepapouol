let userName;
const input = document.querySelector("input");
user();

function user() {
  userName = prompt("Digite seu nome");
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    {
      name: userName,
    }
  );
  promise.then(getMsg);
  promise.catch(alreadyInUse);
}
function alreadyInUse(error) {
  console.log(error.response);
  while (error.response.status === magicNumber400) {
    userName = prompt("Esse nome ja esta em uso, digite outro");
  }
  getMsg();
}
function getMsg() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  promise.then(loadMsg);
  promise.then(setTimeout(getMsg, 3000));
  promise.catch(fail);
}
function verify() {
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    {
      name: userName,
    }
  );
  promise.then(getMsg);
  promise.catch(reload);
}
const magicNumber400 = 400;
const magicNumber5000 = 5000;
setInterval(verify, magicNumber5000);

function loadMsg(resposta) {
  console.log(resposta.data);
  const msgData = resposta.data;

  const content = document.querySelector("main");

  for (let i = 0; i < msgData.length; i++) {
    if (msgData[i].type === "status") {
      content.innerHTML += `<div class="${msgData[i].type} msg">
                      
                          <h1>(${msgData[i].time})
                          <span class='name'>${msgData[i].from}</span>
                          ${msgData[i].text}</span></h1>
                      
                  </div>`;
    } else if (msgData[i].type === "message") {
      content.innerHTML += `<div class="${msgData[i].type} msg lobby">
                      
                         <h1> (${msgData[i].time})
                         <span class='name'>${msgData[i].from}</span>
                           para
                          <span class='name'>${msgData[i].to}:</span>
                          ${msgData[i].text}</span></h1>
                      
                  </div>`;
    } else if (
      msgData[i].type === "private_message" &&
      msgData[i].to === userName
    ) {
      content.innerHTML += `<div class="${msgData[i].type} msg private">
                      
                          <h1>(${msgData[i].time})
                          <span class='name'>${msgData[i].from}</span>
                           reservadamente para
                           <span class='name'>${msgData[i].to}:</span>
                          ${msgData[i].text}</span></h1>
                      
                  </div>`;
    }
  }
  const last = content.lastElementChild;
  last.scrollIntoView();
}

function reload() {
  alert("Usuário desconectou");
  window.location.reload();
}

function sendMsg() {
  const msgSent = document.querySelector("input").value;
  document.querySelector("input").value = "";
  if (msgSent === "") {
    alert("Mensagem vazia");
  }
  const msgContent = {
    from: userName,
    to: "Todos",
    text: msgSent,
    type: "message",
  };
  console.log(msgContent);
}

function fail() {
  console.log(alert("Tente novamente"));
}
