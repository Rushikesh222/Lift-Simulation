const submitBtn = document.querySelector(".submit");
const mainContainer = document.querySelector(".Lift-UI");
const noOfLiftElement = document.querySelector(".no-of-lift");
const noOfFloorElement = document.querySelector(".no-of-floor");
let numberOfLift;
let numberOffloor;
let numberOfLiftData = [];
let numberOfFloorRequest = [];

submitBtn.addEventListener("click", () => {
  if (noOfFloorElement && noOfLiftElement.value == "") {
    alert("Please Number Of Lift");
    return;
  }
  if (
    noOfLiftElement &&
    (noOfLiftElement.value > 10 || noOfLiftElement.value < 1)
  ) {
    alert("Enter the number of Lift between 1 to 10");
    return;
  }
  if (noOfFloorElement && noOfFloorElement.value == "") {
    alert("Please Number Of floor");
    return;
  }
  if (
    noOfFloorElement &&
    (noOfFloorElement.value > 10 || noOfFloorElement.value < 2)
  ) {
    alert("Enter the number of floor between 2 to 10");
    return;
  }
  if (Number(noOfLiftElement.value) > Number(noOfFloorElement.value)) {
    alert("No of Lift must be less than the floor");
    return;
  }

  mainContainer.innerHTML = "";
  noOfFloor = noOfFloorElement.value;
  noOfLift = noOfLiftElement.value;
  noOfFloorElement.value = "";
  noOfLiftElement.value = "";

  let element = document.createElement("div");
  element.style.cssText = "height:auto; width:100vw; display:flex;";
  element.style.flexDirection = "column";

  let currentFloor;
  for (let i = noOfFloor; i > 0; i--) {
    currentFloor = document.createElement("div");
    let upButton = document.createElement("button");
    upButton.textContent = `UP-${i}`;
    upButton.id = `UP-${i}`;
    let downButton = document.createElement("button");
    downButton.textContent = downButton.id = `Down-${i}`;

    let upDownContainer = document.createElement("div");
    if (i != noOfFloor) {
      upButton.addEventListener("click", this.callingLift);
      upDownContainer.appendChild(upButton);
    }
    if (i != 1) {
      downButton.addEventListener("click", this.callingLift);
      upDownContainer.appendChild(downButton);
    }
    upButton.style.cssText =
      "background-color: green; font-weight: 700; font-size: 15px; min-width: 100%; height: 25px; border: none; border-radius: 10px;";
    downButton.style.cssText =
      "background-color: yellow; font-weight: 700; font-size: 15px; min-width: 100%; height: 25px; border: none; border-radius: 10px;";
    mainContainer.style.cssText = "width:auto;min-width:100vw";

    upDownContainer.style.cssText =
      "display: flex; flex-direction: column; justify-content: space-around; min-width: 80px;";
    upDownContainer.setAttribute("id", `Floor-up-down${i}`);
    currentFloor.setAttribute("id", `Floor-${i}`);

    currentFloor.appendChild(upDownContainer);
    currentFloor.style.cssText =
      "height: 120px; min-width: 90vw; border: 0.1px solid grey; display:flex; flex-direction:row; gap:2rem; width:auto; border-right:0px;";

    element.appendChild(currentFloor);
  }

  mainContainer.appendChild(element);

  let targetFloorNo = mainContainer.querySelector("#Floor-1");
  let lift;

  for (let j = noOfLift; j > 0; j--) {
    lift = document.createElement("div");
    lift.style.cssText =
      "height:100px; min-width:80px; border:2px solid grey; display:flex; overflow: hidden; ";
    lift.setAttribute("id", `floorid-${j}`);
    let left = document.createElement("div");
    left.setAttribute("id", `left-door-${j}`);

    left.classList.add("leftLift");

    let right = document.createElement("div");
    right.setAttribute("id", `right-door-${j}`);
    right.classList.add("rightlift");
    lift.appendChild(left);
    lift.appendChild(right);

    targetFloorNo.appendChild(lift);

    const liftState = {
      id: j,
      isRunning: false,
      currentFloor: 1,
      Destination: null,
      isGateOpening: false,
    };

    numberOfLiftData.push(liftState);
    setInterval(() => {
      ScheduleLift();
    }, 1000);
  }
});

