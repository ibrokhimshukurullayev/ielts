const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const content = {
  passages: [
    {
      number: 1,
      title: "Passage 1: Rubber",
      subtitle: "T and W Musgrove discuss the origins and early uses of rubber",
      from: 1,
      to: 13,
      text: "The plants that produce rubber are spread right across the globe, and grow in many different habitats. One might think it likely, therefore, that humankind has known about rubber for thousands of years. Yet, unlike other crops of economic importance, rubber led a relatively anonymous life until the last 150 years or so. The Indians of South America appear to be the first people to have understood the properties of rubber, and the Aztecs of what is now Mexico were the first to be recorded using the substance; a wall painting dating back to the sixth century depicts a scene of a tributary offering of crude rubber. With the arrival of Columbus in the Americas and the resulting Spanish influx, further evidence starts to appear concerning the Native American use of rubber. Antonio de Herrera y Tordesillas describes a ritual game played with a rubber ball at the court of the Aztec Emperor Montezuma II, and the Mayan and Toltec people are known to have taken part in similar activities. Rubber was also used to make raincoats, shoes, jars, torches and musical instruments, all of which must have been made from the indigenous Castilla elastica, as the Para plant now favoured for rubber cultivation does not grow in the Mexican region.\n\nThe first description of latex (liquid rubber) extraction is made by Juan de Torquemada, who noted that if a receptacle was not at hand the Native Americans would place the latex on their bodies to allow it to solidify. However, no real interest in rubber was shown by any European until Charles de la Condamine, a French mathematician, published an account of his journey to South America in 1735. The journey was undertaken on behalf of the Paris Academy of Sciences to measure an arc of the meridian line on the equator, but the journey home was to turn out to be more significant than the true purpose of the trip. Condamine explored Brazil and Peru and discovered how the local people used one single piece of coagulated latex to make boots. The boots were impervious to water and, when smoked, looked like real leather. In 1747 the first description of the rubber tree and latex tapping was made by a military engineer and amateur botanist, François Fresneau, who was posted to French Guiana. The publications of Condamine and Fresneau created considerable excitement among French scientists, and an attempt was made to discover a solvent that could turn the crude rubber into a substance for commercial exploitation.\n\nIn 1818 a British medical student named James Syme first used rubber to make waterproof cloth. Another early use of the substance was as an eraser of pencil marks, hence the name 'rubber'. This was complemented by balloons, rubber bands, braces, boots for the army and other ideas that met with varying degrees of success. In 1820 Thomas Hancock, an English manufacturer of rubber goods such as driving belts, industrial rollers and rubber hoses, invented a machine he called the 'piokle', which chewed up waste strips for re-use. It was discovered that the masticated rubber was more malleable, while maintaining much of its elasticity. In Scotland at the same time Charles Mackintosh had discovered a way of using rubber as waterproofing material, by a process he patented in 1823. Hancock and Mackintosh joined forces in 1834, and three years later Hancock invented a machine for spreading rubber onto material.\n\nDespite their beneficial qualities, such as waterproofing, rubber goods were still not particularly popular as they had some major flaws, including the fact that they dissolved malodorously. They also became pliant when warm and rigid when cold. Then in 1839 the American Charles Goodyear discovered that it was possible to stabilise rubber by mixing it with sulphur while exposing it to heat – a process he called vulcanisation – and the full versatility of this extraordinary substance became apparent.\n\nRubber goods could now be manufactured which had all the beneficial qualities of the material, such as durability, elasticity and variability, but which were not sticky, soluble or governed by the vagaries of the weather. The economic potential of rubber was now clearly evident. It played an important role in the Industrial Revolution, being employed in the steam engines found in factories, mills, mines and railways. It made a triumphant entrance as a new and innovative material at the Great Exhibition of 1851, where shoes, airbeds, furniture and clothing made out of newly improved rubber were proudly displayed.\n\nOne of the most important rubber inventions was made in 1888, when an Irishman called John Boyd Dunlop produced the first pneumatic tyre. Solid rubber tyres had been used for the previous 18 years, but Dunlop's new design, which he updated in 1890, immediately became popular. In 1895 Dunlop's tyres were first used in motor cars, and with the mass production of cars just over the horizon the rubber industry had never looked healthier. The import levels of rubber over the nineteenth century bear witness to its irrepressible rise. In 1830 Britain had imported just 211 kg of crude rubber. This had risen to 10,000 kg in 1857, and by 1874 levels were just under six times as much again."
    },
    {
      number: 2,
      title: "Passage 2: The Myth of the Eight-hour Sleep",
      from: 14,
      to: 26,
      text: "We often worry about lying awake in the middle of the night – but it could be good for you. Indications from both science and history suggest that the eight-hour sleep may not be a natural or inborn pattern for humans. In the early 1990s, psychiatrist Thomas Wehr conducted research which implies just that. Wehr kept a group of people in a darkened room for 14 hours a day for a month. It took some time for their sleep to regulate, but by the fourth week the subjects had settled into a very distinct sleeping pattern. Firstly, they slept four hours, then woke for one or two hours before falling into a second four-hour sleep. Though sleep scientists were impressed by the implications of the study, the idea that we must sleep for eight consecutive hours persists amongst the general public.\n\nIn 2001, historian Roger Ekirch of Virginia Tech University in the US published a paper drawn from 16 years of research, revealing historical evidence that humans used to sleep in two distinct periods of time each night. Ekirch's research found more than 500 references to a segmented sleeping pattern – in diaries, court recorders, medical books and literature, from the ancient Greeks to tribes in Nigeria. Much like Wehr's findings, these references describe a first sleep which began not long following sunset. Then there was a waking period of one or two hours and after that a second sleep. During the waking period, people could be quite active. They sometimes got up and moved around the house, although most people stayed in bed, and perhaps read or wrote if they had enough money for candles. In many historic accounts, Ekirch found that people used the time that they were awake between periods of sleep to think about and attempt to analyse their dreams.\n\nIn his book, Evening's Empire, historian Craig Koslofsky suggested an explanation for this divided sleep pattern in Europe. 'Associations with night before the 17th century were not good,' he writes. He goes on to explain that the streets of cities and towns at night were often populated by thieves or worse. The streets at night consequently scared many people. Even the wealthy, who could afford to light their way, had better things to spend their money on. There was no prestige or social value with going out or staying up late at night.\n\nEkirch found that references to the first and second sleep started to disappear during the late 17th century. The pattern began to alter first among the urban upper classes, changing amongst the rest of Western society. By the 1920s, the idea of a first and second sleep had receded entirely from our social consciousness. Ekirch attributes the initial shift to improvements in street and home lighting. As the night became a time for all kinds of activity, the length of time people used for rest declined.\n\nIn 1667, Paris became the first city in the world to light its streets, using wax candles in glass lamps. It was followed by another French city, Lille, in the same year and by Amsterdam in Holland two years later, where a much more efficient oil-powered lamp was developed. London didn't light its streets until 1684, but by the end of the 17th century, more than 50 of Europe's major towns and cities were lit at night. Coffee houses emerged as a fashionable phenomenon and many were open virtually around the clock. Going out at night became commonplace, and spending hours lying in bed was considered a waste of time. 'People were becoming increasingly time-conscious and sensitive to efficiency, certainly before the 19th century,' says Ekirch. 'But the Industrial Revolution intensified that attitude considerably.' Strong evidence of this shifting attitude is contained in a medical journal from 1829 which urged parents to force their children out of the pattern of first and second sleep.\n\nToday, most people seem to have adapted quite well to the eight-hour sleep, but Ekirch believes many sleeping problems may have roots in the human body's natural preference for divided sleep, as well as in difficulties caused by extended exposure to artificial light in the modern world. This could be the cause of a condition called sleep maintenance insomnia, where people wake during the night and have trouble getting back to sleep. The condition first appears in literature at the end of the 19th century, at the same time as accounts of interrupted sleep disappear.\n\nSleep psychologist, Gregg Jacobs, says that the idea that we must sleep for an extended period of time could be changing. If it makes people who wake up in the night anxious, this anxiety can itself discourage sleep and is likely to affect waking life too. Jacobs suggests that the waking period between sleeping, when people simply rested and relaxed, could have played an important part in the human capacity to regulate stress naturally. Russell Foster, a professor of circadian (body clock) neuroscience at Oxford University in the UK, shares this point of view. 'Over 30% of the medical problems that doctors are faced with stem directly or indirectly from sleep. But sleep has been ignored in medical training, and there are very few countries where sleep is studied,' Foster says. He feels this needs to change."
    },
    {
      number: 3,
      title: "Passage 3: Living dunes",
      subtitle: "Sally Palmer investigates",
      from: 27,
      to: 40,
      text: "Armies of giant sand dunes are advancing across the world's deserts, engulfing anything that crosses their path. They are tens of metres tall and hundreds of metres long. Fortunately, they aren't going very fast. Even the smallest, speediest dunes only travel about 100 metres over the course of a year, while the bigger ones, which weigh something in the order of 10,000 tonnes, barely move one metre in that time. However, their insidious creep can have serious consequences if there is an oil installation or a railway line in their path.\n\nAbout 47% of the world's land mass, including Antarctica, most of Australia and large areas of Africa, is classified as arid or semi-arid desert. Only around 20% of that is sand-covered, however, and over half of that is classified as 'linear' sand dunes. These form in a long curving wave, as a result of wind blowing strongly from several quarters, flipping them from side to side. Although linear dunes are static, sand blowing off them can cause problems for desert villages, burying crops and buildings.\n\nMoving dunes make up just a small percentage of the rest, but they are of the most interest to scientists. They are known as 'barchans': heavy, crescent-shaped sand piles with a ridged crest and two elongated arms, one curving away to either side. 'Barchan dunes only tend to form where you have one-directional winds on the edge of sandy deserts near coastal areas,' says Giles Wiggs, a geomorphologist at Oxford University, who has been studying the formation and movement of sand dunes for more than a decade.\n\nBut even with strong winds, how can entire barchans move while retaining their form? That question was first answered in the mid-20th century by British explorer Ralph Alger Bagnold, and his answer hinges on the fact that dunes aren't solid, but granular. Bagnold figured out how barchan dunes are able to move grain by grain. Imagine a single grain of sand being blown up the back of a dune by the wind and deposited on the top. More grains follow the same pattern, until the accumulated weight of piled-up sand finally pushes the top down the dune face. The grain tumbles, then stops on the face until subsequent mini-avalanches bury it. Eventually, it reappears at the back of the dune, ready to repeat the process. As this happens to every grain of sand in the dune, the whole thing creeps in the direction of the prevailing wind.\n\nThe relationship between the wind and barchan dunes is complex. As a dune grows, it modifies the speed and course of the wind, which in turn alters how that dune and its neighbours evolve. 'Interestingly, the dune can regulate its own shape, and maintain it as it moves,' says Dr Stéphane Douady, a physicist at Ecole Normale Supérieure (ENS) in France. 'Even when two dunes collide, they quickly take on their distinctive shapes again. It's like a living organism.'\n\nDouady and his colleagues have also been studying an even odder phenomenon than moving dunes: some barchans actually sing. Local legends attributed the sounds to dangerous spirits which were trying to trap unwary travellers. Douady is more pragmatic. 'It's a strong booming noise with a low frequency,' he explains, making a noise like a foghorn to demonstrate. 'It can last for a long time – up to several minutes. It's a very loud sound and you don't understand where it's coming from when you first hear it.' There are about 50 dunes distributed across 35 deserts round the world that are known to sing. Douady says the sound is caused by the way sand avalanches down the faces of particular dunes. Rather than tumbling randomly, the sand grains flow in synchrony and set each other vibrating like the membrane on a gigantic loudspeaker. The synchronisation causes the air to move in and out between the grains, creating a powerful sound wave.\n\nWhat really surprised the scientists, however, was that they were able to take samples of the singing sand back to France and replicate the sound at ENS, proving that it's the sand, not the dune shape, that causes the sound. Their studies show the grains are a uniform shape, well-rounded from years of striking each other, and that the variations in size affect the tone. Crucially, the grains are coated with a special veneer, which Douady calls 'desert glaze', made from a precise combination of minerals from surrounding rocks including iron, aluminium, manganese, silicon and calcium. The team found that after a month or so, the veneer wore off and the grains lost their 'voice'. 'We managed to reproduce the desert glaze and then the grains started to sing again,' says Douady. 'We tried putting the coating onto different grains, but they weren't round enough and it didn't work. But some American colleagues made some artificial grains and managed to make them sing, after covering them in desert glaze.' Douady has now made recordings of dunesong from all over the world which are to be made into a CD."
    }
  ],

  questionGroups: [
    {
      from: 1, to: 6,
      instruction: "Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this."
    },
    {
      from: 7, to: 13,
      instruction: "Complete the summary below. Write NO MORE THAN THREE WORDS from the passage for each answer.",
      groupTitle: "The Commercial Development of Rubber",
      template: "Early European travellers gave accounts of various rubber objects in use in Central and South America, and these accounts created interest in the commercial exploitation of rubber. In 1818, [7] was produced using rubber, and in 1820 a machine was invented for recycling [8] of rubber. Over the next few years, other attempts were made to improve rubber, but some problems remained. For example, rubber products smelt bad when they were dissolved, and could turn either soft or [9] depending on the temperature. However, in 1839 a new process to [10] the substance greatly increased its potential. For example, rubber was used in the creation of the [11] industry during the Industrial Revolution. Then in 1888 the [12] was developed, and a few years later the [13] of the motor car began."
    },
    {
      from: 14, to: 18,
      instruction: "Reading Passage 2 has five sections. Choose the correct heading for each section from the list of headings below. Choose the correct number i–vii in boxes 14–18.",
      options: [
        "i – historical reasons why interrupted sleep became uncommon",
        "ii – Brain structures involved in sleep patterns",
        "iii – Potential health issues related to sleep",
        "iv – Famous cases in literature of sleep",
        "v – An analysis of old documents to discover deep patterns",
        "vi – Biological and environmental factors preventing people from falling asleep again",
        "vii – Scientific evidence that divided sleep is a natural phenomenon"
      ]
    },
    {
      from: 19, to: 23,
      instruction: "Look at the following statements and the list of researchers below. Match each statement with the correct researcher A–E. You may use any letter more than once.",
      options: [
        "A – Thomas Wehr",
        "B – Roger Ekirch",
        "C – Craig Koslofsky",
        "D – Gregg Jacobs",
        "E – Russell Foster"
      ]
    },
    {
      from: 24, to: 26,
      instruction: "Complete the summary below. Write ONE WORD ONLY from the passage for each answer.",
      groupTitle: "Historical patterns of interrupted sleep",
      template: "Historical evidence seems to show that humans had common sleep patterns which were quite unlike today's eight hours of unbroken sleep each night. People habitually went to bed early, soon after [24], slept for a while, then woke up for a few hours of activity or perhaps to consider, for example, the meaning of [25]. There was little else to do at home in the dark, since what little means of lighting they had, such as using candles, was costly. In 16th-century Europe, people tended to stay at home at night because they feared [26] on large unlit city streets. Once urban street lighting improved, night life in cities became popular, and recreational spots, like coffee houses came to be considered fashionable. Consequently, sleeping patterns also began to change."
    },
    {
      from: 27, to: 33,
      instruction: "Reading Passage 3 has seven paragraphs. Choose the correct heading for each paragraph from the list of headings below. Choose the correct number i–ix in boxes 27–33.",
      options: [
        "i – Moving rapidly across the desert",
        "ii – Recreating the process in a laboratory",
        "iii – Strange music created by human movement",
        "iv – A potential threat to industry and communications",
        "v – Dunes coming together and re-forming",
        "vi – Needing a specific combination of conditions",
        "vii – A continuous cycle",
        "viii – The commonest type of dune",
        "ix – Old superstitions demystified"
      ]
    },
    {
      from: 34, to: 36,
      instruction: "Choose the correct answer, A, B, C or D."
    },
    {
      from: 37, to: 40,
      instruction: "Complete the summary below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
      groupTitle: "Singing dunes",
      template: "Singing dunes, which belong to the type of dunes known as [37], produce a very loud sound which is transmitted at a low frequency. Researchers have worked out that sand grains fall down the dune and start vibrating against other grains, forming a sound wave. Research proves that the individual grains have a similar [38], but the differences in dimensions alter the [39] of the 'song'. Each grain is covered with a mixture of different [40] and this is vital to the sound production."
    }
  ],

  questions: {
    "1": { "type": "tfng", "text": "Rubber plants grow only in certain regions of the world." },
    "2": { "type": "tfng", "text": "Rubber was extracted in Mexico as early as the sixth century." },
    "3": { "type": "tfng", "text": "Rubber from the Castilla elastica plant is of poorer quality than that from the Para plant." },
    "4": { "type": "tfng", "text": "A French mathematician inspired real interest in rubber amongst Europeans." },
    "5": { "type": "tfng", "text": "The process of vulcanisation was discovered by accident." },
    "6": { "type": "tfng", "text": "Imports of crude rubber into Britain fell during the nineteenth century." },
    "7": { "type": "gap", "text": "7" },
    "8": { "type": "gap", "text": "8" },
    "9": { "type": "gap", "text": "9" },
    "10": { "type": "gap", "text": "10" },
    "11": { "type": "gap", "text": "11" },
    "12": { "type": "gap", "text": "12" },
    "13": { "type": "gap", "text": "13" },
    "14": { "type": "matching", "text": "Section 1" },
    "15": { "type": "matching", "text": "Section 2" },
    "16": { "type": "matching", "text": "Section 3" },
    "17": { "type": "matching", "text": "Section 4" },
    "18": { "type": "matching", "text": "Section 5" },
    "19": { "type": "matching", "text": "In certain historical periods, the threat of criminal danger led to segmented sleep." },
    "20": { "type": "matching", "text": "Physicians should learn more about treating people with sleeping difficulties." },
    "21": { "type": "matching", "text": "Historically, when people experienced interrupted sleep, they used the waking period at night for different activities." },
    "22": { "type": "matching", "text": "Technological changes in Europe made people more likely to sleep throughout the night." },
    "23": { "type": "matching", "text": "The belief that humans should have a long continuous sleep can be psychologically harmful." },
    "24": { "type": "gap", "text": "24" },
    "25": { "type": "gap", "text": "25" },
    "26": { "type": "gap", "text": "26" },
    "27": { "type": "matching", "text": "Paragraph 1" },
    "28": { "type": "matching", "text": "Paragraph 2" },
    "29": { "type": "matching", "text": "Paragraph 3" },
    "30": { "type": "matching", "text": "Paragraph 4" },
    "31": { "type": "matching", "text": "Paragraph 5" },
    "32": { "type": "matching", "text": "Paragraph 6" },
    "33": { "type": "matching", "text": "Paragraph 7" },
    "34": { "type": "mcq", "text": "What are we told about linear dunes?", "options": ["A – They are formed by strong winds blowing from one direction.", "B – They can move up to 100 metres in a twelve-month period.", "C – They develop in a recognisable shape.", "D – They make up about 20% of the world's deserts."] },
    "35": { "type": "mcq", "text": "Bagnold discovered that movement in barchans was caused by", "options": ["A – the long straight shape of the dunes.", "B – the particular composition of the dunes.", "C – the exceptionally heavy nature of the sand grains.", "D – the unusual strength of the wind in certain seasons."] },
    "36": { "type": "mcq", "text": "Why does Dr Douady compare a barchan dune to a living organism?", "options": ["A – It starts small and then increases in size.", "B – It has an effect on its immediate surroundings.", "C – Its relations with desert organisms are quite developed.", "D – Its outline stays the same even after a period of movement."] },
    "37": { "type": "gap", "text": "37" },
    "38": { "type": "gap", "text": "38" },
    "39": { "type": "gap", "text": "39" },
    "40": { "type": "gap", "text": "40" }
  },

  answers: {
    "1": "FALSE", "2": "TRUE", "3": "NOT GIVEN", "4": "TRUE", "5": "NOT GIVEN", "6": "FALSE",
    "7": "waterproof cloth", "8": "waste strips", "9": "rigid", "10": "stabilise",
    "11": "steam engines", "12": "pneumatic tyre", "13": "mass production",
    "14": "vii – Scientific evidence that divided sleep is a natural phenomenon",
    "15": "v – An analysis of old documents to discover deep patterns",
    "16": "i – historical reasons why interrupted sleep became uncommon",
    "17": "vi – Biological and environmental factors preventing people from falling asleep again",
    "18": "iii – Potential health issues related to sleep",
    "19": "C – Craig Koslofsky", "20": "E – Russell Foster",
    "21": "B – Roger Ekirch", "22": "B – Roger Ekirch", "23": "D – Gregg Jacobs",
    "24": "sunset", "25": "dreams", "26": "thieves",
    "27": "iv – A potential threat to industry and communications",
    "28": "viii – The commonest type of dune",
    "29": "vi – Needing a specific combination of conditions",
    "30": "vii – A continuous cycle",
    "31": "v – Dunes coming together and re-forming",
    "32": "ix – Old superstitions demystified",
    "33": "ii – Recreating the process in a laboratory",
    "34": "C – They develop in a recognisable shape.",
    "35": "B – the particular composition of the dunes.",
    "36": "D – Its outline stays the same even after a period of movement.",
    "37": "barchans", "38": "shape", "39": "tone", "40": "minerals"
  }
};

async function main() {
  try {
    const existing = await prisma.test.findUnique({ where: { slug: "reading-test-5-vol7" } });
    if (existing) {
      await prisma.test.update({ where: { slug: "reading-test-5-vol7" }, data: { title: "Full Reading Test 5 – Vol 7", content } });
      console.log("Updated existing test:", existing.id);
    } else {
      const created = await prisma.test.create({ data: { skill: "READING", slug: "reading-test-5-vol7", title: "Full Reading Test 5 – Vol 7", content } });
      console.log("Created test:", created.id);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
