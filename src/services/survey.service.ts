import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Survey {
  id: string;
  name: string;
  description: string;
  questions: [
    { id: number; question: string; options: [{ id: number; option: string }] },
  ];
}

interface SurveyAnswer {
  surveyId: string;
  userId: string;
  answers: [{ questionId: number; optionId: number }];
}

interface SurveyResult {
  [key: string]: {
    result: [
      {
        questionId: number;
        question: string;
        answers: [
          {
            optionId: number;
            option: string;
            count: number;
          },
        ];
      },
    ];
  };
}

export const createSurvey = (survey: Survey) => {
  if (!survey?.questions?.length)
    throw new Error('Need at least 1 question in the survey');

  const existingData = readFile('surveys.json');

  // In case of writing to external DB, these will be auto generated
  survey.id = uuidv4();
  let questionCounter = 1;
  survey.questions.forEach((question) => {
    if (question.options.length < 2) throw new Error('Need at least 2 options');
    question.id = questionCounter++;
    let optionCounter = 1;
    question.options = question.options.map((option) => {
      return { id: optionCounter++, option };
    }) as any;
  });

  const newData = [...existingData, survey];

  writeFile('surveys.json', newData);

  const surveyResults: SurveyResult = readFile('surveyResults.json');

  surveyResults[survey.id] = {
    result: survey.questions.map((question) => {
      return {
        questionId: question.id,
        question: question.question,
        answers: question.options.map((option) => {
          return { optionId: option.id, option: option.option, count: 0 };
        }),
      };
    }) as any,
  };

  writeFile('surveyResults.json', surveyResults);
  return survey.id;
};

export const getSurvey = (id: string) => {
  const surveys: Survey[] = readFile('surveys.json');

  for (const survey of surveys) {
    if (survey.id == id) return survey;
  }

  throw new Error('No survey found');
};

export const getSurveyList = () => {
  const surveys: Survey[] = readFile('surveys.json');

  const surveyList = surveys.map((survey) => {
    return {
      id: survey.id,
      name: survey.name,
      description: survey.description,
    };
  });

  return surveyList;
};

export const takeSurvey = (data: SurveyAnswer) => {
  getSurvey(data.surveyId);
  // Add every survey taken to surveyAnswers.json
  const existingData = readFile('surveyAnswers.json');
  existingData.push(data);
  writeFile('surveyAnswers.json', existingData);

  // Updating result of the survey
  const surveyResults: SurveyResult = readFile('surveyResults.json');

  const obj: any = {};
  for (const answer of data.answers) {
    obj[answer.questionId] = answer.optionId;
  }

  surveyResults[data.surveyId].result.forEach((question) => {
    question.answers.forEach((answer) => {
      if (obj[question.questionId] === answer.optionId) answer.count++;
    });
  });

  writeFile('surveyResults.json', surveyResults);
};

// const doesSurveyExist = (surveyId: string) => {
//   const surveys: Survey[] = readFile('surveys.json');
//   for (const survey of surveys) {
//     if (survey.id === surveyId) return;
//   }
//   throw new Error('Survey not found');
// };

export const getSurveyResult = (surveyId: string) => {
  const surveyResults: SurveyResult = readFile('surveyResults.json');
  if (!surveyResults[surveyId]?.result) throw new Error('Survey not found');
  const result = surveyResults[surveyId].result;
  return result.map((obj) => {
    return {
      question: obj.question,
      answers: obj.answers.map((answer) => {
        return {
          option: answer.option,
          count: answer.count,
        };
      }),
    };
  });
};

const readFile = (filename: string) => {
  const res = readFileSync(join(__dirname, `../files/${filename}`), 'utf-8');
  return JSON.parse(res);
};

const writeFile = (filename: string, data: any) => {
  writeFileSync(join(__dirname, `../files/${filename}`), JSON.stringify(data));
};
