var url = 'http://' + location.host + '/written';
$.getJSON(url).done(function(data)
{
	if(jQuery.isEmptyObject(data))
		jQuery('<div/>',
		{
			class: 'result',
			id: 'result0',
			style: divStyle,
			html: 'Zero articles written.'
		}).appendTo('.showdiv');
	else
		$.each(data, function(i, doc) 
		{
			var url = doc.url;
			var time = new Date(Number(doc.time));
			var html = '<a style="color: white;" target="_blank" href=/redUrl/' + url +'>' + url + '</a><br><br>Viewed at time: ' + time;
			jQuery('<div/>', 
			{
				class: 'result',
				id: 'result' + (i + 1),
				style: divStyle,
				href: '/redUrl/' + url,
				rel: 'external',
				html: html,
			}).appendTo('.showdiv');
		});
});