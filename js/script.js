// Smooth scroll on navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.animationDelay;
      entry.target.style.animationPlayState = "running";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right")
  .forEach((el) => {
    el.style.animationPlayState = "paused";
    observer.observe(el);
  });

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
  }
});

// Parallax effect for elements
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const circles = document.querySelector(".cta-circles");
  if (circles) {
    circles.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
});

// Counter animation for statistics
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  counters.forEach((counter) => {
    const target = parseInt(counter.innerText);
    const increment = target / 50;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.innerText = target;
        clearInterval(timer);
      } else {
        counter.innerText = Math.ceil(current);
      }
    }, 20);
  });
}

// Trigger counter animation when scrolled to
const statsSection = document.querySelector(".growth-stats");
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(statsSection);
}

// Hover effects for cards
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05)";
  });
  card.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });
});

// Dynamic scroll reveal
window.addEventListener("scroll", () => {
  const elements = document.querySelectorAll('[class*="fade-in"]');
  elements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const elementBottom = el.getBoundingClientRect().bottom;
    if (elementTop < window.innerHeight && elementBottom > 0) {
      el.style.opacity = "1";
    }
  });
});

// Typing Effect

const textArray = ["Health", "Secure Future", "Kids Future"];

let index = 0;
let charIndex = 0;
let currentText = "";
let isDeleting = false;

function typeEffect() {
  currentText = textArray[index];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  document.querySelector(".typing-text").textContent = currentText.slice(
    0,
    charIndex
  );

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1500); // pause before delete
    return;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % textArray.length;
  }

  setTimeout(typeEffect, isDeleting ? 120 : 160);
}

// ✅ Start effect after 3 seconds delay
setTimeout(() => {
  typeEffect();
}, 500);

// Brand Slider

const track = document.getElementById("brandTrack");

// Clone all items once for smooth infinite scroll
const items = Array.from(track.children);
items.forEach((item) => {
  const clone = item.cloneNode(true);
  track.appendChild(clone);
});

// Pause animation on hover
track.addEventListener("mouseover", () => {
  track.style.animationPlayState = "paused";
});

track.addEventListener("mouseleave", () => {
  track.style.animationPlayState = "running";
});






 var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
        }
    });




AOS.init({
  duration: 800, // smooth animation
  easing: "ease-out", // smooth feel
  once: true, // animate only once
  offset: 80, // start a bit early
});
