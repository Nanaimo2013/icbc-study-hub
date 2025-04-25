// This file is deprecated.
// Please use questions.yaml instead, which contains all questions organized by category.
// The categories are: signs, rules, hazards, safety, and parking.

// Export direct questions to use when YAML loading fails
const questions = [
  // ROAD SIGNS QUESTIONS WITH IMAGES
  {
    id: "signs_1",
    question: "What does this sign mean?",
    answer: "Stop",
    category: "signs",
    difficulty: "easy",
    explanation: "A stop sign means you must come to a complete stop. Stop at the stop line or before the crosswalk. If there is no stop line or crosswalk, stop at the point nearest to the intersection where you can see traffic.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/stop.gif"
  },
  {
    id: "signs_2",
    question: "What does this sign mean?",
    answer: "Yield",
    category: "signs",
    difficulty: "easy",
    explanation: "A yield sign means you must let traffic in the intersection or close to it go first. You don't need to stop if there's no traffic.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/yield.gif"
  },
  {
    id: "signs_3",
    question: "What does this sign mean?",
    answer: "School Zone",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign indicates you are entering a school zone with a maximum speed of 30 km/h in effect on school days, 8 a.m. to 5 p.m.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-school-zone.png"
  },
  {
    id: "signs_4",
    question: "What does this sign mean?",
    answer: "Playground Zone",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign indicates a playground zone. The maximum speed of 30 km/h is in effect from dawn to dusk.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-playground.png"
  },
  {
    id: "signs_5",
    question: "What does this sign mean?",
    answer: "Railway Crossing Ahead",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign warns you that a railway crossing is ahead. You must yield to trains.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-railway-crossing.png"
  },
  {
    id: "signs_6",
    question: "What does this sign mean?",
    answer: "No Entry",
    category: "signs",
    difficulty: "easy",
    explanation: "This sign indicates that you are not permitted to enter. You will see this sign at exit ramps of expressways or highways.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-no-entry.gif"
  },
  {
    id: "signs_7",
    question: "What does this sign mean?",
    answer: "Maximum Speed Limit",
    category: "signs",
    difficulty: "easy",
    explanation: "This sign indicates the maximum legal speed permitted when conditions are good.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-speed-limit-50.gif"
  },
  {
    id: "signs_8",
    question: "What does this sign mean?",
    answer: "One Way",
    category: "signs",
    difficulty: "easy",
    explanation: "This sign indicates that traffic is allowed to move in one direction only.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-one-way.gif"
  },
  {
    id: "signs_9",
    question: "What does this sign mean?",
    answer: "No Stopping",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign means you must not stop your vehicle at this location for any reason.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-no-stopping.gif"
  },
  {
    id: "signs_10",
    question: "What does this sign mean?",
    answer: "Road Slippery When Wet",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign warns that the road ahead may become slippery when wet. Slow down in wet conditions.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-slippery.gif"
  },
  {
    id: "signs_11",
    question: "What does this sign mean?",
    answer: "Merging Traffic",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign indicates that another roadway is joining yours. Adjust your speed and position to allow traffic to merge safely.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-merge.gif"
  },
  {
    id: "signs_12",
    question: "What does this sign mean?",
    answer: "Narrow Bridge",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign warns that the bridge ahead is narrower than the roadway you are travelling on.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-narrow-bridge.gif"
  },
  {
    id: "signs_13",
    question: "What does this sign mean?",
    answer: "No Left Turn",
    category: "signs",
    difficulty: "easy",
    explanation: "This sign indicates that left turns are not permitted at this intersection.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-no-left-turn.gif"
  },
  {
    id: "signs_14",
    question: "What does this sign mean?",
    answer: "No Right Turn",
    category: "signs",
    difficulty: "easy",
    explanation: "This sign indicates that right turns are not permitted at this intersection.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-no-right-turn.gif"
  },
  {
    id: "signs_15",
    question: "What does this sign mean?",
    answer: "Two-Way Traffic",
    category: "signs",
    difficulty: "medium",
    explanation: "This sign warns that you are entering a two-way roadway. Keep to the right.",
    imageUrl: "https://www.icbc.com/driver-licensing/Documents/rs-two-way-traffic.gif"
  },

  // RULES AND REGULATIONS
  {
    id: "rules_1",
    question: "What should you do at a flashing red light?",
    choices: ["Slow down", "Stop completely", "Yield only", "Speed up"],
    answer: "Stop completely",
    category: "rules",
    difficulty: "medium",
    explanation: "A flashing red light should be treated as a stop sign. You must come to a complete stop, check for traffic, and proceed when safe."
  },
  {
    id: "rules_2",
    question: "What is the maximum speed limit in a residential area?",
    choices: ["30 km/h", "50 km/h", "60 km/h", "80 km/h"],
    answer: "50 km/h",
    category: "rules",
    difficulty: "easy",
    explanation: "Unless otherwise posted, the default speed limit in residential areas is 50 km/h."
  },
  {
    id: "rules_3",
    question: "What is the minimum following distance recommended in good conditions?",
    choices: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
    answer: "2 seconds",
    category: "rules",
    difficulty: "medium",
    explanation: "In good conditions, you should maintain at least a 2-second following distance from the vehicle ahead of you."
  },
  {
    id: "rules_4",
    question: "When should you signal a lane change?",
    choices: ["Just as you change lanes", "1 second before", "At least 3 seconds before", "Only when there's traffic"],
    answer: "At least 3 seconds before",
    category: "rules",
    difficulty: "easy",
    explanation: "You should signal at least 3 seconds before changing lanes to give other drivers time to react."
  },
  {
    id: "rules_5",
    question: "When driving through a roundabout, who has the right of way?",
    choices: ["Vehicles entering the roundabout", "Vehicles already in the roundabout", "Vehicles on the right", "Emergency vehicles only"],
    answer: "Vehicles already in the roundabout",
    category: "rules",
    difficulty: "medium",
    explanation: "Vehicles already in the roundabout have the right of way. You must yield to traffic already in the roundabout before entering."
  },

  // HAZARDS QUESTIONS
  {
    id: "hazards_1",
    question: "What should you do if your vehicle starts to skid?",
    choices: ["Steer in the opposite direction", "Steer in the direction of the skid", "Brake hard", "Accelerate"],
    answer: "Steer in the direction of the skid",
    category: "hazards",
    difficulty: "hard",
    explanation: "When your vehicle skids, you should steer in the direction of the skid (the direction the rear of the vehicle is sliding) while avoiding sudden braking or acceleration."
  },
  {
    id: "hazards_2",
    question: "What does a slippery road sign indicate?",
    choices: ["Road is clear", "Road is wet and slippery", "Road is under construction", "Road is closed"],
    answer: "Road is wet and slippery",
    category: "hazards",
    difficulty: "medium",
    explanation: "A slippery road sign warns that the road may become slippery when wet, and you should reduce your speed accordingly."
  },
  {
    id: "hazards_3",
    question: "What should you do if you encounter a deer on the road?",
    choices: ["Speed up to get past it quickly", "Honk your horn and flash your lights", "Brake firmly and stay in your lane", "Swerve to avoid it"],
    answer: "Brake firmly and stay in your lane",
    category: "hazards",
    difficulty: "hard",
    explanation: "If you encounter a deer or other animal on the road, brake firmly but stay in your lane. Swerving can cause you to lose control or hit another vehicle."
  },
  {
    id: "hazards_4",
    question: "What should you do if your vehicle hydroplanes?",
    choices: ["Accelerate", "Brake hard", "Steer into the skid", "Ease off the gas and steer straight"],
    answer: "Ease off the gas and steer straight",
    category: "hazards",
    difficulty: "hard",
    explanation: "If your vehicle hydroplanes, ease off the accelerator, avoid braking, and keep the steering wheel straight until you regain traction."
  },
  {
    id: "hazards_5",
    question: "What is the proper response if your brakes fail?",
    choices: ["Turn off the engine immediately", "Pump the brake pedal rapidly", "Shift to a lower gear and use the emergency brake", "Open the door and jump out"],
    answer: "Shift to a lower gear and use the emergency brake",
    category: "hazards",
    difficulty: "hard",
    explanation: "If your brakes fail, shift to a lower gear to use engine braking, pump the brake pedal, and gradually apply the parking/emergency brake. Signal and move to the side of the road when safe."
  },

  // SAFETY QUESTIONS
  {
    id: "safety_1",
    question: "When should you not use your high beam headlights?",
    choices: ["On country roads", "In fog or snow", "On unlit highways", "During dawn or dusk"],
    answer: "In fog or snow",
    category: "safety",
    difficulty: "medium",
    explanation: "You should not use high beam headlights in fog or snow as the light will reflect back and reduce visibility. Use low beams instead."
  },
  {
    id: "safety_2",
    question: "What is the safest hand position on the steering wheel?",
    choices: ["10 and 2 o'clock", "9 and 3 o'clock", "8 and 4 o'clock", "One hand at 12 o'clock"],
    answer: "9 and 3 o'clock",
    category: "safety",
    difficulty: "easy",
    explanation: "The 9 and 3 o'clock position is now recommended as the safest steering wheel hand position, as it provides good control and reduces the risk of injury if the airbag deploys."
  },
  {
    id: "safety_3",
    question: "What is the main purpose of anti-lock braking systems (ABS)?",
    choices: ["To make the car stop faster", "To prevent the wheels from locking during braking", "To reduce fuel consumption", "To reduce wear on brake pads"],
    answer: "To prevent the wheels from locking during braking",
    category: "safety",
    difficulty: "medium",
    explanation: "Anti-lock braking systems (ABS) prevent the wheels from locking during hard braking, allowing you to maintain steering control while braking."
  },
  {
    id: "safety_4",
    question: "When driving in heavy fog, you should:",
    choices: ["Use high beams", "Follow closely to the car ahead to see their taillights", "Increase your speed to get out of the fog quickly", "Use low beams and reduce speed"],
    answer: "Use low beams and reduce speed",
    category: "safety",
    difficulty: "medium",
    explanation: "In heavy fog, use low beam headlights (not high beams), reduce your speed, and increase your following distance. If necessary, use fog lights if your vehicle has them."
  },
  {
    id: "safety_5",
    question: "What does the acronym SIPDE stand for in defensive driving?",
    choices: ["Stop, Inspect, Plan, Drive, Evaluate", "Scan, Identify, Predict, Decide, Execute", "See, Interpret, Plan, Drive, Evade", "Safety In Potentially Dangerous Environments"],
    answer: "Scan, Identify, Predict, Decide, Execute",
    category: "safety",
    difficulty: "hard",
    explanation: "SIPDE stands for Scan, Identify, Predict, Decide, Execute - a method for defensive driving that helps drivers anticipate and respond to potential hazards."
  }
];

// Define categories
const categories = [
  { id: "signs", name: "Road Signs", description: "Learn about traffic signs and their meanings", icon: "signs" },
  { id: "rules", name: "Road Rules", description: "Understanding driving regulations and laws", icon: "rules" },
  { id: "hazards", name: "Hazard Awareness", description: "Identifying and responding to road hazards", icon: "hazards" },
  { id: "safety", name: "Road Safety", description: "Safety practices for drivers and pedestrians", icon: "safety" },
  { id: "parking", name: "Parking Rules", description: "Rules and regulations for parking", icon: "parking" }
];

// Create the data object
const questionData = {
  questions,
  categories
};

// Export the questions and categories
export default questionData;