$(function() {
    chrome.storage.onChanged.addListener(function(changes) {
        if (changes.loggedWorkEvents) {
            renderHtml(changes.loggedWorkEvents.newValue);
        }
    });
    chrome.storage.local.get(function(data) {
        renderHtml(data.loggedWorkEvents)
    });
    chrome.extension.getBackgroundPage().reloadLoggedWorkEvents();

    function renderHtml(loggedWorkEvents) {
        var odd = false;
        $('table tbody:last').empty();
        loggedWorkEvents.forEach(function(item) {
            var date = new Date(item.date)
            $('table tbody:last').prepend("<tr class='" + (odd ? "odd" : "") + "'><td class='summary'><a target='_blank' href='" + item.link + "' title='" + item.summary + "'>" + item.key + ": " + item.summary + "</a></td><td>" + date.getHours() + ":" + pad(date.getMinutes(), 2) + "</td><td>" + Math.floor(item.loggedWork / 60) + ":" + pad(item.loggedWork % 60, 2) + "</td></tr>")
            odd = !odd;
        });
        var total = loggedWorkEvents.reduce(
                function(curr, prev) {
                    return {loggedWork: curr.loggedWork + prev.loggedWork};
                }, {loggedWork: 0}).loggedWork;
        $("table tfoot td:last").text(Math.floor(total / 60) + ":" + pad(total % 60, 2));
    }

    function pad(str, max) {
        return (str + "").length < max ? pad("0" + str, max) : str;
    }

});
		