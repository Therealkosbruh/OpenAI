import OpenAI from "openai";

const apiKey = "";
const openai = new OpenAI({ apiKey: apiKey });

async function main(url) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are an advanced assistant for recognizing objects in a photo. you recognize the main object in the photo and write what it is. you can recognize absolutely any object or thing. Detailed exceptions are listed below: if you recognize a car, specify its make and model. if the model could not be recognized, specify its brand. if you recognize the flowers, specify the name of the flower. if you recognize a dish, specify its name as accurately as possible (for example, the name of the pizza, the variety of apples, berries, and so on). if you recognize a toy (children's), specify its name in as much detail as possible. if you recognize the book, specify its author and title if you recognize a person or a face, if it is a famous person, specify his first and last name, if it is an ordinary person, specify a girl / man , if you recognize a technique, specify its model and manufacturer, if possible, always specify the model of the product and its manufacturer, if this product is popular (except for food), answers they should be short (one or two words, or the name of the product). full name of the model) You do not need to describe the color of the product or its detailed characteristics. You only need the name/modelthe response format without clarifying words (without 'this, in the photo, here' and so on) is just the name of the object or mode" },
          {
            type: "image_url",
            image_url: {
              "url": url,
            },
          },
        ],
      },
    ],
  });

  const recognizedObject = response.choices[0].message.content;

  const secondResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Provide information about ${recognizedObject}. 
        верни мне их в формате - 
        labels: ,
        did_you_know:,
        price: ,
        description: "...",
        facts: ,
          ...
        Ещё в параметр labels добавьте только название модели Пожалуйста, включите технические характеристики для электроники, ингредиенты для продуктов питания и другие соответствующие детали. Используйте точные значения, если это возможно. Если значения варьируются, то выводите только усредненное значение, если значение имеет хоть какой то числовой формат выводите только число. Так же если в ответе присутствует цена, то выводите конкретное значение цены и валюту, если присутствуют какие-то технические показатели выводите только их, без описания, если есть вес предмета тоже выводите только число, так же ко всему остальному, где используются числовые значения.В ответе используй только указанный формат, не нужно любезно отвечать на мой запрос и писать что то кроме ответа по типу :"Конечно" и так далее. Так же верни результат в формате русской раскладки`,
      },
    ],
  });

  const result = secondResponse.choices[0].message.content;

// Parse the result and extract the necessary information
let resultArray = [];
let labels = [];
let didYouKnow = "";
let price = "";
let description = "";
let facts = [];

// Parse the result and extract the necessary information
const lines = result.split("\n");
lines.forEach((line) => {
  const keyValue = line.split(":");
  if (keyValue.length === 2) {
    const key = keyValue[0].trim().toLowerCase(); 
    const value = keyValue[1].trim();
    if (key === "labels") {
      labels.push(value.replace(/"/g, '').replace(/\//g, ''));
    } else if (key.match(/^did[_ ]?you[_ ]?know$/i)) { 
      didYouKnow = value.replace(/"/g, '').replace(/\//g, '');
    } else if (key === "price") {
      price = value;
    }else if (key === "description") {
      description = value.replace(/"/g, '').replace(/\//g, '');
    } else if (key === "facts") {
      // skip this line, as it's just a header
    } else {
      const factKey = key.replace(/^-/, ''); 
      facts.push(`${factKey}: ${value.replace(/"/g, '').replace(/\//g, '')}`);
    }
  }
});

resultArray.push({
  labels,
  did_you_know: didYouKnow, 
  price,
  description,
  facts: facts.map(fact => fact.trim().charAt(0).toUpperCase() + fact.trim().slice(1).toLowerCase())
});

return resultArray;
}

// main("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNAdu9v57uZkTZH9vb0BfItyDNo-sqjv5msDgVIU4kcD8JAAn");
// main("https://nypost.com/wp-content/uploads/sites/2/2019/10/gettyimages-187596325.jpg?quality=75&strip=all&w=744");
export { main };
