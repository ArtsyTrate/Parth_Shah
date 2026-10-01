/* ==========================================================================
   Your projects. Images and videos live in the assets/ folder of this repository.

   Fields
     slug         Short unique id used in links, lowercase with dashes.
     title        Project name.
     category     One of: Modeling, Environment, Texturing, UV, Animation.
                  (The filter buttons on the Projects page are built from these.)
     year         Optional. Shown next to the category when set.
     role         What you did on the piece.
     tools        Optional list of software used.
     summary      One line shown on the card.
     description  A few sentences shown when the project is opened.
     featured     true to show the project on the home page (the first three are used).
     thumb        Optional card image. If left out, the first image in `media` is used,
                  then a generated placeholder.
     media        List of things to show when the project is opened. Each item is one of:
                    { type: "image",     src: "assets/example.png", alt: "Describe the image" }
                    { type: "video",     src: "assets/example.mp4", alt: "Describe the video" }
                    { type: "sketchfab", id: "your-sketchfab-model-id", alt: "Interactive model" }
                    { type: "embed",     src: "https://...",           alt: "Marmoset or other viewer" }
   ========================================================================== */

window.PROJECTS = [
  {
    slug: "ancient-temple",
    title: "Ancient Temple",
    category: "Environment",
    role: "Environment art, modeling, lighting, rendering",
    summary: "A cinematic temple interior with carved detail and reflective water.",
    description:
      "A detailed temple environment focused on architectural modeling, carved surface detail, atmospheric lighting, composition and reflective water to create a cinematic interior space.",
    featured: true,
    media: [
      {
        type: "image",
        src: "assets/Ancient%20Temple.jpg",
        alt: "Ancient Temple environment render"
      }
    ]
  },
  {
    slug: "ancient-well",
    title: "Ancient Well",
    category: "Modeling",
    role: "Modeling, sculpting, prop design, lighting",
    summary: "A stylized medieval-inspired well, shown from four angles.",
    description:
      "A stylized medieval-inspired well created as a modeling and sculpting study. The project focuses on layered wood construction, stonework, rope detailing, roof shingles, pulley mechanics and presentation from multiple angles.",
    featured: true,
    media: [
      { type: "image", src: "assets/Ancient_Well.png", alt: "Ancient Well, front view" },
      { type: "image", src: "assets/Ancient_Well_02.png", alt: "Ancient Well, three-quarter view" },
      { type: "image", src: "assets/Ancient_Well_03.png", alt: "Ancient Well, rear view" },
      { type: "image", src: "assets/Ancient_Well_04.png", alt: "Ancient Well, pulley detail" },
      { type: "video", src: "assets/Well_Turn%20Table.mp4", alt: "Ancient Well turntable" }
    ]
  },
  {
    slug: "fight-sequence",
    title: "Fight Sequence",
    category: "Animation",
    role: "Character animation, acting, body mechanics",
    summary: "Recovering from a heavy punch, with a fourth-wall moment.",
    description:
      "A character animation sequence centered on recovering after a heavy punch, with an added fourth-wall moment for personality and comedic timing. The shot focuses on body mechanics, weight, posing, acting choices and readable character performance.",
    featured: true,
    media: [
      {
        type: "video",
        src: "assets/Shah_Parth_Fight_Sequence.mp4",
        alt: "Character animation fight sequence"
      }
    ]
  }
];
