const companiesData = [
    {
        id: 1,
        name: "Compañía 1",
        logo: "https://placehold.co/400x200?text=Logo+1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "Lorem Status",
        country: "Lorem Country",
        rating: "0.0/5",
        links: {
            website: "#",
            twitter: "#",
            facebook: "#"
        },
        stats: {
            platforms: [
                { name: "Lorem Platform 1", count: 0 },
                { name: "Lorem Platform 2", count: 0 },
                { name: "Lorem Platform 3", count: 0 }
            ],
            genres: [
                { name: "Lorem Genre 1", count: 0 },
                { name: "Lorem Genre 2", count: 0 },
                { name: "Lorem Genre 3", count: 0 }
            ]
        },
        topGames: ["Lorem Game 1", "Lorem Game 2", "Lorem Game 3", "Lorem Game 4", "Lorem Game 5", "Lorem Game 6", "Lorem Game 7", "Lorem Game 8", "Lorem Game 9", "Lorem Game 10"]
    },
    {
        id: 2,
        name: "Compañía 2",
        logo: "https://placehold.co/400x200?text=Logo+2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "Lorem Status",
        country: "Lorem Country",
        rating: "0.0/5",
        links: {
            website: "#",
            twitter: "#",
            facebook: "#"
        },
        stats: {
            platforms: [
                { name: "Lorem Platform 1", count: 0 },
                { name: "Lorem Platform 2", count: 0 },
                { name: "Lorem Platform 3", count: 0 }
            ],
            genres: [
                { name: "Lorem Genre 1", count: 0 },
                { name: "Lorem Genre 2", count: 0 },
                { name: "Lorem Genre 3", count: 0 }
            ]
        },
        topGames: ["Lorem Game 1", "Lorem Game 2", "Lorem Game 3", "Lorem Game 4", "Lorem Game 5", "Lorem Game 6", "Lorem Game 7", "Lorem Game 8", "Lorem Game 9", "Lorem Game 10"]
    },
    {
        id: 3,
        name: "Compañía 3",
        logo: "https://placehold.co/400x200?text=Logo+3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "Lorem Status",
        country: "Lorem Country",
        rating: "0.0/5",
        links: {
            website: "#",
            twitter: "#",
            facebook: "#"
        },
        stats: {
            platforms: [
                { name: "Lorem Platform 1", count: 0 },
                { name: "Lorem Platform 2", count: 0 },
                { name: "Lorem Platform 3", count: 0 }
            ],
            genres: [
                { name: "Lorem Genre 1", count: 0 },
                { name: "Lorem Genre 2", count: 0 },
                { name: "Lorem Genre 3", count: 0 }
            ]
        },
        topGames: ["Lorem Game 1", "Lorem Game 2", "Lorem Game 3", "Lorem Game 4", "Lorem Game 5", "Lorem Game 6", "Lorem Game 7", "Lorem Game 8", "Lorem Game 9", "Lorem Game 10"]
    },
    {
        id: 4,
        name: "Compañía 4",
        logo: "https://placehold.co/400x200?text=Logo+4",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "Lorem Status",
        country: "Lorem Country",
        rating: "0.0/5",
        links: {
            website: "#",
            twitter: "#",
            facebook: "#"
        },
        stats: {
            platforms: [
                { name: "Lorem Platform 1", count: 0 },
                { name: "Lorem Platform 2", count: 0 },
                { name: "Lorem Platform 3", count: 0 }
            ],
            genres: [
                { name: "Lorem Genre 1", count: 0 },
                { name: "Lorem Genre 2", count: 0 },
                { name: "Lorem Genre 3", count: 0 }
            ]
        },
        topGames: ["Lorem Game 1", "Lorem Game 2", "Lorem Game 3", "Lorem Game 4", "Lorem Game 5", "Lorem Game 6", "Lorem Game 7", "Lorem Game 8", "Lorem Game 9", "Lorem Game 10"]
    }
];

function getCompanyById(id) {
    return companiesData.find(company => company.id === parseInt(id));
}
