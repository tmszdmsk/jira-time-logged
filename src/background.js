
chrome.alarms.create("refresh",{"periodInMinutes":1/6, "delayInMinutes":1/60});
chrome.alarms.onAlarm.addListener(function(alarm) {
	parseLoggedTime(function(data){
		var total = data.reduce(
			function(curr,prev){
				return {loggedWork: curr.loggedWork+prev.loggedWork};
			},{loggedWork:0}).loggedWork;
		var totalStr = Math.floor(total/60)+":"+pad(total%60,2);;
		chrome.browserAction.setBadgeText({"text":totalStr});
	});
});

function parseLoggedTime(callback){
	var startDate = new Date();
	startDate.setUTCHours(0,0,0,0);
	var endDate = new Date(); 
	endDate.setDate(startDate.getDate()+1);
	chrome.storage.local.get(function(data){
		if(data.username && data.server){
		$.get(data.server+"/activity?maxResults=99&streams=key+IS+UTC&streams=update-date+BETWEEN+"+startDate.getTime()+"+"+endDate.getTime()+"&streams=user+IS+"+data.username+"&issues=activity+IS+issue%3Aupdate&providers=issues&os_authType=basic",
		function(data) {
			var $xml = $(data); 
			var logEntries = [];
			$xml.find("entry").each(function(){
				var $this=$(this);
				var matches = $this.find("content[type=html]").text().match(/.*<li>Logged '(.*)'<\/li>.*/);
				if(matches){
					logEntries.push(
						{
							"key":$this.find("title[type=text]").text(),
							"summary":$this.find("summary[type=text]").text(),
							"link":$this.find("link[rel=alternate]").attr("href"),
							"loggedWork": loggedTimeInMinutes(matches[1]),
							"date": new Date($this.find("published").text())
						}
					);
					
				}
			});
			callback(logEntries);
		}
		);
		}
	});
	
}

function loggedTimeInMinutes(loggedWork){
	var e = loggedWork.replace(/h/g, "*60");
	e = e.replace(/m/g, "");
	e = e.replace(/d/g, "*60*8");
	e = e.replace(/ /g, "+");
	return eval(e);
}

function pad (str, max) {
	return (str+"").length < max ? pad("0" + str, max) : str;
}
