
const ENVIROMENT = 'env';
let postURL;

if(ENVIROMENT == 'env'){
  postURL = 'http://localhost/api/accounts';
}
if(ENVIROMENT == 'pro'){
  postURL = '';
}


//Popupで自動入力ボタンが押されたとき
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action ==="autoInput"){
    chrome.storage.local.get(['accounts'], function(result) {
      let accounts = result.accounts;
      let page = request.page;
      sendAutoInputMessage(accounts,page);      
    });
  }
});

//Popupからアカウントデータ取得メッセージを受け取ったとき
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action ==="getStoredAccounts"){
    chrome.storage.local.get(['accounts'], function(result) {
      let accounts = result.accounts;
      sendResponse({accounts:accounts});
    });
  }
  return true;
});

// タブが更新されたとき
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    let url = getOriginFromURL(tab.url);
    autoInputByFetch(url);
  }
});

//アクティブなタブが変更されたとき
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.status === 'complete') {
      let url = getOriginFromURL(tab.url);
      autoInputByFetch(url);
    }
  });
}); 

function autoInputByFetch(url){
  let accounts = null;
  let data = {
    "url" : url,
  }      
  let response = fetchAccounts(postURL,data);
  response.then((res) => {
    //アカウントデータがある場合
    if(Array.isArray(res)){
      accounts = res;
      sendAutoInputMessage(accounts,0);
    }
    //local storageに保存
    chrome.storage.local.set({accounts: accounts});
  });

}

//Content Scriptへ自動入力メッセージ送信
function sendAutoInputMessage(accounts,page){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(tabs[0].status === "complete"){
      let promise = chrome.tabs.sendMessage(tabs[0].id, {action: "autoInput", accounts: accounts,page: page});
      promise.catch((error) => {
        console.log(error);
      });
    }
  });
}


async function fetchAccounts(postURL,data){
  let formData = new FormData();
  for(let key in data){
    formData.append(key,data[key]);
  }
  let response = await fetch(postURL,{
    method:"POST",
    mode:"cors",
    body:formData,
  
  });
  if(!response.ok){
    console.log(response.statusText);
    return;
  }
  return response.json();
}

function getOriginFromURL(url){
  let origin = new URL(url).origin;
  return origin;
}




