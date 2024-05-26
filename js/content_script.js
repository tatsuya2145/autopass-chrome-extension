
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action ==="autoInput"){
    let accounts = request.accounts;
    let page = request.page;
    autoInput(accounts,page);
  }
});

/**
 * 
 * @param {array} accounts 
 * @param {int} page popup画面の各ページ 
 */
function autoInput(accounts,page){
  let account = accounts[page];
  let inputs = document.querySelectorAll('input');
  
  if(isExistTypePassword(inputs)){
    inputs.forEach(input => {
      if(input.type === 'password'){
        input.value = account.password;
      }
      if(input.type === 'text'){
        input.value = account.login_id;
      }
    });
  }
}

function isExistTypePassword(inputs){
  for (let i = 0; i < inputs.length; i++) {
    if(inputs[i].type === 'password') return true;
  }
  return false;

}

