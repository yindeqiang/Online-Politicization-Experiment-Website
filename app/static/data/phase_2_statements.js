let randomNumber_phaseII_text12 = Math.random();
randomNumber_phaseII_text12 = randomNumber_phaseII_text12 < 0.5 ? 0 : 2;
let randomNumber_phaseII_text34 = Math.random();
randomNumber_phaseII_text34 = randomNumber_phaseII_text34 < 0.5 ? 0 : 2;
let randomNumber_phaseII_text56 = Math.random();
randomNumber_phaseII_text56 = randomNumber_phaseII_text56 < 0.5 ? 0 : 2;
let randomNumber_phaseII_text78 = Math.random();
randomNumber_phaseII_text78 = randomNumber_phaseII_text78 < 0.5 ? 0 : 2;
let randomNumber_phaseII_text910 = Math.random();
randomNumber_phaseII_text910 = randomNumber_phaseII_text910 < 0.5 ? 0 : 2;
let text1;
let text2;
let text3;
let text4;
let text5;
let text6;
let text7;
let text8;
let text9;
let text10;
if(randomNumber_phaseII_text12 == 0)
    {text1 = "space exploration";
    text2 = "virtual reality technology";}
else
    {   text2 = "space exploration";
        text1 = "virtual reality technology";}
if(randomNumber_phaseII_text34 == 0)
            {text3 = "agrees";
            text4 = "disagrees";}
else
            {   text4 = "agrees";
                text3 = "disagrees";}
if(randomNumber_phaseII_text56 == 0)
                    {text5 = "local historical figures";
                    text6 = "natural landmarks";}
else
                    {   text6 = "local historical figures";
                        text5 = "natural landmarks";}

if(randomNumber_phaseII_text78 == 0)
                            {text7 = "food vendors";
                            text8 = "street performers";}
else
                            {   text8 = "food vendors";
                                text7 = "street performers";}
if(randomNumber_phaseII_text910 == 0)
                                    {text9 = "agrees";
                                    text10 = "disagrees";}
else
                                    {   text10 = "agrees";
                                        text9 = "disagrees";}







