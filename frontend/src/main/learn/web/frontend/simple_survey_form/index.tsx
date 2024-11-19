import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@resource/css/global-twcss.css";

import SurveyApp from '@learn/web/frontend/simple_survey_form/SurveyApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyApp />
  </StrictMode>,
)
