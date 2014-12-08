var selected = [];
var divStyle = 'background-color: #583759; display: block; border-radius: 4px; height: 60px; font-weight: bold; color: white; padding: 2px; border-width: 2px; border-color: white; margin-top: 10px; margin-bottom: 10px;';

$(document).ready(function() 
{
	// animate hover text
	$('#hovershow').hide();

	$("#hovertext").hover(
    function() 
    {
        // Styles to show the box
        $('#hovershow').show("medium");
    },
    function () 
    {
        // Styles to hide the box
        $('#hovershow').hide("medium");
    });
	// animate the navbar
	$('.navbarelements').hover(function()
	{
		$(this).css('cursor', 'pointer');
		$(this).stop().animate({'opacity': 1});
	},
	function()
	{
		$(this).stop().animate({'opacity': 0.6});
	});

	// click-enable the navbar
	$('.navbarelements').click(function()
	{
		var text = $(this).text();
		switch(text)
		{
			case 'Home':
				window.location = "/loginsuccess";
				break;
			case 'User Activity':
				window.location = "/viewActivity";
				break;
			case 'Search':
				window.location = "/search";
				break;
			case 'Log out!':
				window.location = "/logout";
				break;
			case 'Write':
				window.location = "/write";
				break;
			case 'Books!':
				window.location = "/books";
				break;
		}
	});

	var url = 'http://' + location.host + '/activity';
	$.getJSON(url).done(function(data)
	{
		if(jQuery.isEmptyObject(data))
			jQuery('<div/>',
			{
				class: 'resultdiv',
				id: 'result0',
				html: 'You have not read any articles yet.'
			}).appendTo('.showdiv');
		else
			$.each(data, function(i, doc) 
			{
				var title = doc.title;
  				var id = doc.articleId;
  				var url;
  				(doc.URL != undefined) ? url = '/readarticle/' + id : '/readarticle/user/' + id
  				var image = '/css/images/nophoto.png';
  				var time = new Date(Number(doc.time));
  				var html = '<img title="' + title + '" class=bookimg src=' + image + ' /><a href=' + url + ' target=_blank><h5>' + title + '</h5></a><p style="float:left;">Read at: ' + time;
  				jQuery('<div/>', 
				{
					class: 'resultdiv',
					id: 'resultdiv' + (i + 1),
					html: html
				}).appendTo('.showdiv');
  			});
	});
	url = 'http://' + location.host + '/writtenbyme';
	$.getJSON(url).done(function(data)
	{
		if(jQuery.isEmptyObject(data))
			jQuery('<div/>',
			{
				class: 'resultdiv',
				id: 'result0',
				html: 'You have not written any articles yet.'
			}).appendTo('.written');

		else
			$.each(data, function(i, doc) 
			{
				var title = doc.title;
				var url = doc.URL;
				var time = new Date(Number(doc.Time));
				var image = '/css/images/nophoto.png';
				var html = '<img title="' + title + '" class=bookimg src=' + image + ' /><a href=' + url + ' target=_blank><h5>' + title + '</h5></a><p style="float:left;">Written at: ' + time;
				jQuery('<div/>', 
				{
					class: 'resultdiv',
					id: 'result' + (i + 1),
					href: url,
					html: html,
				}).appendTo('.written');
			});
	});

});