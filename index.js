gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
    scrollTrigger: {
      trigger: ".images-sec",
      start: "top top",
      end: `bottom top`,
      scrub: true,
      pin: true,
    }
  })
gsap.timeline({
  opacity: '0.5',
    scrollTrigger: {
      trigger: ".image-center",
      start: "top bottom",
      end: `bottom top`,
      scrub: true,
    }
  })
  .to(".image-center", {scale: '1', opacity: '1' }, 0)
  .to(".image-left", {scale: '1', translateY: '0' }, 0.3)
  .to(".image-right", {scale: '1', translateY: '0' }, 0.3)
  .to(".image-left", { rotateY: '300deg', }, 0.5)
  .to(".image-right", { rotateY: '-300deg' }, 0.5)