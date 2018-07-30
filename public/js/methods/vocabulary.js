import locales from '../../../data/locales';

let vocabulary = {};

locales.forEach((el) => {
	vocabulary[el] = require(`../../../locales/${el}.json`);
});

export default vocabulary;