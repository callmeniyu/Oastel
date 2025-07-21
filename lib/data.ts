import { BlogType, FAQType, TransferType } from "./types"

export const allTours = [
    {
        id: 1,
        slug: "half-day-land-rover-road-trip",
        title: "Half Day Land Rover Road Trip",
        //100 characters max for title
        //30-45 characters recommended for title
        image: "/images/tour7.jpg",
        tags: ["Co-Tour", "Half-day", "Adventure"],
        desc: "Embark on a thrilling half-day journey through scenic trails and lush forests in a classic Land Rover.",
        // 110 characters max for description
        type: "co-tour",
        packageType: "tour",
        duration: "5-6",
        bookedCount: "2.6k",
        oldPrice: 70,
        newPrice: 50,
        childPrice: 25,
        minimumPerson: 1,
        maximumPerson: 32,
        time: ["8:00 AM", "1:30 PM"],
        label: "Recommended",
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Thrilling Land Rover Ride: Explore off-the-beaten-path trails and stunning landscapes.Local Culture: Visit traditional villages and meet the locals.Hidden Gems: Discover breathtaking viewpoints and untouched nature.Expert Guides: Knowledgeable and friendly guides ensure a safe and memorable trip.",
            itinerary:
                "Mossy Forest Boardwalk :Explore the enchanting Mossy Forest (entrance fees excluded).Optional entry: Pay on-site to the Forestry Department officer BOH Sungei Palas Tea Plantations :Visit the Tea Factory, Tea Café, and Tea Shop .Note : BOH Tea Center is closed on Mondays.",
            pickupLocations: ["Tanah Rata", "Golden Hills", "Brinchang", "Kea Farm"],
            note: "If the Mossy Forest is closed, the guide will take the group to other hiking trails.",
            faq: [
                {
                    question: "What is included in the Land Rover Road Trip tours?",
                    answer: "The tours include transportation in a Land Rover, an expert guide, and visits to key attractions. Entry fees to certain sites like the Mossy Forest are not included and must be paid on-site.",
                },
                {
                    question: "Are the tours suitable for children and families?",
                    answer: "Yes, the tours are family-friendly and suitable for children. However, some trails may not be stroller accessible.",
                },
                {
                    question: "What should I bring for the tour?",
                    answer: "We recommend bringing comfortable walking shoes, a jacket, water, and a camera. For the Mossy Forest, a raincoat and insect repellent are also advised.",
                },
                {
                    question: "Is hotel pickup and drop-off provided?",
                    answer: "Yes, hotel pickup and drop-off within Cameron Highlands are included in all private and group tours.",
                },
                {
                    question: "What happens if the Mossy Forest is closed?",
                    answer: "If the Mossy Forest is closed, your guide will take you to alternative hiking trails or attractions in the area.",
                },
                {
                    question: "How do I book a tour and what is the cancellation policy?",
                    answer: "You can book directly through our website. Cancellations made at least 24 hours in advance are fully refundable.",
                },
            ],
        },
    },
    {
        id: 2,
        slug: "full-day-land-rover-road-trip",
        title: "Full Day Land Rover Road Trip",
        image: "/images/tour2.jpg",
        tags: ["Co-Tour", "Full-day"],
        desc: "Experience the ultimate Cameron Highlands adventure with a full day of exploration, culture, and nature.",
        type: "co-tour",
        packageType: "tour",
        duration: "8-10",
        bookedCount: 1000,
        oldPrice: 140,
        newPrice: 100,
        childPrice: 50,
        minimumPerson: 2,
        maximumPerson: 32,
        time: ["8:00 AM", "1:30 PM", "5:00 PM"],
        label: "Popular",
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Ultimate Full Day Adventure: Experience the best of Cameron Highlands with a comprehensive Land Rover journey. Diverse Landscapes: Traverse lush tea plantations, misty forests, and scenic valleys. Cultural Encounters: Engage with local communities and learn about their traditions. Extended Exploration: More stops and activities for a truly immersive day.",
            itinerary:
                "Mossy Forest Boardwalk: Guided walk through the mystical Mossy Forest (entrance fees excluded). Optional entry: Pay on-site to the Forestry Department officer. BOH Sungei Palas Tea Plantations: Tour the Tea Factory, enjoy refreshments at the Tea Café, and shop for local teas. Note: BOH Tea Center is closed on Mondays. Local Market Visit: Explore a vibrant local market and sample fresh produce. Strawberry Farm: Pick your own strawberries and learn about local agriculture.",
            pickupLocations: ["Tanah Rata", "Golden Hills", "Brinchang", "Kea Farm"],
            note: "Lunch is not included; your guide will recommend local eateries. If the Mossy Forest is closed, alternative nature trails will be offered.",
            faq: [
                {
                    question: "What is included in the Full Day Land Rover Road Trip?",
                    answer: "The tour includes Land Rover transportation, an expert guide, and visits to multiple attractions. Entry fees and meals are not included.",
                },
                {
                    question: "Is this tour suitable for all ages?",
                    answer: "Yes, but the full day itinerary may be tiring for very young children or elderly guests.",
                },
                {
                    question: "What should I bring?",
                    answer: "Comfortable shoes, a jacket, water, snacks, and a camera. For the Mossy Forest, bring a raincoat and insect repellent.",
                },
                {
                    question: "Are there restroom stops?",
                    answer: "Yes, regular restroom breaks are scheduled throughout the tour.",
                },
                {
                    question: "How do I book and what is the cancellation policy?",
                    answer: "Book via our website. Cancellations 24 hours in advance are fully refundable.",
                },
            ],
        },
    },
    {
        id: 3,
        slug: "private-half-day-tour",
        title: "Private Half Day Tour",
        image: "/images/tour1.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Enjoy a personalized half-day tour with your own group, tailored to your interests and pace.",
        type: "private",
        packageType: "tour",
        duration: "5-6",
        bookedCount: 1.5,
        oldPrice: 400,
        newPrice: 349,
        childPrice: 150,
        minimumPerson: 1,
        maximumPerson: 32,
        time: ["9:00 AM", "11:30 PM"],
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Private Half Day Tour: Enjoy a personalized experience exploring Cameron Highlands with your own group. Flexible Itinerary: Tailor the tour to your interests with the help of your expert guide. Exclusive Access: Visit hidden gems and popular attractions at your own pace. Comfort & Privacy: Travel in comfort with up to 8 guests in a private Land Rover.",
            itinerary:
                "Customizable Stops: Choose from Mossy Forest, tea plantations, local markets, and more. Expert Guidance: Your guide will suggest the best spots based on your preferences.",
            pickupLocations: ["Tanah Rata", "Golden Hills", "Brinchang", "Kea Farm"],
            note: "Entry fees and meals are not included. The itinerary can be adjusted based on weather and group interests.",
            faq: [
                {
                    question: "What is included in the Private Half Day Tour?",
                    answer: "Private Land Rover transportation, a dedicated guide, and a flexible itinerary. Entry fees and meals are not included.",
                },
                {
                    question: "How many people can join the private tour?",
                    answer: "Up to 8 guests can join the tour in one vehicle.",
                },
                {
                    question: "Can we choose our own stops?",
                    answer: "Yes, the itinerary is flexible and can be tailored to your group's interests.",
                },
                {
                    question: "What should we bring?",
                    answer: "Comfortable shoes, a jacket, water, and a camera. For outdoor stops, a raincoat and insect repellent are recommended.",
                },
                {
                    question: "How do I book and what is the cancellation policy?",
                    answer: "Book via our website. Cancellations 24 hours in advance are fully refundable.",
                },
            ],
        },
    },
    {
        id: 4,
        slug: "half-day-tour-coral-hills",
        title: "Half Day Tour - Coral Hills",
        image: "/images/tour8.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Discover the unique Coral Hills area with a private guide, featuring nature walks and stunning viewpoints.",
        type: "private",
        packageType: "tour",
        duration: "5-6",
        bookedCount: 500,
        oldPrice: 549,
        newPrice: 449,
        childPrice: 200,
        minimumPerson: 1,
        maximumPerson: 32,
        time: ["7:20 AM"],
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Coral Hills Discovery: Experience the unique landscapes and biodiversity of the Coral Hills area in Cameron Highlands. Scenic Views: Enjoy panoramic vistas and photo opportunities at exclusive viewpoints. Nature Walks: Guided exploration of local flora and fauna. Personalized Experience: Private tour tailored to your group's interests.",
            itinerary:
                "Coral Hills Nature Walk: Guided walk through the Coral Hills area, learning about its unique ecosystem. Scenic Viewpoints: Stop at the best spots for breathtaking views and photography. Local Culture: Optional visit to nearby villages or markets, based on group preference.",
            pickupLocations: ["Tanah Rata", "Golden Hills", "Brinchang", "Kea Farm"],
            note: "Entry fees and meals are not included. The itinerary may be adjusted based on weather and group interests.",
            faq: [
                {
                    question: "What is included in the Coral Hills tour?",
                    answer: "Private transportation, a dedicated guide, and a flexible itinerary. Entry fees and meals are not included.",
                },
                {
                    question: "How many guests can join?",
                    answer: "Up to 8 guests can join in one vehicle.",
                },
                {
                    question: "Is the tour suitable for children?",
                    answer: "Yes, but some walks may not be stroller accessible.",
                },
                {
                    question: "What should we bring?",
                    answer: "Comfortable shoes, a jacket, water, and a camera. For outdoor stops, a raincoat and insect repellent are recommended.",
                },
                {
                    question: "How do I book and what is the cancellation policy?",
                    answer: "Book via our website. Cancellations 24 hours in advance are fully refundable.",
                },
            ],
        },
    },
    {
        id: 5,
        slug: "sunrise-half-day-tour",
        title: "Sunrise + Half Day Tour",
        image: "/images/tour9.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Start your day with a breathtaking sunrise followed by a half-day exploration of Cameron Highlands’ highlights.",
        type: "private",
        packageType: "tour",
        duration: "5-6",
        bookedCount: 400,
        oldPrice: 600,
        newPrice: 549,
        childPrice: 200,
        minimumPerson: 1,
        maximumPerson: 32,
        time: ["5:00 PM", "1:30 PM"],
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Sunrise Experience: Witness a breathtaking sunrise over the Cameron Highlands before embarking on a half-day adventure. Early Start: Begin your day with panoramic views and photo opportunities at exclusive sunrise viewpoints. Flexible Itinerary: After sunrise, explore tea plantations, forests, or local markets with your private guide. Personalized Tour: Tailor the experience to your group's interests for a memorable morning.",
            itinerary:
                "Sunrise Viewpoint: Early morning drive to a scenic spot for sunrise viewing and photography. Tea Plantation Visit: Explore a local tea plantation and learn about tea production. Optional Stops: Choose from Mossy Forest, local markets, or strawberry farms based on group preference.",
            pickupLocations: ["Tanah Rata", "Golden Hills", "Brinchang", "Kea Farm"],
            note: "Entry fees and meals are not included. The itinerary may be adjusted based on weather and group interests.",
            faq: [
                {
                    question: "What time does the tour start?",
                    answer: "The tour begins at 5:00 AM to ensure you catch the sunrise.",
                },
                {
                    question: "What is included in the Sunrise + Half Day Tour?",
                    answer: "Private transportation, a dedicated guide, and a flexible itinerary. Entry fees and meals are not included.",
                },
                {
                    question: "How many guests can join?",
                    answer: "Up to 8 guests can join in one vehicle.",
                },
                {
                    question: "What should we bring?",
                    answer: "Warm clothing for the early morning, comfortable shoes, a jacket, water, and a camera. For outdoor stops, a raincoat and insect repellent are recommended.",
                },
                {
                    question: "How do I book and what is the cancellation policy?",
                    answer: "Book via our website. Cancellations 24 hours in advance are fully refundable.",
                },
            ],
        },
    },
    {
        id: 6,
        slug: "intimate-group-adventure",
        title: "Intimate Group Adventure",
        image: "/images/tour6.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Perfect for small groups, this private tour offers a flexible and exclusive Cameron Highlands adventure.",
        type: "private",
        packageType: "tour",
        duration: "5-6",
        bookedCount: "1.5k",
        oldPrice: 499,
        newPrice: 399,
        childPrice: 200,
        minimumPerson: 1,
        maximumPerson: 32,
        time: ["8:00 AM"],
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Intimate Group Adventure: Enjoy a private half-day tour designed for small groups seeking a personalized experience in Cameron Highlands. Flexible Itinerary: Customize your journey with the help of your expert guide. Exclusive Access: Visit hidden gems and popular attractions at your own pace. Comfort & Privacy: Travel comfortably with up to 8 guests in a private Land Rover.",
            itinerary:
                "Customizable Stops: Choose from Mossy Forest, tea plantations, local markets, and more. Expert Guidance: Your guide will suggest the best spots based on your preferences.",
            pickupLocations: ["Tanah Rata", "Golden Hills", "Brinchang", "Kea Farm"],
            note: "Entry fees and meals are not included. The itinerary can be adjusted based on weather and group interests.",
            faq: [
                {
                    question: "What is included in the Intimate Group Adventure?",
                    answer: "Private Land Rover transportation, a dedicated guide, and a flexible itinerary. Entry fees and meals are not included.",
                },
                {
                    question: "How many people can join the tour?",
                    answer: "Up to 8 guests can join the tour in one vehicle.",
                },
                {
                    question: "Can we choose our own stops?",
                    answer: "Yes, the itinerary is flexible and can be tailored to your group's interests.",
                },
                {
                    question: "What should we bring?",
                    answer: "Comfortable shoes, a jacket, water, and a camera. For outdoor stops, a raincoat and insect repellent are recommended.",
                },
                {
                    question: "How do I book and what is the cancellation policy?",
                    answer: "Book via our website. Cancellations 24 hours in advance are fully refundable.",
                },
            ],
        },
    },
]