const findNearestLift = (destinationFloor) => {
  let nearestLiftDistance = noOfFloor;
  destinationFloor = Number(destinationFloor);
  let nearestliftId;
  let lifts = numberOfLiftData;

  for (let liftIndex = 0; liftIndex < numberOfLiftData.length; liftIndex++) {
    const lift = lifts[liftIndex];
    if (
      Math.abs(lift.currentFloor - destinationFloor) < nearestLiftDistance &&
      lift.isRunning === false &&
      lift.isGateOpening === false
    ) {
      nearestLiftDistance = Math.abs(lift.currentLift - destinationFloor);
      nearestliftId = lift.id;
    }
  }
  let allLift = [];

  for (let liftIndex = 0; liftIndex < numberOfLiftData.length; liftIndex++) {
    const lift = lifts[liftIndex];
    if (
      Math.abs(lift.currentFloor - destinationFloor) == nearestLiftDistance &&
      lift.isRunning == false &&
      lift.isGateOpening == false
    ) {
      allLift.push(Number(lift.id));
    }
  }
  if (allLift && allLift.length > 0) {
    const randomIndex = Math.floor(Math.random() * allLift.length);
    let lift = allLift[randomIndex];
    nearestliftId = lift;
  }
  return nearestliftId;
};

async function handleLift(door, targetFloor) {
  const currentLift = numberOfLiftData.find((lift) => lift.id == door);
  let from = currentLift.currentFloor;

  const distance = -1 * (targetFloor - 1) * 120;

  const time = Math.abs(from - targetFloor) * 2;

  currentLift.Destination = targetFloor;
  currentLift.isRunning = true;
  let lift = document.querySelector(`#floorid-${door}`);
  lift.style.transform = `translateY(${distance}px)`;
  lift.style.transition = `transform ${time}s`;
  const leftDoor = document.querySelector(`#left-door-${door}`);
  const rightDoor = document.querySelector(`#right-door-${door}`);
  setTimeout(() => {
    leftDoor.classList.add("openLeftDoor");
    rightDoor.classList.add("openrightDoor");
    currentLift.currentFloor = targetFloor;
    currentLift.isRunning = false;
    currentLift.isGateOpening = true;
  }, time * 1000);
  setTimeout(() => {
    leftDoor.classList.remove("openLeftDoor");
    rightDoor.classList.remove("openrightDoor");
    currentLift.isGateOpening = false;
    currentLift.Destination = null;
  }, time * 1000 + 5000);
}
async function openClosedLift(door) {
  const currentLift = numberOfLiftData.find((lift) => lift.id == door);
  const leftDoor = document.querySelector(`#left-door-${door}`);
  const rightDoor = document.querySelector(`#right-door-${door}`);

  setTimeout(() => {
    leftDoor.classList.add("openLeftDoor");
    rightDoor.classList.add("openrightDoor");
    currentLift.isGateOpening = true;
  });
  setTimeout(() => {
    leftDoor.classList.remove("openLeftDoor");
    rightDoor.classList.remove("openrightDoor");
    currentLift.isGateOpening = false;
  }, 6000);
}

function isLiftGoingOnTheFloor(TargetFloorNo) {
  let boolean = false;
  for (let liftIndex = 0; liftIndex < numberOfLiftData.length; liftIndex++) {
    const lift = numberOfLiftData[liftIndex];

    if (Number(lift.Destination) == TargetFloorNo) {
      console.log("lift move");
      boolean = true;
    }
  }
  return boolean;
}

function callingLift(e) {
  let id = e.target.id;
  let TargetFloorNo = id.split("-")[1];
  TargetFloorNo = Number(TargetFloorNo);
  if (isLiftGoingOnTheFloor(TargetFloorNo)) {
    console.log("already exist floor");
  } else {
    console.log("check else");
    numberOfFloorRequest.push(Number(TargetFloorNo));
  }
  return;
}

const findLiftAtparticularFloor = (destinationFloor) => {
  let allLift = [];
  destinationFloor = Number(destinationFloor);
  let nearestLiftId;

  for (let liftIndex = 0; liftIndex < numberOfLiftData.length; liftIndex++) {
    const lift = numberOfLiftData[liftIndex];
    if (
      Number(lift.currentFloor) == destinationFloor &&
      lift.isRunning === false
    ) {
      allLift.push(Number(lift.id));
    }
  }
  if (allLift && allLift.length > 0) {
    const randomIndex = Math.floor(Math.random() * allLift.length);
    let lift = allLift[randomIndex];
    nearestLiftId = lift;
  }

  return nearestLiftId;
};
const ScheduleLift = () => {
  if (numberOfFloorRequest.length === 0) return;

  const TargetFloorNo = numberOfFloorRequest.shift();

  if (isLiftGoingOnTheFloor(TargetFloorNo)) {
    return;
  }
  let nearestLiftId;
  let nearestLiftAtFloor = findLiftAtparticularFloor(TargetFloorNo);

  if (nearestLiftAtFloor) {
    nearestLiftId = nearestLiftAtFloor;
    openClosedLift(nearestLiftId);
    return;
  } else {
    let neaLiftId = findNearestLift(TargetFloorNo);
    if (neaLiftId) {
      nearestLiftId = neaLiftId;
    }
  }
  if (!nearestLiftId) {
    numberOfFloorRequest.unshift(TargetFloorNo);
    return;
  }
  handleLift(nearestLiftId, TargetFloorNo);
};
