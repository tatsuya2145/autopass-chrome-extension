var accounts = [];
var page = 0;
var pageCount = 0;

chrome.runtime.sendMessage({action: "getStoredAccounts"},(response)=>{
  accounts = response.accounts;
  if(accounts != null){
    pageCount = accounts.length;
    let account = accounts[0];
    $('#login_id').val(account.login_id);
    $('#password').val(account.password);
    $('#description').val(account.description);
    $('#accounts').removeAttr('hidden');
    $('#invalid').attr('hidden', true);
    updatePageNumber(page);
  }
  else{
    $('#invalid').removeAttr('hidden');
    $('#accounts').attr('hidden', true);
  }
});

$('.copy').on('click',function() { 
  let id = $(this).data('id');
  let value = $('#'+id).val();
  navigator.clipboard.writeText(value);
});

$('#prev').on('click',function() {
  page--;
  if(page < 0){
    page = accounts.length - 1;
  }
  let account = accounts[page];
  $('#login_id').val(account.login_id);
  $('#password').val(account.password);
  $('#description').val(account.description);
  updatePageNumber(page);
});

$('#next').on('click',function() {
  page++;
  if(page >= accounts.length){
    page = 0;
  }
  let account = accounts[page];
  $('#login_id').val(account.login_id);
  $('#password').val(account.password);
  $('#description').val(account.description);
  updatePageNumber(page);
});

$('#autoinput').on('click',function() {
  let promise = chrome.runtime.sendMessage({action: "autoInput", page: page});
  promise.catch((error) => {
    console.log(error);
  });
});

function updatePageNumber(page){
  let text = (page+1)+'/'+pageCount;
  $('#page').text(text);
}