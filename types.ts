
export enum FunnelStep {
  WELCOME = 'WELCOME',
  CALL = 'CALL',
  WHATSAPP_INTRO = 'WHATSAPP_INTRO',
  SCANNER = 'SCANNER',
  QUIZ = 'QUIZ',
  WHATSAPP_AUTH = 'WHATSAPP_AUTH',
  VSL = 'VSL',
  WHATSAPP_CONTINUITY = 'WHATSAPP_CONTINUITY',
  INSTA_LOGIN = 'INSTA_LOGIN',
  FEED = 'FEED',
  WHATSAPP_OBJECTIONS = 'WHATSAPP_OBJECTIONS',
  SALES_PAGE = 'SALES_PAGE',
  ADMIN = 'ADMIN'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface UserSession {
  id: string;
  startTime: number;
  lastActive: number;
  stepsReached: FunnelStep[];
  currentStep: FunnelStep;
  deviceInfo: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  timestamp: number;
}

export interface AnalyticsEvent {
  sessionId: string;
  timestamp: number;
  type: 'SESSION_START' | 'STEP_REACHED' | 'ACTION';
  payload: any;
}
