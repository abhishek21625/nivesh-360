// NAVBAR ACTIVE LINK

const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

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
    992: { slidesPerView: 3 },
  },
});

// ANIMATE ON SCROLL

AOS.init({
  duration: 800, // smooth animation
  easing: "ease-out", // smooth feel
  once: true, // animate only once
  offset: 80, // start a bit early
});

// STATISTICS

/*
          Rolling digit implementation (Option B: fixed number of cycles)
          - Each digit will perform CYCLES full loops then land on target digit
          - Alternating directions: index 0 -> downward, index 1 -> upward, ...
          - Upward sequence: 1,2,3,4,5,6,7,8,9,0 (repeat)
          - Downward sequence: 9,8,7,6,5,4,3,2,1,0 (repeat)
          - Non-digit characters (k, +) are displayed as static symbols
        */

(function () {
  const CYCLES = 2; // number of full cycles before landing (changeable)
  const BASE_DURATION_PER_CYCLE = 1000; // ms per cycle (changeable)
  const STAGGER = 150; // ms delay between starting each digit

  // Create array for upward wheel (starting from 1 to 9 then 0)
  const UP = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  // Downward wheel (9 to 0)
  const DOWN = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];

  // build a roller sequence that repeats the base wheel "CYCLES" times and then appends the path to the final digit
  function buildSequence(finalDigitStr, direction) {
    const wheel = direction === "up" ? UP : DOWN;
    const final = String(finalDigitStr);

    const seq = [];
    // Add full cycles
    for (let c = 0; c < CYCLES; c++) {
      seq.push(...wheel);
    }

    // After cycles, append items from wheel start until we reach the final digit:
    // For upward wheel: continue from wheel start index 0 forward until final reached
    // For downward wheel: continue from wheel start index 0 forward (which is '9') until final reached
    // This ensures we pass through the digits in order without skipping.
    // Find the index where final occurs in wheel
    const targetIndex = wheel.indexOf(final);
    if (targetIndex === -1) {
      // not a digit (shouldn't normally happen), just append final as-is
      seq.push(final);
    } else {
      // append from start of wheel up to the targetIndex (inclusive)
      for (let i = 0; i <= targetIndex; i++) {
        seq.push(wheel[i]);
      }
    }

    return seq;
  }

  // Build DOM roller for a single digit
  function buildRollerForDigit(digitChar, index) {
    // If not a digit (k, +, etc), return a static element
    if (!/[0-9]/.test(digitChar)) {
      const span = document.createElement("span");
      span.className = "symbol";
      span.textContent = digitChar;
      return { el: span, isSymbol: true };
    }

    // Determine direction for this index: even -> downward, odd -> upward (per Option A)
    const direction = index % 2 === 0 ? "down" : "up";

    // Build sequence
    const seq = buildSequence(digitChar, direction);

    // Create viewport & roller elements
    const viewport = document.createElement("div");
    viewport.className = "digit-viewport";

    const roller = document.createElement("div");
    roller.className = "digit-roller";

    // Populate roller with sequence items (each is a div with digit)
    seq.forEach((ch) => {
      const d = document.createElement("div");
      d.textContent = ch;
      roller.appendChild(d);
    });

    viewport.appendChild(roller);

    return { el: viewport, roller, length: seq.length, direction };
  }

  // Animate a roller to its final position
  function animateRoller(
    rollerEl,
    itemCount,
    digitHeight,
    totalDuration,
    delay
  ) {
    // translateY target = - ( (itemCount - 1) * digitHeight ) to show last item
    const targetTranslate = -((itemCount - 1) * digitHeight);

    // Apply transition duration
    rollerEl.style.transition = `transform ${totalDuration}ms cubic-bezier(.2,.9,.25,1)`;
    // apply delay via setTimeout (stagger)
    setTimeout(() => {
      rollerEl.style.transform = `translateY(${targetTranslate}px)`;
    }, delay);

    // return a promise resolved when transition ends
    return new Promise((resolve) => {
      const onEnd = (e) => {
        if (e.target === rollerEl) {
          rollerEl.removeEventListener("transitionend", onEnd);
          resolve();
        }
      };
      rollerEl.addEventListener("transitionend", onEnd);
    });
  }

  // Build and animate a number element (handles multi-char numbers like '25000' or '10+')
  async function playNumber(element) {
    const text =
      element.getAttribute("data-value") || element.textContent.trim();
    element.innerHTML = ""; // clear fallback

    // For visual purposes, we will display digits side-by-side.
    const chars = String(text).split("");

    // Create container to hold the digit rollers / symbols
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "4px";

    // Build rollers for each char
    const rollers = [];
    chars.forEach((ch, idx) => {
      const r = buildRollerForDigit(ch, idx);
      wrapper.appendChild(r.el);
      if (!r.isSymbol)
        rollers.push({
          roller: r.roller,
          items: r.length,
          idx,
          direction: r.direction,
        });
    });

    // Append wrapper to the number element
    element.appendChild(wrapper);

    // Digit height detection (from rendered first child)
    // We'll assume all digit elements have equal height (CSS sets it).
    // Wait a tiny moment for layout
    await new Promise((r) => requestAnimationFrame(r));

    const sampleRoller = element.querySelector(".digit-roller");
    if (!sampleRoller) return; // nothing to animate

    const digitHeight =
      sampleRoller.firstElementChild.getBoundingClientRect().height;

    // Animate each roller with a stagger and duration proportional to cycles
    const baseDuration = CYCLES * BASE_DURATION_PER_CYCLE; // per-digit base
    const tasks = rollers.map((r, i) => {
      // totalDuration: scale slightly by number of items to ensure smooth roll
      const totalDuration = baseDuration + r.items * 20; // add tiny per-item ms
      const delay = i * STAGGER; // stagger start for a wave effect

      // animate and return promise
      return animateRoller(
        r.roller,
        r.items,
        digitHeight,
        totalDuration,
        delay
      ).then(() => {
        // small settle transform (pop)
        r.roller.parentElement.classList.add("settle");
        setTimeout(
          () => r.roller.parentElement.classList.remove("settle"),
          260
        );
      });
    });

    // Wait for all to finish
    await Promise.all(tasks);
  }

  // Observe when numbers container enters view
  const numbers = document.querySelectorAll(".number");
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          // Play each .number once
          for (const el of entries.map((e) => e.target)) {
            // Guard: only run once
            if (!el.dataset.played) {
              el.dataset.played = "1";
              // We attempt to preserve the visible label (e.g., show "25k") but animate using data-value if present.
              // data-value is the numeric target; if not present, we use element.textContent.
              await playNumber(el);
            }
          }
          obs.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  numbers.forEach((n) => io.observe(n));

  // OPTIONAL: allow replay by focusing or clicking - you can remove if undesired
  // For demo, clicking a number will replay it
  numbers.forEach((n) =>
    n.addEventListener("click", async () => {
      n.dataset.played = "";
      await playNumber(n);
      n.dataset.played = "1";
    })
  );
})();

