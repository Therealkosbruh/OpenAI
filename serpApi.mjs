import { getJson } from 'serpapi';

const getGoogleLensData = async (url) => {
  const apiKey = '364d4e0519488e261248886c8c4555463407e3185b219d91b4a1df873d34ff0d'; 
  const engine = 'google_lens';

  try {
    const json = await getJson({
      api_key: apiKey,
      engine,
      url,
    });

    let results = [];

    // Проверяем все ключи в ответе API Serpapi
    for (const key in json) {
      if (json[key] && Array.isArray(json[key])) {
        // Если ключ содержит массив, проверяем каждый элемент
        json[key].forEach((element) => {
          if (element && element.title && element.link && element.thumbnail) {
            const siteRegex = /https?:\/\/([^\/]+)/;
            const siteMatch = element.link.match(siteRegex);
            let site = siteMatch && siteMatch[1];
            if (!site) {
              site = 'Unknown site';
            }
            // При успешном выполнении добавляем результаты в отдельный массив
            results.push({
              link: element.link,
              image: element.thumbnail,
              title: element.title,
              site,
            });
          }
        });
      }
    }

    if (!results.length) {
      console.log('Изображения не найдены');
    }

    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getGoogleLensData };