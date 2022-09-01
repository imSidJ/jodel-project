import express, { Request, Response } from 'express';

import {
  createSurveyController,
  getSurveyListController,
  getSurveyController,
  takeSurveyController,
  getSurveyResultController,
} from '../controllers/survey.controller';

const router = express.Router();

router.post('/survey', function (req: Request, res: Response) {
  createSurveyController(req, res);
});

router.post('/survey/take', function (req: Request, res: Response) {
  takeSurveyController(req, res);
});

router.get('/survey', function (req: Request, res: Response) {
  getSurveyListController(req, res);
});

router.get('/survey/:id', function (req: Request, res: Response) {
  getSurveyController(req, res);
});

router.get('/survey/:id/result', function (req: Request, res: Response) {
  getSurveyResultController(req, res);
});

export default router;
