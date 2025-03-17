gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Store components in variables
const page = document.querySelector(".page");
const wrapper = document.querySelector(".page__wrapper");

// Ease value to be used in interpolation
const ease = 0.05; // 20%

// Create an object to store scroll details
const scroll = {
  current: 0, // Current scroll position
  target: 0, // Target scroll position
  limit: 0 // Limit of scroll
};

// Function to update target scroll position
const updateTarget = (e) => {
  // Set the target value to deltaY
  scroll.target += e.deltaY;
};

// Create an event listener to listen for mouse-wheel
document.addEventListener("mousewheel", updateTarget);

// Linear interpolation function
const lerp = (current, target) => {
  const distanceBetween = target - current;
  const distanceToTravel = distanceBetween * ease;
  return current + distanceToTravel;
};

// Clamping function to limit mousewheel values
const clamp = (min, max, value) => {
  return Math.min(Math.max(value, min), max);
};

// Main smooth scroll function
const smoothScroll = () => {
  const maxScroll = wrapper.clientHeight - window.innerHeight;
  scroll.limit = maxScroll;

  // Clamp scroll target value
  scroll.target = clamp(0, maxScroll, scroll.target);

  const { current, target } = scroll;
  const transition = lerp(current, target);
  scroll.current = transition;

  // Translate page wrapper based on lerped value
  wrapper.style.transform = `translateY(-${scroll.current}px)`;

  // Update ScrollTrigger with the current scroll position
  ScrollTrigger.update();

  // Continue the loop
  window.requestAnimationFrame(smoothScroll);
};

// Call smoothScroll to start loop
smoothScroll();

// Configure ScrollTrigger to use the custom scroller
ScrollTrigger.scrollerProxy(wrapper, {
  scrollTop(value) {
    if (arguments.length) {
      scroll.current = value; // Setter
      scroll.target = value;
      wrapper.style.transform = `translateY(-${scroll.current}px)`;
    }
    return scroll.current; // Getter
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  pinType: wrapper.style.transform ? "transform" : "fixed"
});

// Section 2: Animated Section
const leftImage = document.querySelector('.left-image');
const centerImage = document.querySelector('.center-image');
const rightImage = document.querySelector('.right-image');
const animatedSection = document.querySelector('.animated-section');

// Pin the animated section and apply animations
ScrollTrigger.create({
  trigger: animatedSection,
  scroller: wrapper, // Use the custom scroller
  start: 'top top', // Start pinning when top of section hits top of viewport
  end: '+=100%', // Pin for the height of the section plus extra space for animation
  pin: true, // Pin the section during scroll
  pinSpacing: true,
  anticipatePin: 1, // Smoothly anticipate pinning
});

// Left Image Animation (rotateY)
gsap.fromTo(
  leftImage,
  { rotateY: 0 },
  {
    rotateY: 220,
    scrollTrigger: {
      trigger: animatedSection,
      scroller: wrapper, // Use the custom scroller
      start: 'top top', // Start animation when top of section aligns with top of viewport
      end: 'bottom 20%', // End animation when 20% of section is left
      scrub: true, // Smoothly tie animation to scroll
      toggleActions: 'play reverse play reverse', // Play on enter, reverse on leave
    }
  }
);

// Center Image Animation (scale up then slightly down)
gsap.fromTo(
  centerImage,
  { scale: 1.8 }, // Start smaller
  {
    scale: 2, // Scale up to larger size
    scrollTrigger: {
      trigger: animatedSection,
      scroller: wrapper, // Use the custom scroller
      start: 'top top',
      end: 'center center', // Scale up until the middle of the section
      scrub: true,
      toggleActions: 'play reverse play reverse',
    }
  }
);

// Add a second animation for the center image to scale down slightly
gsap.to(
  centerImage,
  {
    scale: 1.3, // Scale down slightly, but not too small
    scrollTrigger: {
      trigger: animatedSection,
      scroller: wrapper, // Use the custom scroller
      start: 'center center', // Start scaling down from the middle of the section
      end: 'bottom 20%', // End when 20% of section is left
      scrub: true,
      toggleActions: 'play reverse play reverse',
    }
  }
);

gsap.fromTo(
  rightImage,
  { rotateY: 0 },
  {
    rotateY: -220, // Rotate in opposite direction for right image
    scrollTrigger: {
      trigger: animatedSection,
      scroller: wrapper, // Use the custom scroller
      start: 'top top',
      end: 'bottom 20%',
      scrub: true,
      toggleActions: 'play reverse play reverse',
    }
  }
);

// Optional: Add smooth scroll behavior for navigation (e.g., clicking a link)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(this.getAttribute('href'));
    const targetPosition = targetElement.getBoundingClientRect().top + scroll.current;
    gsap.to(scroll, {
      duration: 1,
      target: targetPosition,
      ease: 'power2.inOut',
      onUpdate: () => {
        wrapper.style.transform = `translateY(-${scroll.current}px)`;
        ScrollTrigger.update();
      }
    });
  });
});

