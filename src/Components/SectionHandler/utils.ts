export const mapSectionData = (data) => {

    const parsedData: ISection = { contents: [] };

    data.content.forEach(item => {

        if (item.type === 'marked') {
            console.log(item)
            const data: IContent = { heading: "", content: "", id: "" };
            data.id = item.id;
            data.heading = item.content.heading;
            data.content = item.content.content;
            parsedData.contents.push(data);
        }
    })

    return parsedData;

}


interface ISection {
    contents: IContent[];
}

interface IContent {
    id: string;
    heading: string;
    content: string;
}