$(document).ready(function() 
{


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
			case 'Books':
				window.location = "/books";
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
});