export const allBlogs: BlogType[] = [
    // TRAVEL TIPS
    {
        _id: "1",
        image: "/images/blog1.jpg",
        title: "Top 10 Essentials to Pack for Your Malaysia Trip",
        slug: "top-10-essentials-to-pack",
        desc: "Don't leave these behind! Travel light, travel smart across Malaysia.",
        createdAt: new Date("2025-06-01"),
        updatedAt: new Date("2025-06-01"),
        category: "Travel Tips",
        views: 132,
        content: `
      <h2>The Ultimate Malaysia Packing List</h2>
      <p>Malaysia's tropical climate and diverse landscapes require thoughtful packing. Whether you're exploring bustling Kuala Lumpur or the serene Cameron Highlands, these essentials will ensure you're prepared for every adventure.</p>
      
      <h3>1. Lightweight, Breathable Clothing</h3>
      <p>Pack quick-dry fabrics that wick moisture. For women, a lightweight scarf is versatile for covering shoulders when visiting temples. Men should include at least one collared shirt for nicer restaurants.</p>
      
      <h3>2. Rain Gear</h3>
      <p>Malaysia's sudden downpours are legendary. A compact, travel-sized umbrella and a waterproof jacket will keep you dry during unexpected showers.</p>
      
      <h3>3. Mosquito Protection</h3>
      <p>DEET-based repellent is essential, especially if visiting rainforest areas. Consider permethrin-treated clothing for added protection during jungle treks.</p>
      
      <h3>4. Sun Protection</h3>
      <p>The equatorial sun is intense. Pack:
        <ul>
          <li>SPF 50+ sunscreen</li>
          <li>Polarized sunglasses</li>
          <li>A wide-brimmed hat</li>
        </ul>
      </p>
      
      <h3>5. Comfortable Walking Shoes</h3>
      <p>You'll need sturdy sandals for cities and waterproof hiking shoes if exploring nature. Break them in before your trip to avoid blisters.</p>
      
      <h3>6. Universal Power Adapter</h3>
      <p>Malaysia uses Type G (British-style) plugs. A universal adapter with USB ports will keep all your devices charged.</p>
      
      <h3>7. Reusable Water Bottle</h3>
      <p>Stay hydrated in the heat. Many hotels and Oastel tour vans provide filtered water refill stations.</p>
      
      <h3>8. Basic First Aid Kit</h3>
      <p>Include:
        <ul>
          <li>Antidiarrheal medication</li>
          <li>Antihistamines</li>
          <li>Band-aids</li>
          <li>Hand sanitizer</li>
        </ul>
      </p>
      
      <h3>9. Waterproof Phone Case</h3>
      <p>Protect your phone during island hopping or sudden rain showers. Essential for capturing those waterfall selfies!</p>
      
      <h3>10. Copies of Important Documents</h3>
      <p>Keep digital and physical copies of your passport, visa, and travel insurance separate from the originals.</p>
      
      <p><strong>Pro Tip from Oastel:</strong> Our tour vans have limited space, so pack in a soft-sided duffel or backpack rather than hard suitcases for easier storage during day trips.</p>
    `,
    },
    {
        _id: "2",
        image: "/images/blog2.jpg",
        title: "Getting Around in Malaysia: A Quick Guide",
        slug: "getting-around-malaysia",
        desc: "From vans to boats — everything you need to know about transportation in Malaysia.",
        createdAt: new Date("2025-06-03"),
        updatedAt: new Date("2025-06-03"),
        category: "Travel Tips",
        views: 88,
        content: `
      <h2>Navigating Malaysia's Transport Network</h2>
      <p>Malaysia offers diverse transportation options, each with its own advantages. Here's how to move like a local:</p>
      
      <h3>1. Domestic Flights</h3>
      <p>For long distances (e.g., Kuala Lumpur to Langkawi), flights save time. AirAsia and Malaysia Airlines offer frequent routes. Book early for the best fares.</p>
      
      <h3>2. Trains</h3>
      <p>The KTM ETS trains connect major west coast cities comfortably. The Jungle Railway from Gemas to Tumpat offers a scenic (but slow) ride through rural Malaysia.</p>
      
      <h3>3. Buses</h3>
      <p>Long-distance buses are affordable and comfortable. Look for companies like Aeroline (luxury) or Transnasional (budget).</p>
      
      <h3>4. Ride-Hailing Apps</h3>
      <p>Grab (Southeast Asia's Uber) works in all major cities. Cheaper than taxis and you avoid haggling.</p>
      
      <h3>5. Oastel Tour Vans</h3>
      <p>Our air-conditioned vans with local drivers are perfect for:
        <ul>
          <li>Door-to-door service between attractions</li>
          <li>Small group tours (max 8 people)</li>
          <li>Areas where public transport is limited</li>
        </ul>
      </p>
      
      <h3>6. Ferries & Boats</h3>
      <p>Essential for island hopping. Oastel partners with licensed boat operators for safe transfers to islands like Perhentian and Langkawi.</p>
      
      <h3>7. Local Buses & LRT</h3>
      <p>Kuala Lumpur's LRT system is efficient. Penang's buses are free in George Town's heritage zone.</p>
      
      <h3>8. Taxis</h3>
      <p>Always insist on using the meter. Better yet, use Grab for transparent pricing.</p>
      
      <h3>9. Car Rentals</h3>
      <p>Only recommended for experienced drivers comfortable with left-hand traffic. Traffic in cities can be chaotic.</p>
      
      <h3>10. Walking</h3>
      <p>Many heritage areas like Melaka and Penang are best explored on foot. Our walking tours include local guides who bring the history to life.</p>
      
      <p><strong>Oastel Tip:</strong> Book our "Transport Pass" package that combines van transfers between cities with guided tours at each destination, eliminating the hassle of arranging multiple tickets.</p>
    `,
    },
    {
        _id: "3",
        image: "/images/blog3.jpg",
        title: "How to Travel Malaysia on a Budget",
        slug: "malaysia-travel-budget-tips",
        desc: "Smart ways to explore without overspending — perfect for backpackers.",
        createdAt: new Date("2025-06-05"),
        updatedAt: new Date("2025-06-05"),
        category: "Travel Tips",
        views: 210,
        content: `
    <h2>Malaysia on a Shoestring: Smart Budget Travel Tips</h2>
    <p>Malaysia offers incredible value for money travelers. With these strategies, you can experience the country's highlights without breaking the bank.</p>
    
    <h3>1. Transportation Savings</h3>
    <p>Cut costs by:
      <ul>
        <li>Using our Oastel Shared Van Service (40% cheaper than private transfers)</li>
        <li>Booking overnight buses between cities (saves on accommodation)</li>
        <li>Using Grab instead of taxis in cities</li>
      </ul>
    </p>
    
    <h3>2. Affordable Eats</h3>
    <p>Malaysia's best food comes cheap:
      <ul>
        <li>Night markets (pasar malam) offer meals for under RM10</li>
        <li>Mamak stalls serve hearty Indian-Muslim fare 24/7</li>
        <li>Self-service nasi campur lets you control portions and price</li>
      </ul>
    </p>
    
    <h3>3. Budget Accommodation</h3>
    <p>Consider:
      <ul>
        <li>Guesthouses in Penang's Love Lane (from RM30/night)</li>
        <li>Homestays with local families (book through Oastel for verified options)</li>
        <li>Capsule hotels in KL (high-tech pods from RM50)</li>
      </ul>
    </p>
    
    <h3>4. Free Attractions</h3>
    <p>Don't miss these no-cost wonders:
      <ul>
        <li>KL's Batu Caves (just pay for train fare)</li>
        <li>Penang's street art trail</li>
        <li>Melaka's Jonker Walk night market</li>
      </ul>
    </p>
    
    <h3>5. Money-Saving Tours</h3>
    <p>Oastel's budget-friendly options:
      <ul>
        <li>Group city walking tours (RM25/person)</li>
        <li>Shared boat trips to islands</li>
        <li>Off-peak discounts (ask about our rainy season specials)</li>
      </ul>
    </p>
    
    <p><strong>Pro Tip:</strong> Our "Budget Explorer Pass" combines 3 tours + 2 transfers at 20% off regular prices - perfect for cost-conscious travelers.</p>
  `,
    },
    {
        _id: "4",
        image: "/images/blog2.jpg",
        title: "Exploring Indigenous Culture in Cameron Highlands",
        slug: "indigenous-culture-cameron-highlands",
        desc: "Get close to traditions, crafts, and people of the highlands.",
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        category: "Local Culture",
        views: 175,
        content: `
    <h2>Meeting Malaysia's Original People</h2>
    <p>The Orang Asli ("Original People") of Cameron Highlands offer visitors rare insights into Malaysia's ancient heritage.</p>
    
    <h3>1. Understanding the Tribes</h3>
    <p>Three main groups inhabit the region:
      <ul>
        <li><strong>Temiar:</strong> Known for their blowpipe craftsmanship</li>
        <li><strong>Semai:</strong> Skilled rattan weavers</li>
        <li><strong>Jah Hut:</strong> Woodcarving specialists</li>
      </ul>
    </p>
    
    <h3>2. Ethical Visitation Guidelines</h3>
    <p>When visiting villages:
      <ul>
        <li>Always ask permission before photographing</li>
        <li>Purchase crafts directly from artisans</li>
        <li>Reserve through Oastel to ensure benefits reach communities</li>
      </ul>
    </p>
    
    <h3>3. Hands-On Experiences</h3>
    <p>Our tours include:
      <ul>
        <li>Blowpipe-making workshops (you get to keep your creation)</li>
        <li>Traditional cooking classes using jungle ingredients</li>
        <li>Guided medicinal plant walks</li>
      </ul>
    </p>
    
    <h3>4. Seasonal Highlights</h3>
    <p>Plan around:
      <ul>
        <li>Harvest festivals (May-June)</li>
        <li>Storytelling nights under the stars</li>
        <li>Full moon ceremonies (varies monthly)</li>
      </ul>
    </p>
    
    <p><strong>Oastel Insight:</strong> Our "Culture Keeper" tours are co-designed with village elders, ensuring authentic experiences that support local livelihoods.</p>
  `,
    },
    {
        _id: "5",
        image: "/images/blog1.jpg",
        title: "Heritage Walks: Uncovering Hidden Stories of Ipoh",
        slug: "heritage-walks-ipoh",
        desc: "A walk through Ipoh's old town reveals stories untold.",
        createdAt: new Date("2025-06-09"),
        updatedAt: new Date("2025-06-09"),
        category: "Local Culture",
        views: 92,
        content: `
    <h2>Ipoh's Living History</h2>
    <p>Beyond the famous white coffee, Ipoh's heritage quarter hides century-old secrets in every corner.</p>
    
    <h3>1. Architectural time Capsules</h3>
    <p>Key landmarks include:
      <ul>
        <li><strong>Birch Memorial Clock Tower:</strong> With its controversial colonial history</li>
        <li><strong>Concubine Lane:</strong> Restored shophouses with dark pasts</li>
        <li><strong>St. Michael's Institution:</strong> Stunning Anglo-Indian school</li>
      </ul>
    </p>
    
    <h3>2. Street Art Beyond Penang</h3>
    <p>Discover:
      <ul>
        <li>Ernest Zacharevic's lesser-known murals</li>
        <li>Traditional signboard painters still practicing their craft</li>
        <li>Hidden alleyway installations</li>
      </ul>
    </p>
    
    <h3>3. Culinary Heritage</h3>
    <p>Must-try classics:
      <ul>
        <li>Kai See Hor Fun (chicken rice noodles)</li>
        <li>Ipoh bean sprout chicken</li>
        <li>Traditional biscuit makers using 100-year-old recipes</li>
      </ul>
    </p>
    
    <h3>4. Oastel's Special Access</h3>
    <p>Our tours include:
      <ul>
        <li>Private viewings of normally closed heritage buildings</li>
        <li>Meetings with fourth-generation business owners</li>
        <li>Night walks when the colonial facades are beautifully lit</li>
      </ul>
    </p>
    
    <p><strong>Local Secret:</strong> Ask your Oastel guide about the "Tunnel Network" beneath Ipoh - remnants from tin mining days now used for... (we'll let them surprise you!)</p>
  `,
    },
    {
        _id: "6",
        image: "/images/blog3.jpg",
        title: "A Festival for Every Month: Malaysia's Cultural Calendar",
        slug: "malaysia-festival-calendar",
        desc: "Plan your trip around local celebrations to feel the true vibe of Malaysia.",
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-10"),
        category: "Local Culture",
        views: 130,
        content: `
    <h2>Malaysia's Year-Round Celebrations</h2>
    <p>With its multicultural society, Malaysia offers vibrant festivals throughout the year.</p>
    
    <h3>1. January-February</h3>
    <p><strong>Chinese New Year:</strong>
      <ul>
        <li>KL's Petaling Street decorations</li>
        <li>Penang's massive open houses</li>
        <li>Our special "Lion Dance Workshop" tours</li>
      </ul>
    </p>
    
    <h3>2. March-April</h3>
    <p><strong>Hari Raya Aidilfitri:</strong>
      <ul>
        <li>Bazaar Ramadan night markets</li>
        <li>Open house invitations to Malay homes</li>
        <li>Traditional ketupat weaving demonstrations</li>
      </ul>
    </p>
    
    <h3>3. May-June</h3>
    <p><strong>Kaamatan & Gawai:</strong>
      <ul>
        <li>Sabah/Sarawak harvest festivals</li>
        <li>Tuak (rice wine) tasting sessions</li>
        <li>Traditional bamboo band performances</li>
      </ul>
    </p>
    
    <h3>4. July-September</h3>
    <p><strong>Hungry Ghost Festival:</strong>
      <ul>
        <li>Street opera performances</li>
        <li>Massive paper effigy burnings</li>
        <li>Our late-night "Spirit World" tours</li>
      </ul>
    </p>
    
    <h3>5. October-December</h3>
    <p><strong>Deepavali & Christmas:</strong>
      <ul>
        <li>Little India's light displays</li>
        <li>Melaka's Portuguese Settlement festivities</li>
        <li>Our "Three Festivals in One Day" special</li>
      </ul>
    </p>
    
    <p><strong>Oastel Tip:</strong> Book our "Festival Insider" packages that include transport, local guides, and special access to normally closed events.</p>
  `,
    },
    {
        _id: "7",
        image: "/images/blog3.jpg",
        title: "10 Must-Try Street Foods in Malaysia",
        slug: "malaysian-street-foods",
        desc: "Roti Canai, Nasi Lemak, Satay and more — here's your food checklist.",
        createdAt: new Date("2025-06-12"),
        updatedAt: new Date("2025-06-12"),
        category: "Food & Cuisine",
        views: 320,
        content: `
    <h2>Malaysia's Street Food Odyssey</h2>
    <p>From dawn till late night, Malaysia's streets offer an endless culinary adventure.</p>
    
    <h3>1. Breakfast Champions</h3>
    <p><strong>Nasi Lemak:</strong> Coconut rice with sambal, anchovies, peanuts and egg. Try the banana leaf-wrapped versions at roadside stalls.</p>
    <p><strong>Roti Canai:</strong> Flaky flatbread with dhal curry. Watch masters flip the dough at 6am.</p>
    
    <h3>2. Lunchtime Favorites</h3>
    <p><strong>Char Kway Teow:</strong> Penang's smoky stir-fried noodles with cockles.</p>
    <p><strong>Hainanese Chicken Rice:</strong> Deceptively simple poached chicken with fragrant rice.</p>
    
    <h3>3. Afternoon Snacks</h3>
    <p><strong>Apam Balik:</strong> Crispy peanut-filled pancakes cooked in cast iron pans.</p>
    <p><strong>Cendol:</strong> Shaved ice with palm sugar, coconut milk and green rice flour jelly.</p>
    
    <h3>4. Dinner Stars</h3>
    <p><strong>Satay:</strong> Skewered meats with peanut sauce. Kajang town is the undisputed capital.</p>
    <p><strong>Banana Leaf Rice:</strong> Southern Indian feast served on fresh banana leaves.</p>
    
    <h3>5. Late Night Bites</h3>
    <p><strong>Rojak:</strong> Sweet-spicy fruit salad with shrimp paste dressing.</p>
    <p><strong>Mamak Mee Goreng:</strong> Indian-Muslim style fried noodles best enjoyed at 2am.</p>
    
    <h3>Oastel Food Tours</h3>
    <p>Our "Street Food Safaris" include:
      <ul>
        <li>Hygiene-verified stalls only</li>
        <li>Behind-the-scenes kitchen access</li>
        <li>Customized spice levels</li>
        <li>Digestive tea breaks between stops</li>
      </ul>
    </p>
    
    <p><strong>Pro Tip:</strong> Join our 6am "Breakfast Hunt" tour to watch (and taste) Malaysia's iconic dishes being made fresh for the day.</p>
  `,
    },
    {
        _id: "8",
        image: "/images/blog2.jpg",
        title: "Sipping Serenity: Tea Tasting in Cameron Highlands",
        slug: "tea-tasting-cameron-highlands",
        desc: "More than a drink — it's a scenic, aromatic experience.",
        createdAt: new Date("2025-06-13"),
        updatedAt: new Date("2025-06-13"),
        category: "Food & Cuisine",
        views: 190,
        content: `
    <h2>The Art of Malaysian Tea</h2>
    <p>Cameron Highlands' cool climate produces some of the world's most flavorful teas. Here's how to experience them fully.</p>
    
    <h3>1. Understanding Tea Grades</h3>
    <p>Learn to distinguish:
      <ul>
        <li><strong>BOP:</strong> Broken Orange Pekoe (standard grade)</li>
        <li><strong>FOP:</strong> Flowery Orange Pekoe (higher grade)</li>
        <li><strong>Silver Tip:</strong> Rare white tea buds</li>
      </ul>
    </p>
    
    <h3>2. Tea Plantation Tours</h3>
    <p>Beyond the touristy spots, we access:
      <ul>
        <li>Small-batch artisanal growers</li>
        <li>Experimental tea gardens testing new hybrids</li>
        <li>Heritage tea factories with original 1930s equipment</li>
      </ul>
    </p>
    
    <h3>3. Proper Tasting Technique</h3>
    <p>The Malaysian "Tea Master" way:
      <ul>
        <li>Observe the dry leaves' appearance</li>
        <li>Inhale the aroma before and after brewing</li>
        <li>Slurp to aerate the tea across your palate</li>
        <li>Note the aftertaste (hui gan)</li>
      </ul>
    </p>
    
    <h3>4. Pairing Suggestions</h3>
    <p>Local combinations:
      <ul>
        <li>BOH Gold Blend with kaya toast</li>
        <li>Jasmine Green Tea with pandan cake</li>
        <li>Cham (tea+coffee mix) with roti bakar</li>
      </ul>
    </p>
    
    <h3>5. Oastel's Tea Experiences</h3>
    <p>Unique offerings:
      <ul>
        <li>Sunrise tea plucking sessions</li>
        <li>Blending workshops to create your custom tea</li>
        <li>High tea in colonial-era bungalows</li>
      </ul>
    </p>
    
    <p><strong>Insider Tip:</strong> Ask about our "Tea + Trek" package that combines plantation visits with guided walks through mossy forests where wild tea plants grow.</p>
  `,
    },
    {
        _id: "9",
        image: "/images/blog1.jpg",
        title: "Where to Find the Best Vegan Food in Malaysia",
        slug: "vegan-malaysia-guide",
        desc: "Yes, Malaysia is vegan-friendly — here's where to go.",
        createdAt: new Date("2025-06-14"),
        updatedAt: new Date("2025-06-14"),
        category: "Food & Cuisine",
        views: 105,
        content: `
    <h2>Plant-Based Paradise</h2>
    <p>Malaysia's multicultural cuisine offers abundant vegan options once you know where to look.</p>
    
    <h3>1. Traditional Vegan Dishes</h3>
    <p>Naturally plant-based classics:
      <ul>
        <li><strong>Nasi Ulam:</strong> Herbal rice with dozens of edible leaves</li>
        <li><strong>Thosai:</strong> Fermented rice-lentil crepes</li>
        <li><strong>Buddhist Temple Food:</strong> Mock meats made from gluten</li>
      </ul>
    </p>
    
    <h3>2. City-by-City Guide</h3>
    <p><strong>Kuala Lumpur:</strong>
      <ul>
        <li>Annalakshmi (pay-as-you-wish Indian)</li>
        <li>Loving Hut (international vegan chain)</li>
      </ul>
    </p>
    <p><strong>Penang:</strong>
      <ul>
        <li>Simple Life (vegan dim sum)</li>
        <li>Woods Vegan (modern interpretations)</li>
      </ul>
    </p>
    
    <h3>3. Market Finds</h3>
    <p>Look for:
      <ul>
        <li>Fresh tropical fruits (rambutan, mangosteen)</li>
        <li>Kacang pool (broad bean dip)</li>
        <li>Ulam (raw herb salads)</li>
      </ul>
    </p>
    
    <h3>4. Oastel's Vegan Tours</h3>
    <p>We offer:
      <ul>
        <li>Vegan street food safaris</li>
        <li>Market tours with cooking demos</li>
        <li>Monastery lunch experiences</li>
      </ul>
    </p>
    
    <h3>5. Special Requests</h3>
    <p>Malay for vegans:
      <ul>
        <li>"Saya vegan" (I'm vegan)</li>
        <li>"Tidak ada telur/daging/susu" (no eggs/meat/dairy)</li>
        <li>"Ada makanan sayur saja?" (vegetable food only?)</li>
      </ul>
    </p>
    
    <p><strong>Pro Tip:</strong> Book our "Vegan Visa" package that includes a digital guide with 100+ vegan eateries across Malaysia.</p>
  `,
    },
    {
        _id: "10",
        image: "/images/blog1.jpg",
        title: "A Day Trek Through the Malaysian Rainforest",
        slug: "rainforest-day-trek",
        desc: "Sweat, mud, and beauty — all in one unforgettable trail.",
        createdAt: new Date("2025-06-16"),
        updatedAt: new Date("2025-06-16"),
        category: "Adventure & Nature",
        views: 242,
        content: `
    <h2>Into the Green Heart of Malaysia</h2>
    <p>Malaysia's rainforests are among the world's oldest. Here's how to explore them responsibly.</p>
    
    <h3>1. Choosing Your Trail</h3>
    <p>Top day hike options:
      <ul>
        <li><strong>FRIM, KL:</strong> Canopy walkway with city views</li>
        <li><strong>Penang National Park:</strong> Beach-to-jungle trek</li>
        <li><strong>Taman Negara:</strong> Ancient rainforest trails</li>
      </ul>
    </p>
    
    <h3>2. Essential Gear</h3>
    <p>Our recommended packing list:
      <ul>
        <li>Quick-dry clothing (long sleeves/pants)</li>
        <li>Leach socks (trust us!)</li>
        <li>Waterproof backpack cover</li>
        <li>High-energy snacks</li>
      </ul>
    </p>
    
    <h3>3. Wildlife Spotting</h3>
    <p>What you might see:
      <ul>
        <li>Hornbills (early morning best)</li>
        <li>Flying lemurs (not actually lemurs!)</li>
        <li>Pitcher plants and rare orchids</li>
      </ul>
    </p>
    
    <h3>4. Safety First</h3>
    <p>Important reminders:
      <ul>
        <li>Never hike alone</li>
        <li>Watch for sudden weather changes</li>
        <li>Our guides carry first aid and emergency comms</li>
      </ul>
    </p>
    
    <h3>5. Oastel's Special Touches</h3>
    <p>What makes our treks unique:
      <ul>
        <li>Post-hike herbal foot baths</li>
        <li>Traditional packed lunches in banana leaves</li>
        <li>Night vision goggles for sunset-to-dusk hikes</li>
      </ul>
    </p>
    
    <p><strong>Pro Tip:</strong> Book our "Rainforest Immersion" package combining a day hike with an overnight in a research station for incredible nocturnal wildlife encounters.</p>
  `,
    },
    {
        _id: "11",
        image: "/images/blog3.jpg",
        title: "Snorkeling the Crystal Waters of Perhentian Islands",
        slug: "snorkeling-perhentian-islands",
        desc: "Turquoise waters, coral reefs, and sea turtles await.",
        createdAt: new Date("2025-06-18"),
        updatedAt: new Date("2025-06-18"),
        category: "Adventure & Nature",
        views: 275,
        content: `
    <h2>Underwater Paradise Found</h2>
    <p>The Perhentian Islands offer some of Southeast Asia's most accessible marine wonders.</p>
    
    <h3>1. Top Snorkel Spots</h3>
    <p>Our recommended sites:
      <ul>
        <li><strong>Shark Point:</strong> Blacktip reef sharks (harmless!)</li>
        <li><strong>Turtle Bay:</strong> Guaranteed green turtle sightings</li>
        <li><strong>Light House:</strong> Stunning coral gardens</li>
      </ul>
    </p>
    
    <h3>2. Marine Life Calendar</h3>
    <p>Seasonal highlights:
      <ul>
        <li>March-May: Coral spawning</li>
        <li>June-August: Turtle nesting</li>
        <li>September: Juvenile reef fish abundance</li>
      </ul>
    </p>
    
    <h3>3. Responsible Snorkeling</h3>
    <p>Protect the reefs by:
      <ul>
        <li>Never touching corals or chasing animals</li>
        <li>Using reef-safe sunscreen</li>
        <li>Choosing operators with mooring buoys (like Oastel's partners)</li>
      </ul>
    </p>
    
    <h3>4. Gear Tips</h3>
    <p>For best experience:
      <ul>
        <li>Bring your own mask for perfect fit</li>
        <li>Wear a rash guard instead of sunscreen</li>
        <li>Use floatation vests if not confident</li>
      </ul>
    </p>
    
    <h3>5. Beyond Snorkeling</h3>
    <p>Complementary activities:
      <ul>
        <li>Beach clean-ups with marine biologists</li>
        <li>Night snorkels with bioflourescent plankton</li>
        <li>Island-hopping to secret beaches</li>
      </ul>
    </p>
    
    <p><strong>Oastel Special:</strong> Our "Marine Biologist for a Day" tour includes underwater slates for recording sightings and contributing to conservation research.</p>
  `,
    },
    {
        _id: "12",
        image: "/images/blog2.jpg",
        title: "Chasing Fireflies: A Magical River Tour at Night",
        slug: "firefly-river-tour-malaysia",
        desc: "A romantic, surreal boat ride through nature's fairy lights.",
        createdAt: new Date("2025-06-19"),
        updatedAt: new Date("2025-06-19"),
        category: "Adventure & Nature",
        views: 159,
        content: `
      <h2>The Enchanting Firefly Experience</h2>
      <p>Along Malaysia's mangrove rivers, synchronous fireflies (Pteroptyx tener) create one of nature's most magical displays. Here's what makes this experience unforgettable:</p>
      
      <h3>Best Locations for Firefly Watching</h3>
      <p>Top spots include:
        <ul>
          <li><strong>Kuala Selangor:</strong> Just 1.5 hours from KL, this is the most accessible site</li>
          <li><strong>Kampung Kuantan:</strong> Less touristy with equally impressive displays</li>
          <li><strong>Kuala Gula, Perak:</strong> Combines fireflies with migratory bird watching</li>
        </ul>
      </p>
      
      <h3>When to Go</h3>
      <p>The fireflies are active year-round, but optimal viewing conditions are:
        <ul>
          <li>After sunset (7:30-10pm ideal)</li>
          <li>During new moon phases (darker skies)</li>
          <li>Dry season (March-October) for calmer waters</li>
        </ul>
      </p>
      
      <h3>What to Expect</h3>
      <p>Our Oastel firefly tours include:
        <ul>
          <li>Small electric boats (quieter than motorboats)</li>
          <li>Knowledgeable naturalist guides</li>
          <li>Pre-tour mangrove ecology briefing</li>
          <li>Complimentary life jackets</li>
        </ul>
      </p>
      
      <h3>Photography Tips</h3>
      <p>Capturing fireflies is challenging but possible:
        <ul>
          <li>Use a tripod and long exposure (10-30 seconds)</li>
          <li>High ISO settings (1600-3200)</li>
          <li>Wide aperture (f/2.8 or lower)</li>
          <li>No flash - it disrupts the fireflies</li>
        </ul>
      </p>
      
      <h3>Conservation Matters</h3>
      <p>These ecosystems are fragile. Oastel follows strict guidelines:
        <ul>
          <li>No loud noises that disturb wildlife</li>
          <li>Minimal light pollution</li>
          <li>Support for local conservation initiatives</li>
        </ul>
      </p>
      
      <p><strong>Pro Tip:</strong> Combine your firefly tour with our "Mangrove Mystery" daytime package that includes a morning kayak through the same waterways to spot monkeys, otters, and migratory birds.</p>
    `,
    },
]