// SERVICES SECTION

const serviceData = {
  life: {
    price: "INSURANCE SOLUTIONS",
    title: "Insurance Solutions at Nivesh360",
    button: "Explore Insurance Solutions →",
    description: `Insurance is the foundation of a stable and worry-free future. At Nivesh360, we help individuals, families, and businesses choose
    the right protection based on their unique needs and goals. Our insurance advisory
    covers life protection, health coverage, term plans, retirement planning, child
    education security, and motor & lifestyle protection.
    <br><br>
    We guide you through every step — from choosing
    the right policy to claim assistance — ensuring you always feel supported, informed, and
    protected. Our approach is transparent, educational, and completely customer-first.
    Whether you want to secure your family’s future, safeguard your health, or plan for
    retirement, we provide tailor-made solutions backed by 25+ years of experience.`,
    image: "images/imgi_16_68feeb0b4844973a5db50c47_about-us-Image.webp",
  },
  health: {
    price: "INVESTMENT SERVICES",
    title: "Grow Your Wealth with Smart, Guided Investments",
    button: "Explore Investment Options →",
    description: `Investing is not just about returns — it’s about building a strong financial foundation for your future. At Nivesh360, we help you invest confidently in Mutual Funds, SIPs, AIFs, PMS, REITs, fixed-income instruments, and tax-saving plans. <br><br>
    Our advisory combines market expertise, risk analysis, and long-term planning to create a personalized investment roadmap that matches your income, risk capacity, and future goals. Whether you’re beginning with a small SIP or exploring advanced wealth-building products, we ensure your money grows steadily and safely.`,
    image: "images/imgi_18_6911a1921d23ee316c8e5cbc_Health Insurance.webp",
  },
  auto: {
    price: "FINANCIAL ADVISORY",
    title: "Your 360° Financial Roadmap",
    button: "Discover Our Advisory →",
    description: `Our financial advisory service provides end-to-end planning for your entire financial life — income, savings, investments, tax planning, risk management, retirement, and family protection. We create long-term strategies that help you stay disciplined, reduce risk, and enjoy financial freedom over time. <br><br> From portfolio reviews to wealth management and structured goal planning, our advisory ensures that every financial decision leads to a stronger, stable, and worry-free future.`,
    image: "images/imgi_21_6911a17248a3ed3ed109b37a_Business Insurance.webp",
  },
};

// SELECT ELEMENTS
const filterButtons = document.querySelectorAll(".filter-btn");
const priceElement = document.getElementById("price");
const descriptionElement = document.getElementById("description");
const titleElement = document.getElementById("services-title");
const ctaButton = document.getElementById("cta-btn");
const imageWrapper = document.getElementById("image-wrapper");

// BUTTON CLICK HANDLER
filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    const service = this.dataset.service;
    const data = serviceData[service];

    if (data) {
      imageWrapper.classList.add("out");

      setTimeout(() => {
        priceElement.textContent = data.price;
        titleElement.textContent = data.title;
        ctaButton.textContent = data.button;
        descriptionElement.innerHTML = data.description;

        imageWrapper.innerHTML = `<img src="${data.image}" alt="${service} Image" />`;

        imageWrapper.classList.remove("out");
      }, 300);
    }
  });
});

// BLOG SECTION

document.querySelectorAll(".blog-card").forEach((card) => {
  card.addEventListener("mouseenter", () => card.classList.add("shadow-lg"));
  card.addEventListener("mouseleave", () => card.classList.remove("shadow-lg"));
});

// FAQ SECTION

// FAQ Accordion Functionality
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    // Close all other items
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });

    // Toggle current item
    item.classList.toggle("active");

    // Smooth scroll to item if opening
    if (item.classList.contains("active")) {
      setTimeout(() => {
        item.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  });
});

// Add smooth scroll behavior to CTA button
document.querySelector(".cta-button").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
