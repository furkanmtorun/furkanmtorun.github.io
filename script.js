/* 
Furkan M. Torun
furkanmtorun@gmail.com
*/

const $ = window.$ // Declare the $ variable

$(document).ready(() => {
  // Theme toggle functionality
  const themeToggle = $("#theme-toggle")
  const themeIcon = themeToggle.find("i")

  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", currentTheme)

  // Update icon based on current theme
  updateThemeIcon(currentTheme)

  // Theme toggle click handler
  themeToggle.on("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)
  })

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.removeClass("fa-moon").addClass("fa-sun")
    } else {
      themeIcon.removeClass("fa-sun").addClass("fa-moon")
    }
  }

  // Smooth scrolling for navigation links
  $(".nav-link").on("click", function (e) {
    e.preventDefault()

    const target = $(this).attr("href")
    const targetSection = $(target)

    if (targetSection.length) {
      $("html, body").animate(
        {
          scrollTop: targetSection.offset().top - 100,
        },
        800,
      )
    }
  })

  // Update active navigation link on scroll
  $(window).on("scroll", () => {
    const scrollPosition = $(window).scrollTop() + 150

    $(".nav-link").each(function () {
      const target = $(this).attr("href")
      const targetSection = $(target)

      if (targetSection.length) {
        const sectionTop = targetSection.offset().top
        const sectionBottom = sectionTop + targetSection.outerHeight()

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          $(".nav-link").removeClass("active")
          $(this).addClass("active")
        }
      }
    })
  })

  // Add scroll effect to cards
  $(window).on("scroll", () => {
    $(".timeline-item, .portfolio-card, .talk-card, .honor-item, .volunteer-item, .blog-card, .contact-card").each(
      function () {
        const elementTop = $(this).offset().top
        const elementBottom = elementTop + $(this).outerHeight()
        const viewportTop = $(window).scrollTop()
        const viewportBottom = viewportTop + $(window).height()

        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          $(this).addClass("animate-in")
        }
      },
    )
  })

  // Blog card click effect
  $(".blog-card").on("click", function () {
    $(this).addClass("clicked")
    setTimeout(() => {
      $(this).removeClass("clicked")
    }, 200)
  })

  // Social link hover effects
  $(".social-link").hover(
    function () {
      $(this).addClass("hovered")
    },
    function () {
      $(this).removeClass("hovered")
    },
  )

  // GDPR notification
  if (!localStorage.getItem("gdprAccepted")) {
    $("#gdprNotification").show()
  }

  // Set dynamic year in footer
  $("#currentYear").text(new Date().getFullYear())
})

// GDPR notification close function
function closeNotification() {
  $("#gdprNotification").hide()
  localStorage.setItem("gdprAccepted", "true")
}

// Add CSS for animations
$("<style>")
  .prop("type", "text/css")
  .html(
    `
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .blog-card.clicked {
            transform: scale(0.98);
        }
        
        .social-link.hovered {
            transform: translateY(-3px) scale(1.05);
        }
    `,
  )
  .appendTo("head")
