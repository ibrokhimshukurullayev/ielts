export const LISTENING_SECTIONS = [
  {
    id: 1,
    title: "Section 1 — Gym Membership Enquiry",
    type: "Form Completion",
    description: "A woman phones a leisure centre to ask about membership options.",
    transcript: `Receptionist: Good morning, Riverside Leisure Centre, how can I help?
Caller: Hi, I'd like some information about joining the gym.
Receptionist: Of course. Can I take your full name, please?
Caller: It's Caroline Hewitt — H-E-W-I-T-T.
Receptionist: And a contact phone number?
Caller: 0792 334 8851.
Receptionist: Great. We have three membership types: Standard, which is forty-two pounds a month, Off-Peak at twenty-eight pounds, and Family at sixty-five pounds. Which sounds suitable?
Caller: The Off-Peak one sounds good for me.
Receptionist: Lovely. There's also a one-off joining fee of fifteen pounds. Would you like to book an induction session? We have availability on Thursday at half past five in the evening.
Caller: Thursday at five thirty works for me.
Receptionist: Perfect, and the induction takes place in Studio 2 on the second floor.`,
    questions: [
      { id: 1, type: "form", prompt: "Full name:", blankLabel: "Caroline ___________" },
      { id: 2, type: "form", prompt: "Contact number:", blankLabel: "0792 334 ___________" },
      { id: 3, type: "form", prompt: "Membership chosen:", blankLabel: "___________" },
      { id: 4, type: "form", prompt: "Monthly fee:", blankLabel: "£___________" },
      { id: 5, type: "form", prompt: "Joining fee:", blankLabel: "£___________" },
      { id: 6, type: "form", prompt: "Induction day:", blankLabel: "___________" },
      { id: 7, type: "form", prompt: "Induction time:", blankLabel: "___________" },
      { id: 8, type: "form", prompt: "Induction location:", blankLabel: "Studio ___________" },
      { id: 9, type: "form", prompt: "Location floor:", blankLabel: "___________ floor" },
      {
        id: 10,
        type: "mcq",
        prompt: "What does the caller need to pay in addition to the monthly fee?",
        options: ["A. Equipment hire", "B. A joining fee", "C. A guest pass fee"],
      },
    ],
  },
  {
    id: 2,
    title: "Section 2 — Community Centre Tour",
    type: "Map Labelling",
    description: "A guide describes the layout of a new community centre to visitors.",
    transcript: `Guide: Welcome to the Hartfield Community Centre. Let me explain the layout. As you enter through the main doors, the reception desk is directly ahead of you. To the left of reception is the café, and beyond the café, in the far corner, you'll find the library. On the right of reception is the main hall, which is used for events. Behind the main hall, at the back of the building, is the art studio. Next to the art studio, closer to the rear exit, is the meeting room. Upstairs, directly above reception, is the fitness suite, and the children's play area is at the far end of the upstairs floor, above the library.`,
    mapAreas: ["Reception", "Café", "Library", "Main Hall", "Art Studio", "Meeting Room", "Fitness Suite", "Play Area"],
    questions: [
      { id: 11, type: "map", prompt: "Located directly ahead of the main doors:", options: ["Reception", "Café", "Main Hall"] },
      { id: 12, type: "map", prompt: "Located to the left of reception:", options: ["Café", "Library", "Art Studio"] },
      { id: 13, type: "map", prompt: "Located in the far corner, beyond the café:", options: ["Library", "Meeting Room", "Fitness Suite"] },
      { id: 14, type: "map", prompt: "Located on the right of reception:", options: ["Main Hall", "Play Area", "Café"] },
      { id: 15, type: "map", prompt: "Located behind the main hall:", options: ["Art Studio", "Library", "Reception"] },
      { id: 16, type: "map", prompt: "Located next to the art studio, near the rear exit:", options: ["Meeting Room", "Café", "Fitness Suite"] },
      { id: 17, type: "map", prompt: "Located upstairs, directly above reception:", options: ["Fitness Suite", "Play Area", "Library"] },
      { id: 18, type: "map", prompt: "Located at the far end of the upstairs floor:", options: ["Play Area", "Meeting Room", "Café"] },
      {
        id: 19,
        type: "mcq",
        prompt: "Which floor is the fitness suite on?",
        options: ["A. Ground floor", "B. Upstairs", "C. Basement"],
      },
      {
        id: 20,
        type: "mcq",
        prompt: "What is located above the library?",
        options: ["A. Fitness suite", "B. Children's play area", "C. Meeting room"],
      },
    ],
  },
  {
    id: 3,
    title: "Section 3 — Discussing a Research Project",
    type: "Multiple Choice",
    description: "Two students discuss their plans for a sociology research project with their tutor.",
    transcript: `Tutor: So tell me, what's the focus of your project going to be?
Student A: We're looking at how commuting patterns affect wellbeing in different age groups.
Tutor: That's broad — how will you narrow it down?
Student B: We thought we'd compare two groups: people who commute by car and people who use public transport.
Tutor: Good. And your method?
Student A: A survey, probably around two hundred respondents, plus a handful of follow-up interviews.
Tutor: Two hundred is ambitious for the timeframe you have. I'd suggest aiming for around eighty, with five or six interviews for depth.
Student B: That sounds more realistic, actually.
Tutor: What's your main concern at this stage?
Student A: Recruiting enough car commuters — most volunteers so far use public transport.
Tutor: Try posting in the car park noticeboards and the staff newsletter, not just student channels.`,
    questions: [
      {
        id: 21,
        type: "mcq",
        prompt: "The project will focus on the relationship between commuting and:",
        options: ["A. income level", "B. wellbeing", "C. job satisfaction"],
      },
      {
        id: 22,
        type: "mcq",
        prompt: "The two groups being compared are defined by:",
        options: ["A. age", "B. mode of transport", "C. distance travelled"],
      },
      {
        id: 23,
        type: "mcq",
        prompt: "What method do the students initially propose?",
        options: ["A. Interviews only", "B. A survey plus interviews", "C. Observational study"],
      },
      {
        id: 24,
        type: "mcq",
        prompt: "What does the tutor recommend for the survey sample size?",
        options: ["A. 200", "B. 80", "C. 50"],
      },
      {
        id: 25,
        type: "mcq",
        prompt: "How many follow-up interviews does the tutor suggest?",
        options: ["A. Two or three", "B. Five or six", "C. Ten"],
      },
      {
        id: 26,
        type: "mcq",
        prompt: "What is the students' main current difficulty?",
        options: ["A. Finding car commuters to take part", "B. Designing the survey questions", "C. Booking interview rooms"],
      },
      {
        id: 27,
        type: "mcq",
        prompt: "Where does the tutor suggest advertising for participants?",
        options: ["A. Student social media only", "B. Car park noticeboards and the staff newsletter", "C. Local newspapers"],
      },
      {
        id: 28,
        type: "mcq",
        prompt: "Most current volunteers use:",
        options: ["A. Cars", "B. Public transport", "C. Bicycles"],
      },
      {
        id: 29,
        type: "mcq",
        prompt: "The tutor describes the original sample size of 200 as:",
        options: ["A. too small", "B. ambitious for the timeframe", "C. exactly right"],
      },
      {
        id: 30,
        type: "mcq",
        prompt: "The overall tone of the tutor's feedback is:",
        options: ["A. discouraging", "B. constructive", "C. indifferent"],
      },
    ],
  },
  {
    id: 4,
    title: "Section 4 — Lecture: The History of Urban Parks",
    type: "Multiple Choice",
    description: "A short academic lecture on the development of public parks in cities.",
    transcript: `Lecturer: Today I want to look briefly at the history of urban parks. Before the nineteenth century, green space in cities was largely private, attached to wealthy estates. The idea of a park open to the general public is largely a nineteenth-century invention, driven partly by public health concerns about overcrowded, polluted industrial cities. Birkenhead Park, opened in England in 1847, is often cited as the first publicly funded park designed specifically for public use, and it directly influenced the design of Central Park in New York a few years later. By the early twentieth century, planners increasingly viewed parks not just as places for leisure, but as essential infrastructure, comparable to roads or water supply, that contributed to a healthier, more liveable city.`,
    questions: [
      {
        id: 31,
        type: "mcq",
        prompt: "Before the nineteenth century, most green space in cities was:",
        options: ["A. publicly owned", "B. attached to private estates", "C. used for farming"],
      },
      {
        id: 32,
        type: "mcq",
        prompt: "The idea of public parks was partly driven by concerns about:",
        options: ["A. public health", "B. tourism revenue", "C. land prices"],
      },
      {
        id: 33,
        type: "mcq",
        prompt: "Birkenhead Park opened in:",
        options: ["A. 1837", "B. 1847", "C. 1857"],
      },
      {
        id: 34,
        type: "mcq",
        prompt: "Birkenhead Park influenced the design of:",
        options: ["A. Central Park", "B. Hyde Park", "C. a park in Paris"],
      },
      {
        id: 35,
        type: "mcq",
        prompt: "By the early twentieth century, planners viewed parks as:",
        options: ["A. a luxury for the wealthy", "B. essential infrastructure", "C. a temporary trend"],
      },
      {
        id: 36,
        type: "mcq",
        prompt: "Parks were compared to which other type of infrastructure?",
        options: ["A. Roads and water supply", "B. Schools and hospitals", "C. Railways and bridges"],
      },
      {
        id: 37,
        type: "mcq",
        prompt: "The lecture mainly focuses on parks in:",
        options: ["A. ancient civilisations", "B. the nineteenth and early twentieth centuries", "C. the present day"],
      },
      {
        id: 38,
        type: "mcq",
        prompt: "According to the lecturer, parks contribute to a city that is:",
        options: ["A. more profitable", "B. healthier and more liveable", "C. more crowded"],
      },
      {
        id: 39,
        type: "mcq",
        prompt: "Central Park was built in:",
        options: ["A. London", "B. New York", "C. Liverpool"],
      },
      {
        id: 40,
        type: "mcq",
        prompt: "The overall purpose of this lecture extract is to:",
        options: ["A. argue against public parks", "B. trace the historical development of public parks", "C. compare park maintenance costs"],
      },
    ],
  },
];
