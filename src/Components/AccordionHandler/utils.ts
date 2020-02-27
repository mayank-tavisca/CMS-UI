export const mapAccordionData = (data) => {

    const parsedData: IAccordionData = { heading: "", contents: [] };

    Object.keys(data).forEach(key => {
        const val = data[key];

        if (key === 'heading') {
            parsedData.heading = val;
        } else if (key === 'content') {
            val.forEach(item => {
                const data: IContent = { heading: "", content: "", id: "" };
                data.heading = item.heading;
                data.content = item.content[0].content;
                data.id = item.id;
                parsedData.contents.push(data);

            });
        }
    })

    return parsedData;

}


interface IAccordionData {
    heading: string;
    contents: IContent[];
}

interface IContent {
    heading: string;
    content: string;
    id: string;
}
