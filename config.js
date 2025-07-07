// Configuration file for Location Hints Adventure
// Modify this file to customize hints and locations

const HINTS_CONFIG = {
    // Override codes for testing (you can change these)
    masterOverride: "MASTER2024", // Master code to unlock all hints
    
    // Hint definitions
    hints: [
        {
            id: 1,
            title: "The Starting Point",
            description: "From trees they come, so rich and sweet, A ruby fruit you pluck and eat. In Louisville’s sun, you fill your pail, Then blend your harvest, smooth and pale. With berries bright and toppings stacked, In bowls where flavor’s never lacked. What’s this joy, both fresh and chillin’? A local twist that’s truly thrillin’?",
            additionalHint: "Place to pick a red fruit",
            location: {
                name: "Cherry Pickin'",
                latitude: 38.25273,
                longitude: -85.73682,
                radius: 100 // meters
            },
            overrideCode: "START123"
        },
        {
            id: 2,
            title: "___holic",
            description: "I'm powdered green and whisked with care, A calming sip, beyond compare. In bowls or cups, I’m smooth and bright, A burst of zen in every sip. You’ll find me where the kettles steam, In peaceful spots that feel like dream. Where rituals meet a modern stop — What am I?",
            additionalHint: "Your FAVORITE matcha shop in Louisville",
            location: {
                name: "Kiwa",
                latitude: 38.2628,
                longitude: -85.7135,
                radius: 100
            },
            overrideCode: "KIWA101"
        },
        {
            id: 3,
            title: "The River's Edge",
            description: "Where blossoms bloom and petals gleam, Beside a river's quiet stream. With winding paths and fragrant air, You'll find rare beauty growing there. Nature’s colors, gently planned, By thoughtful heart and careful hand. It’s not just plants that leave their mark — It’s peace and life near waters park. What is this place that so enchants? A haven full of trees and plants",
            additionalHint: "By the river the flowers lie",
            location: {
                name: "Waterfront Botanical Gardens",
                latitude: 38.263603,
                longitude: -85.723656,
                radius: 150
            },
            overrideCode: "RIVER789"
        },
        {
            id: 4,
            title: "Over the River and Through the Woods",
            description: "I’m kissed by waves and cooled by breeze, With swaying trees and ducks at ease. People stroll or sit and gaze, At sunsets setting skies ablaze. Children laugh, dogs may bark, You’ll find me calm from dawn till dark. With water near and nature’s spark— What am I?",
            additionalHint: "Head over to near the Big Four Bridge",
            location: {
                name: "Waterfront Park",
                latitude: 38.260103,
                longitude: -85.745187,
                radius: 150
            },
            overrideCode: "SKY101"
        },
        {
            id: 5,
            title: "The Final Destination",
            description: "I’m not a home, though I may feel like one, Where tasks are many, and breaks are few. I see your hustle from sun to sun, And pay you for the things you do. I could be a tower, a shop, or a farm, A screen, a stage, or something with charm. What am I, where duty lurks.",
            additionalHint: "My favorite Drake and Rihanna song",
            location: {
                name: "Humana Office",
                latitude: 38.2601,
                longitude: -85.7452,
                radius: 100 // meters
            },
            overrideCode: "FINAL202"
        }
    ],

    // Game settings
    settings: {
        locationTimeout: 10000, // milliseconds
        locationAccuracy: true, // enable high accuracy
        locationMaxAge: 60000, // milliseconds
        animationDuration: 500, // milliseconds
        notificationDuration: 3000 // milliseconds
    },

    // UI customization
    ui: {
        theme: {
            primaryColor: "#667eea",
            secondaryColor: "#764ba2",
            successColor: "#4CAF50",
            errorColor: "#f44336",
            warningColor: "#FF9800"
        },
        animations: {
            enabled: true,
            slideInDuration: 500,
            successFlashDuration: 500,
            errorShakeDuration: 500
        }
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HINTS_CONFIG;
} 