// Section 3: Tabs with Accordion and Images
const accordionSection = document.querySelector('.accordion-section');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const accordionItems = document.querySelectorAll('.accordion-item');
const accordionImages = document.querySelectorAll('.accordion-image');

// Variable to track if click mode is active
let isClickMode = false;

// Function to reset all accordion items and images
function resetAccordionState() {
  accordionItems.forEach(item => {
    const paragraph = item.querySelector('p');
    gsap.set(paragraph, { height: 0, opacity: 0 });
    item.classList.remove('active');
  });
  accordionImages.forEach(image => {
    gsap.set(image, { opacity: 0, transform: 'translateY(50px)' });
  });
}

// Function to activate a specific accordion item and its image
function activateAccordionItem(tabContent, itemIndex) {
  resetAccordionState();
  const item = tabContent.querySelector(`.accordion-item[data-index="${itemIndex}"]`);
  const paragraph = item.querySelector('p');
  item.classList.add('active');
  gsap.to(paragraph, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power1.out' });
  const image = document.querySelector(`.accordion-image[data-tab="${tabContent.dataset.tab}"][data-index="${itemIndex}"]`);
  gsap.to(image, { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: 'power1.out' });
}

// Add click event listeners to accordion headings
accordionItems.forEach(item => {
  const heading = item.querySelector('h3');
  heading.addEventListener('click', () => {
    isClickMode = true; // Enable click mode
    const tabContent = item.closest('.tab-content');
    const itemIndex = item.dataset.index;
    activateAccordionItem(tabContent, itemIndex);
  });
});

function initializeAccordionSection() {
  // Reset all states
  gsap.killTweensOf(accordionItems);
  gsap.killTweensOf(accordionImages);
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  resetAccordionState();

  // Set initial tab state
  tabs[0].classList.add('active');
  const firstTabContent = document.querySelector(`.tab-content[data-tab="restaurants"]`);
  firstTabContent.classList.add('active');

  // Create ScrollTrigger
  return ScrollTrigger.create({
    trigger: accordionSection,
    scroller: wrapper, // Use the custom scroller
    start: 'top top',
    end: '+=1200%', // 3 tabs * 4 items per tab * 100% per item
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    scrub: 1, // Smoothly tie animation to scroll
    toggleActions: 'play reverse play reverse', // Play on enter, reverse on leave (both directions)
    invalidateOnRefresh: true, // Refresh animations on page refresh or resize
    onUpdate: (self) => {
      if (isClickMode) return; // Skip scroll updates if in click mode

      const progress = self.progress;
      const itemsPerTab = 4; // 4 accordion items per tab
      const totalSegments = tabs.length * itemsPerTab; // 3 tabs * 4 items = 12 segments
      const segmentProgress = progress * totalSegments;

      // Determine active tab and item
      const activeTabIndex = Math.floor(segmentProgress / itemsPerTab);
      const activeItemIndex = Math.floor(segmentProgress % itemsPerTab);

      // Activate the current tab
      tabs.forEach((tab, index) => {
        if (index === activeTabIndex) {
          tab.classList.add('active');
          const tabContent = document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`);
          tabContent.classList.add('active');
        } else {
          tab.classList.remove('active');
          const tabContent = document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`);
          tabContent.classList.remove('active');
        }
      });

      // Open or close accordion items and images based on scroll position
      tabContents.forEach((tabContent, tabIndex) => {
        if (tabIndex === activeTabIndex) {
          const items = tabContent.querySelectorAll('.accordion-item');
          items.forEach((item, itemIndex) => {
            const paragraph = item.querySelector('p');
            if (itemIndex === activeItemIndex) {
              item.classList.add('active');
              gsap.to(paragraph, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power1.out' });
              const image = document.querySelector(`.accordion-image[data-tab="${tabContent.dataset.tab}"][data-index="${itemIndex}"]`);
              gsap.to(image, { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: 'power1.out' });
            } else {
              item.classList.remove('active');
              gsap.to(paragraph, { height: 0, opacity: 0, duration: 0.3, ease: 'power1.in' });
              const image = document.querySelector(`.accordion-image[data-tab="${tabContent.dataset.tab}"][data-index="${itemIndex}"]`);
              gsap.to(image, { opacity: 0, transform: 'translateY(50px)', duration: 0.3, ease: 'power1.in' });
            }
          });
        } else {
          const items = tabContent.querySelectorAll('.accordion-item');
          items.forEach((item) => {
            const paragraph = item.querySelector('p');
            item.classList.remove('active');
            gsap.to(paragraph, { height: 0, opacity: 0, duration: 0.3, ease: 'power1.in' });
            const itemIndex = item.dataset.index;
            const image = document.querySelector(`.accordion-image[data-tab="${tabContent.dataset.tab}"][data-index="${itemIndex}"]`);
            gsap.to(image, { opacity: 0, transform: 'translateY(50px)', duration: 0.3, ease: 'power1.in' });
          });
        }
      });
    },
    // Reset to initial state when entering from top
    onEnter: () => {
      isClickMode = false; // Disable click mode on scroll entry
      // Reset all states
      gsap.killTweensOf(accordionItems);
      gsap.killTweensOf(accordionImages);
      tabs.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      resetAccordionState();

      // Set initial state
      tabs[0].classList.add('active');
      const firstTabContent = document.querySelector(`.tab-content[data-tab="restaurants"]`);
      firstTabContent.classList.add('active');
      const firstItem = firstTabContent.querySelector('.accordion-item[data-index="0"]');
      firstItem.classList.add('active');
      const firstParagraph = firstItem.querySelector('p');
      gsap.set(firstParagraph, { height: 'auto', opacity: 1 });
      const firstImage = document.querySelector('.accordion-image[data-tab="restaurants"][data-index="0"]');
      gsap.set(firstImage, { opacity: 1, transform: 'translateY(0)' });
    },
    // Reset to initial state when entering from bottom
    onEnterBack: () => {
      isClickMode = false; // Disable click mode on scroll entry
      // Reset all states
      gsap.killTweensOf(accordionItems);
      gsap.killTweensOf(accordionImages);
      tabs.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      resetAccordionState();

      // Set initial state (same as onEnter to restart animation)
      tabs[0].classList.add('active');
      const firstTabContent = document.querySelector(`.tab-content[data-tab="restaurants"]`);
      firstTabContent.classList.add('active');
      const firstItem = firstTabContent.querySelector('.accordion-item[data-index="0"]');
      firstItem.classList.add('active');
      const firstParagraph = firstItem.querySelector('p');
      gsap.set(firstParagraph, { height: 'auto', opacity: 1 });
      const firstImage = document.querySelector('.accordion-image[data-tab="restaurants"][data-index="0"]');
      gsap.set(firstImage, { opacity: 1, transform: 'translateY(0)' });
    }
  });
}

// Initialize the accordion section
let accordionScrollTrigger = initializeAccordionSection();

// Refresh ScrollTrigger on window resize or orientation change
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});