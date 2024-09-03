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
          { type: "text", text: "You are an advanced assistant for recognizing objects in a photo. You recognize the main object in the photo and write what it is. You can recognize absolutely any object or object. Below are the detailed exceptions: if you recognize the car, specify its make and model. If the model could not be recognized, write down its brand. If you recognize the flowers, specify the name of the flower. If you recognize a food, specify its name, as accurate as possible (for example, the name of a pizza, the type of apples, berries, and so on) If you recognize a toy (children's), specify its name in as much detail as possible. If you recognize the book, specify its author and title If you recognize the technique, specify its model and manufacturer , if possible, always specify the model of the item and its manufacturer, if this product is popular (except food) , the answers should be short (one or two words, or the full name of the model) , you do not need to describe the color of the item or its detailed characteristics. You only need the name/model" },
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
      content: `Provide detailed information about ${recognizedObject} in the following format: 
      {
        "labels": [...],
        "did_you_know": "...",
        "price": "...",
        "description": "...",
        "facts": [
          "...",
          ...
        ]
      }
      Ещё в параметр labels добавьте только название модели Пожалуйста, включите технические характеристики для электроники, ингредиенты для продуктов питания и другие соответствующие детали. Используйте точные значения, если это возможно. Если значения варьируются, то выводите только усредненное значение, если значение имеет хоть какой то числовой формат выводите только число. Так же если в ответе присутствует цена, то выводите конкретное значение цены и валюту, если присутствуют какие-то технические показатели выводите только их, без описания, если есть вес предмета тоже выводите только число, так же ко всему остальному, где используются числовые значения.В ответе используй только указанный формат, не нужно любезно отвечать на мой запрос и писать что то кроме ответа по типу :"Конечно" и так далее `,
    },
  ],
});

const result = JSON.parse(secondResponse.choices[0].message.content);
return({
  labels: result.labels,
  did_you_know: result.did_you_know,
  price: result.price,
  description: result.description,
  facts: result.facts,
});
}
export { main };

// main("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE_nzUZbusriiA1_m8tWYdwTF3llSufSgw7g&s");