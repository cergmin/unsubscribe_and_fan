const cursor = document.querySelector(".cursor");
const wind = document.querySelector(".wind");
const banner = document.querySelector(".pointer_lock_banner");

let windOffsetX = 0;
let cursorX = 0;
let cursorY = 0;
let isCursorLocked = false;

document.body.addEventListener("click", (e) => {
  if (!isCursorLocked) {
    document.body.requestPointerLock();
    cursorX = e.clientX;
    cursorY = e.clientY;
  }
});

const isInWind = () => {
  // Returns true if cursor is in the .air

  if (cursorX > wind.getBoundingClientRect().left + wind.offsetWidth) {
    return false;
  }

  if (
    cursorY < wind.getBoundingClientRect().top ||
    cursorY > wind.getBoundingClientRect().top + wind.offsetHeight
  ) {
    return false;
  }

  return true;
};

const updateCursorPosition = (e) => {
  if (e.movementX > 0 && isInWind()) {
    cursorX += e.movementX / (1 + (cursorX / document.body.clientWidth) * 3);
  } else {
    cursorX += e.movementX;
  }
  cursorY += e.movementY;

  if (cursorX < 0) {
    cursorX = 0;
  }
  if (cursorY < 0) {
    cursorY = 0;
  }
  if (cursorX > document.body.clientWidth) {
    cursorX = document.body.clientWidth;
  }
  if (cursorY > document.body.clientHeight) {
    cursorY = document.body.clientHeight;
  }

  cursor.style.transform = `translateX(${cursorX}px) translateY(${cursorY}px)`;
};

let prevTime, timeDelta;
const animationFrameStep = (currTime) => {
  if (!prevTime) {
    timeDelta = 10;
  } else {
    timeDelta = Math.min(20, Math.max(10, currTime - prevTime));
  }
  prevTime = currTime;

  if (isCursorLocked) {
    // Animation for wind
    windOffsetX -= 0.6 * timeDelta;
    wind.style.backgroundPositionX = `${windOffsetX}px`;

    // Changing cursor's position
    if (isInWind()) {
      cursorX -= 0.6 * timeDelta;

      if (cursorX < 0) {
        cursorX = 0;
      }
    }

    cursor.style.transform = `translateX(${cursorX}px) translateY(${cursorY}px)`;
  }

  window.requestAnimationFrame(animationFrameStep);
};

window.requestAnimationFrame(animationFrameStep);

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === null) {
    document.removeEventListener("mousemove", updateCursorPosition, false);
    cursor.style.display = "none";
    banner.style.display = "flex";
    isCursorLocked = false;
  } else {
    document.addEventListener("mousemove", updateCursorPosition, false);
    cursor.style.display = "block";
    banner.style.display = "none";
    isCursorLocked = true;
  }
});
