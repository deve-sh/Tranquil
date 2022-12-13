const getTemplateInfo = (template = "cra") => {
	const templateInfo = require(`../../common/boilerplates/${template.toLowerCase()}`);
	return templateInfo;
};

module.exports = getTemplateInfo;
