export const Clients = [
    { label: 'RBS', value: 'rbs' },
    { label: 'Natwest', value: 'natwest' },
    { label: 'Ulster', value: 'ulster' }
]

export const Accounts = [
    { label: 'Black', value: 'black' },
    { label: 'Platinum', value: 'platinum' },
]

export const Pages = [
    { label: 'Explore Page', value: 'explorePage' },
    { label: 'Home Page', value: 'homePage' }
]

export const MockModels = [
    {
        id: '100',
        name: "HeroBanner",
        label: "Hero Banner",
        fields: [
            { keyName: "headingText", type: "markedText", label: "Heading Text" },
            { keyName: "buttonText", type: "text", label: "Button Text" },
            { keyName: "imageUrl", type: "media", label: "Image URL" }
        ],
    },
    {
        id: '200',
        name: "Section",
        label: "Section",
        fields: [
            { keyName: "heading", type: "text", label: "Heading" },
            { keyName: "content", type: "markedText", label: "Content" }
        ]
    },
    {
        id: '300',
        name: "MultiSection",
        label: "Multi Section",
        fields: [
            { keyName: "heading", type: "text", label: "Heading" },
            { keyName: "content", type: "markedText", label: "Content" }
        ]
    },
    {
        id: '400',
        name: "ImageBanner",
        label: "Image Banner",
        fields: [
            { keyName: "imageUrl", type: "media", label: "Image URL" },
            { keyName: "heading", type: "text", label: "Heading" },
            { keyName: "content", type: "markedText", label: "Content" }
        ]
    },
    {
        id: '500',
        name: "AccordionComponent",
        label: "Accordion",
        fields: [
            { keyName: "heading", type: "text", label: "Heading" },
            {
                keyName: 'content', type: 'markedText', label: 'Contents'
                // , fields: [
                //     { keyName: "heading", type: "text", label: "Heading" },
                //     { keyName: "content", type: "markedText", label: "Content" }
                // ]
            },
        ]
    },
    {
        id: '600',
        name: "AdditionalInfo",
        label: "Additional Info",
        fields: [
            { keyName: "heading", type: "text", label: "Heading" },
            { keyName: "title", type: "text", label: "File Title" },
            { keyName: "content", type: "markedText", label: "Content" }
        ]
    },
];

export const AccordionElement = [
    { keyName: "heading", type: "text", label: "Heading" },
    { keyName: "content", type: "markedText", label: "Content" }
]