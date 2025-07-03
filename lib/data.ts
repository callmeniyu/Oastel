export const allTours = [
    {
        id: 1,
        slug: "half-day-land-rover-road-trip",
        title: "Half Day Land Rover Road Trip",
        //100 characters max for title
        //30-45 characters recommended for title
        image: "/images/tour1.jpg",
        tags: ["Co-Tour", "Half-day", "Adventure"],
        desc: "Embark on a thrilling half-day journey through scenic trails and lush forests in a classic Land Rover.",
        // 110 characters max for description
        type: "co-tour",
        duration: "5-6",
        bookedCount: "2.6k",
        oldPrice: 70,
        newPrice: 50,
        childPrice: 25,
        time: ["8:00 AM", "1:30 PM"],
        details: {
            about: "Thrilling Land Rover Ride: Explore off-the-beaten-path trails and stunning landscapes.Local Culture: Visit traditional villages and meet the locals.Hidden Gems: Discover breathtaking viewpoints and untouched nature.Expert Guides: Knowledgeable and friendly guides ensure a safe and memorable trip.",
            itinerary: [
                "Mossy Forest Boardwalk :Explore the enchanting Mossy Forest (entrance fees excluded).Optional entry: Pay on-site to the Forestry Department officer.",
                " BOH Sungei Palas Tea Plantations :Visit the Tea Factory, Tea Café, and Tea Shop .Note : BOH Tea Center is closed on Mondays.",
            ],
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
        duration: "8-10",
        bookedCount: 1000,
        oldPrice: 140,
        newPrice: 100,
        childPrice: 50,
        time: ["8:00 AM", "1:30 PM", "5:00 PM"],
        details: {
            about: "Ultimate Full Day Adventure: Experience the best of Cameron Highlands with a comprehensive Land Rover journey. Diverse Landscapes: Traverse lush tea plantations, misty forests, and scenic valleys. Cultural Encounters: Engage with local communities and learn about their traditions. Extended Exploration: More stops and activities for a truly immersive day.",
            itinerary: [
                "Mossy Forest Boardwalk: Guided walk through the mystical Mossy Forest (entrance fees excluded). Optional entry: Pay on-site to the Forestry Department officer.",
                "BOH Sungei Palas Tea Plantations: Tour the Tea Factory, enjoy refreshments at the Tea Café, and shop for local teas. Note: BOH Tea Center is closed on Mondays.",
                "Local Market Visit: Explore a vibrant local market and sample fresh produce.",
                "Strawberry Farm: Pick your own strawberries and learn about local agriculture.",
            ],
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
        image: "/images/tour3.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Enjoy a personalized half-day tour with your own group, tailored to your interests and pace.",
        type: "private",
        duration: "5-6",
        bookedCount: 1.5,
        oldPrice: 400,
        newPrice: 349,
        childPrice: 150,
        time: ["9:00 AM", "11:30 PM"],
        details: {
            about: "Private Half Day Tour: Enjoy a personalized experience exploring Cameron Highlands with your own group. Flexible Itinerary: Tailor the tour to your interests with the help of your expert guide. Exclusive Access: Visit hidden gems and popular attractions at your own pace. Comfort & Privacy: Travel in comfort with up to 8 guests in a private Land Rover.",
            itinerary: [
                "Customizable Stops: Choose from Mossy Forest, tea plantations, local markets, and more.",
                "Expert Guidance: Your guide will suggest the best spots based on your preferences.",
            ],
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
        image: "/images/tour4.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Discover the unique Coral Hills area with a private guide, featuring nature walks and stunning viewpoints.",
        type: "private",
        duration: "5-6",
        bookedCount: 500,
        oldPrice: 549,
        newPrice: 449,
        childPrice: 200,
        time: ["7:20 AM"],
        details: {
            about: "Coral Hills Discovery: Experience the unique landscapes and biodiversity of the Coral Hills area in Cameron Highlands. Scenic Views: Enjoy panoramic vistas and photo opportunities at exclusive viewpoints. Nature Walks: Guided exploration of local flora and fauna. Personalized Experience: Private tour tailored to your group's interests.",
            itinerary: [
                "Coral Hills Nature Walk: Guided walk through the Coral Hills area, learning about its unique ecosystem.",
                "Scenic Viewpoints: Stop at the best spots for breathtaking views and photography.",
                "Local Culture: Optional visit to nearby villages or markets, based on group preference.",
            ],
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
        image: "/images/tour5.jpg",
        tags: ["Private", "Half-day", "Upto 8 guests"],
        desc: "Start your day with a breathtaking sunrise followed by a half-day exploration of Cameron Highlands’ highlights.",
        type: "private",
        duration: "5-6",
        bookedCount: 400,
        oldPrice: 600,
        newPrice: 549,
        childPrice: 200,
        time: ["5:00 PM", "1:30 PM"],
        details: {
            about: "Sunrise Experience: Witness a breathtaking sunrise over the Cameron Highlands before embarking on a half-day adventure. Early Start: Begin your day with panoramic views and photo opportunities at exclusive sunrise viewpoints. Flexible Itinerary: After sunrise, explore tea plantations, forests, or local markets with your private guide. Personalized Tour: Tailor the experience to your group's interests for a memorable morning.",
            itinerary: [
                "Sunrise Viewpoint: Early morning drive to a scenic spot for sunrise viewing and photography.",
                "Tea Plantation Visit: Explore a local tea plantation and learn about tea production.",
                "Optional Stops: Choose from Mossy Forest, local markets, or strawberry farms based on group preference.",
            ],
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
        duration: "5-6",
        bookedCount: "1.5k",
        oldPrice: 499,
        newPrice: 399,
        childPrice: 200,
        time: ["8:00 AM"],
        details: {
            about: "Intimate Group Adventure: Enjoy a private half-day tour designed for small groups seeking a personalized experience in Cameron Highlands. Flexible Itinerary: Customize your journey with the help of your expert guide. Exclusive Access: Visit hidden gems and popular attractions at your own pace. Comfort & Privacy: Travel comfortably with up to 8 guests in a private Land Rover.",
            itinerary: [
                "Customizable Stops: Choose from Mossy Forest, tea plantations, local markets, and more.",
                "Expert Guidance: Your guide will suggest the best spots based on your preferences.",
            ],
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
