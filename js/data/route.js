/* ---------------- DATA ---------------- */
// Route order: geographic/flight-cluster logic from Delhi outward.
// Only cities with a full "map" object are ready to explore — the rest
// are placeholders on the route until their City Experience Map is built.
const ROUTE = [
  {
    id: "kathmandu",
    city: "Kathmandu",
    country: "Nepal",
    flag: "🇳🇵",
    lat: 27.7172, lng: 85.3240, tz: "Asia/Kathmandu", accent: "#8B3A2A",
    map: {
      identity: "Kathmandu is a valley of three ancient kingdoms — sacred, artisanal, chaotic, and quietly spiritual — where temples are as everyday as tea stalls.",
      why: "Closest capital by direct flight (~1.5 hrs from Delhi), no backtracking needed, and it opens the whole Himalayan cluster before moving further out.",
      hotel: { name: "Dwarika's Hotel, Kathmandu", note: "A heritage property built almost entirely from centuries-old rescued Newari wood carvings — you're inside the city's aesthetic before you've seen a single landmark." },
      core: [
        { id:"durbar", name:"Kathmandu Durbar Square", tag:"History & Politics", desc:"The old royal palace complex of the Malla kings, seat of political power for centuries. Restored after the 2015 earthquake — a good entry point into Nepal's monarchy-to-republic history.", explore:"Google Earth walk-through + a short read on the Malla dynasty and the 2015 rebuild." },
        { id:"swayambhu", name:"Swayambhunath (Monkey Temple)", tag:"Culture & Geography", desc:"A 2,000-year-old Buddhist stupa on a hilltop overlooking the whole valley — sacred to both Buddhists and Hindus.", explore:"Photos/drone footage from the hilltop, the Swayambhu Purana creation myth." },
        { id:"boudha", name:"Boudhanath Stupa", tag:"Culture & Architecture", desc:"One of the largest stupas in the world, heart of the Tibetan Buddhist community in exile. Walking its kora is a living ritual, not a tourist act.", explore:"The story of the Tibetan refugee community around Boudha and the stupa's 'Wisdom Eyes'." },
        { id:"pashupatinath", name:"Pashupatinath Temple", tag:"Religion & Local Life", desc:"A UNESCO World Heritage Shiva temple on the Bagmati River — one of the most important Shiva temples on Earth.", explore:"A 'sit with it' landmark — understand why this site matters across South Asia, not a checklist stop." },
        { id:"thamel", name:"Thamel", tag:"Local Life & Food", desc:"The backpacker/trekker nerve-center of the city — narrow lanes, gear shops, momos, live music. The everyday pulse rather than the monuments.", explore:"Look up a real Newari thali and mentally 'order' your meal for the night." }
      ],
      optional: [
        { name:"Patan Durbar Square", desc:"The sister royal square across the river — arguably more architecturally intact." },
        { name:"Bhaktapur", desc:"A whole medieval city preserved like an open-air museum — pottery square, Nyatapola Temple." },
        { name:"Garden of Dreams", desc:"A restored neo-classical garden — the city's quiet aesthetic escape." },
        { name:"Nagarkot Viewpoint", desc:"Sunrise views of the Himalayan range, including Everest on a clear day." },
        { name:"Freak Street", desc:"The old 1960s-70s hippie trail hangout — the counter-culture layer." },
        { name:"Newari Cuisine Deep Dive", desc:"Yomari, choila, bara — a food identity distinct from the rest of Nepal." }
      ],
      next: "Thimphu, Bhutan — continues the Himalayan cluster with no backtracking."
    }
  },
  {
    id: "thimphu",
    city: "Thimphu",
    country: "Bhutan",
    flag: "🇧🇹",
    lat: 27.4728, lng: 89.6390, tz: "Asia/Thimphu", accent: "#2F5D3A",
    map: {
      identity: "Thimphu is the world's only capital with no traffic lights — a small, devout, deliberately unhurried city where Gross National Happiness shapes the skyline more than any building does.",
      why: "Reached from Kathmandu via Paro, Bhutan's only international airport (~1.5-2 hr flight with Himalayan views) — continuing the Himalayan cluster before dropping toward the Bay of Bengal (Dhaka, Colombo).",
      hotel: { name: "Taj Tashi, Thimphu", note: "Built in traditional dzong architecture in the heart of the city — you're sleeping inside Bhutanese design language, not just visiting it." },
      core: [
        { id:"tashichhodzong", name:"Tashichho Dzong", tag:"History & Politics", desc:"A fortress-monastery housing the King's throne room, government offices, and the central monastic body under one roof.", explore:"Photos of the dzong lit up at night + a short read on Bhutan's dual system of monastic and secular governance." },
        { id:"buddhadordenma", name:"Buddha Dordenma", tag:"Culture & Geography", desc:"A 51.5m bronze Buddha statue on a hilltop over the valley, containing over 100,000 smaller Buddha statues inside it.", explore:"Drone footage from the statue's viewpoint over Thimphu valley + the story of why it was built, marking the fourth king's 60th anniversary." },
        { id:"memorialchorten", name:"Memorial Chorten", tag:"Religion & Local Life", desc:"A whitewashed stupa built in memory of the third king, where locals circumambulate daily — a living devotional site, not a museum piece.", explore:"A short video of elderly residents doing their daily kora + what a chorten means in Bhutanese Buddhism." },
        { id:"simplybhutan", name:"Simply Bhutan / Folk Heritage Museum", tag:"Culture & Everyday Life", desc:"A reconstructed traditional Bhutanese farmhouse with rural artifacts and a live archery demonstration.", explore:"Watch a clip of archery, Bhutan's national sport, and read how the Gross National Happiness index actually shapes policy." },
        { id:"centenarymarket", name:"Centenary Farmers Market", tag:"Local Life & Food", desc:"The social and commercial heart of the city on the riverbank, where valley farmers sell produce, cheese, incense, and betel nut.", explore:"Look up an ema datshi recipe and mentally pick your ingredients for it at the market stalls." }
      ],
      optional: [
        { name:"Dochula Pass", desc:"108 chortens on a mountain pass an hour away, with a full Himalayan panorama on a clear day." },
        { name:"Changangkha Lhakhang", desc:"The oldest temple in Thimphu valley, still the neighbourhood's spiritual anchor today." },
        { name:"National Institute for Zorig Chusum", desc:"The painting school where Bhutan's 13 traditional arts and crafts are taught to students." },
        { name:"Motithang Takin Preserve", desc:"Home of the takin — Bhutan's strange, goat-antelope national animal." },
        { name:"Clock Tower Square", desc:"The closest thing Thimphu has to a downtown — murals, cafés, and a slow evening crowd." },
        { name:"Bhutan Postal Museum", desc:"Get a real, usable postage stamp printed with your own photo — a genuine Bhutanese specialty." }
      ],
      next: "Dhaka, Bangladesh — reached via Kolkata/Delhi connections since Bhutan has very limited direct international routes, continuing the move toward the Bay of Bengal cluster before Sri Lanka and the Maldives."
    }
  },
  {
    id: "dhaka",
    city: "Dhaka",
    country: "Bangladesh",
    flag: "🇧🇩",
    lat: 23.8103, lng: 90.4125, tz: "Asia/Dhaka", accent: "#1B5E4A",
    map: {
      identity: "Dhaka is a city of rivers and rickshaws — one of the densest, loudest, most alive capitals on Earth, built on trade, textiles, and the Buriganga.",
      why: "Reached via a short hop from Thimphu (routed through Kolkata, the nearest hub connecting both), continuing east along the Bay of Bengal before the route swings south to Myanmar and the island capitals.",
      hotel: { name: "Pan Pacific Sonargaon Dhaka", note: "A long-standing city landmark in its own right, central enough to reach Old Dhaka's chaos and the diplomatic quarter's calm with equal ease." },
      core: [
        { id:"lalbaghfort", name:"Lalbagh Fort", tag:"History & Politics", desc:"An unfinished 17th-century Mughal fort complex — its incompleteness (the governor died mid-construction) is as telling as anything actually built.", explore:"Photos of the fort's mosque and tomb of Pari Bibi + a short read on Mughal Bengal and why the fort was abandoned." },
        { id:"ahsanmanzil", name:"Ahsan Manzil (Pink Palace)", tag:"History & Architecture", desc:"The pink former palace of the Nawab of Dhaka on the Buriganga riverbank, now a museum of the city's zamindar-era elite.", explore:"A virtual walk through its restored rooms and the story of Dhaka's Nawab family." },
        { id:"jatiyosangsad", name:"National Parliament House (Jatiyo Sangsad Bhaban)", tag:"Politics & Architecture", desc:"Louis Kahn's monumental brutalist parliament building, considered one of the 20th century's great works of architecture.", explore:"Photos of the building's geometric light-cuts and a short piece on Louis Kahn's design philosophy for it." },
        { id:"sadarghat", name:"Sadarghat River Port", tag:"Local Life & Geography", desc:"One of the world's largest river ports — an overwhelming, constant churn of launches, cargo, and commuters on the Buriganga.", explore:"Watch footage of the port's morning rush and read how central river transport still is to Bangladeshi life." },
        { id:"olddhaka", name:"Old Dhaka Street Food Trail", tag:"Local Life & Food", desc:"Narrow lanes of Old Dhaka packed with biryani houses, sweet shops, and centuries-old trade guild streets.", explore:"Look up Old Dhaka's kacchi biryani and Shakrain kite-festival traditions, and mentally plan your food trail." }
      ],
      optional: [
        { name:"Dhakeshwari Temple", desc:"The national Hindu temple of Bangladesh, its name literally meaning 'goddess of Dhaka.'" },
        { name:"Star Mosque (Tara Masjid)", desc:"A small mosque famous for its dazzling mosaic star motifs in blue and white china-clay tiles." },
        { name:"Liberation War Museum", desc:"A direct, unfiltered account of the 1971 Bangladesh Liberation War." },
        { name:"Bangabandhu Memorial Museum", desc:"The former residence-turned-museum of Sheikh Mujibur Rahman, founding leader of Bangladesh." },
        { name:"Dhaka University Curzon Hall", desc:"Colonial-era architecture at the heart of Bangladesh's most historically significant university." },
        { name:"Jamdani Weaving Villages (virtual)", desc:"Explore the UNESCO-recognised jamdani muslin weaving tradition just outside the city." }
      ],
      next: "Naypyidaw, Myanmar — reached via Yangon (Naypyidaw's own airport has almost no direct international routes, so this is the route's one deliberate backtrack, taken here rather than later)."
    }
  },
  {
    id: "naypyidaw",
    city: "Naypyidaw",
    country: "Myanmar",
    flag: "🇲🇲",
    lat: 19.7633, lng: 96.0785, tz: "Asia/Yangon", accent: "#B08D3E",
    map: {
      identity: "Naypyidaw is a capital built from scratch in 2005 — vast empty twenty-lane highways, government buildings spaced kilometers apart, a city designed for power rather than people.",
      why: "Reached via Yangon, since Naypyidaw's own airport has almost no direct international connections — the one deliberate backtrack on this route, done early rather than compounding later.",
      hotel: { name: "Kempinski Hotel Naypyitaw", note: "One of the few genuinely finished, functioning luxury properties in a city still mostly empty — staying here means noticing what's absent as much as what's there." },
      core: [
        { id:"uppatasanti", name:"Uppatasanti Pagoda", tag:"Religion & Politics", desc:"A near-exact replica of Yangon's Shwedagon Pagoda, built as Naypyidaw's spiritual centerpiece and a deliberate statement of continuity with Burmese tradition.", explore:"Compare photos of Uppatasanti to Shwedagon Pagoda and read why the government chose to replicate it here." },
        { id:"nationalmuseum", name:"Myanmar National Museum (Naypyidaw)", tag:"History & Culture", desc:"Houses royal regalia including the Lion Throne of the last Burmese king — the physical remnants of a monarchy the country no longer has.", explore:"Look up the Lion Throne's history and how it ended up in a museum in a city that didn't exist 20 years ago." },
        { id:"nationallandmarkgarden", name:"National Landmark Garden", tag:"Geography & Culture", desc:"A park containing scaled-down replicas of Myanmar's most famous landmarks from every state and region in one walkable space.", explore:"Use it as a virtual 'map' of Myanmar itself — pick three regions you'd want to actually visit someday." },
        { id:"waterfountaingarden", name:"Naypyidaw Water Fountain Garden", tag:"Local Life", desc:"A large public garden and fountain park — one of the only places in the city where ordinary Naypyidaw residents actually gather.", explore:"Watch footage of the evening fountain show and consider how a planned capital tries to manufacture 'public life.'" },
        { id:"zoo", name:"Naypyidaw Zoological Gardens", tag:"Nature", desc:"A large, sparsely-visited zoo including a rare snow-dome enclosure for penguins in tropical Myanmar.", explore:"Look up why a snow environment was built here at all, as a small case study in prestige infrastructure." }
      ],
      optional: [
        { name:"Naypyidaw Golf Clubs", desc:"Several full-size golf courses built for a diplomatic and government class the city was designed around." },
        { name:"Myoma Market", desc:"One of the only traditionally busy, human-scale markets in an otherwise oversized city." },
        { name:"Parliament Building (exterior views)", desc:"The vast Pyidaungsu Hluttaw complex, one of the largest legislative buildings in the world by land area." },
        { name:"Ngalaik Dam Resort", desc:"A reservoir-side resort area used as Naypyidaw's closest thing to a weekend nature escape." },
        { name:"Thabyegon Market", desc:"A smaller neighbourhood market showing what everyday commerce looks like outside the government core." },
        { name:"City layout aerial exploration", desc:"Look at satellite/aerial views of Naypyidaw's zoning — the city itself as an experience of urban planning." }
      ],
      next: "Colombo (Sri Jayawardenepura Kotte), Sri Lanka — the route turns southwest to the island capitals of Sri Lanka and the Maldives before continuing to Pakistan."
    }
  },
  {
    id: "colombo",
    city: "Colombo (Sri Jayawardenepura Kotte)",
    country: "Sri Lanka",
    flag: "🇱🇰",
    lat: 6.9271, lng: 79.8612, tz: "Asia/Colombo", accent: "#1A6B75",
    map: {
      identity: "Sri Jayawardenepura Kotte is the official capital, but Colombo next door is where the country's colonial layers, coastline, and daily life actually live — this stop treats the two as one experience.",
      why: "A direct flight from Yangon into Colombo, Sri Lanka's main regional hub, continuing the route south through the island capitals before Pakistan.",
      hotel: { name: "Galle Face Hotel, Colombo", note: "A 19th-century colonial-era landmark right on the Indian Ocean — its seafront terrace is arguably Colombo's most iconic single spot." },
      core: [
        { id:"kotteparliament", name:"Sri Jayawardenepura Kotte Parliament Complex", tag:"Politics & Architecture", desc:"Sri Lanka's parliament building sits on an artificial island within a lake — the actual seat of government, in the actual capital.", explore:"Photos of the parliament's island setting and a short read on why the capital moved from Colombo to Kotte in 1982." },
        { id:"gallefacegreen", name:"Galle Face Green", tag:"Local Life & Geography", desc:"A long oceanfront promenade where all of Colombo gathers in the evening for kites, street food, and sunset.", explore:"Watch footage of a Galle Face Green evening and look up what to eat from its famous food carts (isso wade, kottu)." },
        { id:"gangaramaya", name:"Gangaramaya Temple", tag:"Religion & Culture", desc:"An eclectic Buddhist temple mixing Sri Lankan, Thai, Chinese, and Indian architectural influences in one dense compound.", explore:"A visual walk through its unusual museum-like collection of donated artifacts alongside its religious functions." },
        { id:"pettah", name:"Pettah Market", tag:"Local Life & Trade", desc:"Colombo's chaotic, centuries-old bazaar district — every street specializing in a different trade, from spices to hardware.", explore:"Look up Pettah's street-by-street specialization and imagine which street you'd actually need for a shopping list." },
        { id:"independencesquare", name:"Independence Memorial Hall", tag:"History & Politics", desc:"Built to commemorate Sri Lanka's 1948 independence from British rule, styled after a traditional Kandyan royal audience hall.", explore:"Read a short account of Ceylon's transition to independence and how the monument's design references Kandyan kingship." }
      ],
      optional: [
        { name:"Old Dutch Hospital Precinct", desc:"A 17th-century Dutch colonial building restored into a shopping and dining quarter." },
        { name:"National Museum of Colombo", desc:"Sri Lanka's largest museum, holding the last Kandyan king's throne among its collections." },
        { name:"Colombo Lotus Tower", desc:"South Asia's tallest self-supported structure, an observation tower over the whole city." },
        { name:"Beira Lake", desc:"A city-center lake with a walking path, a quiet contrast to Pettah's density nearby." },
        { name:"Ceylon Tea Museum (virtual)", desc:"A look into the tea industry that shaped Sri Lanka's colonial and post-colonial economy." },
        { name:"Wolvendaal Church", desc:"One of the oldest Protestant churches in Sri Lanka, a remnant of the Dutch colonial period." }
      ],
      next: "Malé, Maldives — one of the best-connected short hops in the region, continuing south before the route heads to Pakistan."
    }
  },
  {
    id: "male",
    city: "Malé",
    country: "Maldives",
    flag: "🇲🇻",
    lat: 4.1755, lng: 73.5093, tz: "Indian/Maldives", accent: "#0E7C7B",
    map: {
      identity: "Malé is one of the most densely packed islands on Earth — a capital with no room to sprawl, built straight up instead of out, ringed entirely by ocean.",
      why: "A short, well-connected flight from Colombo — one of the most reliable regional routes on the whole journey.",
      hotel: { name: "Hotel Jen Malé", note: "A proper city hotel in Malé itself rather than a resort island — the point here is the capital, not a beach retreat." },
      core: [
        { id:"hukurumiskiy", name:"Hukuru Miskiy (Old Friday Mosque)", tag:"Religion & Architecture", desc:"A 17th-century coral-stone mosque covered in intricate hand-carved calligraphy, one of the finest examples of Islamic coral craftsmanship anywhere.", explore:"Close-up photos of the coral carving detail and a short read on the mosque's near-500-year history." },
        { id:"grandfridaymosque", name:"Grand Friday Mosque & Islamic Centre", tag:"Religion & Politics", desc:"The Maldives' largest mosque, its golden dome visible from almost anywhere in Malé — the modern counterpart to Hukuru Miskiy.", explore:"Compare its scale and modern design to the Old Friday Mosque as two eras of the same faith." },
        { id:"malefishmarket", name:"Malé Local Fish Market", tag:"Local Life & Food", desc:"A working harbourside market where the day's tuna catch is sold directly off boats — the real economic engine of the city.", explore:"Watch footage of the market's morning rush and look up how tuna fishing anchors the entire Maldivian economy." },
        { id:"sultanpark", name:"Sultan Park & National Museum", tag:"History & Politics", desc:"The former grounds of the Sultan's palace, now a park and museum holding relics of the Maldivian monarchy abolished in 1968.", explore:"A short read on the Maldivian sultanate and how the country transitioned to a republic." },
        { id:"artificialbeach", name:"Malé Artificial Beach", tag:"Local Life & Geography", desc:"A man-made beach built because the natural coastline is almost entirely taken up by the harbour and city — a small, telling adaptation to zero spare land.", explore:"Consider how a city this size engineers its own leisure space, then look at an aerial view of Malé's total land area." }
      ],
      optional: [
        { name:"Muleeaage", desc:"The official residence of the President, an early-20th-century palace building." },
        { name:"Malé Monument", desc:"A memorial commemorating the 2004 Indian Ocean tsunami's impact on the Maldives." },
        { name:"Local Market (produce)", desc:"A separate market from the fish market, selling produce shipped in daily from other islands." },
        { name:"Rasfannu Park", desc:"A green, breezy park on the western edge of the island, popular at sunset." },
        { name:"Villingili Island (virtual day trip)", desc:"A short ferry ride from Malé, a quieter residential island worth seeing for contrast." },
        { name:"Aerial view of Malé's density", desc:"Look at satellite imagery of Malé to genuinely register how little land this capital has to work with." }
      ],
      next: "Islamabad, Pakistan — via a connecting hub (Delhi or Dubai), since there's no direct Maldives-Pakistan route."
    }
  },
  {
    id: "islamabad",
    city: "Islamabad",
    country: "Pakistan",
    flag: "🇵🇰",
    lat: 33.6844, lng: 73.0479, tz: "Asia/Karachi", accent: "#3E6B4F",
    map: {
      identity: "Islamabad is a planned, green, deliberately calm capital at the foot of the Margalla Hills — quieter and newer than almost anywhere else on the route so far.",
      why: "Reached via a connecting hub (Delhi or Dubai) from Malé, since no direct Maldives-Pakistan route exists — entering the route's move into West/Central Asia.",
      hotel: { name: "Islamabad Serena Hotel", note: "Set in its own landscaped gardens with the Margalla Hills as a backdrop — widely considered the city's signature luxury address." },
      core: [
        { id:"faisalmosque", name:"Faisal Mosque", tag:"Religion & Architecture", desc:"One of the largest mosques in the world, its tent-like modernist design breaking completely from traditional dome-and-minaret mosque architecture.", explore:"Photos of the mosque against the Margalla Hills and a short read on its unusual Turkish-modernist design." },
        { id:"pakistanmonument", name:"Pakistan Monument", tag:"History & Politics", desc:"A flower-shaped national monument whose four petals represent Pakistan's four provinces, built to symbolize national unity and history.", explore:"A short read on the monument's symbolism and the adjoining museum's account of Pakistan's founding." },
        { id:"damaekoh", name:"Daman-e-Koh Viewpoint", tag:"Nature & Geography", desc:"A hilltop viewpoint in the Margalla Hills overlooking the entire planned grid of Islamabad below.", explore:"Look at the view alongside a map of Islamabad's sector-based city planning to understand the grid from above." },
        { id:"lokvirsa", name:"Lok Virsa Museum", tag:"Culture & Local Life", desc:"A heritage museum dedicated to Pakistan's folk culture, crafts, and regional traditions from across all provinces.", explore:"A walkthrough of regional crafts and folk instruments as a crash course in Pakistan's cultural diversity." },
        { id:"rawallake", name:"Rawal Lake", tag:"Nature & Local Life", desc:"A reservoir on the city's edge that doubles as Islamabad's main recreational escape — boating, walking, evening crowds.", explore:"Footage of a Rawal Lake evening as a contrast to the formality of the monument district." }
      ],
      optional: [
        { name:"Centaurus Mall & Blue Area", desc:"Islamabad's modern commercial spine, a contrast to the city's green, low-density residential sectors." },
        { name:"Shah Faisal Masjid Museum", desc:"A smaller museum within the mosque complex detailing its construction and Saudi-Pakistani diplomatic history." },
        { name:"Pakistan Monument Museum", desc:"The museum wing beneath the monument, covering the independence movement in more depth." },
        { name:"Saidpur Village", desc:"A restored heritage village at the base of the Margalla Hills with old temples and cafés." },
        { name:"Margalla Hills National Park", desc:"Hiking trails right at the edge of the city, unusually accessible for a capital." },
        { name:"Rose & Jasmine Garden", desc:"A large public garden showcasing Pakistan's national flower, popular during spring blooms." }
      ],
      next: "Kabul, Afghanistan — geographically adjacent across the Khyber Pass corridor, entering the Central/West Asia leg of the route."
    }
  },
  {
    id: "kabul",
    city: "Kabul",
    country: "Afghanistan",
    flag: "🇦🇫",
    lat: 34.5553, lng: 69.2075, tz: "Asia/Kabul", accent: "#6E5344",
    map: {
      identity: "Kabul sits in a high mountain bowl at over 1,800m — an old Silk Road crossroads city whose layered history runs from Mughal gardens to empire after empire passing through.",
      why: "Geographically adjacent to Pakistan across the historic Khyber Pass corridor, this is the route's entry point into Central/West Asia.",
      hotel: { name: "Kabul Serena Hotel", note: "Built around a preserved historic garden in the heart of the city — one of the few consistently maintained luxury properties through decades of change." },
      core: [
        { id:"babursgardens", name:"Bagh-e Babur (Babur's Gardens)", tag:"History & Geography", desc:"A terraced Mughal-era garden built by Emperor Babur, founder of the Mughal dynasty, who chose to be buried here rather than in India.", explore:"A short read on Babur's life and why he requested burial in Kabul instead of the empire he founded in India." },
        { id:"nationalmuseumafghanistan", name:"National Museum of Afghanistan", tag:"History & Culture", desc:"A museum whose own survival is part of the story — looted and damaged across decades of conflict, then painstakingly rebuilt and restocked.", explore:"Read about the museum's history of loss and recovery, including pieces recovered from abroad." },
        { id:"darulaman", name:"Darul Aman Palace", tag:"History & Politics", desc:"A grand early-20th-century palace built to house a modernizing monarchy's parliament, destroyed and rebuilt multiple times through Afghanistan's turbulent 20th century.", explore:"Photos of the palace's restoration and a short timeline of what it's been used for across a century." },
        { id:"chickenstreet", name:"Chicken Street", tag:"Local Life & Trade", desc:"A historic bazaar street famous for carpets, antiques, and jewelry, once a stop on the 1960s-70s overland hippie trail through Asia.", explore:"Look up what a Kabul carpet shop actually looks like and Chicken Street's unlikely place on the old hippie trail." },
        { id:"tvhill", name:"TV Hill (Asamayi Hill) Viewpoint", tag:"Geography & Local Life", desc:"A hilltop overlooking the entire Kabul valley and its surrounding mountains, one of the best places to see the city's mountain-bowl geography.", explore:"Aerial/viewpoint footage of Kabul's valley setting, paired with a look at the mountain ranges that ring the city." }
      ],
      optional: [
        { name:"Kabul River", desc:"The river running through the city, historically central to Kabul's water supply and layout." },
        { name:"Shah-Do Shamshira Mosque", desc:"A distinctive early-20th-century mosque along the Kabul River with a European-influenced facade." },
        { name:"Kabul Zoo", desc:"One of the world's more improbable zoos, having survived decades of conflict with a handful of animals." },
        { name:"Bala Hissar Fortress (exterior)", desc:"An ancient hilltop fortress overlooking the city, used by rulers for over a thousand years." },
        { name:"Kabul carpet weaving (virtual)", desc:"A look into Afghanistan's centuries-old carpet weaving tradition and its regional patterns." },
        { name:"Paghman Gardens (day trip)", desc:"A former royal garden retreat in the hills just outside Kabul." }
      ],
      next: "Tehran, Iran — continuing west into the Middle East cluster."
    }
  },
  {
    id: "tehran",
    city: "Tehran",
    country: "Iran",
    flag: "🇮🇷",
    lat: 35.6892, lng: 51.3890, tz: "Asia/Tehran", accent: "#6A3D5C",
    map: {
      identity: "Tehran is a sprawling mountain-backed metropolis where Qajar-era palaces, revolutionary murals, and a genuinely serious café culture all sit within the same few kilometers.",
      why: "Continuing west from Kabul into the Middle East cluster, opening the route toward the Caucasus and Central Asia next.",
      hotel: { name: "Espinas Palace Hotel, Tehran", note: "A modern high-rise property in the city's northern hills, close enough to the Alborz mountain backdrop to make the geography part of the stay." },
      core: [
        { id:"golestanpalace", name:"Golestan Palace", tag:"History & Architecture", desc:"A UNESCO-listed Qajar-dynasty royal complex, its mirrored halls and tiled facades summarizing Persian royal aesthetics in one compound.", explore:"A visual walkthrough of the Hall of Mirrors and a short read on the Qajar dynasty's use of the palace." },
        { id:"grandbazaar", name:"Tehran Grand Bazaar", tag:"Local Life & Trade", desc:"One of the largest and oldest covered marketplaces in the world, still the functioning commercial heart of the old city.", explore:"Footage of the bazaar's carpet and spice sections, and a short read on its historic role in Iranian trade and politics." },
        { id:"azaditower", name:"Azadi Tower", tag:"Politics & Architecture", desc:"A monumental white marble tower built to mark 2,500 years of Persian monarchy, later becoming a symbol of the 1979 revolution that ended it.", explore:"A short account of how the same monument came to represent both the monarchy and the revolution against it." },
        { id:"niavaranpalace", name:"Niavaran Palace Complex", tag:"History & Culture", desc:"The last residence of the Pahlavi royal family before the 1979 revolution, preserved largely as they left it.", explore:"A look at the interiors as a time capsule of pre-revolution Iran's elite life." },
        { id:"tochal", name:"Tochal Gondola & Mountain View", tag:"Nature & Geography", desc:"A cable car climbing into the Alborz mountains directly from the city, offering a full view of Tehran's scale below.", explore:"Footage of the gondola ascent, useful for understanding how the city sits against the mountain range." }
      ],
      optional: [
        { name:"National Museum of Iran", desc:"Holding artifacts spanning from ancient Persia through the Islamic era in one collection." },
        { name:"Milad Tower", desc:"Tehran's tallest structure and main modern observation tower over the city." },
        { name:"Tabiat Bridge", desc:"A large, architecturally notable pedestrian bridge connecting two of Tehran's parks." },
        { name:"Darband", desc:"A mountain-foothill neighbourhood of teahouses and restaurants built right into the slope." },
        { name:"Carpet Museum of Iran", desc:"A dedicated museum for the country's most famous craft export." },
        { name:"Jamaran (Khomeini's residence)", desc:"The former residence and mosque of Ayatollah Khomeini during and after the 1979 revolution." }
      ],
      next: "Ashgabat, Turkmenistan — continuing north into Central Asia."
    }
  },
  {
    id: "ashgabat",
    city: "Ashgabat",
    country: "Turkmenistan",
    flag: "🇹🇲",
    lat: 37.9601, lng: 58.3261, tz: "Asia/Ashgabat", accent: "#7A7570",
    map: {
      identity: "Ashgabat holds the Guinness World Record for the highest density of white marble buildings anywhere on Earth — a surreal, gleaming, oddly empty capital built to a single aesthetic.",
      why: "A direct route north from Tehran into Central Asia, continuing the route toward the Caucasus and beyond.",
      hotel: { name: "Yyldyz Hotel, Ashgabat", note: "A star/flame-shaped tower that is itself one of the city's landmarks — staying here means sleeping inside the same white-marble-and-gold design language as everything around it." },
      core: [
        { id:"independencemonument", name:"Independence Monument", tag:"History & Politics", desc:"A soaring golden-topped tower marking Turkmenistan's 1991 independence, surrounded by statues representing the country's history.", explore:"A short read on Turkmenistan's post-Soviet independence and the monument's symbolism." },
        { id:"neutralitymonument", name:"Arch of Neutrality", tag:"Politics & Architecture", desc:"A striking tripod tower originally topped with a rotating gold statue of the first president, commemorating Turkmenistan's declared permanent neutrality.", explore:"Look up what 'permanent neutrality' means as a formal foreign policy status, and why Turkmenistan adopted it." },
        { id:"ruhymosque", name:"Turkmenbashy Ruhy Mosque", tag:"Religion & Architecture", desc:"One of Central Asia's largest mosques, unusually inscribed with quotes from a former president's own book alongside verses from the Quran.", explore:"A short read on the mosque's dual religious-political inscriptions and the debate they caused." },
        { id:"altynasyrbazaar", name:"Altyn Asyr Bazaar (Tolkuchka)", tag:"Local Life & Trade", desc:"A vast, traditional market on the city's edge selling carpets, livestock, and household goods — the human, unpolished counterpart to the marble center.", explore:"Footage of the bazaar's carpet section, particularly Turkmen rugs, a major national craft export." },
        { id:"nationalmuseumturkmenistan", name:"State Museum of Turkmenistan", tag:"History & Culture", desc:"Houses artifacts from the ancient Silk Road city of Merv and other archaeological sites within Turkmenistan.", explore:"A short read on Merv, once one of the largest cities in the world, now an archaeological site within Turkmenistan." }
      ],
      optional: [
        { name:"Wedding Palace (Bagt Köşgi)", desc:"A giant globe-topped tower built specifically as a public wedding registration hall." },
        { name:"Ashgabat Cableway", desc:"A cable car into the nearby Kopet Dag mountains overlooking the city and the Iranian border beyond." },
        { name:"National Museum of Fine Arts", desc:"Turkmen and Russian-era paintings and applied arts in one collection." },
        { name:"Ashgabat Flagpole", desc:"One of the tallest freestanding flagpoles in the world when built, a small case study in record-chasing architecture." },
        { name:"Aerial views of the white city", desc:"Satellite/aerial imagery of Ashgabat's marble skyline, worth seeing purely for how uniform it is." },
        { name:"Kow Ata Underground Lake (day trip)", desc:"A warm underground lake in a cave system outside the city, a popular local day-trip spot." }
      ],
      next: "Baku, Azerbaijan — continuing the route into the Caucasus (not yet mapped)."
    }
  },
  { id:"baku", city:"Baku", country:"Azerbaijan", flag:"🇦🇿", lat: 40.4093, lng: 49.8671, tz: "Asia/Baku", accent: "#2A5F7A" }
];
