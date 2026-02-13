/* 
Furkan M. Torun
@furkanmtorun
*/


$(document).ready(function () {

  // GDPR notification visibility
  if (!localStorage.getItem("gdprAccepted")) {
    $("#gdprNotification").fadeIn();
  }

  // Navigation scroll behavior
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 20) {
      $('#nav').addClass('scrolled');
    } else {
      $('#nav').removeClass('scrolled');
    }
  });

  // Mobile menu toggle
  $('.menu-toggle').on('click', function () {
    $(this).toggleClass('open');
    $('.nav-mobile-menu').toggleClass('open');
  });

  // Close mobile menu when clicking a link
  $('.nav-mobile-menu a').on('click', function () {
    $('.menu-toggle').removeClass('open');
    $('.nav-mobile-menu').removeClass('open');
  });

  // Theme toggle
  $('.theme-toggle').on('click', function () {
    $('html').toggleClass('light');

    // Save theme preference to localStorage
    if ($('html').hasClass('light')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    $('html').addClass('light');
  } else {
    $('html').removeClass('light');
  }

  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 80
      }, 800);
    }
  });

});

// GDPR notification close function
function closeNotification() {
  $("#gdprNotification").hide()
  localStorage.setItem("gdprAccepted", "true")
}