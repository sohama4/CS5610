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

	// make navbar clickable
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
			case 'Write':
				window.location = "/write";
				break;
			case 'Search':
				window.location = "/search";
				break;
			case 'Log out!':
				window.location = "/logout";
				break;
			case 'Books!':
					window.location = "/books";
					break;
		}
	});
});