const phase_2_statements = {
    "fact": [//对应0开始，0问题组
        {
            "text": "From 2010 to 2020, the percentage of population growth in California is higher than 5%.",
            "index": 0,
            "summary": "California population growth",
            "enabled": false,
        },
        {
            "text": "The average distance between Mars and Earth is larger than that between Mercury and Earth.",
            "index": 1,
            "summary": "Mars vs. Mercury distance to Earth",
            "enabled": false,
        },   
        {
            "text": "On average, an adult body produces more than 10 million cells per second.",
            "index": 2,
            "summary": "Adult body cell production rate",
            "enabled": false,
        },
        {
            "text": "The human body contains more atoms than there are stars in the Milky Way galaxy.",
            "index": 3,
            "summary": "Body atoms vs. Milky Way stars",
            "enabled": false,
        },
        {
            "text": "A honeybee flies faster than the top speed of a running elephant.",
            "index": 4,
            "summary": "Honeybee vs. elephant speed",
            "enabled": false,
        },
        {
            "text": "Venus rotates on its axis more slowly than Earth.",
            "index": 5,
            "summary": "Venus vs. Earth rotation speed",
            "enabled": false,
        },
        {
            "text": "The first computer virus was released before the first personal computer was sold.",
            "index": 6,
            "summary": "First computer virus timing",
            "enabled": false,
        },
        {
            "text": "Some species of turtles can breathe through their rear ends.",
            "index": 7,
            "summary": "Turtles' unique breathing method",
            "enabled": false,
        },
        {
            "text": "Some sharks can live for over 200 years.",
            "index": 8,
            "summary": "Longevity of sharks",
            "enabled": false,
        },
        {
            "text": "It is possible to see a rainbow at midnight, known as a 'moonbow'.",
            "index": 9,
            "summary": "Phenomenon of moonbows",
            "enabled": false,
        },
        {
            "text": "A cockroach can survive without its head for a week.",
            "index": 10,
            "summary": "Cockroach survival without head",
            "enabled": false,
        },
        {
            "text": "Gold exists naturally in the human body.",
            "index": 11,
            "summary": "Gold in the human body",
            "enabled": false,
        },
        {
            "text": "A lightning strike can produce temperatures hotter than the surface of the Sun.",
            "index": 12,
            "summary": "Lightning vs. Sun surface temperature",
            "enabled": false,
        },
        {
            "text": "The Earth gets heavier each day due to cosmic dust and meteorite particles.",
            "index": 13,
            "summary": "Earth's increasing weight from cosmic particles",
            "enabled": false,
        },
        {
            "text": "What was the percentage of the population growth in California from 2010 to 2020?",
            "index": 14,
            "summary": "Percentage of the population growth in California",
            "enabled": true,
            "range": [0, 0.1]
        },
        {
            "text": "How many cells on average does an adult body produce every second?",
            "index": 15,
            "summary": "The number of cells produced per day by an adult",
            "enabled": true,
            "range": [0, 100],
        }
    ],

    "prediction": [//对应20开始，1号组
        {
            "text": "If robots and computers were able to perform most of the jobs currently being done by humans, the economy as a whole would be more efficient.",
            "index": 0,
            "summary": "Robots replacing human jobs",
            "enabled": false,
        },
        {
            "text": "Within 50 years, self-driving technology will be sufficiently mature that most personal cars will no longer be equipped with a steering wheel.",
            "index": 1,
            "summary": "Future of self-driving cars",
            "enabled": false,
        },
        {
            "text": "If scientists invented a non-invasive clinical surgery that could accurately erase people's memory of a certain period, the overall happiness of our society would be greatly improved.",
            "index": 2,
            "summary": "Memory erasure and societal happiness",
            "enabled": true,
        },
        {
            "text": "As artificial-intelligence technology develops, most people will eventually live better lives without having to work.",
            "index": 3,
            "summary": "AI development and workless lives",
            "enabled": false,
        },
        {
            "text": "Within the next 100 years, human beings will have contact with intelligent life from other planets.",
            "index": 4,
            "summary": "Contact with extraterrestrial life",
            "enabled": false,
        },
        {
            "text": "If virtual reality technology becomes indistinguishable from real life, most people will prefer spending a significant portion of their time in virtual environments for leisure activities.",
            "index": 5,
            "summary": "Virtual reality and leisure time",
            "enabled": false,
        },
        {
            "text": "Within 100 years, personalized education plans generated by AI, tailored to each student's learning style and pace, will become the standard in schooling, making traditional grade levels obsolete.",
            "index": 6,
            "summary": "AI and personalized education",
            "enabled": false,
        },
        {
            "text": "In 50 years, the average human lifespan could extend significantly, with many living beyond 100 years as a norm rather than an exception.",
            "index": 7,
            "summary": "Extended human lifespan",
            "enabled": false,
        },
        {
            "text": "In 100 years, with the development of advanced materials, buildings and infrastructure will become self-healing and highly resistant to natural disasters, dramatically reducing maintenance costs and increasing safety.",
            "index": 8,
            "summary": "Self-healing infrastructure",
            "enabled": false,
        },
        {
            "text": "If a universally effective method of communication were developed that could resolve misunderstandings instantly, global conflict rates would significantly decrease.",
            "index": 9,
            "summary": "Effective communication and conflict reduction",
            "enabled": false,
        },
        {
            "text": "Should a simple, accurate test become available to predict one's future health, many would choose to alter their lifestyles dramatically to prevent possible diseases.",
            "index": 10,
            "summary": "Predictive health tests and lifestyle changes",
            "enabled": false,
        },
        {
            "text": "In the next 30 years, the discovery of a scalable, affordable method to desalinate seawater could solve global freshwater scarcity issues, dramatically impacting agriculture and sustainability.",
            "index": 11,
            "summary": "Desalination and freshwater scarcity",
            "enabled": false,
        },
        {
            "text": "In the next 50 years, the development of advanced neural interface technology will enabled humans to interact with computers and digital environments through thought alone, revolutionizing how we work, learn, and communicate.",
            "index": 12,
            "summary": "Neural interfaces and digital interaction",
            "enabled": false,
        },
        {
            "text": "Within the next 100 years, advances in genetic engineering could enabled humans to adapt to previously uninhabitable environments, opening up new frontiers for colonization on Earth and beyond.",
            "index": 13,
            "summary": "Genetic engineering and colonization",
            "enabled": false,
        },
        {
            "text": "If robots and computers were able to perform most of the jobs currently being done by humans, the economy as a whole would be more efficient.",
            "index": 14,
            "summary": "Robots and computers are more conducive to economic development",
            "enabled": true,
        }
    ],

    "issue": [//根据enable的true来确定启用哪些问题！！，对应2
        {
            "text": "The government should invest more scientific research funding into space exploration instead of virtual reality technology.",//20240523,变成小写了
            "index": 0,
            "summary": "Space exploration vs. virtual reality funding",
            "enabled": true,
        },
        {
            "text": "the use of cloning technology should be approved, to provide infertile couples using test-tube fertilization with more embryos to increase their chances of conceiving.",//20240523,变成小写了
            "index": 1,
            "summary": "Cloning technology for infertile couples",
            "enabled": true,
        },
        {
            "text": "Everyone should be allowed to use paid advertising to present their point of view on controversial public policy issues, no matter how extreme.",
            "index": 2,
            "summary": "Paid advertising for public policy views",
            "enabled": false,
        },
        {
            "text": "Your city should locate the next community festival in the city center rather than at a waterfront park.",
            "index": 3,
            "summary": "Location of community festival",
            "enabled": false,
        },
        {
            "text": "the city council should name new streets after local historical figures rather than natural landmarks.",//20240523,变成小写了
            "index": 4,
            "summary": "Naming new street after historical figure",
            "enabled": false,
        },
        {
            "text": "The new public service should be a mobile library service rather than a traveling museum exhibit.",
            "index": 5,
            "summary": "Mobile library vs. traveling museum",
            "enabled": false,
        },
        {
            "text": "the priority of public space usage should be given to food vendors rather than to street performers.",//20240523,变成小写了
            "index": 6,
            "summary": "Priority for food vendors in public spaces",
            "enabled": false,
        },
        {
            "text": "Your city council should feature a natural preserve rather than a sports complex in the new park.",
            "index": 7,
            "summary": "Natural preserve vs. sports complex",
            "enabled": false,
        },
        {
            "text": "The local government should prioritize recycling programs over waste-to-energy plants in changes to waste management.",//20240523,变成小写了
            "index": 8,
            "summary": "Recycling vs. waste-to-energy",
            "enabled": false,
        },
        {
            "text": "For a new fitness initiative, the community should construct outdoor gyms rather than walking trails.",
            "index": 9,
            "summary": "Outdoor gyms vs. walking trails",
            "enabled": false,
        },
        {
            "text": "For an art project in your community, it should create a giant mosaic on a downtown building rather than a series of sculptures along the riverwalk.",
            "index": 10,
            "summary": "Giant mosaic vs. riverwalk sculptures",
            "enabled": false,
        },
        {
            "text": "The new playground in the community park should have a nature-inspired theme rather than a space exploration theme.",
            "index": 11,
            "summary": "Nature-inspired vs. space exploration playground",
            "enabled": false,
        },
        {
            "text": "Your city's new recycling initiative should focus on composting organic waste rather than recycling electronic devices.",
            "index": 12,
            "summary": "Composting organic waste vs. recycling electronics",
            "enabled": false,
        },
        {
            "text": "Your city should upgrade the public library's digital resources rather than expand the physical fitness facilities in parks as the next public service improvement.",
            "index": 13,
            "summary": "Library digital resources vs. park fitness facilities",
            "enabled": false,
        },
        {
            "text": "For a campaign to encourage reading, your city should distribute free e-books rather than physical books.",
            "index": 14,
            "summary": "Free e-books vs. physical books",
            "enabled": false,
        },
        {
            "text": "The average distance between Mars and Earth is larger than that between Mercury and Earth.",
            "index": 15,
            "summary": "Mars vs. Mercury distance to Earth",
            "enabled": false,
        },   
        
        {
            "text": "The human body contains more atoms than there are stars in the Milky Way galaxy.",
            "index": 16,
            "summary": "Body atoms vs. Milky Way stars",
            "enabled": false,
        },
        {
            "text": "If robots and computers were able to perform most of the jobs currently being done by humans, the economy as a whole would be more efficient.",
            "index": 17,
            "summary": "Robots replacing human jobs",
            "enabled": false,
        },
        {
            "text": "Within the next 100 years, human beings will have contact with intelligent life from other planets.",
            "index": 18,
            "summary": "Contact with extraterrestrial life",
            "enabled": false,
        },
    ],

    "design": [
        {
            "text": "an Antarctic resort hotel",
            "index": 0,
            "summary": "Antarctic resort hotel",
            "enabled": false,
        },
        {
            "text": "A bridge across a canyon",
            "index": 1,
            "summary": "Canyon bridge",
            "enabled": true,
        },
        {
            "text": "An underwater science research base",
            "index": 2,
            "summary": "Underwater research base",
            "enabled": false,
        },
        {
            "text": "a desert ecological corridor",
            "index": 3,
            "summary": "Desert ecological corridor",
            "enabled": false,
        },
        {
            "text": "a library built beside a creek on a grassland",
            "index": 4,
            "summary": "Creekside grassland library",
            "enabled": true,
        },
        {
            "text": "a machine that scans the human body and automatically diagnoses diseases",
            "index": 5,
            "summary": "Disease diagnosis machine",
            "enabled": false,
        },
        {
            "text": "a cup that automatically shows the calorie count of beverages",
            "index": 6,
            "summary": "Calorie-counting cup",
            "enabled": false,
        },
        {
            "text": "a software that translates between dog barking and human language in both directions",
            "index": 7,
            "summary": "Dog-human translation software",
            "enabled": true,
        },
        {
            "text": "the flag for a human settlement on Mars",
            "index": 8,
            "summary": "Mars settlement flag",
            "enabled": true,
        },
        {
            "text": "a logo for an institute dedicated to researching time travel",
            "index": 9,
            "summary": "Time travel research institute logo",
            "enabled": true,
        },
        {
            "text": "An urban vertical farming complex",
            "index": 10,
            "summary": "Urban vertical farm",
            "enabled": false,
        },
        {
            "text": "a transportable modular house",
            "index": 11,
            "summary": "Modular transportable house",
            "enabled": false,
        },
        {
            "text": "A solar street light",
            "index": 12,
            "summary": "Solar street light",
            "enabled": false,
        }
    ]  
}
    