import * as ReactRouterDom from "react-router-dom"
import SurveyApp from '@learn/web/frontend/simple_survey_form/SurveyApp.tsx'
import "@resource/css/global-twcss.css";


function App(): React.ReactElement {
  return (
    <>
    <ReactRouterDom.BrowserRouter>
      <ReactRouterDom.Routes>
        {/* <ReactRouterDom.Route path="/" element={<ChristmasLayout/>}> */}
          <ReactRouterDom.Route index element={<SurveyApp/>}/>
          <ReactRouterDom.Route path="/admin/login" element={<h1 className={`text-[2rem] p-4 text-lime-600`}>login, to be continue...</h1>}/>
          <ReactRouterDom.Route path="/admin/partial-dashboard" element={<h1 className={`text-[2rem] p-4 text-lime-600`}>dashboard, to be continue...</h1>}/>
          <ReactRouterDom.Route path="*" element={<h1 className={`text-[2rem] p-4 text-red-500`}>Page not found</h1>}/>
        {/* </ReactRouterDom.Route> */}
      </ReactRouterDom.Routes>
    </ReactRouterDom.BrowserRouter>
    </>
  )
}

export default App
