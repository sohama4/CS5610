$(document).ready(function() 
{
  var i = 0;
  var quoteArray = ["<h3><i>“The more that you read, the more things you will know. The more that you learn, the more places you'll go.”</i></h3>" + 
                      "<br> - Oscar Wilde", 
                    "<h3><i>“It is what you read when you don't have to that determines what you will be when you can't help it.”</i></h3>" + 
                      "<br> - Dr. Seuss",
                    "<h3><i>“A great book should leave you with many experiences, and slightly exhausted at the end. You live several lives while reading.”</i></h3>" + 
                      "<br> - William Styron",
                    "<h3><i>“Do not read, as children do, to amuse yourself, or like the ambitious, for the purpose of instruction. No, read in order to live.”</i></h3>" +
                      "<br> - Gustave Flaubert"];

  $('.rotatediv').html(quoteArray[0]);
  setInterval(swapText,4000);

  function swapText()
  {
    $(".rotatediv").fadeOut(function() 
    {
      if(i != quoteArray.length - 1)
      {
        $(this).html(quoteArray[i+1]);
        i = i+1;
      }
      else
      {
        i = 0;
        $(this).html(quoteArray[i]);
      }
    }).fadeIn();
  }

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
    var text = $(this).html();
    switch(text)
    {
      case 'Home':
        window.location = "/";
        break;
      case 'Books':
        window.location = "/";
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
    }
  });
});