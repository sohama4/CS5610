$(document).ready(function() 
{
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
			case 'Register':
				window.location = "/register";
				break;
			case 'Login':
				window.location = "/login";
				break;
			case 'Best-Sellers':
				window.location = "/list";
				break;
			case 'Search Books!':
				window.location = "/booksearch";
				break;
			case 'Write':
				window.location = "/write";
				break;
			case 'Search':
				window.location = "/search";
				break;
			case 'Log out!':
				window.location = "/logout";
				break;
		}
	});
	var path = window.location.pathname;
	var isbn = path.substring(8, path.length);
	var url = 'http://'+ window.location.host + '/about/' + isbn;
	$.getJSON(url).done(function(data)
	{
		if(jQuery.isEmptyObject(data))
			jQuery('<div/>', 
				{
					html: '<h2>No books found</h2><br>That ISBN is not linked to any book. Please try again!'
				}).appendTo('.showdiv');
		else
		{
			var googleLink 		= data.accessInfo.webReaderLink;
			var volumeInfo 		= data.volumeInfo;
			var imageLink 		= volumeInfo.imageLinks.thumbnail;
			var authors 		= volumeInfo.authors;
			var rating 			= volumeInfo.averageRating;
			var ratingsCount 	= volumeInfo.ratingsCount;
			var ratingsHTML;
			(ratingsCount === undefined) ? ratingsHTML = '<b>Ratings data unavailable for this title</b>' : ratingsHTML = '<b> '+ ratingsCount + '</b> People gave it an average rating of<b> ' + rating + '</b> out of 5<br>'
			var description 	= volumeInfo.description;
			var pageCount 		= volumeInfo.pageCount;
			var publishedDate 	= volumeInfo.publishedDate;
			var publisher 		= volumeInfo.publisher;
			var title 			= volumeInfo.title;
			var newHTML = '';
			if(authors !== undefined)
				$.each(authors, function(index, value)
				{
					if((index + 1) === authors.length)
						newHTML += '<span>' + value + '</span>';
					else
						newHTML += '<span>' + value + ', </span>';
				});
			else
				newHTML = 'Not found! :(';
			(title === '') ? (title = 'ISBN: ' + volumeInfo.industryIdentifiers[1].identifier) : title = title;

			var html = '<img src=' + imageLink + ' /><p style=" color: white; text-align: justify; text-justify: inter-word;"><h2>' + title + '</h2><br><h3><a target=_blank href= ' + googleLink + '>Check it out on Google Reader</a></h3><br><hr><b>Author(s):</b> '+ newHTML  + '<br><br><b>Summary: </b>' + description + '<br><br><b>Publisher:</b> ' + publisher + '<br><b>Date of Publication: </b>' + publishedDate + '<br><b>Number of Pages: </b>' + pageCount + '<br>' + ratingsHTML + '</p>';
			console.log(html, newHTML)
			jQuery('<div/>', 
				{
					html: html
				}).appendTo('.showdiv');
		}
	});
});