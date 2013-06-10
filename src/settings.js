$(function(){
	chrome.storage.local.get(function(data){
		if(data.username){
			$('#username').val(data.username);
			$('#server').val(data.server);
			$('#key').val(data.key);
		}
	});
	$('#properties').on('submit', function(event){
		event.preventDefault();
		var username = $('#username').val();
		var server = $('#server').val();
		var key = $('#key').val();
		chrome.storage.local.set({'username':username, 'server': server, 'key': key});
	});
});