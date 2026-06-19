export const TFNG_OPTIONS = ["TRUE", "FALSE", "NOT GIVEN"];

export const READING_PARTS = [
  {
    id: 1,
    title: "Passage 1",
    passageTitle: "From Horse-Drawn Carriages to Mass Transit",
    paragraphs: [
      `For most of human history, the speed at which a person could move through a city was limited to the pace of a walking person or, for the privileged few, a horse. The nineteenth century changed this fundamentally. As industrial cities swelled in population, the horse-drawn omnibus emerged as the first organised form of public transport, carrying paying passengers along fixed routes through London, Paris and New York. These vehicles were slow, uncomfortable, and dependent on animals that required feeding, stabling and frequent replacement, but they established a principle that would define urban mobility for the next two centuries: that transport could be shared, scheduled and sold as a service rather than owned outright by every traveller.`,
      `The real breakthrough came with the railway. Steam-powered trains, first developed for moving goods between cities, were soon adapted for use within them. London opened the world's first underground railway in 1863, and within a few decades dozens of cities had followed with elevated or underground lines. Electrification in the 1890s made these systems faster, cleaner and considerably safer, since electric motors did not fill tunnels with smoke the way steam engines did. Trams, or streetcars, running on rails embedded in city streets, offered a complementary form of surface transport that could move large numbers of people without requiring the costly tunnelling associated with underground systems.`,
      `What is often overlooked in popular accounts of this period is the role transport played in reshaping the physical form of cities themselves. Suburbs developed along tram and rail lines because they offered affordable land within commuting distance of city centres. Property developers frequently built or subsidised transit lines specifically to make their housing developments viable, a pattern repeated from Los Angeles to Tokyo. In this sense, transport infrastructure did not merely respond to urban growth; it actively produced the shape that growth would take.`,
    ],
    questionGroups: [
      {
        type: "tfng",
        title: "Questions 1–5",
        instructions:
          "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.",
        items: [
          { id: 1, text: "The horse-drawn omnibus operated along fixed routes.", answer: "TRUE" },
          { id: 2, text: "Horse-drawn vehicles required very little maintenance.", answer: "FALSE" },
          { id: 3, text: "London opened the world's first underground railway.", answer: "TRUE" },
          { id: 4, text: "Electrification of underground railways made tunnels smokier.", answer: "FALSE" },
          { id: 5, text: "Trams required the same amount of tunnelling as underground systems.", answer: "FALSE" },
        ],
      },
      {
        type: "matchingParagraph",
        title: "Questions 6–9",
        instructions:
          "Which paragraph contains the following information? Write the correct paragraph number (1, 2 or 3). You may use any paragraph more than once.",
        items: [
          { id: 6, text: "A description of how transport shaped where people chose to live.", answer: "3" },
          { id: 7, text: "An explanation of why early public transport was uncomfortable.", answer: "1" },
          { id: 8, text: "A comparison between underground and surface rail technologies.", answer: "2" },
          { id: 9, text: "An example of developers funding infrastructure for profit.", answer: "3" },
        ],
      },
      {
        type: "shortAnswer",
        title: "Questions 10–13",
        instructions: "Answer the questions below using NO MORE THAN THREE WORDS from the passage for each answer.",
        items: [
          { id: 10, text: "What was the first organised form of public transport?", answer: "omnibus" },
          { id: 11, text: "In what year did London open its underground railway?", answer: "1863" },
          { id: 12, text: "In what decade were underground railways electrified?", answer: "1890s" },
          { id: 13, text: "What term describes rail vehicles running on tracks embedded in city streets?", answer: "trams" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Passage 2",
    passageTitle: "The Automobile Century and Its Costs",
    paragraphs: [
      `The mass production of the automobile in the early twentieth century, pioneered by manufacturers such as Ford, triggered the most significant transformation in the history of urban transport. For the first time, a private vehicle was affordable to a substantial proportion of the population, not merely the wealthy. The car offered something no fixed-route tram or train ever could: door-to-door travel on a schedule set entirely by the passenger. Governments responded by building road networks of unprecedented scale, and by the middle of the century many cities had begun to dismantle their tram systems, viewing them as obstacles to the smooth flow of motor traffic.`,
      `This shift came at a considerable cost, though the full scale of that cost was not widely appreciated for decades. Cities designed around the car required far more land for roads and parking than those designed around rail, which made walking and cycling progressively less practical and often more dangerous. Air pollution from vehicle exhaust became a chronic public health problem in car-dependent cities. Traffic congestion, meanwhile, proved to be a self-defeating problem: widening roads to ease congestion tended to encourage more driving, which filled the new capacity within a few years, a phenomenon transport economists term "induced demand."`,
      `By the 1970s, a number of cities began to reconsider this trajectory. Rising fuel prices following the oil crises of that decade exposed the vulnerability of transport systems built around a single fuel source. Singapore introduced one of the world's first congestion pricing schemes in 1975, charging drivers to enter the city centre during peak hours. Curitiba, in Brazil, pioneered the bus rapid transit concept, demonstrating that dedicated bus lanes and efficient boarding systems could approximate the speed and reliability of rail at a fraction of the construction cost.`,
    ],
    questionGroups: [
      {
        type: "tfng",
        title: "Questions 14–19",
        instructions:
          "Do the following statements agree with the information given in the passage? Choose TRUE, FALSE or NOT GIVEN.",
        items: [
          { id: 14, text: "The automobile was initially affordable only to wealthy households.", answer: "FALSE" },
          { id: 15, text: "Cities dismantled tram systems because trams obstructed motor traffic.", answer: "TRUE" },
          { id: 16, text: "Car-dependent cities required less land for roads than rail-based cities.", answer: "FALSE" },
          { id: 17, text: "Widening roads has been shown to permanently reduce congestion.", answer: "FALSE" },
          { id: 18, text: "Singapore introduced congestion pricing in 1975.", answer: "TRUE" },
          { id: 19, text: "Curitiba was the first city to build an underground railway.", answer: "NOT GIVEN" },
        ],
      },
      {
        type: "multipleChoice",
        title: "Questions 20–23",
        instructions: "Choose the correct letter, A, B, C or D.",
        items: [
          {
            id: 20,
            text: "According to the passage, what did the car offer that trams and trains could not?",
            options: ["A. Lower fares", "B. Door-to-door travel on the passenger's own schedule", "C. Faster average speeds", "D. Greater seating capacity"],
            answer: "B",
          },
          {
            id: 21,
            text: 'The phenomenon of "induced demand" refers to:',
            options: ["A. more roads leading to more driving", "B. fuel prices rising during oil crises", "C. congestion pricing reducing traffic", "D. trams being replaced by buses"],
            answer: "A",
          },
          {
            id: 22,
            text: "What prompted cities to reconsider car-centred transport in the 1970s?",
            options: ["A. New tram technology", "B. Rising fuel prices following oil crises", "C. A decline in car manufacturing", "D. Stricter pollution laws"],
            answer: "B",
          },
          {
            id: 23,
            text: "Curitiba's bus rapid transit system is presented as an example of:",
            options: ["A. a failed transport experiment", "B. a low-cost alternative that approximates rail performance", "C. the first electrified bus network", "D. a system later abandoned for trams"],
            answer: "B",
          },
        ],
      },
      {
        type: "shortAnswer",
        title: "Questions 24–26",
        instructions: "Answer the questions below using NO MORE THAN THREE WORDS from the passage for each answer.",
        items: [
          { id: 24, text: "Which manufacturer pioneered mass production of the automobile?", answer: "Ford" },
          { id: 25, text: "In which decade did oil crises expose the vulnerability of car-dependent transport?", answer: "1970s" },
          { id: 26, text: "What public health problem became chronic in car-dependent cities?", answer: "air pollution" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Passage 3",
    passageTitle: "Electrification and the Search for a Sustainable Future",
    paragraphs: [
      `The early twenty-first century has brought a second great transition, this time driven by concerns about climate change and urban air quality rather than by congestion alone. Electric vehicles, dismissed as impractical novelties for most of the twentieth century owing to limited battery range and high cost, have become commercially viable thanks to substantial improvements in battery chemistry and manufacturing scale. Several national governments have announced dates after which the sale of new petrol or diesel vehicles will be prohibited, and some cities have created low-emission zones that restrict or charge polluting vehicles for entering central districts.`,
      `However, transport researchers increasingly argue that simply replacing petrol cars with electric ones will not, by itself, solve the deeper problems associated with car-dependent urban design. An electric car still requires road space, still contributes to traffic congestion, and still demands parking, even if it produces no exhaust emissions at the point of use. For this reason, many of the most ambitious contemporary transport strategies emphasise a combination of approaches: expanding high-quality public transit, designing streets that prioritise walking and cycling, and integrating shared mobility services such as electric bicycles and scooters, which can cover the "last mile" between a transit stop and a traveller's final destination far more efficiently than a car.`,
      `Autonomous vehicle technology, still in development at the time of writing, adds a further layer of uncertainty to predictions about the future of urban transport. Optimists argue that self-driving cars, used as part of shared fleets rather than individually owned, could dramatically reduce the number of vehicles a city needs while maintaining the convenience of door-to-door travel. Sceptics counter that the same technology could just as easily increase the total amount of driving, by making car travel so effortless that people abandon public transport altogether, intensifying rather than relieving congestion. What is generally agreed upon is that the choices cities make in the coming decade will shape urban mobility for generations.`,
    ],
    questionGroups: [
      {
        type: "matchingParagraph",
        title: "Questions 27–31",
        instructions:
          "Which paragraph contains the following information? Write the correct paragraph number (1, 2 or 3). You may use any paragraph more than once.",
        items: [
          { id: 27, text: "A description of two opposing views about a future technology.", answer: "3" },
          { id: 28, text: "An explanation of why electric cars do not fully solve urban transport problems.", answer: "2" },
          { id: 29, text: "A mention of government policies restricting the sale of certain vehicles.", answer: "1" },
          { id: 30, text: 'A reference to transport solutions for the "last mile" of a journey.', answer: "2" },
          { id: 31, text: "A claim that today's choices will affect mobility far into the future.", answer: "3" },
        ],
      },
      {
        type: "multipleChoice",
        title: "Questions 32–35",
        instructions: "Choose the correct letter, A, B, C or D.",
        items: [
          {
            id: 32,
            text: "According to the passage, electric vehicles only recently became commercially viable because of:",
            options: ["A. new government subsidies", "B. improvements in battery chemistry and manufacturing", "C. a fall in oil prices", "D. stricter emissions testing"],
            answer: "B",
          },
          {
            id: 33,
            text: "The passage suggests that electric vehicles alone will not solve urban transport problems because they:",
            options: ["A. are more expensive than petrol cars", "B. still require road space and parking", "C. cannot be produced at sufficient scale", "D. are banned in most low-emission zones"],
            answer: "B",
          },
          {
            id: 34,
            text: "Shared mobility services such as e-bikes and scooters are described as useful for:",
            options: ["A. long-distance commuting", "B. replacing all public transport", "C. covering the \"last mile\" of a journey", "D. reducing battery manufacturing costs"],
            answer: "C",
          },
          {
            id: 35,
            text: "Sceptics of autonomous vehicles argue that the technology might:",
            options: ["A. eliminate the need for public transport funding", "B. reduce the number of vehicles on the road", "C. increase total driving and worsen congestion", "D. be banned before it is widely adopted"],
            answer: "C",
          },
        ],
      },
      {
        type: "shortAnswer",
        title: "Questions 36–39",
        instructions: "Answer the questions below using NO MORE THAN THREE WORDS from the passage for each answer.",
        items: [
          { id: 36, text: "What kind of zones restrict or charge polluting vehicles in city centres?", answer: "low-emission zones" },
          { id: 37, text: "What term describes shared electric bicycles and scooters covering short final trips?", answer: "shared mobility" },
          { id: 38, text: "What vehicle technology is described as still in development?", answer: "autonomous vehicle" },
          { id: 39, text: "According to optimists, what kind of fleets could reduce the number of vehicles a city needs?", answer: "shared fleets" },
        ],
      },
    ],
  },
];

export const READING_ANSWERS = READING_PARTS.reduce((all, part) => {
  for (const group of part.questionGroups) {
    for (const item of group.items) {
      all[item.id] = item.answer;
    }
  }
  return all;
}, {});
