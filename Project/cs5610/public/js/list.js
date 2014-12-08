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
		$(this).stop().animate({'opacity': 0.9});
	});

	// click-enable the navbar
	$('.navbarelements').click(function()
	{
		var text = $(this).text()
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
			case 'Books':
				window.location = "/books";
				break;
			case 'Search':
				window.location = "/search";
				break;
			case 'Log out!':
				window.location = "/logout";
				break;
		}
	});

	$('#b1').hide();
	$('#b1').click(function()
	{
		window.location = "/list";
	});


	var url = 'http://api.nytimes.com/svc/books/v2/lists/names.jsonp?api-key=05caeecdb1c47e526bf39660adc78e26:19:70186283';
	$.ajax({ url: url, dataType: 'jsonp', jsonp: 'callback', success: 
		function(data) 
		{
			$.each(data.results, function(i, doc) 
			{
				var newUrl = 'http://api.nytimes.com/svc/books/v3/lists/' + doc.list_name_encoded + '.jsonp?api-key=05caeecdb1c47e526bf39660adc78e26:19:70186283';
				var nUrl = 'http://www.nytimes.com/best-sellers-books/' + doc.list_name_encoded + '/list.html';
				jQuery('<div/>', 
				{
					class: 'listitemdiv',
					id: 'result' + (i + 1),
					rel: 'external',
					href: newUrl,
					html: '<h3><a target="_blank" href=' + nUrl +'>' + doc.display_name + '</a></h3><br><br><b>Date first published: ' + doc.oldest_published_date + '<br>Updated: ' + doc.updated + '</b>'
				}).appendTo('.maindiv');
			});

			$('.listitemdiv').click(function()
			{
				var href = $(this).attr('href');
				$('#b1').show("medium");
				$(this).siblings().stop().animate().hide("medium");
				$.ajax({ url: href, dataType: 'jsonp', jsonp: 'callback', success: 
					function(data) 
					{
						console.log(data);
						$.each(data.results.books, function(i, doc) 
						{
							var bookUrl = 'http://du.ec2.nytimes.com.s3.amazonaws.com/prd/books/';
							var length = bookUrl.length;
							var rank = doc.rank;
							var weeks = doc.weeks_on_list;
							var description = doc.description;
							var author = doc.author;
							var isbn = doc.primary_isbn13;
							var title = doc.title;
							var book_image;
							(doc.book_image == null) ? (book_image = '/css/images/nophoto.png') : book_image = bookUrl + doc.book_image.substring(length, doc.book_image.length);
							
							var amazon_url = doc.amazon_product_url;
							var html = '<img title="' + description + '" class=bookimg src=' + book_image + ' /><a href=/review/' + isbn + ' target=_blank><h5>' + title + '</h5></a><p style="float:left;">Rank: ' + rank + '<br>Author: ' + author +'<br>Number of weeks spent on list: ' + weeks + '</p>';
							jQuery('<div/>', 
							{
								class: 'resultdiv',
								id: 'resultdiv' + (i + 1),
								rel: 'external',
								html: html
							}).appendTo('.viewdiv');
						});
					}
				});
			});
		}
	});
});