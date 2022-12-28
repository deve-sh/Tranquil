const templateList = [
	{
		image: "https://i.ytimg.com/vi/C2HU3AY7IkU/maxresdefault.jpg",
		id: "Next",
		label: "Next.js",
	},
	{
		image: "https://create-react-app.dev/img/logo-og.png",
		id: "CRA",
		label: "React with CRA",
	},
];

export const getTemplateInfoFromId = (templateId: string) => {
	return templateList.find((template) => template.id === templateId);
};

export default templateList;