export const allTransfers: TransferType[] = [
    {
        _id: "1",
        title: "Cameron Highlands → Taman Negara in van",
        slug: "cameron-highlands-taman-negara-van",
        image: "/images/transfer1.jpg",
        from: "Cameron Highlands",
        to: "Taman Negara",
        tags: ["Van", "Fun", "Adventure"],
        desc: "Comfortable van transfer from Cameron Highlands to Taman Negara with scenic stops.",
        type: "Van",
        packageType: "transfer",
        duration: "4 hours",
        bookedCount: "1.5k",
        oldPrice: 150,
        newPrice: 95,
        childPrice: 50,
        minimumPerson: 1,
        maximumPerson: 8,
        times: ["09:00 AM", "01:00 PM", "05:00 PM"],
        status: "active",
        createdAt: new Date("2025-06-01"),
        updatedAt: new Date("2025-06-01"),
        details: {
            about: "Enjoy a scenic van ride through Malaysia's lush highlands, stopping at key viewpoints and local markets. Perfect for small groups or families.",
            itinerary:
                "Depart from Cameron Highlands and enjoy scenic mountain views. Stop at local markets and viewpoints along the way. Arrive at Taman Negara with comfortable seating throughout the journey.",
            pickupLocations: ["Tanah Rata", "Brinchang"],
            note: "Journey time may vary depending on weather and road conditions.",
            faq: [
                {
                    question: "What is included in the van transfer?",
                    answer: "Air-conditioned van transportation with experienced driver and scenic stops along the way.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local markets and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "2",
        title: "Cameron Highland → Kuala Besut Jetty in van",
        slug: "cameron-highland-kuala-besut-van",
        image: "/images/transfer2.jpg",
        from: "Cameron Highlands",
        to: "Kuala Besut Jetty",
        tags: ["Van", "Comfort", "Scenic"],
        desc: "Relaxing van transfer from Cameron Highlands to Kuala Besut Jetty with beautiful views.",
        type: "Van",
        packageType: "transfer",
        duration: "3.5",
        bookedCount: "1.2k",
        oldPrice: 150,
        newPrice: 110,
        childPrice: 60,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["08:00 AM", "12:00 PM", "04:00 PM"],
        createdAt: new Date("2025-06-02"),
        updatedAt: new Date("2025-06-02"),
        details: {
            about: "Experience a comfortable van ride from the cool Cameron Highlands to the bustling Kuala Besut Jetty, gateway to the Perhentian Islands. Enjoy scenic views and local insights along the way.",
            itinerary:
                "Depart from Cameron Highlands and travel through picturesque landscapes. Stop at local attractions and viewpoints. Arrive at Kuala Besut Jetty ready for your island adventure.",
            pickupLocations: ["Tanah Rata", "Brinchang"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the van transfer?",
                    answer: "Air-conditioned van transportation with experienced driver and scenic stops along the way.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "3",
        title: "Taman Negara → Kuala Lumpur in van",
        slug: "taman-negara-kuala-lumpur-van",
        image: "/images/transfer3.jpg",
        from: "Taman Negara",
        to: "Kuala Lumpur",
        tags: ["Van", "Convenient", "Scenic"],
        desc: "Convenient van transfer from Taman Negara to Kuala Lumpur with scenic views and comfortable seating.",
        type: "Van",
        packageType: "transfer",
        duration: "3.5",
        bookedCount: "900",
        oldPrice: 130,
        newPrice: 95,
        childPrice: 50,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["09:00 AM", "01:00 PM", "05:00 PM"],
        label: "Best Value",
        createdAt: new Date("2025-06-03"),
        updatedAt: new Date("2025-06-03"),
        details: {
            about: "Travel from the heart of Taman Negara to the bustling city of Kuala Lumpur in comfort. Enjoy scenic views and local insights during your journey.",
            itinerary:
                "Depart from Taman Negara and travel through lush landscapes. Stop at local attractions and viewpoints. Arrive in Kuala Lumpur ready to explore the city.",
            pickupLocations: ["Taman Negara Park Entrance", "Kuala Tahan"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the van transfer?",
                    answer: "Air-conditioned van transportation with experienced driver and scenic stops along the way.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "4",
        title: "Taman Nagara → Kuala Besut",
        slug: "taman-negara-kuala-besut-van",
        image: "/images/transfer4.jpg",
        from: "Taman Negara",
        to: "Kuala Besut Jetty",
        tags: ["Van", "Comfort", "Scenic"],
        desc: "Comfortable van transfer from Taman Negara to Kuala Besut Jetty with beautiful views.",
        type: "Van",
        packageType: "transfer",
        duration: "5.5",
        bookedCount: "800",
        oldPrice: 180,
        newPrice: 130,
        childPrice: 70,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["08:00 AM", "12:00 PM", "04:00 PM"],
        createdAt: new Date("2025-06-04"),
        updatedAt: new Date("2025-06-04"),
        details: {
            about: "Experience a comfortable van ride from Taman Negara to Kuala Besut Jetty, gateway to the Perhentian Islands. Enjoy scenic views and local insights along the way.",
            itinerary:
                "Depart from Taman Negara and travel through picturesque landscapes. Stop at local attractions and viewpoints. Arrive at Kuala Besut Jetty ready for your island adventure.",
            pickupLocations: ["Taman Negara Park Entrance", "Kuala Tahan"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the van transfer?",
                    answer: "Air-conditioned van transportation with experienced driver and scenic stops along the way.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "5",
        title: "Taman Nagara → Cameron Highlands in Van",
        slug: "taman-negara-cameron-highlands-van",
        image: "/images/transfer5.jpg",
        from: "Taman Negara",
        to: "Cameron Highlands",
        tags: ["Van", "Comfort", "Scenic"],
        desc: "Comfortable van transfer from Taman Negara to Cameron Highlands with beautiful views.",
        type: "Van",
        packageType: "transfer",
        duration: "4.5",
        bookedCount: "600",
        oldPrice: 160,
        newPrice: 95,
        childPrice: 70,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["08:00 AM", "12:00 PM", "04:00 PM"],
        createdAt: new Date("2025-06-05"),
        updatedAt: new Date("2025-06-05"),
        details: {
            about: "Experience a comfortable van ride from Taman Negara to the cool Cameron Highlands. Enjoy scenic views and local insights along the way.",
            itinerary:
                "Depart from Taman Negara and travel through picturesque landscapes. Stop at local attractions and viewpoints. Arrive at Cameron Highlands ready to explore the tea plantations and cool climate.",
            pickupLocations: ["Taman Negara Park Entrance", "Kuala Tahan"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the van transfer?",
                    answer: "Air-conditioned van transportation with experienced driver and scenic stops along the way.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "6",
        title: "Kuala Besut → Cameron Highlands in Van",
        slug: "kuala-besut-cameron-highlands-van",
        image: "/images/transfer6.jpg",
        from: "Kuala Besut Jetty",
        to: "Cameron Highlands",
        tags: ["Van", "Comfort", "Scenic"],
        desc: "Comfortable van transfer from Kuala Besut Jetty to Cameron Highlands with beautiful views.",
        type: "Van",
        packageType: "transfer",
        duration: "5.5",
        bookedCount: "500",
        oldPrice: 140,
        newPrice: 110,
        childPrice: 30,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["08:00 AM", "12:00 PM", "04:00 PM"],
        createdAt: new Date("2025-06-06"),
        updatedAt: new Date("2025-06-06"),
        details: {
            about: "Experience a comfortable van ride from Kuala Besut Jetty to the cool Cameron Highlands. Enjoy scenic views and local insights along the way.",
            itinerary:
                "Depart from Kuala Besut Jetty and travel through picturesque landscapes. Stop at local attractions and viewpoints. Arrive at Cameron Highlands ready to explore the tea plantations and cool climate.",
            pickupLocations: ["Kuala Besut Jetty"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the van transfer?",
                    answer: "Air-conditioned van transportation with experienced driver and scenic stops along the way.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "7",
        title: "Cameron Highlands → Taman Negara in Ferry",
        slug: "cameron-highlands-taman-negara-ferry",
        image: "/images/transfer7.jpg",
        from: "Cameron Highlands",
        to: "Taman Negara",
        tags: ["Ferry", "Adventure", "Scenic"],
        desc: "Scenic ferry ride from Cameron Highlands to Taman Negara with beautiful views.",
        type: "Van + Ferry",
        packageType: "transfer",
        duration: "5",
        bookedCount: "300",
        oldPrice: 200,
        newPrice: 145,
        childPrice: 80,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["09:00 AM", "01:00 PM", "05:00 PM"],
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Experience a unique ferry ride from the cool Cameron Highlands to the heart of Taman Negara. Enjoy scenic views and local insights along the way.",
            itinerary:
                "Depart from Cameron Highlands and travel to the nearest ferry terminal. Board the ferry and enjoy the scenic ride through Malaysia's lush landscapes. Arrive at Taman Negara ready for your adventure.",
            pickupLocations: ["Tanah Rata", "Brinchang"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the ferry transfer?",
                    answer: "Air-conditioned van transportation to the ferry terminal, ferry ride, and experienced guide.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "8",
        title: "Taman Nagara → Cameron Highlands in Ferry",
        slug: "taman-negara-cameron-highlands-ferry",
        image: "/images/transfer1.jpg",
        from: "Taman Negara",
        to: "Cameron Highlands",
        tags: ["Ferry", "Adventure", "Scenic"],
        desc: "Scenic ferry ride from Taman Negara to Cameron Highlands with beautiful views.",
        type: "Van + Ferry",
        packageType: "transfer",
        duration: "5",
        bookedCount: "250",
        oldPrice: 200,
        newPrice: 145,
        childPrice: 80,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["09:00 AM", "01:00 PM", "05:00 PM"],
        createdAt: new Date("2025-06-08"),
        updatedAt: new Date("2025-06-08"),
        details: {
            about: "Experience a unique ferry ride from the heart of Taman Negara to the cool Cameron Highlands. Enjoy scenic views and local insights along the way.",
            itinerary:
                "Depart from Taman Negara and travel to the nearest ferry terminal. Board the ferry and enjoy the scenic ride through Malaysia's lush landscapes. Arrive at Cameron Highlands ready for your adventure.",
            pickupLocations: ["Taman Negara Park Entrance", "Kuala Tahan"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the ferry transfer?",
                    answer: "Air-conditioned van transportation to the ferry terminal, ferry ride, and experienced guide.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "9",
        title: " Cameron Highlands → Perhentian islands",
        slug: "cameron-highlands-perhentian-islands",
        image: "/images/transfer2.jpg",
        from: "Cameron Highlands",
        to: "Perhentian Islands",
        tags: ["Ferry", "Island", "Adventure"],
        desc: "Scenic ferry ride from Cameron Highlands to the beautiful Perhentian Islands with stunning views.",
        type: "Van + Ferry",
        packageType: "transfer",
        duration: "6",
        bookedCount: "400",
        oldPrice: 220,
        newPrice: 100,
        childPrice: 50,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["08:00 AM", "12:00 PM", "04:00 PM"],
        createdAt: new Date("2025-06-09"),
        updatedAt: new Date("2025-06-09"),
        details: {
            about: "Experience a scenic ferry ride from the cool Cameron Highlands to the stunning Perhentian Islands. Enjoy breathtaking views and local insights along the way.",
            itinerary:
                "Depart from Cameron Highlands and travel to the nearest ferry terminal. Board the ferry and enjoy the scenic ride through Malaysia's lush landscapes. Arrive at Perhentian Islands ready for your island adventure.",
            pickupLocations: ["Tanah Rata", "Brinchang"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the ferry transfer?",
                    answer: "Air-conditioned van transportation to the ferry terminal, ferry ride, and experienced guide.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "10",
        title: "Taman Nagara → Perhentian Islands",
        slug: "taman-negara-perhentian-islands",
        image: "/images/transfer3.jpg",
        from: "Taman Negara",
        to: "Perhentian Islands",
        tags: ["Ferry", "Island", "Adventure"],
        desc: "Scenic ferry ride from Taman Negara to the beautiful Perhentian Islands with stunning views.",
        type: "Van + Ferry",
        packageType: "transfer",
        duration: "6",
        bookedCount: "350",
        oldPrice: 320,
        newPrice: 300,
        childPrice: 150,
        minimumPerson: 1,
        maximumPerson: 8,
        time: ["08:00 AM", "12:00 PM", "04:00 PM"],
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-10"),
        details: {
            about: "Experience a scenic ferry ride from the heart of Taman Negara to the stunning Perhentian Islands. Enjoy breathtaking views and local insights along the way.",
            itinerary:
                "Depart from Taman Negara and travel to the nearest ferry terminal. Board the ferry and enjoy the scenic ride through Malaysia's lush landscapes. Arrive at Perhentian Islands ready for your island adventure.",
            pickupLocations: ["Taman Negara Park Entrance", "Kuala Tahan"],
            note: "Please arrive 15 minutes before departure time.",
            faq: [
                {
                    question: "What is included in the ferry transfer?",
                    answer: "Air-conditioned van transportation to the ferry terminal, ferry ride, and experienced guide.",
                },
                {
                    question: "Can I book this transfer for a group?",
                    answer: "Yes, the van can accommodate up to 8 passengers. Please contact us for group bookings.",
                },
                {
                    question: "Is there a child discount?",
                    answer: "Yes, children under 12 years old receive a 50% discount on the ticket price.",
                },
                {
                    question: "What if I need to cancel my booking?",
                    answer: "Cancellations made 24 hours before the scheduled transfer will receive a full refund. No refunds for cancellations within 24 hours.",
                },
                {
                    question: "Are there any stops during the transfer?",
                    answer: "Yes, we make scenic stops at local attractions and viewpoints to enhance your travel experience.",
                },
            ],
        },
    },
    {
        _id: "11",
        title: "Kuala Lumpur → Cameron Highlands Private Transfer",
        slug: "kuala-lumpur-cameron-highlands-private",
        image: "/images/transfer4.jpg",
        from: "Kuala Lumpur",
        to: "Cameron Highlands",
        tags: ["Private", "Luxury", "Direct"],
        desc: "Private luxury transfer from Kuala Lumpur to Cameron Highlands with personalized service.",
        type: "Private",
        packageType: "transfer",
        duration: "3",
        bookedCount: "800",
        oldPrice: 400,
        newPrice: 350,
        childPrice: 175,
        minimumPerson: 1,
        maximumPerson: 6,
        time: ["07:00 AM", "11:00 AM", "03:00 PM"],
        createdAt: new Date("2025-06-07"),
        updatedAt: new Date("2025-06-07"),
        details: {
            about: "Experience luxury and comfort with our private transfer service from Kuala Lumpur to Cameron Highlands.",
            itinerary:
                "",
            pickupLocations: ["KLIA", "KL Sentral", "Any KL Hotel"],
            note: "Driver will contact you 30 minutes before pickup time.",
            faq: [
                {
                    question: "What type of vehicle is used?",
                    answer: "We use comfortable private vehicles including Toyota Innova and similar models based on group size.",
                },
            ],
        },
    },
]

export const allFaqs: FAQType[] = [
    // 🏨 Stay
    {
        question: "What types of accommodations does Oastel offer?",
        answer: "Oastel provides a range of stays including boutique hotels, hostels, homestays, and eco-lodges depending on your travel preference and budget.",
        category: "Stay",
    },
    {
        question: "Are the stays suitable for families with children?",
        answer: "Yes, many of our stays are family-friendly and include child-safe amenities, family rooms, and kid-friendly activities.",
        category: "Stay",
    },
    {
        question: "Can I choose my preferred room type while booking?",
        answer: "Yes, during the booking process, you can select from the available room types such as single, double, family, or deluxe rooms.",
        category: "Stay",
    },
    {
        question: "Is breakfast included with the stay?",
        answer: "Some accommodations include complimentary breakfast. The details will be mentioned in the listing before you book.",
        category: "Stay",
    },
    {
        question: "Are pets allowed in Oastel stays?",
        answer: "Pet policies vary by property. Please check the individual stay's listing or contact support to confirm.",
        category: "Stay",
    },

    // 🚐 Transportation
    {
        question: "What types of transportation options are available?",
        answer: "Oastel offers vans, minibuses, and cars with professional drivers for intercity travel and local exploration.",
        category: "Transportation",
    },
    {
        question: "How do I book a van for a group trip?",
        answer: "You can book a van directly on our website by selecting your route, date, and number of passengers.",
        category: "Transportation",
    },
    {
        question: "Can I request a custom pick-up or drop-off point?",
        answer: "Yes, custom pick-ups are possible depending on the route. Please mention your request while booking.",
        category: "Transportation",
    },
    {
        question: "Do your vehicles have air conditioning?",
        answer: "Yes, all our vehicles come with air conditioning to ensure a comfortable journey.",
        category: "Transportation",
    },
    {
        question: "What happens if I miss my van departure?",
        answer: "If you're running late, please contact our support immediately. Rebooking depends on availability and refund policies.",
        category: "Transportation",
    },

    // 🗺️ Tours
    {
        question: "What is the difference between Co-Tour and Private Tour?",
        answer: "A Co-Tour involves joining a group with other travelers, while a Private Tour is exclusive for you and your group.",
        category: "Tours",
    },
    {
        question: "Can I customize a private tour?",
        answer: "Yes, private tours are customizable. You can choose your itinerary, duration, and preferences.",
        category: "Tours",
    },
    {
        question: "Are guides included in the tours?",
        answer: "All tours include experienced local guides who ensure safety and offer cultural insights.",
        category: "Tours",
    },
    {
        question: "Do the tours include meals?",
        answer: "Some tours include meals depending on the duration and package. Check the tour details for inclusions.",
        category: "Tours",
    },
    {
        question: "What is the maximum group size for Co-Tours?",
        answer: "Group size varies but is usually limited to 12-15 people for a more personalized experience.",
        category: "Tours",
    },

    // 💳 Booking & Payment
    {
        question: "How do I know my booking is confirmed?",
        answer: "You will receive a confirmation email and receipt immediately after successful payment.",
        category: "Booking",
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept credit/debit cards, online banking, and selected e-wallets like GrabPay and Touch ‘n Go.",
        category: "Booking",
    },
    {
        question: "Can I modify my booking after payment?",
        answer: "Modifications depend on the service and timing. Contact support at least 24 hours in advance.",
        category: "Booking",
    },
    {
        question: "Is there a refund policy if I cancel my booking?",
        answer: "Refund policies vary. Please refer to the cancellation terms provided during booking.",
        category: "Booking",
    },
    {
        question: "Will I get an invoice for my booking?",
        answer: "Yes, an invoice will be sent via email upon completion of your transaction.",
        category: "Booking",
    },

    // 👤 Account & Support
    {
        question: "Do I need to create an account to book?",
        answer: "You can checkout as a guest, but creating an account gives access to booking history, offers, and faster checkouts.",
        category: "Account",
    },
    {
        question: "How can I update my profile details?",
        answer: "You can update your name, contact info, and preferences from your dashboard under ‘Profile’.",
        category: "Account",
    },
    {
        question: "What should I do if I forget my password?",
        answer: "Click on ‘Forgot Password’ on the login page and follow the instructions to reset it.",
        category: "Account",
    },
    {
        question: "How can I reach Oastel customer support?",
        answer: "You can contact us through live chat, WhatsApp, or email at support@oastel.com.",
        category: "Account",
    },
    {
        question: "Is my personal information secure?",
        answer: "Yes, we use encrypted servers and secure protocols to protect your data at all times.",
        category: "Account",
    },

    // 🌐 General
    {
        question: "Is Oastel available across all of Malaysia?",
        answer: "We currently operate in top tourist destinations like Cameron Highlands, Langkawi, Penang, and Kuala Lumpur.",
        category: "General",
    },
    {
        question: "Does Oastel offer group discounts?",
        answer: "Yes, group discounts are available for tours and transport bookings. Contact support for custom quotes.",
        category: "General",
    },
    {
        question: "Can I book on behalf of someone else?",
        answer: "Yes, you can book for others. Just make sure to enter their details accurately during checkout.",
        category: "General",
    },
    {
        question: "Does Oastel offer packages for school or corporate trips?",
        answer: "Yes, we provide tailored packages for institutions and companies. Reach out for customized plans.",
        category: "General",
    },
    {
        question: "Is Oastel a licensed travel service provider?",
        answer: "Yes, Oastel is a registered and licensed travel service provider operating under Malaysian tourism regulations.",
        category: "General",
    },
]

// export cartItems: CartItemType[] = []
