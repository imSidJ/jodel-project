import { Request, Response } from 'express';

import {
  createSurvey,
  getSurveyList,
  getSurvey,
  takeSurvey,
  getSurveyResult,
} from '../services/survey.service';

export const createSurveyController = async (req: Request, res: Response) => {
  try {
    const surveyId = createSurvey(req.body);
    res.send({
      message: 'Survey created successfully',
      data: { surveyId },
    });
  } catch (error: any) {
    res.send({ error: error.message });
  }
};

export const getSurveyController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = getSurvey(id);
    res.send(data);
  } catch (error: any) {
    res.send({ error: error.message });
  }
};

export const getSurveyListController = async (req: Request, res: Response) => {
  try {
    const data = getSurveyList();
    res.send(data);
  } catch (error: any) {
    res.send({ error: error.message });
  }
};

export const takeSurveyController = async (req: Request, res: Response) => {
  try {
    takeSurvey(req.body);
    res.send({ message: 'Survey completed successfully' });
  } catch (error: any) {
    res.send({ error: error.message });
  }
};

export const getSurveyResultController = async (
  req: Request,
  res: Response,
) => {
  try {
    const data = getSurveyResult(req.params.id);
    res.send(data);
  } catch (error: any) {
    res.send({ error: error.message });
  }
};
